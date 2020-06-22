import { BigDecimal } from '../../web3/BigDecimal';
import { BassetState, BassetStatus, DataState, MassetState } from './types';

const calculateBasset = (
  bAsset: BassetState,
  mAsset: MassetState,
): BassetState => {
  const balanceInMasset = bAsset.balance
    .mulRatioTruncate(bAsset.ratio)
    .setDecimals(mAsset.decimals);
  const maxWeightInMasset = mAsset.totalSupply
    .mulTruncate(bAsset.maxWeight)
    .setDecimals(mAsset.decimals);
  const totalVaultInMasset = bAsset.totalVault
    .mulRatioTruncate(bAsset.ratio)
    .setDecimals(mAsset.decimals);

  const overweight =
    bAsset.totalSupply.exact.gt(0) &&
    totalVaultInMasset.exact.gt(maxWeightInMasset.exact);

  const basketShare = (mAsset.totalSupply.exact.gt(0)
    ? totalVaultInMasset
    : new BigDecimal(0, mAsset.decimals)
  ).divPrecisely(mAsset.totalSupply);

  return {
    ...bAsset,
    balanceInMasset,
    basketShare,
    maxWeightInMasset,
    overweight,
    totalVaultInMasset,
  };
};

const recalculateSavingsContract = (
  dataState: DataState,
): DataState['savingsContract'] => {
  const {
    mAsset,
    savingsContract: {
      latestExchangeRate,
      creditBalances: [credits = new BigDecimal(0, mAsset.decimals)],
    },
  } = dataState;

  if (latestExchangeRate) {
    const balance = credits.mulTruncate(latestExchangeRate.exchangeRate.exact);
    return {
      ...dataState.savingsContract,
      savingsBalance: { balance, credits },
    };
  }

  return {
    ...dataState.savingsContract,
    savingsBalance: {},
  };
};

export const recalculateState = (dataState: DataState): DataState => {
  const bAssets: DataState['bAssets'] = Object.keys(dataState.bAssets).reduce(
    (_bAssets, address) => ({
      ..._bAssets,
      [address]: calculateBasset(dataState.bAssets[address], dataState.mAsset),
    }),
    {},
  );

  const bAssetsArr = Object.values(bAssets);

  const allBassetsNormal = bAssetsArr.every(
    ({ status }) => status === BassetStatus.Normal,
  );

  const overweightBassets = bAssetsArr
    .filter(({ overweight }) => overweight)
    .map(b => b.address);

  const blacklistedBassets = bAssetsArr
    .filter(({ status }) => status === BassetStatus.Blacklisted)
    .map(b => b.address);

  const savingsContract = recalculateSavingsContract(dataState);

  return {
    ...dataState,
    bAssets,
    savingsContract,
    mAsset: {
      ...dataState.mAsset,
      allBassetsNormal,
      blacklistedBassets,
      overweightBassets,
    },
  };
};
