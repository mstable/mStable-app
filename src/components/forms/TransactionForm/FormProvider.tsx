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
import { SendTxManifest } from '../../../types';

interface State<TState> {
  formId: string;
  manifest?: SendTxManifest<never, never>;
  submitting: boolean;
}

interface Dispatch<TState> {
  setManifest<TIface extends any, TFn extends any>(
    manifest: SendTxManifest<TIface, TFn> | null,
  ): void;
  submitStart(): void;
  submitEnd(): void;
}

enum Actions {
  SetManifest,
  SubmitEnd,
  SubmitStart,
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
    };

const stateCtx = createContext<State<any>>({} as any);

const dispatchCtx = createContext<Dispatch<never>>({} as Dispatch<never>);

const reducer: Reducer<State<any>, Action<any>> = (state, action) => {
  switch (action.type) {
    case Actions.SetManifest: {
      const manifest = action.payload || undefined;
      return { ...state, manifest };
    }

    case Actions.SubmitEnd:
      return { ...state, submitting: false };

    case Actions.SubmitStart:
      return { ...state, submitting: true };

    default:
      throw new Error('Unhandled action type');
  }
};

export const FormProvider: FC<{ formId: string }> = ({ children, formId }) => {
  const [state, dispatch] = useReducer(reducer, { submitting: false, formId });

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

  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider
        value={useMemo(
          () => ({
            setManifest,
            submitEnd,
            submitStart,
          }),
          [setManifest, submitEnd, submitStart],
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

export const useFormId = (): State<never>['formId'] => useStateCtx().formId;

export const useSetFormManifest = (): Dispatch<never>['setManifest'] =>
  useDispatchCtx().setManifest;

export const useSubmitStart = (): Dispatch<never>['submitStart'] =>
  useDispatchCtx().submitStart;

export const useSubmitEnd = (): Dispatch<never>['submitEnd'] =>
  useDispatchCtx().submitEnd;
