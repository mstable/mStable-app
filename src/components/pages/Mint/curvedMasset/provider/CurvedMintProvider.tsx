import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { useSelectedMassetState } from '../../../../../context/DataProvider/DataProvider';
import { Actions, Dispatch, State } from './types';
import { reducer } from './reducer';

const initialState: State = {
  initialized: false,
  inputAssets: {},
  outputAssets: {},
};

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const CurvedMintProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const massetState = useSelectedMassetState();

  useEffect(() => {
    dispatch({ type: Actions.Data, payload: massetState });
  }, [massetState]);

  const setAssetAmount = useCallback<Dispatch['setAssetAmount']>(
    (address, formValue) => {
      dispatch({
        type: Actions.SetBassetAmount,
        payload: { address, formValue },
      });
    },
    [dispatch],
  );

  const setAssetMaxAmount = useCallback<Dispatch['setAssetMaxAmount']>(
    address => {
      dispatch({ type: Actions.SetBassetMaxAmount, payload: { address } });
    },
    [dispatch],
  );

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(
          () => ({
            setAssetAmount,
            setAssetMaxAmount,
          }),
          [setAssetAmount, setAssetMaxAmount],
        )}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useMintState = (): State => useContext(stateCtx);

export const useMintDispatch = (): Dispatch => useContext(dispatchCtx);

export const useMintSetBassetAmount = (): Dispatch['setAssetAmount'] =>
  useMintDispatch().setAssetAmount;

export const useMintSetBassetMaxAmount = (): Dispatch['setAssetMaxAmount'] =>
  useMintDispatch().setAssetMaxAmount;
