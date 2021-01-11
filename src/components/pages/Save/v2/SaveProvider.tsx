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
import { useTokensState } from '../../../../context/TokensProvider';
import { reducer } from './reducer';
import { Actions, Dispatch, State, SaveMode } from './types';

const initialState: State = {
  initialized: false,
  touched: false,
  valid: false,
  mode: SaveMode.Deposit,
  tokens: {},
  exchange: {
    input: {},
    output: {},
    feeAmountSimple: null,
  },
};

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>(null as never);

export const SaveProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const massetState = useSelectedMassetState();
  const { tokens } = useTokensState();

  useEffect(() => {
    dispatch({ type: Actions.Data, payload: { massetState, tokens } });
  }, [massetState, tokens]);

  const setInput = useCallback<Dispatch['setInput']>(formValue => {
    dispatch({
      type: Actions.SetInput,
      payload: { formValue },
    });
  }, []);

  const setMaxInput = useCallback<Dispatch['setMaxInput']>(
    () => dispatch({ type: Actions.SetMaxInput }),
    [],
  );

  const setToken = useCallback<Dispatch['setToken']>((field, tokenAddress) => {
    dispatch({
      type: Actions.SetToken,
      payload: {
        field,
        tokenAddress,
      },
    });
  }, []);

  const setModeType = useCallback<Dispatch['setModeType']>(modeType => {
    dispatch({
      type: Actions.SetModeType,
      payload: modeType,
    });
  }, []);

  return (
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
      <stateCtx.Provider value={state}>{children}</stateCtx.Provider>
    </dispatchCtx.Provider>
  );
};

export const useSaveState = (): State => useContext(stateCtx);

export const useSaveDispatch = (): Dispatch => useContext(dispatchCtx);
