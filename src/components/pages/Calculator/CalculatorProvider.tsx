import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';

import { reducer, initialState } from './reducer';
import { Actions, Dispatch, State } from './types';

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const CalculatorProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const amountChanged = useCallback<Dispatch['amountChanged']>(
    value => {
      dispatch({ type: Actions.AmountChanged, payload: { value } });
    },
    [dispatch],
  );

  const monthsChanged = useCallback<Dispatch['monthsChanged']>(
    value => {
      dispatch({ type: Actions.MonthsChanged, payload: { value } });
    },
    [dispatch],
  );

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(() => ({ amountChanged, monthsChanged }), [
          amountChanged,
          monthsChanged,
        ])}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useCalculatorState = (): State => useContext(stateCtx);

export const useCalculatorDispatch = (): Dispatch => useContext(dispatchCtx);
