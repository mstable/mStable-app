import {
  LazyQueryHookOptions,
  QueryTuple,
} from '@apollo/react-hooks/lib/types';
import { QueryResult } from '@apollo/react-common';
import React, {
  createContext,
  FC,
  Reducer,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import * as ApolloReactHooks from '@apollo/react-hooks';
import { BigNumber, formatUnits, parseUnits } from 'ethers/utils';
import { useWallet } from 'use-wallet';

import { ContractNames } from '../../types';
import {
  TokenDetailsWithBalance,
  useTokenAllowance,
  useTokensState,
} from './TokensProvider';
import {
  CreditBalancesQueryResult,
  MassetQueryResult,
  SavingsContractQueryResult,
  useCreditBalancesLazyQuery,
  useLatestExchangeRateLazyQuery,
  useMassetLazyQuery,
  useSavingsContractLazyQuery,
} from '../../graphql/generated';
import { useKnownAddress } from './KnownAddressProvider';
import { EXP_SCALE, RATIO_SCALE, SCALE } from '../../web3/constants';
import { Action, Actions, BassetData, MassetData, State } from './types';

const initialState: State = {
  [ContractNames.mUSD]: {
    basket: ({} as unknown) as MassetData['basket'],
    bAssets: [],
    token: {} as never,
    feeRate: null,
    loading: true,
  },
  creditBalances: [],
  latestExchangeRate: undefined,
  savingsBalance: {
    exact: null,
    simple: null,
    creditsExact: null,
  },
};

const useBlockPollingSubscription = <TData, TVariables>(
  lazyQuery: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any,
    options?: LazyQueryHookOptions<TData, TVariables>,
  ) => QueryTuple<TData, TVariables>,
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TData, TVariables>,
  skip?: boolean,
): QueryResult<TData, TVariables> => {
  const { getBlockNumber } = useWallet();
  const blockNumber = getBlockNumber();
  const blockNumberRef = useRef<number | undefined>(blockNumber);
  const hasBlock = !!blockNumber;

  // We're using a long-polling query because subscriptions don't seem to be
  // re-run when derived or nested fields change.
  // See https://github.com/graphprotocol/graph-node/issues/1398
  const [run, query] = lazyQuery({
    fetchPolicy: 'cache-and-network',
    ...baseOptions,
  });

  // Long poll (15s interval) if the block number isn't available.
  useEffect(() => {
    let interval: number;

    if (!skip && !hasBlock) {
      run();
      interval = setInterval(() => {
        run();
      }, 15000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [skip, hasBlock, run]);

  // Run the query on every block when the block number is available.
  useEffect(() => {
    if (!skip && blockNumber && blockNumber !== blockNumberRef.current) {
      run();
      blockNumberRef.current = blockNumber;
    }
  }, [skip, blockNumber, run]);

  return query;
};

const useMusdSubscription = (): MassetQueryResult => {
  const address = useKnownAddress(ContractNames.mUSD);

  return useBlockPollingSubscription(
    useMassetLazyQuery,
    {
      variables: {
        id: address as string,
      },
    },
    !address,
  );
};

const useMusdSavingsSubscription = (): SavingsContractQueryResult => {
  const address = useKnownAddress(ContractNames.mUSDSavings);

  return useBlockPollingSubscription(
    useSavingsContractLazyQuery,
    {
      variables: { id: address as string },
    },
    !address,
  );
};

const useCreditBalancesSubscription = (): CreditBalancesQueryResult => {
  const { account } = useWallet();

  return useBlockPollingSubscription(
    useCreditBalancesLazyQuery,
    { variables: { account: account ? account.toLowerCase() : '' } },
    !account,
  );
};

const updateSavingsBalance = (state: State): State => {
  const {
    latestExchangeRate,
    creditBalances: [creditBalance],
  } = state;
  if (latestExchangeRate) {
    let internalCredits = creditBalance?.amount;
    if (!internalCredits) {
      internalCredits = '0';
    }
    const rate = parseUnits(latestExchangeRate.exchangeRate);
    const balance = parseUnits(internalCredits);

    const exact = balance.mul(rate).div(SCALE);
    const simple = parseFloat(
      parseFloat(formatUnits(exact, 18))
        .toFixed(10)
        .toString(),
    );

    return {
      ...state,
      savingsBalance: { exact, simple, creditsExact: balance },
    };
  }

  return {
    ...state,
    savingsBalance: { exact: null, simple: null, creditsExact: null },
  };
};

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.UpdateLatestExchangeRate: {
      return updateSavingsBalance({
        ...state,
        latestExchangeRate: action.payload,
      });
    }

    case Actions.UpdateCreditBalances: {
      return updateSavingsBalance({
        ...state,
        creditBalances: action.payload,
      });
    }

    case Actions.UpdateMusdSavingsData: {
      return {
        ...state,
        [ContractNames.mUSDSavings]: action.payload,
      };
    }

    case Actions.UpdateMassetData: {
      const masset = action.payload;

      if (!masset?.basket) {
        return state;
      }

      const {
        token: mUsdToken,
        basket: { bassets, collateralisationRatio, failed, undergoingRecol },
        feeRate,
      } = masset;
      const { mUSD } = state;

      return {
        ...state,
        mUSD: {
          ...mUSD,
          loading: false,
          token: { ...mUSD.token, ...mUsdToken },
          basket: { collateralisationRatio, failed, undergoingRecol },
          bAssets: bassets.map(
            (
              {
                id: address,
                isTransferFeeCharged,
                maxWeight,
                ratio,
                status,
                token: { decimals, totalSupply, symbol },
                vaultBalance,
              },
              index,
            ) => {
              const mUsdTotalSupplyExact = parseUnits(
                mUsdToken.totalSupply,
                mUsdToken.decimals,
              );

              const maxWeightInUnitsExact = mUsdTotalSupplyExact
                .mul(maxWeight)
                .div(EXP_SCALE);

              const vaultBalanceExact = parseUnits(vaultBalance, decimals);

              const currentVaultUnitsExact = vaultBalanceExact
                .mul(ratio)
                .div(RATIO_SCALE);

              const overweight =
                parseUnits(totalSupply, decimals).gt(0) &&
                currentVaultUnitsExact.gt(maxWeightInUnitsExact);

              const basketShareExact = mUsdTotalSupplyExact.gt(0)
                ? currentVaultUnitsExact
                    .mul(EXP_SCALE)
                    .div(mUsdTotalSupplyExact)
                : new BigNumber(0);
              // TODO use exact values in state
              return {
                ...mUSD?.bAssets[index],
                token: {
                  ...mUSD?.bAssets[index]?.token,
                  decimals,
                  totalSupply,
                  symbol,
                },
                address,
                basketShare: basketShareExact,
                isTransferFeeCharged,
                maxWeight,
                overweight,
                ratio,
                status,
                vaultBalance,
              };
            },
          ),
          feeRate,
        },
      };
    }

    case Actions.UpdateTokens: {
      const tokens = action.payload;

      const mUsd = state[ContractNames.mUSD];
      if (!mUsd) return state;

      return {
        ...state,
        [ContractNames.mUSD]: {
          ...mUsd,
          token: {
            ...mUsd.token,
            ...(mUsd.token.address ? tokens[mUsd.token.address] : null),
          } as TokenDetailsWithBalance,
          bAssets: mUsd.bAssets.map(b => ({
            ...b,
            token: { ...b.token, ...tokens[b.address] },
          })),
        },
      };
    }

    default:
      throw new Error('Unhandled action type');
  }
};

const stateContext = createContext<State>(initialState);

export const DataProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const tokens = useTokensState();
  const mUsdSub = useMusdSubscription();
  const mUsdSavingsSub = useMusdSavingsSubscription();
  const creditBalancesSub = useCreditBalancesSubscription();
  const latestSub = useBlockPollingSubscription(useLatestExchangeRateLazyQuery);

  useEffect(() => {
    dispatch({ type: Actions.UpdateTokens, payload: tokens });
  }, [tokens, dispatch]);

  useEffect(() => {
    if (mUsdSub.data?.masset) {
      dispatch({
        type: Actions.UpdateMassetData,
        payload: mUsdSub.data.masset,
      });
    }
  }, [mUsdSub.data, dispatch]);

  useEffect(() => {
    if (mUsdSavingsSub.data?.savingsContracts[0]) {
      dispatch({
        type: Actions.UpdateMusdSavingsData,
        payload: mUsdSavingsSub.data.savingsContracts[0],
      });
    }
  }, [mUsdSavingsSub.data, dispatch]);

  useEffect(() => {
    if (latestSub.data?.exchangeRates[0]) {
      dispatch({
        type: Actions.UpdateLatestExchangeRate,
        payload: latestSub.data.exchangeRates[0],
      });
    }
  }, [latestSub.data, dispatch]);

  useEffect(() => {
    if (creditBalancesSub.data?.account) {
      dispatch({
        type: Actions.UpdateCreditBalances,
        payload: creditBalancesSub.data.account.creditBalances,
      });
    }
  }, [creditBalancesSub.data, dispatch]);

  return (
    <stateContext.Provider value={state}>{children}</stateContext.Provider>
  );
};

