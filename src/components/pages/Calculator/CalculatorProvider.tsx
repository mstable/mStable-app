import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { useDataState } from '../../../context/DataProvider/DataProvider';
import { reducer } from './reducer';
import { Actions, Dispatch, State } from './types';

const initialState: State = {
  initialized: false,
};

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const CalculatorProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const dataState = useDataState();
  useEffect(() => {
    dispatch({ type: Actions.Data, payload: dataState });
  }, [dataState]);

  const calculate = useCallback<Dispatch['calculate']>(() => {
    dispatch({ type: Actions.Calculate });
  }, [dispatch]);

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider value={useMemo(() => ({ calculate }), [calculate])}>
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useCalculatorState = (): State => useContext(stateCtx);

export const useCalculatorDispatch = (): Dispatch => useContext(dispatchCtx);
