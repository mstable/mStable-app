import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { TokenQuantityV2 } from '../../../../types';
import { reducer } from './reducer';
import { Actions, Dispatch, State, SaveMode } from './types';

export const initialTokenQuantityFieldV2: TokenQuantityV2 = {
  formValue: null,
  amount: null,
};

const initialState: State = {
  initialized: false,
  touched: false,
  valid: false,
  mode: SaveMode.Deposit,
  exchange: {
    input: initialTokenQuantityFieldV2,
    output: initialTokenQuantityFieldV2,
    feeAmountSimple: null,
  },
};

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const SaveProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const massetState = useSelectedMassetState();

  useEffect(() => {
    dispatch({ type: Actions.Data, payload: massetState });
  }, [massetState]);

  const setInput = useCallback<Dispatch['setInput']>(
    formValue => {
      dispatch({
        type: Actions.SetInput,
        payload: { formValue },
      });
    },
    [dispatch],
  );

  const setMaxInput = useCallback<Dispatch['setMaxInput']>(
    () => dispatch({ type: Actions.SetMaxInput }),
    [dispatch],
  );

  const setToken = useCallback<Dispatch['setToken']>(
    (field, token) => {
      dispatch({
        type: Actions.SetToken,
        payload: {
          field,
          token,
        },
      });
    },
    [dispatch],
  );

  const setModeType = useCallback<Dispatch['setModeType']>(
    modeType => {
      dispatch({
        type: Actions.SetModeType,
        payload: modeType,
      });
    },
    [dispatch],
  );

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(
          () => ({
            setInput,
            setModeType,
            setToken,
            setMaxInput,
          }),
          [setToken, setInput, setMaxInput, setModeType],
        )}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useSaveState = (): State => useContext(stateCtx);

export const useSaveDispatch = (): Dispatch => useContext(dispatchCtx);
