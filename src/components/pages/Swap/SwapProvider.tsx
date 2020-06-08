import React, {
  FC,
  createContext,
  useCallback,
  useMemo,
  useReducer,
  useContext,
  useEffect,
} from 'react';
import { useDataState } from '../../../context/DataProvider/DataProvider';
import { Actions, Dispatch, State } from './types';
import { reducer, initialState } from './reducer';

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const SwapProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setQuantity = useCallback<Dispatch['setQuantity']>(
    (field, formValue) => {
      dispatch({
        type: Actions.SetQuantity,
        payload: { formValue, field },
      });
    },
    [dispatch],
  );

  const setToken = useCallback<Dispatch['setToken']>(
    (field, payload) => {
      dispatch({
        type: Actions.SetToken,
        payload: {
          field,
          ...(payload ?? { address: null, symbol: null, decimals: null }),
        },
      });
    },
    [dispatch],
  );

  const dataState = useDataState();
  useEffect(() => {
    dispatch({
      type: Actions.Data,
      payload: dataState,
    });
  }, [dispatch, dataState]);

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(() => ({ setQuantity, setToken }), [
          setQuantity,
          setToken,
        ])}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useSwapState = (): State => useContext(stateCtx);

export const useSwapDispatch = (): Dispatch => useContext(dispatchCtx);
