import { useCallback, useMemo, useReducer } from 'react';
import { Actions, Dispatch, State } from './types';
import { reducer, initialState } from './reducer';

export const useSwapState = (): [State, Dispatch] => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const updateMassetData = useCallback<Dispatch['updateMassetData']>(
    (mAssetData) => {
      dispatch({
        type: Actions.UpdateMassetData,
        payload: mAssetData,
      });
    },
    [dispatch],
  );

  const invertDirection = useCallback<Dispatch['invertDirection']>(() => {
    dispatch({
      type: Actions.InvertDirection,
    });
  }, [dispatch]);

  const setError = useCallback<Dispatch['setError']>(
    (reason, field) => {
      dispatch({
        type: Actions.SetError,
        payload: reason === null ? null : { reason, field },
      });
    },
    [dispatch],
  );

  const setQuantity = useCallback<Dispatch['setQuantity']>(
    (field, formValue) => {
      dispatch({
        type: Actions.SetQuantity,
        payload: { formValue, field },
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

  return useMemo(
    () => [
      state,
      { updateMassetData, invertDirection, setError, setQuantity, setToken },
    ],
    [state, updateMassetData, invertDirection, setError, setQuantity, setToken],
  );
};
