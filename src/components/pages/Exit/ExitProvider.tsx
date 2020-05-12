import React, {
  createContext,
  FC,
  Reducer,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { BigNumber, formatUnits, parseUnits } from 'ethers/utils';
import {
  Action,
  Actions,
  BassetData,
  BassetOutput,
  Dispatch,
  Mode,
  State,
} from './types';
import { useMusdSubscription } from '../../../context/KnownAddressProvider';
import { parseAmount } from '../../../web3/amounts';
import { RATIO_SCALE, EXP_SCALE } from '../../../web3/constants';
import { Amount } from '../../../types';
import { useTokenBalance } from '../../../context/TokensProvider';

const estimateRedemptionQuantities = (
  bassets: BassetData[],
  massetAmount: BigNumber,
): Amount[] => {
  const scaledVaults = bassets.map(b =>
    parseUnits(b.vaultBalance, b.token.decimals)
      .mul(b.ratio)
      .div(RATIO_SCALE),
  );

  const totalVault = scaledVaults.reduce(
    (_totalVault, vault) => _totalVault.add(vault),
    new BigNumber(0),
  );

  return scaledVaults.map((vault, index) => {
    const percentage = vault.mul(EXP_SCALE).div(totalVault);
    const scaledAmount = percentage.mul(massetAmount).div(EXP_SCALE);
    const exact = scaledAmount.mul(RATIO_SCALE).div(bassets[index].ratio);
    return {
      exact,
      simple: parseFloat(formatUnits(exact, bassets[index].token.decimals)),
    };
  });
};

const updateBassetAmounts = (state: State): State => {
  if (!state.massetData.data?.masset?.basket) return state;

  const {
    bassets,
    redemption,
    massetData: {
      data: {
        masset: {
          basket: { bassets: bassetsData },
        },
      },
    },
  } = state;

  const redemptionAmounts = estimateRedemptionQuantities(
    bassetsData,
    redemption.amount.exact || new BigNumber(0),
  );

  return {
    ...state,
    bassets: bassets.map((b, index) => ({
      ...b,
      amount: redemptionAmounts[index],
    })),
  };
};

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.UpdateMassetData: {
      const massetData = action.payload;
      return {
        ...state,
        massetData,
        bassets:
          state.bassets.length > 0
            ? state.bassets
            : massetData.data?.masset?.basket.bassets.map(b => ({
                address: b.token.address,
                amount: { exact: null, simple: null },
              })) || [],
      };
    }
    case Actions.SetRedemptionAmount: {
      const formValue = action.payload;
      return updateBassetAmounts({
        ...state,
        redemption: {
          formValue,
          amount: parseAmount(
            formValue,
            state.massetData.data?.masset?.token.decimals || 18,
          ),
        },
      });
    }
    case Actions.SetError: {
      const { error } = action.payload;
      return { ...state, error };
    }
    case Actions.UpdateMassetBalance: {
      const massetBalance = action.payload;
      return { ...state, massetBalance };
    }
    default:
      throw new Error('Unhandled action type');
  }
};

const initialState: State = {
  bassets: [],
  error: null,
  massetData: {
    data: undefined,
    loading: true,
  },
  massetBalance: null,
  mode: Mode.RedeemProportional,
  redemption: {
    formValue: null,
    amount: {
      simple: null,
      exact: null,
    },
  },
};

const context = createContext<[State, Dispatch]>([{} as State, {} as Dispatch]);

export const ExitProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { error, redemption } = state;

  const setRedemptionAmount = useCallback<Dispatch['setRedemptionAmount']>(
    amount => {
      dispatch({ type: Actions.SetRedemptionAmount, payload: amount });
    },
    [dispatch],
  );

  const setError = useCallback(
    (_error: string | null) => {
      dispatch({ type: Actions.SetError, payload: { error: _error } });
    },
    [dispatch],
  );

  const { data, loading } = useMusdSubscription();
  useEffect(() => {
    dispatch({
      type: Actions.UpdateMassetData,
      payload: { data, loading },
    });
  }, [dispatch, data, loading]);

  const massetBalance = useTokenBalance(data?.masset?.token.address || null);
  useEffect(() => {
    dispatch({
      type: Actions.UpdateMassetBalance,
      payload: massetBalance,
    });
  }, [dispatch, massetBalance]);

  useEffect(() => {
    if (redemption.amount.exact && massetBalance) {
      if (redemption.amount.exact.gt(massetBalance)) {
        setError('Insufficient balance');
        return;
      }
    }

    if (error) setError(null);
  }, [setError, error, redemption, massetBalance]);

  return (
    <context.Provider
      value={useMemo(
        () => [
          state,
          {
            setRedemptionAmount,
          },
        ],
        [state, setRedemptionAmount],
      )}
    >
      {children}
    </context.Provider>
  );
};

export const useExitContext = (): [State, Dispatch] => useContext(context);

export const useExitState = (): State => useExitContext()[0];

export const useExitBassetOutput = (address: string): BassetOutput | null => {
  const { bassets } = useExitState();
  return useMemo(() => bassets.find(b => b.address === address) || null, [
    address,
    bassets,
  ]);
};

export const useExitBassetData = (address: string): BassetData | null => {
  const { massetData } = useExitState();
  return useMemo(
    () =>
      massetData.data?.masset?.basket.bassets.find(
        b => b.token.address === address,
      ) || null,
    [massetData, address],
  );
};
