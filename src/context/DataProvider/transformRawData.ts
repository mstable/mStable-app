import { bigNumberify } from 'ethers/utils';

import { BigDecimal } from '../../web3/BigDecimal';
import { BassetState, BassetStatus, DataState, RawData } from './types';

type TransformFn<T extends keyof DataState> = (
  rawData: RawData,
  dataState: DataState,
) => DataState[T];

type TransformPipelineItem<T extends keyof DataState> = [T, TransformFn<T>];

const getMassetState: TransformFn<'mAsset'> = ({
  mAsset: {
    basket: { collateralisationRatio, failed, undergoingRecol },
    feeRate,
    redemptionFeeRate,
    token: { totalSupply, address, decimals, symbol },
  },
  tokens,
}) => {
  const { allowances, balance } = tokens[address] ?? {
    balance: new BigDecimal(0, decimals),
    allowances: {},
  };
  return {
    address,
    balance,
    allowances,
    collateralisationRatio: bigNumberify(collateralisationRatio),
    decimals,
    failed,
    feeRate: bigNumberify(feeRate),
    redemptionFeeRate: bigNumberify(redemptionFeeRate || '0'),
    symbol,
    totalSupply: BigDecimal.fromMetric(totalSupply),
    undergoingRecol,

    // Initial values
    allBassetsNormal: false,
    blacklistedBassets: [],
    overweightBassets: [],
  };
};

const getSavingsContract: TransformFn<'savingsContract'> = (
  {
    creditBalance,
    latestExchangeRate,
    savingsContract: savingsContractData,
    tokens,
  },
  { mAsset: { address: mAssetAddress, decimals } },
) => ({
  address: savingsContractData.id,
  automationEnabled: savingsContractData.automationEnabled,
  creditBalance: creditBalance
    ? new BigDecimal(creditBalance.amount, decimals)
    : undefined,
  latestExchangeRate: latestExchangeRate
    ? {
        rate: BigDecimal.parse(latestExchangeRate.rate, decimals),
        timestamp: latestExchangeRate.timestamp,
      }
    : undefined,
  mAssetAllowance:
    tokens[mAssetAddress]?.allowances?.[savingsContractData.id] ??
    new BigDecimal(0, decimals),
  // savingsRate: BigDecimal.fromMetric(savingsContractData.savingsRate),
  totalCredits: BigDecimal.fromMetric(savingsContractData.totalCredits),
  totalSavings: BigDecimal.fromMetric(savingsContractData.totalSavings),
  savingsBalance: {},
  dailyAPY: parseFloat(savingsContractData.dailyAPY),
});

const getBassetsState: TransformFn<'bAssets'> = (
  {
    mAsset: {
      basket: { bassets },
    },
    tokens,
  },
  { mAsset },
) =>
  bassets.reduce(
    (
      _bAssets,
      {
        isTransferFeeCharged,
        maxWeight,
        ratio,
        status,
        token: { address, decimals, symbol, totalSupply },
        vaultBalance,
      },
    ) => {
      const { balance, allowances } = tokens[address] ?? {
        balance: new BigDecimal(0, decimals),
        allowances: {},
      };
      const bAsset: BassetState = {
        address,
        allowances,
        balance,
        decimals,
        isTransferFeeCharged,
        mAssetAddress: mAsset.address,
        maxWeight: bigNumberify(maxWeight),
        ratio: bigNumberify(ratio),
        status: status as BassetStatus,
        symbol,
        totalSupply: BigDecimal.fromMetric(totalSupply),
        totalVault: BigDecimal.fromMetric(vaultBalance),

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

const pipelineItems: TransformPipelineItem<keyof DataState>[] = [
  ['mAsset', getMassetState],
  ['bAssets', getBassetsState],
  ['savingsContract', getSavingsContract],
];

export const transformRawData = (rawData: RawData): DataState =>
  pipelineItems.reduce(
    (_dataState, [key, transform]) => ({
      ..._dataState,
      [key]: transform(rawData, _dataState as DataState),
    }),
    {} as Partial<DataState>,
  ) as DataState;
