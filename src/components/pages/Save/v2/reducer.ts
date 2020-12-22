import { Reducer } from 'react';
import { pipeline } from 'ts-pipe-compose';

import { BigDecimal } from '../../../../web3/BigDecimal';
import { validate } from './validate';
import { Action, Actions, FieldPayload, State, TransactionType } from './types';
import { parseAmount } from '../../../../web3/amounts';
import { TokenQuantity } from '../../../../types';

const initialize = (state: State): State =>
  !state.initialized && state.massetState
    ? {
        ...state,
        initialized: true,
        amount: new BigDecimal(0, state.massetState.token.decimals),
        amountInCredits: new BigDecimal(0, state.massetState.token.decimals),
      }
    : state;

const simulateDeposit = (state: State): State['simulated'] => state.simulated;

const simulateWithdrawal = (state: State): State['simulated'] =>
  state.simulated;

const simulate = (state: State): State =>
  state.initialized && state.massetState
    ? {
        ...state,
        simulated:
          state.transactionType === TransactionType.Deposit
            ? simulateDeposit(state)
            : simulateWithdrawal(state),
      }
    : state;
    
const getExchangeRate = (state: State): BigDecimal | undefined => {
  const { massetState } = state;
  if (!massetState) return undefined;
  
  // for now return musd exchange.
  return massetState.savingsContracts.v2?.latestExchangeRate?.rate
}

const updateToken = (state: State, payload: FieldPayload): {[field: string]: TokenQuantity } => {
  const { address, decimals, symbol, field } = payload;
  
  const token = {address, decimals, symbol };
  const formValue = null;
  const amount = parseAmount(formValue, token.decimals);
    
  return {
    [field]: {
      formValue,
      amount,
      token,
    },
  }
}
    
const updateTokenPair = (state: State, payload: FieldPayload[]): {[field: string]: TokenQuantity } => {
  const exchange = payload.map(p => updateToken(state, p));
  return exchange.reduce((prev, current) => ({
    ...prev,
    ...current
    }));;
}

const reduce: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Data:
      return { ...state, massetState: action.payload };

    // input change only for now.
    case Actions.SetAmount: {
      const { exchange, massetState } = state;
      const { formValue } = action.payload;
      const { decimals } = exchange.input.token;

      if (!massetState) return state;

      // will only work with musd - imusd, not other assets.
      const exchangeRate = exchange.rate;
      const maybeAmount = BigDecimal.maybeParse(formValue, decimals ?? 18);
      
      const amountInCredits = (maybeAmount && exchangeRate)
          ? maybeAmount.divPrecisely(exchangeRate).add(new BigDecimal(1, 0))
          : undefined;
      
      return {
        ...state,
        exchange: {
          ...state.exchange,
          input: {
            ...state.exchange.input,
            formValue,
            amount: maybeAmount ?? null,
          },
          output: {
            ...state.exchange.output,
            formValue: amountInCredits?.format(2) ?? null,
            amount: amountInCredits ?? null,
          }
        }
      }
    }
    
    case Actions.SetToken:
      return {
        ...state,
        exchange: {
          ...state.exchange,
          ...updateToken(state, action.payload),
          rate: getExchangeRate(state),
        }
      };
      
    case Actions.SetTokenPair:
      return {
        ...state,
        exchange: {
          ...state.exchange,
          ...updateTokenPair(state, action.payload),
          rate: getExchangeRate(state),
        }
      };

    case Actions.SetMaxAmount: {
      const { transactionType, massetState } = state;

      if (!massetState) return state;

      if (transactionType === TransactionType.Deposit) {
        const formValue = massetState.token.balance.format(2, false);
        return {
          ...state,
          amount: massetState.token.balance,
          amountInCredits: undefined,
          formValue,
          touched: !!formValue,
        };
      }

      const {
        savingsBalance: { balance, credits },
      } = massetState.savingsContracts.v2 as NonNullable<
        typeof massetState['savingsContracts']['v2']
      >;

      if (balance) {
        const formValue = balance.format(2, false);
        const amount = balance;

        return {
          ...state,
          amount,
          amountInCredits: credits,
          formValue,
          touched: !!formValue,
        };
      }

      return state;
    }

    case Actions.ToggleTransactionType: {
      return {
        ...state,
        transactionType:
          state.transactionType === TransactionType.Deposit
            ? TransactionType.Withdraw
            : TransactionType.Deposit,
        // Reset the amounts when toggling type, and remove `touched`
        amount: undefined,
        amountInCredits: undefined,
        formValue: null,
        touched: false,
      };
    }

    case Actions.SetModeType: {
      const mode = action.payload;
      return {
        ...state,
        mode,
      };
    }

    default:
      throw new Error('Unhandled action type');
  }
};

export const reducer: Reducer<State, Action> = pipeline(
  reduce,
  initialize,
  simulate,
  validate,
);
