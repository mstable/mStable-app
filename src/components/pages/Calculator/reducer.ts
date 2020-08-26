import { Reducer } from 'react';
import { pipeline } from 'ts-pipe-compose';
import { Action, Actions, State } from './types';

const ONE_DAY = 24 * 60 * 60 * 1000;
const FORM_MIN_DATE = '2020-05-29'; // when contract was deployed

const getTodayDate = (): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today;
};

const offsetDate = (dateString: string, offset: number): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + offset);
  return date.toJSON().slice(0, 10);
};

const getFormDate = (offset = 0): string => {
  const today = getTodayDate();
  today.setDate(today.getDate() + offset);
  return today.toJSON().slice(0, 10);
};

export const initialState: State = {
  initialized: false,
  depositedAmount: undefined,
  amount: '',
  startDate: getFormDate(-14),
  startMinDate: FORM_MIN_DATE,
  startMaxDate: '', // always endDate - 1d
  endDate: getFormDate(), // today
  endMinDate: '', // always startDate + 1d
  pastDays: 0,
  futureDays: 0,
  isInThePast: false,
  isInTheFuture: false,
};

const initialize = (state: State): State =>
  !state.initialized && state.dataState
    ? {
        ...state,
        initialized: true,
        depositedAmount: state.dataState.savingsContract.savingsBalance.balance,
      }
    : state;

const setFormDates = (state: State): State => ({
  ...state,
  endMinDate: offsetDate(state.startDate, +1),
  startMaxDate: offsetDate(state.endDate, -1),
});

const setPastAndFuture = (state: State): State => {
  const today = getTodayDate().getTime();
  const start = new Date(state.startDate).getTime();
  const end = new Date(state.endDate).getTime();

  const pastDays = Math.round(Math.abs((today - start) / ONE_DAY));
  const futureDays = Math.round(Math.abs((today - end) / ONE_DAY));

  return {
    ...state,
    isInThePast: pastDays > 0,
    isInTheFuture: futureDays > 0,
    pastDays,
    futureDays,
  };
};

const reduce: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Data: {
      return { ...state, dataState: action.payload };
    }

    case Actions.AmountChanged:
      return {
        ...state,
        amount: action.payload.value,
      };

    case Actions.StartDateChanged:
      return {
        ...state,
        startDate: action.payload.value,
      };

    case Actions.EndDateChanged:
      return {
        ...state,
        endDate: action.payload.value,
      };

    default:
      throw new Error('Unhandled action type');
  }
};

export const reducer: Reducer<State, Action> = pipeline(
  reduce,
  initialize,
  setFormDates,
  setPastAndFuture,
);
