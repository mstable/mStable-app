import { BigDecimal } from '../../web3/BigDecimal';
import {
  BassetStatus,
  DataState,
  MassetState,
  SavingsContractState,
} from './types';

const recalculateSavingsContractV1 = (
  v1: Extract<SavingsContractState, { version: 1 }>,
  token: MassetState['token'],
): Extract<SavingsContractState, { version: 1 }> => {
  const {
    latestExchangeRate,
    creditBalance = new BigDecimal(0, token?.decimals),
  } = v1;

  if (latestExchangeRate) {
    const balance = creditBalance.mulTruncate(latestExchangeRate.rate.exact);
    return {
      ...v1,
      savingsBalance: { balance, credits: creditBalance },
    };
  }

  return v1;
};
const recalculateSavingsContractV2 = (
  v2: Extract<SavingsContractState, { version: 2 }>,
): Extract<SavingsContractState, { version: 2 }> => {
  const { latestExchangeRate, token } = v2;

  if (token && latestExchangeRate) {
    const { balance } = token;
    const credits = balance.mulTruncate(latestExchangeRate.rate.exact);
    return {
      ...v2,
      savingsBalance: { balance, credits },
    };
  }

  return v2;
};

const recalculateSavingsContracts = ({
  token,
  savingsContracts: { v1, v2 },
}: MassetState): MassetState['savingsContracts'] => ({
  v1: v1 ? recalculateSavingsContractV1(v1, token) : undefined,
  v2: v2 ? recalculateSavingsContractV2(v2) : undefined,
});

const recalculateBassets = (masset: MassetState): MassetState['bAssets'] =>
  Object.fromEntries(
    Object.entries(masset.bAssets).map(([address, basset]) => {
      const massetDecimals = masset.token.decimals;

      const balanceInMasset =
        basset.token.balance
          .mulRatioTruncate(basset.ratio)
          .setDecimals(massetDecimals) ?? new BigDecimal(0);

      const maxWeightInMasset =
        masset.token.totalSupply
          .mulTruncate(basset.maxWeight)
          .setDecimals(massetDecimals) ?? new BigDecimal(0);

      const totalVaultInMasset = basset.totalVault
        .mulRatioTruncate(basset.ratio)
        .setDecimals(massetDecimals);

      const overweight = Boolean(
        basset.token.totalSupply.exact.gt(0) &&
          totalVaultInMasset.exact.gt(maxWeightInMasset.exact),
      );

      const basketShare = masset.token.totalSupply.exact.eq(0)
        ? new BigDecimal(0)
        : (masset.token.totalSupply.exact.gt(0)
            ? totalVaultInMasset
            : new BigDecimal(0, massetDecimals)
          ).divPrecisely(masset.token.totalSupply);

      return [
        address,
        {
          ...basset,
          basketShare,
          overweight,
          balanceInMasset,
          maxWeightInMasset,
          totalVaultInMasset,
        },
      ];
    }),
  );

export const recalculateMasset = (masset: MassetState): MassetState => {
  const bAssets = recalculateBassets(masset);

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

  const savingsContracts = recalculateSavingsContracts(masset);

  return {
    ...masset,
    bAssets,
    allBassetsNormal,
    blacklistedBassets,
    overweightBassets,
    savingsContracts,
  };
};

export const recalculateState = (data: DataState): DataState =>
  Object.fromEntries(
    Object.entries(data).map(([symbol, masset]) => [
      symbol,
      recalculateMasset(masset),
    ]),
  );
