/* eslint-disable no-await-in-loop */

import React, {
  FC,
  useCallback,
  useMemo,
  useReducer,
  Reducer,
  createContext,
  useEffect,
  useRef,
  useContext,
} from 'react';
import { BigNumber } from 'ethers/utils';

import RenJS from '@renproject/ren';
import { Bitcoin, Ethereum } from '@renproject/chains';
import { retryNTimes } from '@renproject/utils';
import {
  DepositStatus,
  LockAndMint,
  LockAndMintDeposit,
} from '@renproject/ren/build/main/lockAndMint';
import {
  getRenNetworkDetails,
  LockAndMintParams,
  RenNetwork,
  ContractCall,
} from '@renproject/interfaces';

import { BigDecimal } from '../web3/BigDecimal';
import { FetchState } from '../hooks/useFetchState';
import { RenTransactionManifest } from '../web3/TransactionManifest';

import { useProposeRen } from './TransactionsProvider';
import { useWalletAddress, useWeb3Provider } from './OnboardProvider';

interface RenFees {
  lock?: BigDecimal;
  release?: BigDecimal;
  mintBps: number;
  burnBps: number;
}

interface DepositDetails {
  amount: string;
  transaction: {
    vOut: number;
    confirmations: number;
    amount: number;
    txHash: string;
  };
}

interface RenDeposit {
  id: string;
  createdAt: number;
  depositStatus?: DepositStatus;
  btcConfirmations?: number;
  btcTarget?: number;
}

interface StoredRenDeposit extends RenDeposit {
  contractCall: ContractCall;
  depositDetails: DepositDetails;
  gatewayAddress: string;
}

interface State {
  storage: { [id: string]: StoredRenDeposit };
  lockAndMint: FetchState<LockAndMint>;
  fees: FetchState<RenFees>;
  current?: RenDeposit;
}

interface Dispatch {
  restore(deposit: StoredRenDeposit): void;
  remove(id: string): void;
  start(id: string, params: LockAndMintParams): void;
}

enum Actions {
  DepositError,
  DepositSuccess,
  LockAndMintError,
  LockAndMintStart,
  LockAndMintSuccess,
  FeesError,
  FeesFetching,
  FeesSuccess,
  RehydrateDeposits,
  RemoveDeposit,
  RestoreDeposit,
  SetBtcConfirmations,
  SetBtcTarget,
  SetRenHash,
  SetRenStatus,
}

type Action =
  | { type: Actions.DepositError; payload: string }
  | { type: Actions.DepositSuccess }
  | { type: Actions.LockAndMintError; payload: Error }
  | {
      type: Actions.LockAndMintStart;
      payload: string;
    }
  | { type: Actions.LockAndMintSuccess; payload: LockAndMint }
  | { type: Actions.FeesError; payload: Error }
  | { type: Actions.FeesFetching }
  | { type: Actions.FeesSuccess; payload: RenFees }
  | {
      type: Actions.RehydrateDeposits;
      payload: State['storage'];
    }
  | { type: Actions.RemoveDeposit; payload: string }
  | { type: Actions.RestoreDeposit; payload: string }
  | { type: Actions.SetBtcConfirmations; payload: number }
  | { type: Actions.SetBtcTarget; payload: number }
  | { type: Actions.SetRenHash; payload: string }
  | { type: Actions.SetRenStatus; payload: string };

// TODO use network from env
const renJS = new RenJS(RenNetwork.Testnet, {});
const networkDetails = getRenNetworkDetails(RenNetwork.Testnet);

const storageKey = 'renBTC.depositStorage';

const getDepositStorage = (): State['storage'] => {
  return JSON.parse(localStorage.getItem(storageKey) ?? '{}');
};

