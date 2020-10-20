import React, {
  FC,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useReducer,
  Reducer,
  useEffect,
  useRef,
} from 'react';
import {
  Connectors,
  ChainUnsupportedError,
  ConnectionRejectedError,
  ConnectorUnsupportedError,
  useWallet,
} from 'use-wallet';
import MetamaskOnboarding from '@metamask/onboarding';
import { useHistory } from 'react-router-dom';
import { configureScope } from '@sentry/react';

import { InjectedEthereum, Connector } from '../types';
import { CHAIN_ID, NETWORK_NAMES } from '../web3/constants';
import { CONNECTORS } from '../web3/connectors';
import {
  useAddInfoNotification,
  useAddErrorNotification,
} from './NotificationsProvider';
import { LocalStorage, Storage } from '../localStorage';

export enum AccountItems {
  Notifications,
  Wallet,
}

enum Actions {
  ResetWallet,
  ConnectWallet,
  ConnectWalletError,
  ConnectWalletSuccess,
  SetWalletSubType,
  SelectMasset,
  SupportedChainSelected,
  SetOnline,
  SetAccountItem,
  ToggleAccount,
}

enum WalletConnectionStatus {
  Disconnected,
  Connecting,
  Connected,
}

enum Reasons {
  RejectedActivation = 'Wallet activation rejected',
  UnsupportedChain = 'Unsupported network',
  UnsupportedConnector = 'Unsupported connector',
  Unknown = 'Unknown error',
}

export enum StatusWarnings {
  NotOnline,
  UnsupportedChain,
}

interface State {
  wallet: {
    connector?: {
      id: keyof Connectors;
      subType?: string;
    };
    status: WalletConnectionStatus;
    error: string | null;
    supportedChain: boolean;
  };
  accountItem: AccountItems | null;
  online: boolean;
  selectedMasset: string;
}

type Action =
  | { type: Actions.SelectMasset; payload: string }
  | { type: Actions.SetAccountItem; payload: AccountItems | null }
  | { type: Actions.ToggleAccount; payload: AccountItems }
  | { type: Actions.ResetWallet }
  | { type: Actions.SupportedChainSelected; payload: boolean }
  | {
      type: Actions.ConnectWallet;
      payload: { id: keyof Connectors; subType?: string };
    }
  | {
      type: Actions.SetWalletSubType;
      payload?: string;
    }
  | { type: Actions.ConnectWalletError; payload: string }
  | { type: Actions.ConnectWalletSuccess }
  | { type: Actions.SetOnline; payload: boolean };

interface Dispatch {
  closeAccount(): void;
  connectWallet(connector: keyof Connectors, subType?: string): void;
  openWalletRedirect(redirect: string): void;
  resetWallet(): void;
  selectMasset(massetName: string): void;
  toggleNotifications(): void;
  toggleWallet(): void;
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.SetAccountItem:
      return {
        ...state,
        accountItem: action.payload,
      };
    case Actions.ToggleAccount:
      return {
        ...state,
        accountItem:
          state.accountItem === action.payload ? null : action.payload,
      };
    case Actions.SupportedChainSelected:
      return {
        ...state,
        wallet: {
          ...state.wallet,
          supportedChain: action.payload,
          error: null,
        },
      };
    case Actions.SelectMasset:
      return { ...state, selectedMasset: action.payload };
    case Actions.ResetWallet:
      return {
        ...state,
        wallet: {
          ...state.wallet,
          connector: undefined,
          status: WalletConnectionStatus.Disconnected,
          error: null,
        },
      };
    case Actions.ConnectWallet:
      return {
        ...state,
        wallet: {
          ...state.wallet,
          status: WalletConnectionStatus.Connecting,
          connector: action.payload,
          error: null,
        },
      };
    case Actions.ConnectWalletError:
      return {
        ...state,
        wallet: {
          ...state.wallet,
          status: WalletConnectionStatus.Disconnected,
          error: action.payload,
        },
      };
    case Actions.ConnectWalletSuccess:
      return {
        ...state,
        wallet: {
          ...state.wallet,
          expanded: false,
          status: WalletConnectionStatus.Connected,
          error: null,
        },
      };
    case Actions.SetWalletSubType:
      return state.wallet.connector
        ? {
            ...state,
            wallet: {
              ...state.wallet,
              connector: {
                ...state.wallet.connector,
                subType: action.payload,
              },
            },
          }
        : state;
    case Actions.SetOnline:
      return { ...state, online: action.payload };
    default:
      return state;
  }
};

