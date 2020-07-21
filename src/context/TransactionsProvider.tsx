import React, {
  createContext,
  FC,
  Reducer,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { BigNumber } from 'ethers';
import type { TransactionRequest, TransactionReceipt, TransactionResponse } from '@ethersproject/providers';

import {
  HistoricTransaction,
  SendTxManifest,
  Transaction,
  Purpose,
  TransactionStatus,
} from '../types';
import {
  useAddErrorNotification,
  useAddInfoNotification,
  useAddSuccessNotification,
} from './NotificationsProvider';
import { getTransactionStatus } from '../web3/transactions';
import { DataState } from './DataProvider/types';
import { useDataState } from './DataProvider/DataProvider';
import { getEtherscanLink } from '../web3/strings';
import { BigDecimal } from '../web3/BigDecimal';

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
   * Add a single pending transaction
   */
  addPending(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    manifest: SendTxManifest<any, any>,
    pendingTx: { hash: string; response: TransactionResponse },
  ): void;

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
   * @param purpose
   */
  finalize(hash: string, receipt: TransactionReceipt, purpose: Purpose): void;

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

const getTxPurpose = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { args, fn, iface }: SendTxManifest<any, any>,
  dataState?: DataState,
): Purpose => {
  if (!dataState)
    return {
      present: null,
      past: null,
    };

  const { bAssets, mAsset } = dataState;

  switch (fn) {
    case 'mint': {
      const [bAssetAddress, bAssetQ] = args as [string, BigNumber];

      const bAsset = bAssets[bAssetAddress];
      if (!bAsset)
        return {
          present: null,
          past: null,
        };

      const amount = new BigDecimal(bAssetQ, bAsset.decimals);

      const body = `${amount.format()} ${mAsset.symbol} with ${bAsset.symbol}`;
      return {
        present: `Minting ${body}`,
        past: `Minted ${body}`,
      };
    }
    case 'mintMulti': {
      return {
        present: `Minting mUSD`,
        past: `Minted mUSD`,
      };
    }
    case 'swap': {
      const [input, output, inputQuantity] = args as [
        string,
        string,
        BigNumber,
      ];

      const inputBasset = bAssets[input];
      const outputBasset = bAssets[output];

      if (!inputBasset || !outputBasset)
        return {
          present: null,
          past: null,
        };

      const amount = new BigDecimal(inputQuantity, inputBasset.decimals);

      const body = `${amount.format()} ${inputBasset.symbol} for ${
        outputBasset.symbol
      }`;
      return {
        present: `Swapping ${body}`,
        past: `Swapped ${body}`,
      };
    }
    case 'redeem': {
      if (iface.address === dataState.savingsContract.address) {
        const body = `${mAsset.symbol} savings`;
        return {
          present: `Withdrawing ${body}`,
          past: `Withdrew ${body}`,
        };
      }
      const [bAssetAddress, bAssetQ] = args as [string, BigNumber];

      const bAsset = bAssets[bAssetAddress];
      if (!bAsset)
        return {
          present: null,
          past: null,
        };

      const amount = new BigDecimal(bAssetQ, bAsset.decimals);

      const body = `${amount.format()} ${mAsset.symbol} into ${bAsset.symbol}`;
      return {
        present: `Redeeming ${body}`,
        past: `Redeemed ${body}`,
      };
    }
    case 'redeemMasset': {
      const [mAssetQ] = args as [BigNumber, string];

      const amount = new BigDecimal(mAssetQ, mAsset.decimals);
      const body = `${amount.format()} ${mAsset.symbol}`;
      return {
        present: `Redeeming ${body}`,
        past: `Redeemed ${body}`,
      };
    }
    case 'approve': {
      if (args[0] === dataState.savingsContract.address) {
        const body = `the mUSD SAVE Contract to transfer ${mAsset.symbol}`;
        return {
          present: `Approving ${body}`,
          past: `Approved ${body}`,
        };
      }

      const bAsset = bAssets[iface.address];
      if (!bAsset)
        return {
          past: null,
          present: null,
        };

      const body = `${mAsset.symbol} to transfer ${bAsset.symbol}`;
      return {
        present: `Approving ${body}`,
        past: `Approved ${body}`,
      };
    }
    case 'depositSavings': {
      const [quantity] = args as [BigNumber];
      const amount = new BigDecimal(quantity, mAsset.decimals);
      const body = `${amount.format()} ${mAsset.symbol}`;
      return {
        present: `Depositing ${body}`,
        past: `Deposited ${body}`,
      };
    }
    default:
      return {
        past: null,
        present: null,
      };
  }
};

const getEtherscanLinkForHash = (
  hash: string,
): { href: string; title: string } => ({
  title: 'View on Etherscan',
  href: getEtherscanLink(hash, 'transaction'),
});

/**
 * Provider for sending transactions and tracking their progress.
 */
