import { useCallback, useMemo, useReducer } from 'react';
import { Actions, Dispatch, State } from './types';
import { reducer, initialState } from './reducer';

export const useSwapState = (): [State, Dispatch] => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const updateMassetData = useCallback<Dispatch['updateMassetData']>(
    mAssetData => {
      dispatch({
        type: Actions.UpdateMassetData,
        payload: mAssetData,
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
    () => [state, { updateMassetData, setQuantity, setToken }],
    [state, updateMassetData, setQuantity, setToken],
  );
};
