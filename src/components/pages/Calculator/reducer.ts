import { Reducer } from 'react';
import { pipeline } from 'ts-pipe-compose';
import { differenceInDays, addMonths } from 'date-fns';
import { Action, Actions, State } from './types';
import { BigDecimal } from '../../../web3/BigDecimal';

const getTodayDate = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today;
};

export const initialState: State = {
  formAmount: 10000,
  amount: BigDecimal.parse('10000', 18),
  minAmount: 1000,
  maxAmount: 100000,
  months: 6,
  minMonths: 1,
  maxMonths: 24,
  days: 30,
};

const setDays = (state: State): State => {
  const today = getTodayDate();
  const future = addMonths(today, state.months);
  const days = differenceInDays(future, today);

  return {
    ...state,
    days,
  };
};

const setAmount = (state: State): State => ({
    ...state,
    amount: BigDecimal.parse(state.formAmount.toString(), 18),
  });

const reduce: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.AmountChanged:
      return {
        ...state,
        formAmount: action.payload.value,
      };

    case Actions.MonthsChanged:
      return {
        ...state,
        months: action.payload.value,
      };

    default:
      throw new Error('Unhandled action type');
  }
};

export const reducer: Reducer<State, Action> = pipeline(
  reduce,
  setDays,
  setAmount,
);
