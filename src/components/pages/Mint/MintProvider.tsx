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
import { BigDecimal } from '../../../web3/BigDecimal';
import { Actions, Dispatch, Mode, State } from './types';
import { reducer } from './reducer';

const initialState: State = {
  bAssets: {},
  mode: Mode.MintMulti,
  mintAmount: new BigDecimal(0, 18),
  valid: false,
  amountTouched: false,
  toggleTouched: false,
  initialized: false,
};

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const MintProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const dataState = useDataState();
  useEffect(() => {
    dispatch({ type: Actions.Data, payload: dataState });
  }, [dataState]);

  const setBassetAmount = useCallback<Dispatch['setBassetAmount']>(
    (address, formValue) => {
      dispatch({
        type: Actions.SetBassetAmount,
        payload: { address, formValue },
      });
    },
    [dispatch],
  );

  const toggleBassetEnabled = useCallback<Dispatch['toggleBassetEnabled']>(
    address => {
      dispatch({ type: Actions.ToggleBassetEnabled, payload: address });
    },
    [dispatch],
  );

  const setBassetMaxAmount = useCallback<Dispatch['setBassetMaxAmount']>(() => {
    dispatch({ type: Actions.SetBassetMaxAmount });
  }, [dispatch]);

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(
          () => ({
            setBassetAmount,
            setBassetMaxAmount,
            toggleBassetEnabled,
          }),
          [setBassetAmount, setBassetMaxAmount, toggleBassetEnabled],
        )}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useMintState = (): State => useContext(stateCtx);

export const useMintBasset = (address: string): State['bAssets'][string] => {
  const { bAssets } = useMintState();
  return bAssets[address];
};

export const useMintSimulation = (): State['simulation'] => {
  const { simulation } = useMintState();
  return simulation;
};

export const useMintMode = (): State['mode'] => useMintState().mode;

export const useMintDispatch = (): Dispatch => useContext(dispatchCtx);

export const useMintToggleBassetEnabled = (): Dispatch['toggleBassetEnabled'] =>
  useMintDispatch().toggleBassetEnabled;

export const useMintSetBassetAmount = (): Dispatch['setBassetAmount'] =>
  useMintDispatch().setBassetAmount;

export const useMintSetBassetMaxAmount = (): Dispatch['setBassetMaxAmount'] =>
  useMintDispatch().setBassetMaxAmount;