export const TransactionsProvider: FC<{}> = ({ children }) => {
  const [state, dispatch] = useReducer(transactionsCtxReducer, initialState);
  const addSuccessNotification = useAddSuccessNotification();
  const addInfoNotification = useAddInfoNotification();
  const addErrorNotification = useAddErrorNotification();
  const dataState = useDataState();

  const addPending = useCallback<Dispatch['addPending']>(
    (manifest, pendingTx) => {
      const purpose = getTxPurpose(manifest, dataState);
      dispatch({
        type: Actions.AddPending,
        payload: {
          ...pendingTx,
          ...(manifest.formId ? { formId: manifest.formId } : null),
          fn: manifest.fn,
          args: manifest.args,
          timestamp: Date.now(),
          purpose,
          status: null,
        },
      });

      addInfoNotification(
        'Transaction pending',
        purpose.present,
        getEtherscanLinkForHash(pendingTx.hash),
      );
    },
    [dispatch, dataState, addInfoNotification],
  );

  const addHistoric = useCallback<Dispatch['addHistoric']>(
    historicTransactions => {
      dispatch({
        type: Actions.AddHistoric,
        payload: historicTransactions,
      });
    },
    [dispatch],
  );

  const check = useCallback<Dispatch['check']>(
    (hash, blockNumber) => {
      dispatch({ type: Actions.Check, payload: { hash, blockNumber } });
    },
    [dispatch],
  );

  const finalize = useCallback<Dispatch['finalize']>(
    (hash, receipt, purpose) => {
      const status = getTransactionStatus(receipt);
      const link = getEtherscanLinkForHash(hash);

      if (status === TransactionStatus.Success) {
        addSuccessNotification('Transaction confirmed', purpose.past, link);
      } else if (status === TransactionStatus.Error) {
        addErrorNotification('Transaction failed', purpose.present, link);
      }

      dispatch({ type: Actions.Finalize, payload: { hash, receipt } });
    },
    [dispatch, addSuccessNotification, addErrorNotification],
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

export const useOrderedCurrentTransactions = (
  formId?: string,
): Transaction[] => {
  const { current } = useTransactionsState();
  return useMemo(() => {
    const transactions = Object.values(current).sort(
      (a, b) => b.timestamp - a.timestamp,
    );
    return formId
      ? transactions.filter(t => t.formId === formId)
      : transactions;
  }, [current, formId]);
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
  return Object.values(current).some(tx => tx.status !== 1);
};

export const useHasPendingApproval = (
  address: string,
  spender: string,
): boolean => {
  const { current } = useTransactionsState();
  return Object.values(current).some(
    tx =>
      tx.status !== 1 &&
      tx.fn === 'approve' &&
      tx.args[0] === spender &&
      tx.response.to === address,
  );
};

const overrideProps = ['nonce', 'gasLimit', 'gasPrice', 'value', 'chainId'];

export const calculateGasMargin = (value: BigNumber): BigNumber => {
  const GAS_MARGIN = BigNumber.from(1000);
  const offset = value.mul(GAS_MARGIN).div(BigNumber.from(10000));
  return value.add(offset);
};

const isTransactionRequest = (arg: unknown): boolean =>
  arg != null &&
  typeof arg === 'object' &&
  overrideProps.some(prop => Object.hasOwnProperty.call(arg, prop));

const addGasSettings = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  manifest: SendTxManifest<any, any>,
): Promise<typeof manifest> => {
  const { iface, fn, args } = manifest;
  const last = args[args.length - 1];

  if (
    isTransactionRequest(last) &&
    !(last as TransactionRequest).gasLimit
  ) {
    // Don't alter the manifest if the gas limit is already set
    return manifest;
  }

  // Set the gas limit (with the calculated gas margin)
  const gasLimit = await iface.estimateGas[fn](...args);

  // Also set the gas price, because some providers don't
  const gasPrice = await iface.provider.getGasPrice();

  return {
    ...manifest,
    args: [...args, { gasLimit: calculateGasMargin(gasLimit), gasPrice }],
  };
};

const sendTransaction = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  manifest: SendTxManifest<any, any>,
): Promise<TransactionResponse> => {
  const { iface, fn, args } = await addGasSettings(manifest);
  return iface[fn](...args);
};

const parseTxError = (
  error: Error & { data?: { message: string } },
): string => {
  // MetaMask error messages are in a `data` property
  const txMessage = error.data?.message || error.message;

  return txMessage.includes('always failing transaction')
    ? 'Transaction failed - if this problem persists, contact mStable team.'
    : txMessage;
};

/**
 * Returns a callback that, given a manifest to send a transaction,
 * will create a promise to send the transaction, and add the response to state.
 */
export const useSendTransaction =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (): ((tx: SendTxManifest<any, any>, doneCallback?: () => void) => void) => {
    const [, { addPending }] = useTransactionsContext();
    const addErrorNotification = useAddErrorNotification();

    return useCallback(
      (manifest, doneCallback) => {
        sendTransaction(manifest)
          .then(response => {
            const { hash } = response;
            if (!hash) {
              addErrorNotification('Transaction failed to send: missing hash');
              return;
            }
            addPending(manifest, {
              hash,
              response: { ...response, to: response.to?.toLowerCase() },
            });
          })
          .catch(error => {
            const message = parseTxError(error);
            addErrorNotification(message);
          })
          .finally(() => {
            doneCallback?.();
          });
      },
      [addPending, addErrorNotification],
    );
  };
