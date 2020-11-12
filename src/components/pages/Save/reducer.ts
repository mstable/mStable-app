import { Reducer } from 'react';
import { pipeline } from 'ts-pipe-compose';
import { BigDecimal } from '../../../web3/BigDecimal';
import { validate } from './validate';
import { Action, Actions, State, TransactionType } from './types';

const initialize = (state: State): State =>
  !state.initialized && state.dataState
    ? {
        ...state,
        initialized: true,
        amount: new BigDecimal(0, state.dataState.mAsset.decimals),
        amountInCredits: new BigDecimal(0, state.dataState.mAsset.decimals),
      }
    : state;

const updateNeedsUnlock = (state: State): State =>
  state.initialized && state.dataState
    ? {
        ...state,
        needsUnlock:
          state.transactionType === TransactionType.Deposit &&
          state.amount?.exact.gt(
            state.dataState.savingsContract.mAssetAllowance.exact,
          ),
      }
    : state;

const simulateDeposit = (state: State): State['simulated'] => state.simulated;

const simulateWithdrawal = (state: State): State['simulated'] =>
  state.simulated;

const simulate = (state: State): State =>
  state.initialized && state.dataState
    ? {
        ...state,
        simulated:
          state.transactionType === TransactionType.Deposit
            ? simulateDeposit(state)
            : simulateWithdrawal(state),
      }
    : state;

const reduce: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Data:
      return { ...state, dataState: action.payload };

    case Actions.SetAmount: {
      const { dataState, transactionType } = state;
      const isWithdraw = transactionType === TransactionType.Withdraw;

      if (!dataState) return state;

      const { formValue } = action.payload;

      const { decimals } = dataState.mAsset;
      const exchangeRate =
        dataState.savingsContract.latestExchangeRate?.rate;

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

    case Actions.SetMaxAmount: {
      const { transactionType, dataState } = state;

      if (!dataState) return state;

      if (transactionType === TransactionType.Deposit) {
        const formValue = dataState.mAsset.balance.format(2, false);
        return {
          ...state,
          amount: dataState.mAsset.balance,
          amountInCredits: undefined,
          formValue,
          touched: !!formValue,
        };
      }

      const {
        savingsBalance: { balance, credits },
      } = dataState.savingsContract;

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

    default:
      throw new Error('Unhandled action type');
  }
};

export const reducer: Reducer<State, Action> = pipeline(
  reduce,
  initialize,
  updateNeedsUnlock,
  simulate,
  validate,
);
