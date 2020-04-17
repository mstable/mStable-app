import React, {
  createContext,
  FC,
  Reducer,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react';
import { TransactionReceipt, TransactionResponse } from 'ethers/providers';
import { BigNumber } from 'ethers/utils';
import {
  ContractNames,
  HistoricTransaction,
  SendTxManifest,
  Transaction,
  TransactionStatus,
} from '../types';
import {
  useAddErrorNotification,
  useAddSuccessNotification,
} from './NotificationsProvider';
import { TransactionOverrides } from '../typechain/index.d';
import { getTransactionStatus } from '../web3/transactions';
import { MassetQuery } from '../graphql/generated';
import { useKnownAddress, useMUSD } from './KnownAddressProvider';
import { formatExactAmount } from '../web3/amounts';
import { getEtherscanLink } from '../web3/strings';

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

const getTxPurpose = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { args, fn, iface }: SendTxManifest<any, any>,
  {
    mUSD,
    mUSDSavingsAddress,
  }: { mUSD: MassetQuery['masset'] | null; mUSDSavingsAddress: string | null },
): string | null => {
  if (!mUSD) return null;

  const {
    basket: { bassets },
  } = mUSD;

  switch (fn) {
    case 'mint': {
      const [bassetAddress, bassetQ] = args as [string, BigNumber];

      const bAsset = bassets.find(b => b.token.address === bassetAddress);
      if (!bAsset) return null;

      return `Minting ${formatExactAmount(
        bassetQ,
        bAsset.token.decimals,
        mUSD.token.symbol,
      )} with ${formatExactAmount(
        bassetQ,
        bAsset.token.decimals,
        bAsset.token.symbol,
      )}`;
    }
    case 'redeem': {
      if (iface.address === mUSDSavingsAddress) {
        const [amount] = args as [BigNumber];
        return `Withdrawing ${formatExactAmount(
          amount,
          18,
          mUSD.token.symbol,
        )}`;
      }
      const [bassetAddress, bassetQ] = args as [string, BigNumber];

      const bAsset = bassets.find(b => b.token.address === bassetAddress);
      if (!bAsset) return null;

      return `Redeeming ${formatExactAmount(
        bassetQ,
        bAsset.token.decimals,
        bAsset.token.symbol,
      )} with ${formatExactAmount(
        bassetQ,
        bAsset.token.decimals,
        mUSD.token.symbol,
      )}`;
    }
    case 'approve': {
      if (args[0] === mUSDSavingsAddress) {
        return `Approving the mUSD Savings Contract to transfer ${mUSD.token.symbol}`;
      }

      const bAsset = bassets.find(b => b.token.address === iface.address);
      if (!bAsset) return null;

      return `Approving ${mUSD.token.symbol} to transfer ${bAsset.token.symbol}`;
    }
    case 'depositSavings': {
      const [amount] = args as [BigNumber];
      return `Depositing ${formatExactAmount(amount, 18)} ${mUSD.token.symbol}`;
    }
    default:
      return null;
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
  const addErrorNotification = useAddErrorNotification();
  const mUSD = useMUSD();
  const mUSDSavingsAddress = useKnownAddress(ContractNames.mUSDSavings);

  const addPending = useCallback<Dispatch['addPending']>(
    (manifest, pendingTx) => {
      const purpose = getTxPurpose(manifest, { mUSD, mUSDSavingsAddress });
      dispatch({
        type: Actions.AddPending,
        payload: {
          ...pendingTx,
          fn: manifest.fn,
          args: manifest.args,
          timestamp: Date.now(),
          purpose,
          status: null,
        },
      });

      addSuccessNotification(
        'Transaction pending',
        purpose,
        getEtherscanLinkForHash(pendingTx.hash),
      );
    },
    [dispatch, mUSD, addSuccessNotification, mUSDSavingsAddress],
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
    (hash, receipt) => {
      const status = getTransactionStatus(receipt);
      const link = getEtherscanLinkForHash(hash);

      const { purpose } = state.current[hash];

      if (status === TransactionStatus.Success) {
        addSuccessNotification('Transaction confirmed', purpose, link);
      } else if (status === TransactionStatus.Error) {
        addErrorNotification('Transaction failed', purpose, link);
      }

      dispatch({ type: Actions.Finalize, payload: { hash, receipt } });
    },
    [dispatch, addSuccessNotification, addErrorNotification, state],
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
    const addErrorNotification = useAddErrorNotification();

    return useCallback(
      manifest => {
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
            // MetaMask error messages are in a `data` property
            addErrorNotification(error.data?.message || error.message);
          });
      },
      [addPending, addErrorNotification],
    );
  };
