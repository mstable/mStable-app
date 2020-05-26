import React, {
  FC,
  createContext,
  useContext,
  useCallback,
  useMemo,
  useReducer,
  Reducer,
  useEffect,
} from 'react';
import {
  Connectors,
  RejectedActivationError,
  UnsupportedChainError,
  UnsupportedConnectorError,
  useWallet,
} from 'use-wallet';
import MetamaskOnboarding from '@metamask/onboarding';
import { TokenDetailsFragment } from '../graphql/generated';
import { useMassetToken } from '../web3/hooks';
import { MassetNames, InjectedEthereum } from '../types';
import { CHAIN_ID, CONNECTORS, NETWORK_NAMES } from '../web3/constants';
import {
  useAddInfoNotification,
  useAddErrorNotification,
} from './NotificationsProvider';

enum Actions {
  ResetWallet,
  ConnectWallet,
  ConnectWalletError,
  ConnectWalletSuccess,
  SetWalletPosition,
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
    connector?: keyof Connectors;
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
  | { type: Actions.ConnectWallet; payload: keyof Connectors }
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
  resetWallet(): void;
  connectWallet(connector: keyof Connectors): void;
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

/**
 * Provider for global App state and interactions.
 */
export const AppProvider: FC<{}> = ({ children }) => {
  const { activate, deactivate } = useWallet<InjectedEthereum>();
  const [state, dispatch] = useReducer(reducer, initialState);
  const addInfoNotification = useAddInfoNotification();
  const addErrorNotification = useAddErrorNotification();

  const collapseWallet = useCallback<Dispatch['collapseWallet']>(() => {
    dispatch({ type: Actions.CollapseWallet });
  }, [dispatch]);

  const expandWallet = useCallback<Dispatch['expandWallet']>(() => {
    dispatch({ type: Actions.ExpandWallet });
  }, [dispatch]);

  const selectMasset = useCallback<Dispatch['selectMasset']>(
    massetName => {
      dispatch({ type: Actions.SelectMasset, payload: massetName });
    },
    [dispatch],
  );

  const resetWallet = useCallback<Dispatch['resetWallet']>(() => {
    deactivate();
    dispatch({ type: Actions.ResetWallet });
  }, [dispatch, deactivate]);

  const connectWallet = useCallback<Dispatch['connectWallet']>(
    selected => {
      dispatch({ type: Actions.ConnectWallet, payload: selected });

      if (selected === 'injected') {
        const onboarding = new MetamaskOnboarding();
        if (onboarding.state === 'NOT_INSTALLED') {
          onboarding.startOnboarding();
          return;
        }
      }

      activate(selected)
        .then(() => {
          const connector = CONNECTORS.find(c => c.id === selected);
          addInfoNotification(
            'Connected',
            connector ? `Connected with ${connector.label}` : null,
          );
          dispatch({ type: Actions.ConnectWalletSuccess });
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

    if (injected) {
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

      injected.on('networkChanged', networkChangedListener);
      injected.autoRefreshOnNetworkChange = false;
    }

    return () => {
      if (injected && networkChangedListener) {
        injected.removeListener('networkChanged', networkChangedListener);
      }
    };
  }, [dispatch]);

  return (
    <context.Provider
      value={useMemo(
        () => [
          state,
          {
            collapseWallet,
            expandWallet,
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

export const useResetWallet = (): Dispatch['resetWallet'] =>
  useAppDispatch().resetWallet;

export const useSetWalletPosition = (): Dispatch['setWalletPosition'] =>
  useAppDispatch().setWalletPosition;

export const useSelectMasset = (): Dispatch['selectMasset'] =>
  useAppDispatch().selectMasset;

export const useSelectedMassetToken = (): TokenDetailsFragment | null => {
  const [{ selectedMasset }] = useAppContext();
  return useMassetToken(selectedMasset);
};
