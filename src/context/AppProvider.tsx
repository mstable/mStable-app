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
import { useHistory } from 'react-router-dom';
import { configureScope } from '@sentry/react';

import { CHAIN_ID } from '../web3/constants';
import { useAddErrorNotification } from './NotificationsProvider';
import { useWalletAddress, useConnected, useWallet } from './OnboardProvider';
import { Message } from '../types';

export enum AccountItems {
  Notifications,
  Wallet,
}

enum Actions {
  SupportedChainSelected,
  SetOnline,
  SetAccountItem,
  ToggleAccount,
  SetMessageVisible,
  SetMessage,
}

export enum StatusWarnings {
  NotOnline,
  UnsupportedChain,
}

interface State {
  error: string | null;
  supportedChain: boolean;
  accountItem: AccountItems | null;
  online: boolean;
  messageVisible: boolean;
  message: Message;
}

type Action =
  | { type: Actions.SetAccountItem; payload: AccountItems | null }
  | { type: Actions.ToggleAccount; payload: AccountItems }
  | { type: Actions.SupportedChainSelected; payload: boolean }
  | { type: Actions.SetOnline; payload: boolean }
  | { type: Actions.SetMessage; payload: Message }
  | { type: Actions.SetMessageVisible; payload: boolean };

interface Dispatch {
  closeAccount(): void;
  openWalletRedirect(redirect: string): void;
  toggleNotifications(): void;
  toggleWallet(): void;
  setMessageVisible(isVisible: boolean): void;
  setMessage(message: Message): void;
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
        supportedChain: action.payload,
        error: null,
      };
    case Actions.SetOnline:
      return { ...state, online: action.payload };
    case Actions.SetMessage:
      return { ...state, message: action.payload };
    case Actions.SetMessageVisible:
      return { ...state, messageVisible: action.payload };
    default:
      return state;
  }
};

const initialState: State = {
  error: null,
  supportedChain: true,
  accountItem: null,
  online: true,
  message: {
    title: 'SAVE V2 has launched!',
    subtitle:
      'You’ll need to migrate your balance to continue earning interest.',
    emoji: '🎉',
  },
  messageVisible: false,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const context = createContext<[State, Dispatch]>([initialState, {}] as any);

/**
 * Provider for global App state and interactions.
 */
export const AppProvider: FC<{}> = ({ children }) => {
  const history = useHistory();
  const [state, dispatch] = useReducer(reducer, initialState);
  const addErrorNotification = useAddErrorNotification();
  const address = useWalletAddress();
  const wallet = useWallet();
  const connected = useConnected();
  const status = connected ? 'connected' : 'connecting';

  const setMessageVisible = useCallback<Dispatch['setMessageVisible']>(
    isVisible => {
      dispatch({
        type: Actions.SetMessageVisible,
        payload: isVisible,
      });
    },
    [dispatch],
  );

  const setMessage = useCallback<Dispatch['setMessage']>(
    message => {
      dispatch({
        type: Actions.SetMessage,
        payload: message,
      });
    },
    [dispatch],
  );

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
    let chainChangedListener: (chainId: number | string) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const injected = (window as any).ethereum;
    // The network change listener is only valid when the injected connector is
    // used, or it's present but no connector is activated.
    if (injected && (!wallet || wallet.type === 'injected')) {
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

      injected.on?.('chainChanged', chainChangedListener);
      injected.on?.('networkChanged', chainChangedListener);
      injected.autoRefreshOnNetworkChange = false;
    }

    return () => {
      if (injected && chainChangedListener) {
        injected.removeListener?.('networkChanged', chainChangedListener);
        injected.removeListener?.('chainChanged', chainChangedListener);
      }
    };
  }, [dispatch, wallet, addErrorNotification]);

  /**
   * Set then Sentry user scope when the account changes
   */
  useEffect(() => {
    configureScope(scope => {
      scope.setUser({
        id: address || 'NOT_CONNECTED',
      });
      scope.setTags({
        activated: (status === 'connected').toString(),
      });
    });
  }, [address, status]);

  return (
    <context.Provider
      value={useMemo(
        () => [
          state,
          {
            closeAccount,
            openWalletRedirect,
            toggleNotifications,
            toggleWallet,
            setMessageVisible,
            setMessage,
          },
        ],
        [
          state,
          closeAccount,
          openWalletRedirect,
          toggleNotifications,
          toggleWallet,
          setMessageVisible,
          setMessage,
        ],
      )}
    >
      {children}
    </context.Provider>
  );
};

export const useAppContext = (): [State, Dispatch] => useContext(context);

export const useAppState = (): State => useAppContext()[0];

export const useIsSupportedChain = (): boolean => useAppState().supportedChain;

export const useAccountOpen = (): boolean => useAppState().accountItem !== null;

export const useAccountItem = (): State['accountItem'] =>
  useAppState().accountItem;

export const useAppDispatch = (): Dispatch => useAppContext()[1];

export const useCloseAccount = (): Dispatch['closeAccount'] =>
  useAppDispatch().closeAccount;

export const useAppStatusWarnings = (): StatusWarnings[] => {
  const { online, supportedChain } = useAppState();
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

export const useSetMessageVisible = (): Dispatch['setMessageVisible'] =>
  useAppDispatch().setMessageVisible;

export const useSetMessage = (): Dispatch['setMessage'] =>
  useAppDispatch().setMessage;
