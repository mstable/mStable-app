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
import { reducer } from './reducer';
import { Actions, Dispatch, State, TransactionType, SaveMode } from './types';

const initialState: State = {
  formValue: null,
  initialized: false,
  touched: false,
  transactionType: TransactionType.Deposit,
  valid: false,
  mode: SaveMode.Deposit,
};

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const SaveProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const massetState = useSelectedMassetState();

  useEffect(() => {
    dispatch({ type: Actions.Data, payload: massetState });
  }, [massetState]);

  const setAmount = useCallback<Dispatch['setAmount']>(
    formValue => {
      dispatch({
        type: Actions.SetAmount,
        payload: { formValue },
      });
    },
    [dispatch],
  );

  const setMaxAmount = useCallback<Dispatch['setMaxAmount']>(() => {
    dispatch({ type: Actions.SetMaxAmount });
  }, [dispatch]);

  const toggleTransactionType = useCallback<
    Dispatch['toggleTransactionType']
  >(() => {
    dispatch({ type: Actions.ToggleTransactionType });
  }, [dispatch]);

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
            setAmount,
            setMaxAmount,
            toggleTransactionType,
            setModeType,
          }),
          [setMaxAmount, setAmount, toggleTransactionType, setModeType],
        )}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useSaveState = (): State => useContext(stateCtx);

export const useSaveDispatch = (): Dispatch => useContext(dispatchCtx);
