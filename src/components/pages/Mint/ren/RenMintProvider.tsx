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

export const MintProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setOnboardData = useCallback<Dispatch['setOnboardData']>(
    data => {
      dispatch({ type: Actions.SetOnboardData, payload: data });
    },
    [dispatch],
  );

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(
          () => ({
            setOnboardData,
          }),
          [setOnboardData],
        )}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useRenMintState = (): State => useContext(stateCtx);

export const useRenMintDispatch = (): Dispatch => useContext(dispatchCtx);