const initialState: State = {
  wallet: {
    status: WalletConnectionStatus.Disconnected,
    error: null,
    supportedChain: true,
  },
  accountItem: null,
  selectedMasset: 'mUSD',
  online: true,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const context = createContext<[State, Dispatch]>([initialState, {}] as any);

const identifyInjectedSubType = (
  injected: InjectedEthereum,
): string | undefined => {
  if (injected.isMetaMask) return 'metamask';
  if (injected.isBrave) return 'brave';
  if (injected.isTrust) return 'trust';
  if (injected.isDapper) return 'dapper';
  if (injected.isMeetOne) return 'meetOne';
  return undefined;
};

/**
 * Provider for global App state and interactions.
 */
export const AppProvider: FC<{}> = ({ children }) => {
  const attemptedReconnect = useRef(false);
  const history = useHistory();
  const { connect, reset, status, account, connector, connectors } = useWallet<
    InjectedEthereum
  >();
  const [state, dispatch] = useReducer(reducer, initialState);
  const addInfoNotification = useAddInfoNotification();
  const addErrorNotification = useAddErrorNotification();

  const closeAccount = useCallback<Dispatch['closeAccount']>(() => {
    dispatch({ type: Actions.SetAccountItem, payload: null });
  }, [dispatch]);

  const toggleNotifications = useCallback<
    Dispatch['toggleNotifications']
  >(() => {
    dispatch({
      type: Actions.ToggleAccount,
      payload: AccountItems.Notifications,
    });
  }, [dispatch]);

  const toggleWallet = useCallback<Dispatch['toggleWallet']>(() => {
    dispatch({ type: Actions.ToggleAccount, payload: AccountItems.Wallet });
  }, [dispatch]);

  const openWalletRedirect = useCallback<Dispatch['openWalletRedirect']>(
    path => {
      history.push(path);
      dispatch({ type: Actions.SetAccountItem, payload: AccountItems.Wallet });
    },
    [history],
  );

  const selectMasset = useCallback<Dispatch['selectMasset']>(
    massetName => {
      dispatch({ type: Actions.SelectMasset, payload: massetName });
    },
    [dispatch],
  );

  const resetWallet = useCallback<Dispatch['resetWallet']>(() => {
    reset();
    dispatch({ type: Actions.ResetWallet });
    LocalStorage.removeItem<'connectorId'>('connectorId');
    LocalStorage.removeItem<'connector'>('connector');
  }, [dispatch, reset]);

  const connectWallet = useCallback<Dispatch['connectWallet']>(
    (id, subType) => {
      dispatch({ type: Actions.ConnectWallet, payload: { id, subType } });

      if (id === 'injected' && subType === 'metamask') {
        const onboarding = new MetamaskOnboarding();
        if (onboarding.state === 'NOT_INSTALLED') {
          onboarding.startOnboarding();
          return;
        }
      }

      connect(id)
        .then(() => {
          const _connector = CONNECTORS.find(
            c => c.id === id && c.subType === subType,
          );

          addInfoNotification(
            'Connected',
            _connector ? `Connected with ${_connector.label}` : null,
          );

          dispatch({ type: Actions.ConnectWalletSuccess });

          if (_connector) {
            LocalStorage.set<Storage, 'connector'>('connector', {
              id,
              subType,
            });
          }
        })
        .catch(error => {
          let reason: string;

          if (error instanceof ConnectionRejectedError) {
            reason = Reasons.RejectedActivation;
          } else if (error instanceof ChainUnsupportedError) {
            reason = `${Reasons.UnsupportedChain}; please connect to ${
              NETWORK_NAMES[CHAIN_ID as keyof typeof NETWORK_NAMES]
            }`;
          } else if (error instanceof ConnectorUnsupportedError) {
            reason = Reasons.UnsupportedConnector;
          } else {
            // eslint-disable-next-line no-console
            console.error(error);
            reason = Reasons.Unknown;
          }

          addErrorNotification(reason);
          dispatch({
            type: Actions.ConnectWalletError,
            payload: reason,
          });
        });
    },
    [connect, addInfoNotification, addErrorNotification],
  );

  const connectionListener = useCallback(() => {
    dispatch({
      type: Actions.SetOnline,
      payload: window.navigator.onLine,
    });
  }, [dispatch]);

  /**
   * Get latest release and add an update notification if necessary
   */
  // Temporarily disabled
  // useEffect(() => {
  //   fetch('https://api.github.com/repos/mStable/mStable-app/releases/latest')
  //     .then(result => {
  //       result.json().then(({ tag_name: tag }: { tag_name: string }) => {
  //         if (tag && tag.slice(1) !== (DAPP_VERSION as string)) {
  //           addUpdateNotification(
  //             'New version available',
  //             `A new version of the app is available`,
  //           );
  //         }
  //       });
  //     })
  //     .catch(() => {
  //       // Ignore
  //     });
  // }, [addUpdateNotification]);

  /**
   * Detect internet connection (or lack thereof)
   */
  useEffect((): (() => void) => {
    window.addEventListener('offline', connectionListener);
    window.addEventListener('online', connectionListener);
    return () => {
      window.removeEventListener('offline', connectionListener);
      window.removeEventListener('online', connectionListener);
    };
  }, [connectionListener]);

  /**
   * Detect supported chain ID when the injected provider changes network.
   * This will be deprecated fairly soon:
   * https://docs.metamask.io/guide/ethereum-provider.html#methods-current-api
   */
  useEffect(() => {
    let chainChangedListener: (chainId: number | string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const injected = (window as any).ethereum;

    // The network change listener is only valid when the injected connector is
    // used, or it's present but no connector is activated.
    if (injected && (!connector || connector === 'injected')) {
      chainChangedListener = chainId => {
        // `chainId` from MetaMask can't be trusted in this event
        if (!Number.isNaN(chainId as number)) {
          const supported = CHAIN_ID === parseInt(chainId as string, 10);
          dispatch({
            type: Actions.SupportedChainSelected,
            payload: supported,
          });
        }
      };
      chainChangedListener(parseInt(injected.chainId, 16));

      const subType = identifyInjectedSubType(injected);
      if (subType === 'dapper') {
        addErrorNotification(Reasons.UnsupportedConnector);
        dispatch({
          type: Actions.ConnectWalletError,
          payload: Reasons.UnsupportedConnector,
        });
      } else {
        dispatch({ type: Actions.SetWalletSubType, payload: subType });

        injected.on?.('chainChanged', chainChangedListener);
        injected.on?.('networkChanged', chainChangedListener);
        injected.autoRefreshOnNetworkChange = false;
      }
    }

    return () => {
      if (injected && chainChangedListener) {
        injected.removeListener?.('networkChanged', chainChangedListener);
        injected.removeListener?.('chainChanged', chainChangedListener);
      }
    };
  }, [dispatch, connector, addErrorNotification]);

  /**
   * Automatically reconnect once on startup (if possible)
   */
  useEffect(() => {
    if (
      !attemptedReconnect.current &&
      !['connected', 'connecting'].includes(status)
    ) {
      const { id, subType } = LocalStorage.get('connector') || {};
      if (id) {
        if (id === 'injected') {
          // eslint-disable-next-line
          (connectors.injected as any)
            ?.web3ReactConnector?.({})
            ?.isAuthorized?.()
            .then((authorized: boolean) => {
              if (authorized) {
                connectWallet(id, subType);
              }
            });
        } else {
          connectWallet(id, subType);
        }
      }
      attemptedReconnect.current = true;
    }
  }, [status, connectWallet, connectors.injected]);

  /**
   * Set then Sentry user scope when the account changes
   */
  useEffect(() => {
    configureScope(scope => {
      scope.setUser({
        id: account || 'NOT_CONNECTED',
      });
      scope.setTags({
        activated: (status === 'connected').toString(),
        connector: JSON.stringify(connector),
      });
    });
  }, [account, status, connector]);

  return (
    <context.Provider
      value={useMemo(
        () => [
          state,
          {
            closeAccount,
            connectWallet,
            openWalletRedirect,
            resetWallet,
            selectMasset,
            toggleNotifications,
            toggleWallet,
          },
        ],
        [
          state,
          closeAccount,
          connectWallet,
          openWalletRedirect,
          resetWallet,
          selectMasset,
          toggleNotifications,
          toggleWallet,
        ],
      )}
    >
      {children}
    </context.Provider>
  );
};

export const useAppContext = (): [State, Dispatch] => useContext(context);

export const useAppState = (): State => useAppContext()[0];

export const useWalletState = (): State['wallet'] => useAppState().wallet;

export const useIsSupportedChain = (): boolean =>
  useWalletState().supportedChain;

export const useIsWalletConnected = (): boolean =>
  useWalletState().status === WalletConnectionStatus.Connected;

export const useIsWalletConnecting = (): boolean =>
  useWalletState().status === WalletConnectionStatus.Connecting;

export const useAccountOpen = (): boolean => useAppState().accountItem !== null;

export const useAccountItem = (): State['accountItem'] =>
  useAppState().accountItem;

export const useWalletConnector = (): Connector | undefined => {
  const {
    connector: { id, subType } = { id: undefined, subType: undefined },
  } = useWalletState();

  return useMemo(
    () => id && CONNECTORS.find(c => c.id === id && c.subType === subType),
    [id, subType],
  );
};

export const useAppDispatch = (): Dispatch => useAppContext()[1];

export const useConnectWallet = (): Dispatch['connectWallet'] =>
  useAppDispatch().connectWallet;

export const useCloseAccount = (): Dispatch['closeAccount'] =>
  useAppDispatch().closeAccount;

export const useAppStatusWarnings = (): StatusWarnings[] => {
  const {
    online,
    wallet: { supportedChain },
  } = useAppState();

  return useMemo(() => {
    const warnings = [];

    if (!online) warnings.push(StatusWarnings.NotOnline);
    if (!supportedChain) warnings.push(StatusWarnings.UnsupportedChain);

    return warnings;
  }, [online, supportedChain]);
};

export const useToggleWallet = (): Dispatch['toggleWallet'] =>
  useAppDispatch().toggleWallet;

export const useOpenWalletRedirect = (): Dispatch['openWalletRedirect'] =>
  useAppDispatch().openWalletRedirect;

export const useToggleNotifications = (): Dispatch['toggleNotifications'] =>
  useAppDispatch().toggleNotifications;

export const useResetWallet = (): Dispatch['resetWallet'] =>
  useAppDispatch().resetWallet;
