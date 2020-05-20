import React, {
  createContext,
  FC,
  Reducer,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { BigNumber, parseUnits } from 'ethers/utils';
import { Action, Actions, BassetData, State } from './types';
import { ContractNames } from '../../types';
import { useToken, useTokensState } from './TokensProvider';
import {
  SavingsContractQuery,
  useMassetQuery,
  useMassetSubSubscription,
  useSavingsContractDataSubscription,
} from '../../graphql/generated';
import { useKnownAddress } from './KnownAddressProvider';
import { EXP_SCALE, RATIO_SCALE } from '../../web3/constants';

export const useMusdQuery = (): ReturnType<typeof useMassetQuery> => {
  const address = useKnownAddress(ContractNames.mUSD);
  return useMassetQuery({
    variables: { id: address as string },
    skip: !address,
  });
};

export const useMusdSubscription = (): ReturnType<typeof useMassetSubSubscription> => {
  const address = useKnownAddress(ContractNames.mUSD);
  return useMassetSubSubscription({
    variables: { id: address as string },
    skip: !address,
  });
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
    token: {},
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
