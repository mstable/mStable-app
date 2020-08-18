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
import { reducer, initialState } from './reducer';
import { Actions, Dispatch, State } from './types';

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const CalculatorProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const dataState = useDataState();
  useEffect(() => {
    dispatch({ type: Actions.Data, payload: dataState });
  }, [dataState]);

  const amountChanged = useCallback<Dispatch['amountChanged']>(
    value => {
      dispatch({ type: Actions.AmountChanged, payload: { value } });
    },
    [dispatch],
  );

  const startDateChanged = useCallback<Dispatch['startDateChanged']>(
    value => {
      dispatch({ type: Actions.StartDateChanged, payload: { value } });
    },
    [dispatch],
  );

  const endDateChanged = useCallback<Dispatch['endDateChanged']>(
    value => {
      dispatch({ type: Actions.EndDateChanged, payload: { value } });
    },
    [dispatch],
  );

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(
          () => ({ amountChanged, startDateChanged, endDateChanged }),
          [amountChanged, startDateChanged, endDateChanged],
        )}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useCalculatorState = (): State => useContext(stateCtx);

export const useCalculatorDispatch = (): Dispatch => useContext(dispatchCtx);
