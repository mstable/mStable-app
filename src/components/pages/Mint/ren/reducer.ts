import { Reducer } from 'react';
import { pipeline } from 'ts-pipe-compose';

import { Action, Actions, State } from './types';

const initialize = (state: State): State =>
  !state.initialized
    ? {
        ...state,
        initialized: true,
      }
    : state;

const reduce: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Data:
      return { ...state };

    case Actions.SetOnboardData: {
      return { ...state, onboardData: action.payload };
    }

    case Actions.SetStep: {
      return { ...state, step: action.payload };
    }

    default:
      throw new Error('Unhandled action type');
  }
};

export const reducer: Reducer<State, Action> = pipeline(reduce, initialize);
