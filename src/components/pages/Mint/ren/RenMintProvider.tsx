import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';

import { Actions, Dispatch, OnboardData, State } from './types';
import { reducer } from './reducer';

interface Props {
  onboardData: OnboardData;
}

const initialState: State = {
  initialized: false,
  step: 0,
};

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const RenMintProvider: FC<Props> = ({ onboardData, children }) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    onboardData,
  });

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

export const useRenMintSetOnboardData = (): Dispatch['setOnboardData'] =>
  useRenMintDispatch().setOnboardData;

export const useRenMintStep = (): [State['step'], Dispatch['setStep']] => [
  useRenMintState().step,
  useRenMintDispatch().setStep,
];
