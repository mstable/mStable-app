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
import { BigNumber } from 'ethers/utils';
import {
  SendTxManifest,
  Transaction,
  HistoricTransaction,
} from '../types';
import { useAddSuccessNotification } from './NotificationsProvider';
import { TransactionOverrides } from '../typechain/index.d';

enum Actions {
  AddPending,
  AddHistoric,
  Check,
  Finalize,
  Reset,
}

type TransactionHash = string;

interface State {
  current: Record<TransactionHash, Transaction>;
  historic: Record<TransactionHash, HistoricTransaction>;
}

interface Dispatch {
  /**
   * Add a single current transaction
   */
  addPending(currentTx: Transaction): void;

  /**
   * Add many historic transactions
   *
   * @param historicTxs Map of historic transactions indexed by hash
   */
  addHistoric(historicTxs: Record<TransactionHash, HistoricTransaction>): void;

  /**
   * Check that a current transaction is present at a given block number.
   * @param hash
   * @param blockNumber
   */
  check(hash: string, blockNumber: number): void;

  /**
   * Mark a current transaction as finalized with a transaction receipt.
   * @param hash
   * @param receipt
   */
  finalize(hash: string, receipt: TransactionReceipt): void;

  /**
   * Reset the state completely.
   */
  reset(): void;
}

type Action =
  | {
      type: Actions.AddPending;
      payload: Transaction;
    }
  | {
      type: Actions.AddHistoric;
      payload: Record<TransactionHash, HistoricTransaction>;
    }
  | {
      type: Actions.Check;
      payload: { hash: string; blockNumber: number };
    }
  | {
      type: Actions.Finalize;
      payload: {
        hash: string;
        receipt: TransactionReceipt;
      };
    }
  | { type: Actions.Reset };

const transactionsCtxReducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.AddPending: {
      return {
        ...state,
        current: {
          ...state.current,
          [action.payload.hash]: action.payload,
        },
      };
    }
    case Actions.AddHistoric: {
      return {
        ...state,
        historic: {
          ...state.historic,
          ...action.payload,
        },
      };
    }
    case Actions.Check: {
      const { hash, blockNumber } = action.payload;
      return {
        ...state,
        current: {
          ...state.current,
          [hash]: {
            ...state.current[hash],
            blockNumberChecked: blockNumber,
          },
        },
      } as State;
    }
    case Actions.Finalize: {
      const {
        hash,
        receipt: { status, blockNumber },
      } = action.payload;
      return {
        ...state,
        current: {
          ...state.current,
          [hash]: {
            ...state.current[hash],
            status: status as number,
            blockNumberChecked: blockNumber as number,
          },
        },
      };
    }
    case Actions.Reset:
      return {
        historic: {},
        current: {},
      };
    default:
      throw new Error('Unhandled action');
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const context = createContext<[State, Dispatch]>(null as any);

const initialState: State = Object.freeze({ historic: {}, current: {} });

/**
 * Provider for sending transactions and tracking their progress.
 */
export const TransactionsProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(transactionsCtxReducer, initialState);

  const addPending = useCallback(
    (currentTx: Transaction) => {
      dispatch({
        type: Actions.AddPending,
        payload: currentTx,
      });
    },
    [dispatch],
  );

  const addHistoric = useCallback(
    (historicTransactions: Record<TransactionHash, HistoricTransaction>) => {
      dispatch({
        type: Actions.AddHistoric,
        payload: historicTransactions,
      });
    },
    [dispatch],
  );

  const check = useCallback(
    (hash: string, blockNumber: number) => {
      dispatch({ type: Actions.Check, payload: { hash, blockNumber } });
    },
    [dispatch],
  );

  const finalize = useCallback(
    (hash: string, receipt: TransactionReceipt) => {
      dispatch({ type: Actions.Finalize, payload: { hash, receipt } });
    },
    [dispatch],
  );

  const reset = useCallback(() => {
    dispatch({ type: Actions.Reset });
  }, [dispatch]);

  return (
    <context.Provider
      value={useMemo(
        () => [state, { addPending, addHistoric, check, finalize, reset }],
        [state, addPending, addHistoric, check, finalize, reset],
      )}
    >
      {children}
    </context.Provider>
  );
};

export const useTransactionsContext = (): [State, Dispatch] =>
  useContext(context);

export const useTransactionsState = (): State => useTransactionsContext()[0];

export const useTransactionsDispatch = (): Dispatch =>
  useTransactionsContext()[1];

export const useOrderedCurrentTransactions = (): Transaction[] => {
  const { current } = useTransactionsState();
  return useMemo(
    () => Object.values(current).sort((a, b) => b.timestamp - a.timestamp),
    [current],
  );
};

export const useOrderedHistoricTransactions = (): HistoricTransaction[] => {
  const { historic } = useTransactionsState();
  return useMemo(
    () => Object.values(historic).sort((a, b) => b.blockNumber - a.blockNumber),
    [historic],
  );
};

export const useHasPendingTransactions = (): boolean => {
  const { current } = useTransactionsState();
  return !!Object.values(current).find(tx => tx.status !== 1);
};

const overrideProps = ['nonce', 'gasLimit', 'gasPrice', 'value', 'chainId'];

export const calculateGasMargin = (value: BigNumber): BigNumber => {
  const GAS_MARGIN = new BigNumber(1000);
  const offset = value.mul(GAS_MARGIN).div(new BigNumber(10000));
  return value.add(offset);
};

const isTransactionOverrides = (arg: unknown): boolean =>
  arg != null &&
  typeof arg === 'object' &&
  overrideProps.some(prop => Object.hasOwnProperty.call(arg, prop));

const addGasLimit = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  manifest: SendTxManifest<any, any>,
): Promise<typeof manifest> => {
  const { iface, fn, args } = manifest;
  const last = args[args.length - 1];

  if (
    isTransactionOverrides(last) &&
    !(last as TransactionOverrides).gasLimit
  ) {
    // Don't alter the manifest if the gas limit is already set
    return manifest;
  }

  // Set the gas limit (with the calculated gas margin)
  const gasLimit = await iface.estimate[fn](...args);
  return {
    ...manifest,
    args: [...args, { gasLimit: calculateGasMargin(gasLimit) }],
  };
};

const sendTransaction = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  manifest: SendTxManifest<any, any>,
): Promise<TransactionResponse> => {
  const { iface, fn, args } = await addGasLimit(manifest);
  return iface[fn](...args);
};

/**
 * Returns a callback that, given a manifest to send a transaction,
 * will create a promise to send the transaction, and add the response to state.
 */
export const useSendTransaction =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (): ((tx: SendTxManifest<any, any>) => void) => {
    const [, { addPending }] = useTransactionsContext();
    const addSuccess = useAddSuccessNotification();

    return useCallback(
      manifest => {
        sendTransaction(manifest).then(response => {
          const { hash } = response;
          if (!hash) throw new Error('Missing transaction hash');
          addPending({
            hash,
            response,
            fn: manifest.fn,
            args: manifest.args,
            timestamp: Date.now(),
            status: null,
          });
          addSuccess('Transaction sent');
        });
      },
      [addPending, addSuccess],
    );
  };
