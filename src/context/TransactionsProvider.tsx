import React, {
  createContext,
  FC,
  Reducer,
  useReducer,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import { TransactionReceipt, TransactionResponse } from 'ethers/providers';
import { SendTxManifest, Transaction } from '../types';

type State = Record<string, Transaction>;

interface Dispatch {
  /**
   * Add a just-sent transaction to the state and track its progress.
   * @param hash
   * @param response
   * @param fn Contract function name
   * @param args Decoded arguments for the function
   */
  add: (
    hash: string,
    response: TransactionResponse,
    fn: string,
    args: unknown[],
  ) => void;
  /**
   * Check that a transaction is present at a given block number.
   * @param hash
   * @param blockNumber
   */
  check: (hash: string, blockNumber: number) => void;
  /**
   * Mark a transaction as finalized with a transaction receipt.
   * @param hash
   * @param receipt
   */
  finalize: (hash: string, receipt: TransactionReceipt) => void;
}

type Action =
  | {
      type: 'ADD';
      payload: {
        hash: string;
        response: TransactionResponse;
        fn: string;
        timestamp: number;
        args: unknown[];
      };
    }
  | { type: 'CHECK'; payload: { hash: string; blockNumber: number } }
  | {
      type: 'FINALIZE';
      payload: { hash: string; receipt: TransactionReceipt };
    };

const transactionsCtxReducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'ADD': {
      const { hash, response, fn, timestamp, args } = action.payload;
      return { ...state, [hash]: { response, fn, timestamp, args } };
    }
    case 'CHECK': {
      const { hash, blockNumber } = action.payload;
      return {
        ...state,
        [hash]: { ...state[hash], blockNumberChecked: blockNumber },
      } as State;
    }
    case 'FINALIZE': {
      const { hash, receipt } = action.payload;
      return { ...state, [hash]: { ...state[hash], receipt } };
    }
    default:
      throw new Error('Unhandled action');
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const context = createContext<[State, Dispatch]>(null as any);

/**
 * Provider for sending transactions and tracking their progress.
 */
export const TransactionsProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(transactionsCtxReducer, {});

  const add = useCallback(
    (
      hash: string,
      response: TransactionResponse,
      fn: string,
      args: unknown[],
    ) => {
      dispatch({
        type: 'ADD',
        payload: { hash, response, fn, timestamp: Date.now(), args },
      });
    },
    [dispatch],
  );

  const check = useCallback(
    (hash: string, blockNumber: number) => {
      dispatch({ type: 'CHECK', payload: { hash, blockNumber } });
    },
    [dispatch],
  );

  const finalize = useCallback(
    (hash: string, receipt: TransactionReceipt) => {
      dispatch({ type: 'FINALIZE', payload: { hash, receipt } });
    },
    [dispatch],
  );

  return (
    <context.Provider
      value={useMemo(() => [state, { add, check, finalize }], [
        state,
        add,
        check,
        finalize,
      ])}
    >
      {children}
    </context.Provider>
  );
};

export const useTransactionsContext = (): [State, Dispatch] =>
  useContext(context);

export const useAllTransactions = (): State => {
  const [state] = useTransactionsContext();
  return state;
};

export const useHasPendingTransactions = (): boolean => {
  const transactions = useAllTransactions();
  return Object.values(transactions).filter(tx => !tx.receipt).length > 0;
};

/**
 * Returns a callback that, given a manifest to send a transaction,
 * will create a promise to send the transaction, and add the response to state.
 */
export const useSendTransaction =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (): ((tx: SendTxManifest<any, any>) => void) => {
    const [, { add }] = useTransactionsContext();

    return useCallback(
      ({ iface, fn, args }) => {
        iface[fn](...args).then((response: TransactionResponse) => {
          const { hash } = response;
          if (!hash) throw new Error('Missing transaction hash');
          add(hash, response, fn as string, args);
        });
      },
      [add],
    );
  };
