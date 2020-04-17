import { Reducer, useCallback, useMemo, useReducer } from 'react';
import { TokenDetails, TokenQuantity } from '../../../types';
import { parseAmounts } from '../../../web3/amounts';

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
  | { type: Actions.SetQuantity; payload: { simpleAmount: string | null } }
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
  setQuantity(simpleAmount: string | null): void;
  setToken(token: TokenDetails): void;
  setTransactionType(transactionType: TransactionType): void;
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.SetError: {
      const { reason } = action.payload;
      return { ...state, error: reason };
    }
    case Actions.SetQuantity:
      return {
        ...state,
        input: parseAmounts({
          ...state.input,
          amount: {
            simple: action.payload.simpleAmount,
            exact: null,
            formatted: null,
          },
        }),
      };
    case Actions.SetToken:
      return {
        ...state,
        input:
          action.payload === null
            ? {
                ...state.input,
                token: { address: null, symbol: null, decimals: null },
              }
            : parseAmounts({ ...state.input, token: action.payload }),
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
    token: {
      address: null,
      decimals: null,
      symbol: null,
    },
    amount: {
      simple: null,
      exact: null,
      formatted: null,
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
    simpleAmount => {
      dispatch({ type: Actions.SetQuantity, payload: { simpleAmount } });
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
