import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { createStateContext } from 'react-use';

import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';
import { reducer } from './reducer';
import { Actions, Dispatch, State, TransactionType } from './types';

export interface SaveVersion {
  version: number;
  isCurrent?: boolean;
}

const initialState: State = {
  formValue: null,
  initialized: false,
  touched: false,
  transactionType: TransactionType.Deposit,
  valid: false,
};

const stateCtx = createContext<State>(initialState);
const dispatchCtx = createContext<Dispatch>({} as Dispatch);

export const SAVE_VERSIONS: SaveVersion[] = [
  { version: 1 },
  { version: 2, isCurrent: true },
];

export const CURRENT_SAVE_VERSION = SAVE_VERSIONS.find(
  v => v.isCurrent,
) as SaveVersion;

// Could be moved higher up if necessary
export const [
  useActiveSaveVersion,
  ActiveSaveVersionProvider,
] = createStateContext(CURRENT_SAVE_VERSION);

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

  return (
    <ActiveSaveVersionProvider>
      <stateCtx.Provider value={state}>
        <dispatchCtx.Provider
          value={useMemo(
            () => ({ setAmount, setMaxAmount, toggleTransactionType }),
            [setMaxAmount, setAmount, toggleTransactionType],
          )}
        >
          {children}
        </dispatchCtx.Provider>
      </stateCtx.Provider>
    </ActiveSaveVersionProvider>
  );
};

export const useSaveState = (): State => useContext(stateCtx);

export const useSaveDispatch = (): Dispatch => useContext(dispatchCtx);
