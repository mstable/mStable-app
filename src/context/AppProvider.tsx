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
  RejectedActivationError,
  UnsupportedChainError,
  UnsupportedConnectorError,
  useWallet,
} from 'use-wallet';
import MetamaskOnboarding from '@metamask/onboarding';
import { navigate } from 'hookrouter';
import { configureScope } from '@sentry/react';

import { MassetNames, InjectedEthereum, Connector } from '../types';
import { CHAIN_ID, CONNECTORS, NETWORK_NAMES } from '../web3/constants';
import {
  useAddInfoNotification,
  useAddErrorNotification,
} from './NotificationsProvider';
import { LocalStorage, Storage, StorageV0 } from '../localStorage';

enum Actions {
  ResetWallet,
  ConnectWallet,
  ConnectWalletError,
  ConnectWalletSuccess,
  SetWalletPosition,
  SetWalletSubType,
  ExpandWallet,
  CollapseWallet,
  SelectMasset,
  SupportedChainSelected,
  SetOnline,
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
    expanded: boolean;
    connector?: {
      id: keyof Connectors;
      subType?: string;
    };
    status: WalletConnectionStatus;
    error: string | null;
    supportedChain: boolean;
    position: {
      cx: number;
      cy: number;
    };
  };
  online: boolean;
  selectedMasset: MassetNames;
}

type Action =
  | { type: Actions.SelectMasset; payload: MassetNames }
  | { type: Actions.ExpandWallet }
  | { type: Actions.CollapseWallet }
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
  | { type: Actions.SetOnline; payload: boolean }
  | {
      type: Actions.SetWalletPosition;
      payload: {
        cx: number;
        cy: number;
      };
    };

interface Dispatch {
  selectMasset(massetName: MassetNames): void;
  collapseWallet(): void;
  expandWallet(): void;
  expandWalletRedirect(path: string): void;
  resetWallet(): void;
  connectWallet(connector: keyof Connectors, subType?: string): void;
  setWalletPosition(cx: number, cy: number): void;
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.CollapseWallet:
      return { ...state, wallet: { ...state.wallet, expanded: false } };
    case Actions.ExpandWallet:
      return { ...state, wallet: { ...state.wallet, expanded: true } };
    case Actions.SetWalletPosition:
      return {
        ...state,
        wallet: { ...state.wallet, position: action.payload },
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
    expanded: false,
    status: WalletConnectionStatus.Disconnected,
    error: null,
    supportedChain: true,
    position: {
      cx: 0,
      cy: 0,
    },
  },
  selectedMasset: MassetNames.mUSD,
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

  return undefined;
};

/**
 * Provider for global App state and interactions.
 */
