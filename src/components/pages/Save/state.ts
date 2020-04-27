import { Reducer, useCallback, useMemo, useReducer } from 'react';
import { TokenDetails, TokenQuantity } from '../../../types';
import { parseAmount } from '../../../web3/amounts';

export enum TransactionType {
  Deposit,
  Withdraw,
}

export enum Reasons {
  AmountMustBeSet,
  AmountMustBeGreaterThanZero,
  DepositAmountMustNotExceedTokenBalance,
  WithdrawAmountMustNotExceedSavingsBalance,
  TokenMustBeSelected,
  FetchingData,
  MUSDMustBeUnlocked,
}

enum Actions {
  SetQuantity,
  SetToken,
  SetTransactionType,
  SetError,
}

interface State {
  error: Reasons | null;
  transactionType: TransactionType;
  input: TokenQuantity;
}

type Action =
  | {
      type: Actions.SetError;
      payload: { reason: Reasons | null };
    }
  | { type: Actions.SetQuantity; payload: { formValue: string | null } }
  | {
      type: Actions.SetToken;
      payload: TokenDetails;
    }
  | {
      type: Actions.SetTransactionType;
      payload: { transactionType: TransactionType };
    };

interface Dispatch {
  setError(reason: Reasons | null): void;
  setQuantity(formValue: string | null): void;
  setToken(token: TokenDetails): void;
  setTransactionType(transactionType: TransactionType): void;
}

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

export const useSaveState = (): [State, Dispatch] => {
  const [state, dispatch] = useReducer(reducer, initialState);

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
