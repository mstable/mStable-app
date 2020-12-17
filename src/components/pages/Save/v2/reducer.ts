import { Reducer } from 'react';
import { pipeline } from 'ts-pipe-compose';

import { BigDecimal } from '../../../../web3/BigDecimal';
import { validate } from './validate';
import { Action, Actions, ExchangePair, FieldPayload, State, TransactionType } from './types';
import { initialTokenQuantityField } from '../../Swap/reducer';
import { Fields } from '../../../../types';
import { parseAmount } from '../../../../web3/amounts';

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
    
const calcAssetConversionRate = (state: State, payload: FieldPayload): ExchangePair => {
  const { address, decimals, symbol, field } = payload;
  
  // mocked for now
  const token = {address, decimals, symbol }
  const formValue = "100";
  const amount = parseAmount(formValue, token.decimals);
  
  return {
    ...state.exchange,
    [field]: {
      formValue,
      amount,
      token,
    },
  }
}

const reduce: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Data:
      return { ...state, massetState: action.payload };

    case Actions.SetAmount: {
      const { massetState, transactionType } = state;
      const isWithdraw = transactionType === TransactionType.Withdraw;

      if (!massetState) return state;

      const { formValue } = action.payload;

      const { decimals } = massetState.token;
      const exchangeRate =
        massetState.savingsContracts.v2?.latestExchangeRate?.rate;

      const maybeAmount = BigDecimal.maybeParse(formValue, decimals);

      const amountInCredits =
        isWithdraw && maybeAmount && exchangeRate
          ? maybeAmount.divPrecisely(exchangeRate).add(new BigDecimal(1, 0))
          : undefined;

      return {
        ...state,
        amountInCredits,
        amount: maybeAmount,
        formValue,
        touched: !!formValue,
      };
    }
    
    case Actions.SetToken:
      return {
        ...state,
        exchange: calcAssetConversionRate(state, action.payload)
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
