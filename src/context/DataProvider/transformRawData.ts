import { bigNumberify } from 'ethers/utils';

import { BigDecimal } from '../../web3/BigDecimal';
import { BassetState, DataState, BassetStatus, RawData } from './types';

const getMassetState = ({
  mAsset: {
    basket: { collateralisationRatio, failed, undergoingRecol },
    feeRate,
    token: mAssetToken,
  },
  tokens,
}: RawData): DataState['mAsset'] => ({
  address: mAssetToken.address,
  balance: new BigDecimal(
    tokens[mAssetToken.address]?.balance || 0,
    mAssetToken.decimals,
  ),
  collateralisationRatio: bigNumberify(collateralisationRatio),
  decimals: mAssetToken.decimals,
  failed,
  feeRate: bigNumberify(feeRate),
  symbol: mAssetToken.symbol,
  totalSupply: BigDecimal.parse(mAssetToken.totalSupply, mAssetToken.decimals),
  undergoingRecol,

  // Initial values
  allBassetsNormal: false,
  blacklistedBassets: [],
  overweightBassets: [],
});

const getSavingsContractState = ({
  creditBalances,
  latestExchangeRate,
  mAsset,
  savingsContract: savingsContractData,
  tokens: { [savingsContractData.id]: savingsContract },
}: RawData): DataState['savingsContract'] => ({
  address: savingsContractData.id,
  automationEnabled: savingsContractData.automationEnabled,
  creditBalances: (creditBalances || []).map(({ amount }) =>
    BigDecimal.parse(amount, mAsset.token.decimals),
  ),
  latestExchangeRate: latestExchangeRate
    ? {
        exchangeRate: BigDecimal.parse(
          latestExchangeRate.exchangeRate,
          mAsset.token.decimals,
        ),
        timestamp: latestExchangeRate.timestamp,
      }
    : undefined,
  mAssetAllowance: new BigDecimal(
    savingsContract?.allowance[mAsset.token.address] || 0,
    mAsset.token.decimals,
  ),
  savingsRate: BigDecimal.parse(
    savingsContractData.savingsRate,
    mAsset.token.decimals,
  ),
  totalCredits: BigDecimal.parse(
    savingsContractData.totalCredits,
    mAsset.token.decimals,
  ),
  totalSavings: BigDecimal.parse(
    savingsContractData.totalSavings,
    mAsset.token.decimals,
  ),
  savingsBalance: {},
});

const getBassetsState = (
  {
    mAsset: {
      basket: { bassets },
    },
    tokens,
  }: RawData,
  mAsset: DataState['mAsset'],
): DataState['bAssets'] =>
  bassets.reduce(
    (
      _bAssets,
      {
        isTransferFeeCharged,
        maxWeight: _maxWeight,
        ratio: _ratio,
        status,
        token: { address, decimals, symbol, totalSupply: _totalSupply },
        vaultBalance,
      },
    ) => {
      const token = tokens[address];
      const mAssetToken = tokens[mAsset.address];
      const bAsset: BassetState = {
        address,
        balance: new BigDecimal(token?.balance || 0, decimals),
        decimals,
        isTransferFeeCharged,
        mAssetAddress: mAsset.address,
        mAssetAllowance: new BigDecimal(
          mAssetToken.allowance[address.toLowerCase()] || 0,
          decimals,
        ),
        maxWeight: bigNumberify(_maxWeight),
        ratio: bigNumberify(_ratio),
        status: status as BassetStatus,
        symbol,
        totalSupply: BigDecimal.parse(_totalSupply, decimals),
        totalVault: BigDecimal.parse(vaultBalance, decimals),

        // Initial values
        balanceInMasset: new BigDecimal(0, mAsset.decimals),
        basketShare: new BigDecimal(0, mAsset.decimals),
        maxWeightInMasset: new BigDecimal(0, mAsset.decimals),
        overweight: false,
        totalVaultInMasset: new BigDecimal(0, mAsset.decimals),
      };

      return {
        ..._bAssets,
        [address]: bAsset,
      };
    },
    {},
  );

export const transformRawData = (rawData: RawData): DataState => {
  const mAsset = getMassetState(rawData);
  const savingsContract = getSavingsContractState(rawData);
  const bAssets = getBassetsState(rawData, mAsset);
  return {
    mAsset,
    savingsContract,
    bAssets,
  };
};