export const useDataContext = (): State => useContext(stateContext);

export const useMusdData = (): State[ContractNames.mUSD] =>
  useDataContext()[ContractNames.mUSD];

export const useMusdSavingsData = (): State[ContractNames.mUSDSavings] =>
  useDataContext()[ContractNames.mUSDSavings];

export const useLatestExchangeRate = (): State['latestExchangeRate'] =>
  useDataContext().latestExchangeRate;

export const useSavingsBalance = (): State['savingsBalance'] =>
  useDataContext().savingsBalance;

export const useMusdTokenData = (): TokenDetailsWithBalance | undefined =>
  useMusdData()?.token;

export const useMusdSavingsAllowance = (): BigNumber | undefined => {
  const mUsdSavingsAddress = useKnownAddress(ContractNames.mUSDSavings);
  const mUsdAddress = useKnownAddress(ContractNames.mUSD);
  const allowance = useTokenAllowance(mUsdSavingsAddress);
  return allowance[mUsdAddress || ''];
};

export const useMusdTotalSupply = (): string | undefined =>
  useMusdTokenData()?.totalSupply;

export const useBassetData = (address: string): BassetData | null => {
  const { bAssets = [] } = useMusdData() || {};

  return useMemo(() => bAssets.find(b => b.address === address) || null, [
    bAssets,
    address,
  ]);
};
