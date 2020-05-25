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
import { BigNumber, parseUnits } from 'ethers/utils';
import { useWallet } from 'use-wallet';
import { ContractNames } from '../../types';
import { useToken, useTokensState } from './TokensProvider';
import {
  SavingsContractQuery,
  useSavingsContractDataSubscription,
  useMassetQuery,
  useMassetLazyQuery,
} from '../../graphql/generated';
import { useKnownAddress } from './KnownAddressProvider';
import { EXP_SCALE, RATIO_SCALE } from '../../web3/constants';
import { Action, Actions, BassetData, State } from './types';

export const useMusdSubscription = (): ReturnType<typeof useMassetQuery> => {
  const address = useKnownAddress(ContractNames.mUSD);
  const { getBlockNumber } = useWallet();
  const blockNumber = getBlockNumber();
  const blockNumberRef = useRef<number | undefined>(blockNumber);

  // We're using a long-polling query because subscriptions don't seem to be
  // re-run when derived or nested fields change.
  // See https://github.com/graphprotocol/graph-node/issues/1398
  const [run, query] = useMassetLazyQuery({
    // `skip` isn't possible for lazy queries; address must be null-checked
    variables: { id: address as string },
  });

  // Long poll (15s interval) if the block number isn't available.
  useEffect(() => {
    let interval: number;

    if (address && !blockNumber) {
      run();
      interval = setInterval(() => {
        run();
      }, 15000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [address, blockNumber, run]);

  // Run the query on every block when the block number is available.
  useEffect(() => {
    if (address && blockNumber && blockNumber !== blockNumberRef.current) {
      run();
      blockNumberRef.current = blockNumber;
    }
  }, [address, blockNumber, run]);

  return query;
};

export const useMUSDSavings = ():
  | (SavingsContractQuery['savingsContracts'][0] & {
      allowance: BigNumber | null;
    })
  | null => {
  const address = useKnownAddress(ContractNames.mUSDSavings);
  const mUSDAddress = useKnownAddress(ContractNames.mUSD);

  const {
    data: { savingsContracts: [fromData] = [] } = {},
  } = useSavingsContractDataSubscription({
    variables: { id: address as string },
    skip: !address,
  });

  const { allowance } = useToken(address) || {};

  return fromData
    ? {
        ...fromData,
        allowance: allowance && mUSDAddress ? allowance[mUSDAddress] : null,
      }
    : null;
};

const initialState: State = {
  [ContractNames.mUSD]: {
    basket: {},
    bAssets: [],
    token: {} as never,
    feeRate: null,
    loading: false,
  },
};

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.UpdateMassetData: {
      const { data, loading } = action.payload;

      if (!data?.masset?.basket) {
        return state;
      }

      const {
        token: mUsdToken,
        basket: { bassets, collateralisationRatio, failed, undergoingRecol },
        feeRate,
      } = data?.masset || {};

      const mUsd = state[ContractNames.mUSD];

      return {
        ...state,
        [ContractNames.mUSD]: {
          ...mUsd,
          loading,
          token: { ...mUsd.token, ...mUsdToken },
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
                mUsdToken.totalSupply as string,
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

              const basketShareExact = currentVaultUnitsExact
                .mul(EXP_SCALE)
                .div(mUsdTotalSupplyExact);

              // TODO use exact values in state
              return {
                ...mUsd?.bAssets[index],
                token: {
                  ...mUsd?.bAssets[index]?.token,
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

      return {
        ...state,
        [ContractNames.mUSD]: {
          ...mUsd,
          token: {
            ...mUsd.token,
            ...(mUsd.token.address ? tokens[mUsd.token.address] : null),
          },
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
  const { data, loading } = useMusdSubscription();

  useEffect(() => {
    dispatch({ type: Actions.UpdateTokens, payload: tokens });
  }, [tokens, dispatch]);

  useEffect(() => {
    dispatch({ type: Actions.UpdateMassetData, payload: { data, loading } });
  }, [data, loading, dispatch]);

  return (
    <stateContext.Provider value={state}>{children}</stateContext.Provider>
  );
};

export const useDataContext = (): State => useContext(stateContext);

export const useMusdData = (): State[ContractNames.mUSD] =>
  useDataContext()[ContractNames.mUSD];

export const useMusdTokenData = (): State[ContractNames.mUSD]['token'] =>
  useMusdData().token;

export const useBassetData = (address: string): BassetData | null => {
  const { bAssets } = useMusdData();

  return useMemo(() => bAssets.find(b => b.address === address) || null, [
    bAssets,
    address,
  ]);
};
