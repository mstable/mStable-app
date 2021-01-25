import React, {
  FC,
  createContext,
  useCallback,
  useMemo,
  useReducer,
  useContext,
  useEffect,
} from 'react';

import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { Actions, Dispatch, State } from './types';
import { reducer, initialState } from './reducer';
import { Fields } from '../../../../types';

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const SwapProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setInputQuantity = useCallback<Dispatch['setInputQuantity']>(
    formValue => {
      dispatch({
        type: Actions.SetQuantity,
        payload: { formValue, field: Fields.Input },
      });
    },
    [dispatch],
  );

  const setOutputQuantity = useCallback<Dispatch['setOutputQuantity']>(
    formValue => {
      dispatch({
        type: Actions.SetQuantity,
        payload: { formValue, field: Fields.Output },
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

  const massetState = useSelectedMassetState();
  useEffect(() => {
    dispatch({
      type: Actions.Data,
      payload: massetState,
    });
  }, [dispatch, massetState]);

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(
          () => ({ setInputQuantity, setOutputQuantity, setToken }),
          [setInputQuantity, setOutputQuantity, setToken],
        )}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useSwapState = (): State => useContext(stateCtx);

export const useSwapDispatch = (): Dispatch => useContext(dispatchCtx);
