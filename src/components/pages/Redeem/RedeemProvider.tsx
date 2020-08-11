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
import { Actions, Dispatch, Mode, State } from './types';
import { reducer } from './reducer';

const initialState: State = {
  bAssets: {},
  initialized: false,
  mode: Mode.RedeemMasset,
  touched: false,
  valid: false,
};

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const RedeemProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const dataState = useDataState();
  useEffect(() => {
    dispatch({
      type: Actions.Data,
      payload: dataState,
    });
  }, [dispatch, dataState]);

  const setBassetAmount = useCallback<Dispatch['setBassetAmount']>(
    (address, formValue) => {
      dispatch({
        type: Actions.SetBassetAmount,
        payload: { address, formValue },
      });
    },
    [dispatch],
  );

  const setMassetAmount = useCallback<Dispatch['setMassetAmount']>(
    formValue => {
      dispatch({
        type: Actions.SetMassetAmount,
        payload: formValue,
      });
    },
    [dispatch],
  );

  const setMassetMaxAmount = useCallback<Dispatch['setMassetMaxAmount']>(() => {
    dispatch({
      type: Actions.SetMassetMaxAmount,
    });
  }, [dispatch]);

  const toggleRedeemMasset = useCallback<Dispatch['toggleRedeemMasset']>(() => {
    dispatch({ type: Actions.ToggleRedeemMasset });
  }, [dispatch]);

  const toggleBassetEnabled = useCallback<Dispatch['toggleBassetEnabled']>(
    bAsset => {
      dispatch({ type: Actions.ToggleBassetEnabled, payload: bAsset });
    },
    [dispatch],
  );

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(
          () => ({
            setBassetAmount,
            setMassetAmount,
            setMassetMaxAmount,
            toggleBassetEnabled,
            toggleRedeemMasset,
          }),
          [
            setBassetAmount,
            setMassetAmount,
            setMassetMaxAmount,
            toggleBassetEnabled,
            toggleRedeemMasset,
          ],
        )}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useRedeemState = (): State => useContext(stateCtx);

export const useRedeemDispatch = (): Dispatch => useContext(dispatchCtx);

export const useRedeemMode = (): Mode => useRedeemState().mode;
