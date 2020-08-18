import { Reducer } from 'react';
import { pipeline } from 'ts-pipe-compose';
import { BigNumber } from 'ethers/utils';
import { Action, Actions, State } from './types';
import { BigDecimal } from '../../../web3/BigDecimal';

const ONE_DAY = 24 * 60 * 60 * 1000;

const getTodayDate = (): Date => {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today;
};

const getFormDate = (offset = 0): string => {
  const today = getTodayDate();
  today.setDate(today.getDate() + offset);
  return today.toJSON().slice(0, 10);
};

export const initialState: State = {
  initialized: false,
  processing: false,
  depositedAmount: new BigDecimal(0, 18),
  amount: '',
  startDate: getFormDate(-14),
  endDate: getFormDate(), // today
  totalDays: 0,
  isInThePast: false,
  isInTheFuture: false,
  totalEarnings: new BigDecimal(0, 18),
  avgApy: new BigNumber('10000000000000000'), // 1%
  avgApyPast: new BigNumber(0),
  avgApyFuture: new BigNumber(0),
};

const initialize = (state: State): State =>
  !state.initialized && state.dataState
    ? {
        ...state,
        initialized: true,
        depositedAmount: state.dataState.mAsset.balance,
      }
    : state;

const setTotalDays = (state: State): State => {
  const start = new Date(state.startDate).getTime();
  const end = new Date(state.endDate).getTime();
  const totalDays = Math.round(Math.abs((end - start) / ONE_DAY));

  return {
    ...state,
    totalDays,
  };
};

const setIsInThePastOrFuture = (state: State): State => {
  const today = getTodayDate().setHours(0, 0, 0, 0);
  const start = new Date(state.startDate).setHours(0, 0, 0, 0);
  const end = new Date(state.endDate).setHours(0, 0, 0, 0);

  return {
    ...state,
    isInThePast: today > start,
    isInTheFuture: today < end,
  };
};

const setTotalEarnings = (state: State): State => {
  const amountBN = new BigNumber(state.amount || '0');
  const totalEarnings = new BigDecimal(amountBN.mul(state.avgApy), 18);

  return {
    ...state,
    totalEarnings,
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
  setTotalDays,
  setIsInThePastOrFuture,
  setTotalEarnings,
);
