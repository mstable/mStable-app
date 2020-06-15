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
import { Actions, BassetOutput, Dispatch, Mode, State } from './types';
import { reducer } from './reducer';
import { BassetState, DataState } from '../../../context/DataProvider/types';

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

  const setRedemptionAmount = useCallback<Dispatch['setRedemptionAmount']>(
    formValue => {
      dispatch({
        type: Actions.SetRedemptionAmount,
        payload: formValue,
      });
    },
    [dispatch],
  );

  const setMaxRedemptionAmount = useCallback<
    Dispatch['setMaxRedemptionAmount']
  >(() => {
    dispatch({
      type: Actions.SetMaxRedemptionAmount,
    });
  }, [dispatch]);

  const toggleMode = useCallback<Dispatch['toggleMode']>(() => {
    dispatch({ type: Actions.ToggleMode });
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
            setMaxRedemptionAmount,
            setRedemptionAmount,
            toggleBassetEnabled,
            toggleMode,
          }),
          [
            setMaxRedemptionAmount,
            setRedemptionAmount,
            toggleBassetEnabled,
            toggleMode,
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

export const useToggleBassetEnabled = (): Dispatch['toggleBassetEnabled'] =>
  useRedeemDispatch().toggleBassetEnabled;

export const useRedeemBassetOutput = (
  address: string,
): BassetOutput | undefined => useRedeemState().bAssets[address];

export const useRedeemBassetData = (address: string): BassetState | undefined =>
  useRedeemState().dataState?.bAssets[address];

export const useRedeemMode = (): Mode =>
  useRedeemState().mode;

export const useRedeemSimulation = (
  simulationMustBeValid?: boolean,
): DataState | undefined => {
  const { valid, simulated } = useRedeemState();
  return simulationMustBeValid ? (valid ? simulated : undefined) : simulated;
};
