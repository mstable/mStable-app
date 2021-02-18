import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';

import { Actions, Dispatch, State } from './types';
import { reducer } from './reducer';

const initialState: State = {
  initialized: false,
  step: 0,
};

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const RenMintProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setOnboardData = useCallback<Dispatch['setOnboardData']>(
    data => {
      dispatch({ type: Actions.SetOnboardData, payload: data });
    },
    [dispatch],
  );

  const setStep = useCallback<Dispatch['setStep']>(
    step => {
      dispatch({ type: Actions.SetStep, payload: step });
    },
    [dispatch],
  );

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(
          () => ({
            setOnboardData,
            setStep,
          }),
          [setOnboardData, setStep],
        )}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useRenMintState = (): State => useContext(stateCtx);

export const useRenMintDispatch = (): Dispatch => useContext(dispatchCtx);

export const useRenMintOnboardData = (): [
  State['onboardData'],
  Dispatch['setOnboardData'],
] => [useRenMintState().onboardData, useRenMintDispatch().setOnboardData];

export const useRenMintStep = (): [State['step'], Dispatch['setStep']] => [
  useRenMintState().step,
  useRenMintDispatch().setStep,
];