const saveToDepositStorage = (
  current: RenDeposit,
  deposit: LockAndMintDeposit,
  gatewayAddress: string,
): void => {
  const storage = getDepositStorage();

  const renDeposit: StoredRenDeposit = {
    ...current,
    contractCall: deposit.params.contractCalls?.[0] as ContractCall,
    depositDetails: deposit.depositDetails,
    depositStatus: deposit.status,
    gatewayAddress,
  };

  const newStorage: State['storage'] = {
    ...storage,
    [current.id]: renDeposit,
  };
  localStorage.setItem(storageKey, JSON.stringify(newStorage));
};

const removeFromLocalStorage = (id: string): void => {
  const { [id]: _, ...storage } = getDepositStorage();
  localStorage.setItem(storageKey, JSON.stringify(storage));
};

const dispatchCtx = createContext<Dispatch>(null as never);
const stateCtx = createContext<State>(null as never);

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.RehydrateDeposits: {
      const storage = action.payload;
      return {
        ...state,
        storage: Object.keys(storage).reduce(
          (prev, id) => ({ ...prev, [id]: { ...storage[id], ...prev[id] } }),
          state.storage,
        ),
      };
    }

    case Actions.RemoveDeposit: {
      const { [action.payload]: _, ...storage } = state.storage;
      return { ...state, storage };
    }

    case Actions.RestoreDeposit: {
      const id = action.payload;
      const { [id]: storedDeposit } = state.storage;

      if (storedDeposit) {
        // TODO
        // return { ...state, current: storedDeposit };
      }
      return state;
    }

    case Actions.FeesError: {
      return { ...state, fees: { error: action.payload.toString() } };
    }

    case Actions.FeesSuccess: {
      return { ...state, fees: { value: action.payload } };
    }

    case Actions.FeesFetching: {
      return { ...state, fees: { fetching: true } };
    }

    case Actions.SetBtcTarget: {
      if (!state.current) return state;

      return {
        ...state,
        current: { ...state.current, btcTarget: action.payload },
      };
    }

    case Actions.SetBtcConfirmations: {
      if (!state.current) return state;

      return {
        ...state,
        current: { ...state.current, btcConfirmations: action.payload },
      };
    }

    case Actions.LockAndMintError: {
      return { ...state, lockAndMint: { error: action.payload.toString() } };
    }

    case Actions.LockAndMintSuccess: {
      return { ...state, lockAndMint: { value: action.payload } };
    }

    case Actions.LockAndMintStart: {
      const id = action.payload;
      return {
        ...state,
        current: { id, createdAt: Date.now() },
        lockAndMint: { fetching: true },
      };
    }

    // TODO
    case Actions.DepositSuccess:
    case Actions.DepositError:
    case Actions.SetRenHash:
    case Actions.SetRenStatus:
      return state;

    default:
      return state;
  }
};

export const useRenDispatch = (): Dispatch => useContext(dispatchCtx);
export const useRenState = (): State => useContext(stateCtx);

