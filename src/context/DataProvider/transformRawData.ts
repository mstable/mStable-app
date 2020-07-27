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
    redemptionFeeRate: bigNumberify(redemptionFeeRate),
    symbol,
    totalSupply: BigDecimal.parse(totalSupply, decimals),
    undergoingRecol,

    // Initial values
    allBassetsNormal: false,
    blacklistedBassets: [],
    overweightBassets: [],
  };
};

const getSavingsContract: TransformFn<'savingsContract'> = (
  {
    creditBalances,
    latestExchangeRate,
    savingsContract: savingsContractData,
    tokens: { [savingsContractData.id]: savingsContract },
  },
  { mAsset: { address: mAssetAddress, decimals } },
) => ({
  address: savingsContractData.id,
  automationEnabled: savingsContractData.automationEnabled,
  creditBalances: (creditBalances || []).map(({ amount }) =>
    BigDecimal.parse(amount, decimals),
  ),
  latestExchangeRate: latestExchangeRate
    ? {
      exchangeRate: BigDecimal.parse(
        latestExchangeRate.exchangeRate,
        decimals,
      ),
      timestamp: latestExchangeRate.timestamp,
    }
    : undefined,
  mAssetAllowance:
    savingsContract?.allowances[mAssetAddress] || new BigDecimal(0, decimals),
  savingsRate: BigDecimal.parse(savingsContractData.savingsRate, decimals),
  totalCredits: BigDecimal.parse(savingsContractData.totalCredits, decimals),
  totalSavings: BigDecimal.parse(savingsContractData.totalSavings, decimals),
  savingsBalance: {},
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
        totalSupply: BigDecimal.parse(totalSupply, decimals),
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
