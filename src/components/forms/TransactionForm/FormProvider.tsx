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
import { SendTxManifest } from '../../../types';
import { calculateGasMargin } from '../../../web3/hooks';

export enum GasPriceType {
  Standard,
  Fast,
  Instant,
  Custom,
}

interface State<TState> {
  formId: string;
  manifest?: SendTxManifest<never, never>;
  submitting: boolean;
  gasPriceValue?: number;
  gasPriceType?: GasPriceType;
}

interface Dispatch<TState> {
  setManifest<TIface extends any, TFn extends any>(
    manifest: SendTxManifest<TIface, TFn> | null,
  ): void;
  submitStart(): void;
  submitEnd(): void;
  setGasPrice(gasPrice: number): void;
  setGasPriceType(gasPriceType: GasPriceType): void;
}

enum Actions {
  SetManifest,
  SubmitEnd,
  SubmitStart,
  SetGasPrice,
  SetGasPriceType,
  SetGasLimit,
}

type Action<TState> =
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
      payload: number;
    }
  | {
      type: Actions.SetGasPriceType;
      payload: GasPriceType;
    }
  | {
      type: Actions.SetGasLimit;
      payload?: BigNumber;
    };

const stateCtx = createContext<State<any>>({} as any);

const dispatchCtx = createContext<Dispatch<never>>({} as Dispatch<never>);

const reducer: Reducer<State<any>, Action<any>> = (state, action) => {
  switch (action.type) {
    case Actions.SetManifest: {
      const manifest = action.payload || undefined;
      if (manifest) {
        return {
          ...state,
          manifest: {
            ...manifest,
            gasPrice: state.gasPriceValue,
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
      if (state.manifest) {
        return {
          ...state,
          gasPriceValue: action.payload,
          manifest: {
            ...state.manifest,
            gasPrice: action.payload,
          },
        };
      }
      return {
        ...state,
        gasPriceValue: action.payload,
      };
    }
    case Actions.SetGasPriceType:
      return {
        ...state,
        gasPriceType: action.payload,
      };
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

  const setManifest = useCallback<Dispatch<never>['setManifest']>(
    manifest => {
      dispatch({ type: Actions.SetManifest, payload: manifest as any });
    },
    [dispatch],
  );

  const submitStart = useCallback<Dispatch<never>['submitStart']>(() => {
    dispatch({ type: Actions.SubmitStart });
  }, [dispatch]);

  const submitEnd = useCallback<Dispatch<never>['submitEnd']>(() => {
    dispatch({ type: Actions.SubmitEnd });
  }, [dispatch]);

  const setGasPrice = useCallback<Dispatch<never>['setGasPrice']>(
    gasPrice => {
      dispatch({
        type: Actions.SetGasPrice,
        payload: gasPrice,
      });
    },
    [dispatch],
  );

  const setGasPriceType = useCallback<Dispatch<never>['setGasPriceType']>(
    gasPriceType => {
      dispatch({
        type: Actions.SetGasPriceType,
        payload: gasPriceType,
      });
    },
    [dispatch],
  );

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(
          () => ({
            setManifest,
            submitEnd,
            submitStart,
            setGasPrice,
            setGasPriceType,
          }),
          [setManifest, submitEnd, submitStart, setGasPrice, setGasPriceType],
        )}
      >
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  );
};

const useStateCtx = <TState extends unknown>(): State<TState> =>
  useContext(stateCtx) as State<TState>;

const useDispatchCtx = <TState extends unknown>(): Dispatch<TState> =>
  useContext(dispatchCtx) as Dispatch<TState>;

export const useManifest = (): State<never>['manifest'] =>
  useStateCtx().manifest;

export const useFormSubmitting = (): State<never>['submitting'] =>
  useStateCtx().submitting;

export const useCurrentGasPrice = (): State<never>['gasPriceValue'] =>
  useStateCtx().gasPriceValue;

export const useCurrentGasPriceType = (): State<never>['gasPriceType'] =>
  useStateCtx().gasPriceType;

export const useFormId = (): State<never>['formId'] => useStateCtx().formId;

export const useSetFormManifest = (): Dispatch<never>['setManifest'] =>
  useDispatchCtx().setManifest;

export const useSubmitStart = (): Dispatch<never>['submitStart'] =>
  useDispatchCtx().submitStart;

export const useSubmitEnd = (): Dispatch<never>['submitEnd'] =>
  useDispatchCtx().submitEnd;

export const useSetGasPrice = (): Dispatch<never>['setGasPrice'] =>
  useDispatchCtx().setGasPrice;

export const useSetGasPriceType = (): Dispatch<never>['setGasPriceType'] =>
  useDispatchCtx().setGasPriceType;
