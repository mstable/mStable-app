/* eslint-disable @typescript-eslint/no-explicit-any */

import React, {
  FC,
  Reducer,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import useThrottleFn from 'react-use/lib/useThrottleFn';
import { BigNumber } from 'ethers/utils';
import { ethers } from 'ethers';

import { Instances, Interfaces, SendTxManifest } from '../../../types';
import { calculateGasMargin } from '../../../web3/hooks';

export enum GasPriceType {
  Standard,
  Fast,
  Instant,
  Custom,
}

interface State {
  formId: string;
  manifest?: SendTxManifest<never, never>;
  submitting: boolean;
  gasPrice: { value?: number; type: GasPriceType };
}

interface Dispatch {
  setManifest<
    TIface extends Interfaces,
    TFn extends keyof Instances[TIface]['functions']
  >(
    manifest: SendTxManifest<TIface, TFn> | null,
  ): void;
  submitStart(): void;
  submitEnd(): void;
  setGasPrice(gasPrice: { type?: GasPriceType; value?: number }): void;
}

enum Actions {
  SetManifest,
  SubmitEnd,
  SubmitStart,
  SetGasPrice,
  SetGasLimit,
}

type Action =
  | {
      type: Actions.SetManifest;
      payload: SendTxManifest<never, never> | null;
    }
  | {
      type: Actions.SubmitEnd;
    }
  | {
      type: Actions.SubmitStart;
    }
  | {
      type: Actions.SetGasPrice;
      payload: { type?: GasPriceType; value?: number };
    }
  | {
      type: Actions.SetGasLimit;
      payload?: BigNumber;
    };

const stateCtx = createContext<State>({} as any);

const dispatchCtx = createContext<Dispatch>({} as Dispatch);

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.SetManifest: {
      const manifest = action.payload || undefined;
      if (manifest) {
        return {
          ...state,
          manifest: {
            ...manifest,
            gasPrice: state.gasPrice.value,
          },
        };
      }
      return {
        ...state,
        manifest,
      };
    }
    case Actions.SubmitEnd:
      return { ...state, submitting: false };
    case Actions.SubmitStart:
      return { ...state, submitting: true };
    case Actions.SetGasPrice: {
      const gasPrice = {
        ...state.gasPrice,
        ...action.payload,
      };
      return {
        ...state,
        gasPrice,
        manifest: state.manifest
          ? {
              ...state.manifest,
              gasPrice: gasPrice.value,
            }
          : undefined,
      };
    }
    case Actions.SetGasLimit: {
      if (state.manifest) {
        return {
          ...state,
          manifest: {
            ...state.manifest,
            gasLimit: action.payload,
          },
        };
      }
      return state;
    }
    default:
      throw new Error('Unhandled action type');
  }
};

export const FormProvider: FC<{ formId: string }> = ({ children, formId }) => {
  const [state, dispatch] = useReducer(reducer, {
    submitting: false,
    formId,
    gasPrice: { type: GasPriceType.Standard },
  });

  const { args, fn, iface } = state.manifest || {};

  useThrottleFn<
    Promise<void>,
    [unknown[] | undefined, string | undefined, ethers.Contract | undefined]
  >(
    async (_args, _fn, _iface) => {
      let gasLimit;
      if (_args && _fn && _iface) {
        try {
          gasLimit = (await _iface.estimate[_fn](..._args)) as BigNumber;
          gasLimit = calculateGasMargin(gasLimit);
        } catch {
          // ignore
        }
      }
      dispatch({
        type: Actions.SetGasLimit,
        payload: gasLimit,
      });
    },
    5000,
    [args, fn, iface],
  );

  const setManifest = useCallback<Dispatch['setManifest']>(
    manifest => {
      dispatch({ type: Actions.SetManifest, payload: manifest as any });
    },
    [dispatch],
  );

  const submitStart = useCallback<Dispatch['submitStart']>(() => {
    dispatch({ type: Actions.SubmitStart });
  }, [dispatch]);

  const submitEnd = useCallback<Dispatch['submitEnd']>(() => {
    dispatch({ type: Actions.SubmitEnd });
  }, [dispatch]);

  const setGasPrice = useCallback<Dispatch['setGasPrice']>(
    payload => {
      dispatch({
        type: Actions.SetGasPrice,
        payload,
      });
    },
    [dispatch],
  );

  return (
    <dispatchCtx.Provider
      value={useMemo(
        () => ({
          setManifest,
          submitEnd,
          submitStart,
          setGasPrice,
        }),
        [setManifest, submitEnd, submitStart, setGasPrice],
      )}
    >
      <stateCtx.Provider value={state}>{children}</stateCtx.Provider>
    </dispatchCtx.Provider>
  );
};

export const useStateCtx = (): State => useContext(stateCtx) as State;

export const useDispatchCtx = (): Dispatch =>
  useContext(dispatchCtx) as Dispatch;

export const useManifest = (): State['manifest'] => useStateCtx().manifest;

export const useFormSubmitting = (): State['submitting'] =>
  useStateCtx().submitting;

export const useCurrentGasPrice = (): State['gasPrice'] =>
  useStateCtx().gasPrice;

export const useFormId = (): State['formId'] => useStateCtx().formId;

export const useSetFormManifest = (): Dispatch['setManifest'] =>
  useDispatchCtx().setManifest;

export const useSubmitStart = (): Dispatch['submitStart'] =>
  useDispatchCtx().submitStart;

export const useSubmitEnd = (): Dispatch['submitEnd'] =>
  useDispatchCtx().submitEnd;

export const useSetGasPrice = (): Dispatch['setGasPrice'] =>
  useDispatchCtx().setGasPrice;
