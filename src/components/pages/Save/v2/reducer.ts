import { Reducer } from 'react';
import { pipeline } from 'ts-pipe-compose';

import { BigDecimal } from '../../../../web3/BigDecimal';
import { validate } from './validate';
import { Action, Actions, ExchangeState, State, TokenPayload, TransactionType } from './types';
import { TokenQuantityV2 } from '../../../../types';

const initialize = (state: State): State =>
  !state.initialized && state.massetState
    ? {
        ...state,
        initialized: true,
        amount: new BigDecimal(0, state.massetState.token.decimals),
        amountInCredits: new BigDecimal(0, state.massetState.token.decimals)}
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
    
const setInitialExchangePair = (state: State): State => {
  const { massetState, exchange } = state;
  
  if (massetState && !exchange.rate) {
    const defaultInputToken = massetState.token;
    const defaultOutputToken = massetState.savingsContracts.v2?.token
    
    if (!defaultOutputToken) return state;
    
    return {
      ...state,
      exchange: {
        rate: getExchangeRate(state),
        input: {
          formValue: state.exchange.input.formValue,
          amount: null,
          token: {
            address: defaultInputToken.address,
            decimals: defaultInputToken.decimals,
            symbol: defaultInputToken.symbol,
          },
        },
        output: {
          formValue: null,
          amount: null,
          token: {
            address: defaultOutputToken.address,
            decimals: defaultOutputToken.decimals,
            symbol: defaultOutputToken.symbol,
          },
        },
        feeAmountSimple: null
      }
    }
  }
  return state;
};

const updateToken = (payload: TokenPayload): {[field: string]: TokenQuantityV2 } => {
  const { field, token } = payload;
  
  const formValue = null;
  const amount = BigDecimal.maybeParse(formValue) ?? null;
    
  return {
    [field]: {
      formValue,
      amount,
      token,
    },
  }
}

const updateExchangeState = (state: State, payload: TokenPayload ): ExchangeState => {
  return  {
    ...state.exchange,
    ...updateToken(payload as TokenPayload),
    rate: getExchangeRate(state),
  }
}

const reduce: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Data:
      return { ...state, massetState: action.payload };

    // input change only for now.
    case Actions.SetAmount: {
      const { exchange, massetState } = state;
      const { formValue } = action.payload;

      if (!massetState) return state;

      // will only work with musd - imusd, not other assets.
      const exchangeRate = exchange.rate;
      const maybeAmount = BigDecimal.maybeParse(formValue, exchange.input.token?.decimals);
      
      const amountInCredits = (maybeAmount && exchangeRate)
          ? maybeAmount.mulTruncate(exchangeRate.exact)
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
        exchange: updateExchangeState(state, action.payload)
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
      // disable switching until initialised
      if (!state.initialized) return state;
      // reject if same tab clicked
      if (mode === state.mode) return state;
      
      const {input, output} = state.exchange;
      return {
        ...state,
        mode,
        // switch exchange assets
        exchange: {
          ...state.exchange,
          input: output,
          output: input,
        }
      };
    }

    default:
      throw new Error('Unhandled action type');
  }
};

export const reducer: Reducer<State, Action> = pipeline(
  reduce,
  initialize,
  setInitialExchangePair,
  simulate,
  validate,
);