export const AppProvider: FC<{}> = ({ children }) => {
  const attemptedReconnect = useRef(false);
  const {
    activate,
    deactivate,
    activating,
    connected,
    activated,
    account,
  } = useWallet<InjectedEthereum>();
  const [state, dispatch] = useReducer(reducer, initialState);
  const addInfoNotification = useAddInfoNotification();
  const addErrorNotification = useAddErrorNotification();

  const collapseWallet = useCallback<Dispatch['collapseWallet']>(() => {
    dispatch({ type: Actions.CollapseWallet });
  }, [dispatch]);

  const expandWallet = useCallback<Dispatch['expandWallet']>(() => {
    dispatch({ type: Actions.ExpandWallet });
  }, [dispatch]);

  const expandWalletRedirect = useCallback<Dispatch['expandWalletRedirect']>(
    path => {
      navigate(path);
      dispatch({ type: Actions.ExpandWallet });
    },
    [dispatch],
  );

  const selectMasset = useCallback<Dispatch['selectMasset']>(
    massetName => {
      dispatch({ type: Actions.SelectMasset, payload: massetName });
    },
    [dispatch],
  );

  const resetWallet = useCallback<Dispatch['resetWallet']>(() => {
    deactivate();
    dispatch({ type: Actions.ResetWallet });
    LocalStorage.removeItem<StorageV0, 'connectorId'>('connectorId');
    LocalStorage.removeItem<Storage, 'connector'>('connector');
  }, [dispatch, deactivate]);

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

      activate(id)
        .then(() => {
          const connector = CONNECTORS.find(
            c => c.id === id && c.subType === subType,
          );

          addInfoNotification(
            'Connected',
            connector ? `Connected with ${connector.label}` : null,
          );

          dispatch({ type: Actions.ConnectWalletSuccess });

          if (connector) {
            LocalStorage.set<Storage, 'connector'>('connector', {
              id,
              subType,
            });
          }
        })
        .catch(error => {
          let reason: string;

          if (error instanceof RejectedActivationError) {
            reason = Reasons.RejectedActivation;
          } else if (error instanceof UnsupportedChainError) {
            reason = `${Reasons.UnsupportedChain}; please connect to ${
              NETWORK_NAMES[CHAIN_ID as keyof typeof NETWORK_NAMES]
            }`;
          } else if (error instanceof UnsupportedConnectorError) {
            reason = Reasons.UnsupportedConnector;
          } else {
            reason = Reasons.Unknown;
          }

          addErrorNotification(reason);
          dispatch({
            type: Actions.ConnectWalletError,
            payload: reason,
          });
        });
    },
    [activate, addInfoNotification, addErrorNotification],
  );

  const setWalletPosition = useCallback<Dispatch['setWalletPosition']>(
    (cx, cy) => {
      dispatch({
        type: Actions.SetWalletPosition,
        payload: { cx, cy },
      });
    },
    [dispatch],
  );

  const connectionListener = useCallback(() => {
    dispatch({
      type: Actions.SetOnline,
      payload: window.navigator.onLine,
    });
  }, [dispatch]);

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
    let networkChangedListener: (chainId: number | string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const injected = (window as any).ethereum;

    // The network change listener is only valid when the injected connector is
    // used, or it's present but no connector is activated.
    if (injected && (!activated || activated === 'injected')) {
      networkChangedListener = chainId => {
        // `chainId` from MetaMask can't be trusted in this event
        if (!Number.isNaN(chainId as number)) {
          const supported = CHAIN_ID === parseInt(chainId as string, 10);
          dispatch({
            type: Actions.SupportedChainSelected,
            payload: supported,
          });
        }
      };
      networkChangedListener(parseInt(injected.chainId, 16));

      const subType = identifyInjectedSubType(injected);
      if (subType === 'dapper') {
        addErrorNotification(Reasons.UnsupportedConnector);
        dispatch({
          type: Actions.ConnectWalletError,
          payload: Reasons.UnsupportedConnector,
        });
      } else {
        dispatch({ type: Actions.SetWalletSubType, payload: subType });

        injected.on?.('networkChanged', networkChangedListener);
        injected.autoRefreshOnNetworkChange = false;
      }
    }

    return () => {
      if (injected && networkChangedListener) {
        injected.removeListener?.('networkChanged', networkChangedListener);
      }
    };
  }, [dispatch, activated, addErrorNotification]);

  /**
   * Automatically reconnect once on startup (if possible)
   */
  useEffect(() => {
    if (!attemptedReconnect.current && !(activating || connected)) {
      const { id, subType } =
        LocalStorage.get<Storage, 'connector'>('connector') || {};
      if (id) {
        connectWallet(id, subType);
      }
      attemptedReconnect.current = true;
    }
  }, [activating, connected, connectWallet]);

  /**
   * Set then Sentry user scope when the account changes
   */
  useEffect(() => {
    configureScope(scope => {
      const connector = LocalStorage.get<Storage, 'connector'>('connector');
      scope.setUser({
        id: account || 'NOT_CONNECTED',
      });
      scope.setTags({
        activated,
        connector: JSON.stringify(connector),
      });
    });
  }, [account, activated]);

  return (
    <context.Provider
      value={useMemo(
        () => [
          state,
          {
            collapseWallet,
            expandWallet,
            expandWalletRedirect,
            selectMasset,
            connectWallet,
            resetWallet,
            setWalletPosition,
          },
        ],
        [
          state,
          collapseWallet,
          expandWallet,
          expandWalletRedirect,
          selectMasset,
          resetWallet,
          connectWallet,
          setWalletPosition,
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

export const useWalletExpanded = (): State['wallet']['expanded'] =>
  useWalletState().expanded;

export const useWalletPosition = (): State['wallet']['position'] =>
  useWalletState().position;

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

export const useCollapseWallet = (): Dispatch['collapseWallet'] =>
  useAppDispatch().collapseWallet;

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

export const useExpandWallet = (): Dispatch['expandWallet'] =>
  useAppDispatch().expandWallet;

export const useExpandWalletRedirect = (): Dispatch['expandWalletRedirect'] =>
  useAppDispatch().expandWalletRedirect;

export const useResetWallet = (): Dispatch['resetWallet'] =>
  useAppDispatch().resetWallet;

export const useSetWalletPosition = (): Dispatch['setWalletPosition'] =>
  useAppDispatch().setWalletPosition;
