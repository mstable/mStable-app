import { Reducer, useCallback, useMemo } from 'react';
import { BigNumber } from 'ethers/utils';
import { parseAmount } from '../../../web3/amounts';
import { useStorageReducer } from '../../../context/StorageProvider';
import { Actions, State, TransactionType, Dispatch, Action } from './types';

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.SetError: {
      const { reason } = action.payload;
      return { ...state, error: reason };
    }
    case Actions.SetQuantity: {
      const { formValue } = action.payload;
      return {
        ...state,
        input: {
          ...state.input,
          formValue,
          amount: parseAmount(formValue, state.input.token.decimals),
        },
      };
    }
    case Actions.SetToken:
      return {
        ...state,
        input: {
          ...state.input,
          token:
            action.payload === null
              ? { address: null, symbol: null, decimals: null }
              : action.payload,
        },
      };
    case Actions.SetTransactionType: {
      const { transactionType } = action.payload;
      return { ...state, transactionType };
    }
    default:
      throw new Error('Unhandled action type');
  }
};

const initialState: State = Object.freeze({
  error: null,
  transactionType: TransactionType.Deposit,
  input: {
    formValue: null,
    token: {
      address: null,
      decimals: null,
      symbol: null,
    },
    amount: {
      simple: null,
      exact: null,
    },
  },
});

const hydrator = (state: State): State => ({
  ...state,
  input: {
    ...state.input,
    amount: {
      ...state.input.amount,
      exact: state.input.amount.exact
        ? new BigNumber(state.input.amount.exact)
        : null,
    },
  },
});

export const useSaveState = (): [State, Dispatch] => {
  const [state, dispatch] = useStorageReducer(
    'save',
    initialState,
    reducer,
    hydrator,
  );

  const setError = useCallback<Dispatch['setError']>(
    reason => {
      dispatch({ type: Actions.SetError, payload: { reason } });
    },
    [dispatch],
  );

  const setQuantity = useCallback<Dispatch['setQuantity']>(
    formValue => {
      dispatch({ type: Actions.SetQuantity, payload: { formValue } });
    },
    [dispatch],
  );

  const setToken = useCallback<Dispatch['setToken']>(
    tokenDetails => {
      dispatch({ type: Actions.SetToken, payload: tokenDetails });
    },
    [dispatch],
  );

  const setTransactionType = useCallback<Dispatch['setTransactionType']>(
    transactionType => {
      dispatch({
        type: Actions.SetTransactionType,
        payload: { transactionType },
      });
    },
    [dispatch],
  );

  return useMemo(
    () => [state, { setError, setQuantity, setToken, setTransactionType }],
    [state, setError, setQuantity, setToken, setTransactionType],
  );
};
