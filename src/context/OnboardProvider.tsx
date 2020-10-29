/* eslint-disable no-console */
import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
// eslint-disable-next-line import/no-unresolved
import { Wallet, API } from 'bnc-onboard/dist/src/interfaces';
import {
  Web3Provider as EthersWeb3Provider,
  Provider,
  InfuraProvider,
  JsonRpcSigner,
} from 'ethers/providers';
import { Signer, providers, ethers } from 'ethers';
import { CHAIN_ID } from '../web3/constants';
import { initOnboard } from './onboardUtils';
import { LocalStorage } from '../localStorage';
import {
  useAddInfoNotification,
  useAddErrorNotification,
} from './NotificationsProvider';

export interface State {
  onboard: API;
  address?: string;
  network?: number;
  balance?: string;
  wallet?: Wallet;
  signer?: Signer;
  infuraProvider: InfuraProvider;
  provider?: Provider;
  connect?(): void;
  reset?(): void;
  connected?: boolean;
}

const initialState = {
  infuraProvider: new providers.InfuraProvider(
    CHAIN_ID,
    process.env.REACT_APP_RPC_API_KEY,
  ),
  onboard: undefined,
};

const context = createContext<State>({} as never);

export const OnboardProvider: FC<{}> = ({ children }) => {
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [network, setNetwork] = useState<number | undefined>(undefined);
  const [balance, setBalance] = useState<string | undefined>(undefined);
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined);
  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined);
  const [provider, setProvider] = useState<EthersWeb3Provider | undefined>(
    undefined,
  );
  const [connected, setConnected] = useState<boolean | undefined>(undefined);
  const [onboard, setOnboard] = useState<API>({} as API);
  const addInfoNotification = useAddInfoNotification();
  const addErrorNotification = useAddErrorNotification();
  useEffect(() => {
    const onboardModal = initOnboard({
      address: async account => {
        if (account === undefined) {
          LocalStorage.removeItem('walletName');
          setWallet(undefined);
          setProvider(undefined);
          setSigner(undefined);
          setConnected(false);
          onboardModal.walletReset();
        }
        setAddress(account);
      },
      network: setNetwork,
      balance: setBalance,
      wallet: walletInstance => {
        if (walletInstance.provider) {
          setWallet(walletInstance);
          const ethersProvider = new ethers.providers.Web3Provider(
            walletInstance.provider,
          );
          setProvider(ethersProvider);
          setSigner(ethersProvider.getSigner());
          setConnected(true);
          if (walletInstance.name) {
            LocalStorage.set('walletName', walletInstance.name);
          } else {
            LocalStorage.removeItem('walletName');
          }
        } else {
          setWallet(undefined);
          setProvider(undefined);
          setSigner(undefined);
          setConnected(false);
        }
      },
    });
    setOnboard(onboardModal);
  }, []);

  useEffect(() => {
    const previouslySelectedWallet = LocalStorage.get('walletName');

    if (previouslySelectedWallet && onboard.walletSelect) {
      onboard.walletSelect(previouslySelectedWallet).catch(error => {
        console.error(error);
      });
    }
  }, [onboard]);

  const connect = useCallback(async () => {
    await onboard.walletSelect();
    await onboard.walletCheck().then(res => {
      if (res === true) {
        setConnected(true);
        addInfoNotification('Connected');
      } else if (res === false) {
        LocalStorage.removeItem('walletName');
        onboard.walletReset();
        addErrorNotification('Error', 'Could not connect to the wallet');
        setConnected(false);
        setWallet(undefined);
      }
    });
  }, [onboard, addInfoNotification, addErrorNotification]);

  const reset = useCallback(() => {
    onboard.walletReset();
    LocalStorage.removeItem('walletName');
    setWallet(undefined);
    setConnected(false);
  }, [onboard]);

  return (
    <context.Provider
      value={useMemo(
        () => ({
          ...initialState,
          onboard,
          address,
          network,
          balance,
          wallet,
          signer,
          provider,
          connected,
          connect,
          reset,
        }),
        [
          onboard,
          address,
          network,
          balance,
          wallet,
          signer,
          provider,
          connected,
          connect,
          reset,
        ],
      )}
    >
      {children}
    </context.Provider>
  );
};

export const useOnboard = (): State['onboard'] => useContext(context).onboard;
export const useWalletContext = (): State['wallet'] =>
  useContext(context).wallet;
export const useProviderContext = (): State['provider'] =>
  useContext(context).provider;
export const useWalletAddress = (): State['address'] =>
  useContext(context).address;
export const useConnect = (): State['connect'] => useContext(context).connect;
export const useSigner = (): State['signer'] => useContext(context).signer;
export const useConnected = (): State['connected'] =>
  useContext(context).connected;

export const useReset = (): State['reset'] => useContext(context).reset;

export const useSignerOrInfuraProvider = (): Signer | Provider => {
  const { signer, infuraProvider } = useContext(context);
  return signer ?? infuraProvider;
};
