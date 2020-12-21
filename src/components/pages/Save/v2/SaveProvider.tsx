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
import { initialTokenQuantityField } from '../../Swap/reducer';
import { reducer } from './reducer';
import { Actions, Dispatch, State, TransactionType, SaveMode } from './types';

const initialState: State = {
  formValue: null,
  initialized: false,
  touched: false,
  transactionType: TransactionType.Deposit,
  valid: false,
  mode: SaveMode.Deposit,
  exchange: {
    input: initialTokenQuantityField,
    output: initialTokenQuantityField,
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

  const setTokenPair = useCallback<Dispatch['setTokenPair']>(
    tokenPairs => {
      dispatch({
        type: Actions.SetTokenPair,
        payload: tokenPairs.map(t => ({
          field: t.field,
          ...(t.token ?? { address: null, symbol: null, decimals: null }),
        })),
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
            setToken,
            setTokenPair,
          }),
          [
            setMaxAmount,
            setToken,
            setTokenPair,
            setAmount,
            toggleTransactionType,
            setModeType,
          ],
        )}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

export const useSaveState = (): State => useContext(stateCtx);

export const useSaveDispatch = (): Dispatch => useContext(dispatchCtx);
