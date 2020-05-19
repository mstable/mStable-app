import { parseUnits } from 'ethers/utils';
import { Reducer, useCallback, useMemo, useReducer } from 'react';
import { TokenDetails, SavingsQuantity } from '../../../types';
import { parseAmount } from '../../../web3/amounts';
import { SCALE } from '../../../web3/constants';
import {
  useLatestExchangeRateSubscription,
  ExchangeRate,
} from '../../../graphql/generated';

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
  input: SavingsQuantity;
}

type Action =
  | {
      type: Actions.SetError;
      payload: { reason: Reasons | null };
    }
  | {
      type: Actions.SetQuantity;
      payload: {
        formValue: string | null;
        exchangeRate:
          | Pick<ExchangeRate, 'exchangeRate' | 'timestamp'>
          | undefined;
      };
    }
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
      const { formValue, exchangeRate } = action.payload;
      const amount = parseAmount(formValue, state.input.token.decimals);
      return {
        ...state,
        input: {
          ...state.input,
          formValue,
          amount,
          amountInCredits:
            amount.exact && exchangeRate?.exchangeRate
              ? amount.exact
                  .add(1)
                  .mul(SCALE)
                  .div(parseUnits(exchangeRate.exchangeRate))
              : null,
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
    amountInCredits: null,
  },
});

export const useSaveState = (): [State, Dispatch] => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const latestSub = useLatestExchangeRateSubscription();
  const latest = latestSub.data?.exchangeRates[0];

  const setError = useCallback<Dispatch['setError']>(
    reason => {
      dispatch({ type: Actions.SetError, payload: { reason } });
    },
    [dispatch],
  );

  const setQuantity = useCallback<Dispatch['setQuantity']>(
    formValue => {
      dispatch({
        type: Actions.SetQuantity,
        payload: { formValue, exchangeRate: latest },
      });
    },
    [dispatch, latest],
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
