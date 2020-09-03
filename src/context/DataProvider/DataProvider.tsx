import React, { createContext, FC, useContext, useMemo } from 'react';
import { pipe } from 'ts-pipe-compose';
import useDebouncedMemo from '@sevenoutman/use-debounced-memo';

import { useLatestExchangeRateLazyQuery } from '../../graphql/mstable';
import { BigDecimal } from '../../web3/BigDecimal';
import { useTokensState } from './TokensProvider';
import {
  RawData,
  PartialRawData,
  DataState,
  MassetState,
  SavingsContractState,
  BassetState,
} from './types';
import { recalculateState } from './recalculateState';
import { transformRawData } from './transformRawData';
import {
  useBlockPollingSubscription,
  useCreditBalancesSubscription,
  useMusdSubscription,
  useMusdSavingsSubscription,
} from './subscriptions';

const dataStateCtx = createContext<DataState | undefined>(undefined);

const setDataState = (data: PartialRawData): DataState | undefined => {
  if (data.mAsset && data.savingsContract) {
    return pipe<RawData, DataState, DataState>(
      data as RawData,
      transformRawData,
      recalculateState,
    );
  }
  return undefined;
};

const useRawData = (): PartialRawData => {
  const { tokens } = useTokensState();

  const mUsdSub = useMusdSubscription();
  const mAsset = mUsdSub.data?.masset || undefined;

  const mUsdSavingsSub = useMusdSavingsSubscription();
  const savingsContract = mUsdSavingsSub.data?.savingsContracts[0];

  const creditBalancesSub = useCreditBalancesSubscription();
  const creditBalances = creditBalancesSub.data?.creditBalances;

  const latestExchangeRateSub = useBlockPollingSubscription(
    useLatestExchangeRateLazyQuery,
  );
  const latestExchangeRate = latestExchangeRateSub.data?.exchangeRates[0];

  return useDebouncedMemo(
    () => ({
      creditBalances,
      latestExchangeRate,
      mAsset,
      savingsContract,
      tokens,
    }),
    [creditBalances, latestExchangeRate, mAsset, savingsContract, tokens],
    1000,
  );
};

export const DataProvider: FC<{}> = ({ children }) => {
  const data = useRawData();

  const dataState = useMemo<DataState | undefined>(() => setDataState(data), [
    data,
  ]);

  return (
    <dataStateCtx.Provider value={dataState}>{children}</dataStateCtx.Provider>
  );
};

export const useDataState = (): DataState | undefined =>
  useContext(dataStateCtx);

export const useMassetData = (): MassetState | undefined =>
  useDataState()?.mAsset;

export const useSavingsContractData = (): SavingsContractState | undefined =>
  useDataState()?.savingsContract;

export const useLatestExchangeRate = (): SavingsContractState['latestExchangeRate'] =>
  useSavingsContractData()?.latestExchangeRate;

export const useSavingsBalance = ():
  | SavingsContractState['savingsBalance']
  | undefined => useSavingsContractData()?.savingsBalance;

export const useMusdTotalSupply = (): BigDecimal | undefined =>
  useMassetData()?.totalSupply;

export const useTotalSavings = (): BigDecimal | undefined =>
  useDataState()?.savingsContract.totalSavings;

export const useBassetState = (address: string): BassetState | undefined =>
  useDataState()?.bAssets[address];