export const RenProvider: FC = ({ children }) => {
  const isDepositing = useRef(false);
  const proposeRen = useProposeRen();

  const provider = useWeb3Provider();

  const walletAddress = useWalletAddress();

  const [state, dispatch] = useReducer(reducer, {
    storage: getDepositStorage(),
    lockAndMint: {},
    fees: {},
  });

  const start = useCallback<Dispatch['start']>((id, params) => {
    dispatch({ type: Actions.LockAndMintStart, payload: id });
    renJS
      .lockAndMint(params)
      .then(lockAndMint => {
        dispatch({ type: Actions.LockAndMintSuccess, payload: lockAndMint });
      })
      .catch(error => {
        dispatch({ type: Actions.LockAndMintError, payload: error });
      });
  }, []);

  const restore = useCallback<Dispatch['restore']>(
    deposit => {
      // dispatch({ type: Actions.RestoreDeposit, payload: deposit });
      const { id, contractCall } = deposit;

      if (walletAddress !== contractCall.sendTo || !provider) {
        // TODO error
        return;
      }

      const params: LockAndMintParams = {
        asset: 'BTC',
        from: Bitcoin(),
        to: Ethereum(provider, networkDetails).Contract(contractCall),
      };
      start(id, params);
    },
    [start, walletAddress, provider],
  );

  const remove = useCallback<Dispatch['remove']>(id => {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(
      'Are you sure you want to remove this deposit from browser storage? If funds have been sent but the mint is not yet complete, funds can be lost',
    );
    if (confirmed) {
      dispatch({ type: Actions.RemoveDeposit, payload: id });
      removeFromLocalStorage(id);
    }
  }, []);

  // Set fees (once)
  useEffect(() => {
    if (!state.fees.value && !state.fees.fetching && provider) {
      renJS
        .getFees({
          asset: 'BTC',
          from: Bitcoin(),
          to: Ethereum(provider, networkDetails),
        })
        .then(({ lock, mint: mintBps, burn: burnBps, release }) => {
          const value = {
            lock: lock ? new BigDecimal(lock?.toString(), 8) : undefined,
            release: release
              ? new BigDecimal(release?.toString(), 8)
              : undefined,
            mintBps,
            burnBps,
          };
          dispatch({ type: Actions.FeesSuccess, payload: value });
        })
        .catch(error => {
          dispatch({ type: Actions.FeesError, payload: error });
        });
    }
  }, [state.fees, provider]);

  const { lockAndMint, current } = state;
  useEffect(() => {
    if (isDepositing.current || !current || !lockAndMint.value) {
      return;
    }

    const promise = (async () => {
      if (isDepositing.current || !current || !lockAndMint.value) {
        return;
      }

      isDepositing.current = true;

      const retries = -1;
      const timeout = 10e3;

      lockAndMint.value.on('deposit', async (deposit: LockAndMintDeposit) => {
        saveToDepositStorage(
          current,
          deposit,
          (lockAndMint.value as LockAndMint).gatewayAddress,
        );

        while (deposit.status !== DepositStatus.Submitted) {
          switch (deposit.status) {
            case DepositStatus.Detected: {
              await retryNTimes(
                async () => {
                  await deposit
                    .confirmed()
                    .on('target', target => {
                      dispatch({ type: Actions.SetBtcTarget, payload: target });
                    })
                    .on('confirmation', confs => {
                      dispatch({
                        type: Actions.SetBtcConfirmations,
                        payload: confs,
                      });
                    });
                },
                retries,
                timeout,
              );
              break;
            }
            case DepositStatus.Confirmed: {
              await retryNTimes(
                () =>
                  deposit
                    .signed()
                    .on('txHash', _renHash => {
                      dispatch({ type: Actions.SetRenHash, payload: _renHash });
                    })
                    .on('status', _renStatus => {
                      dispatch({
                        type: Actions.SetRenStatus,
                        payload: _renStatus,
                      });
                    }),
                retries,
                timeout,
              );
              break;
            }
            case DepositStatus.Signed: {
              proposeRen(
                new RenTransactionManifest(
                  'id',
                  { past: 'Minted', present: 'Minting' },
                  deposit.mint,
                  async () => {
                    // TODO perform estimation; need to use params and supply darknode parameters
                    return new BigNumber('10000000');
                  },
                ),
              );
              break;
            }
            case DepositStatus.Reverted: {
              console.error(deposit.revertReason);
              break;
            }
            default:
              break;
          }
        }
      });
    })();

    promise
      .then(() => {
        dispatch({ type: Actions.DepositSuccess });
        isDepositing.current = false;
      })
      .catch(error => {
        dispatch({ type: Actions.DepositError, payload: error.toString() });
        isDepositing.current = false;
      });
  }, [current, lockAndMint.value, proposeRen]);

  return (
    <dispatchCtx.Provider
      value={useMemo(() => ({ start, restore, remove }), [
        start,
        restore,
        remove,
      ])}
    >
      <stateCtx.Provider value={state}>{children}</stateCtx.Provider>
    </dispatchCtx.Provider>
  );
};
