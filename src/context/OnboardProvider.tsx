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
  connect(): void;
  reset(): void;
  connected: boolean;
}

const infuraProvider = new providers.InfuraProvider(
  CHAIN_ID,
  process.env.REACT_APP_RPC_API_KEY,
);

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
  const [connected, setConnected] = useState<boolean>(false);
  const addInfoNotification = useAddInfoNotification();
  const addErrorNotification = useAddErrorNotification();
  const onboard = useMemo(() => {
    return initOnboard({
      address: account => {
        if (account === undefined) {
          LocalStorage.removeItem('walletName');
          setWallet(undefined);
          setProvider(undefined);
          setSigner(undefined);
          setConnected(false);
          onboard.walletReset();
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
  }, []);

  const connect = useCallback(
    async (walletName?: string) => {
      await onboard.walletSelect(walletName);

      let checkPassed = false;
      try {
        checkPassed = await onboard.walletCheck();
      } catch (error) {
        console.error(error);
      }
      if (checkPassed) {
        setConnected(true);
        addInfoNotification('Connected');
      } else {
        LocalStorage.removeItem('walletName');
        onboard.walletReset();
        addErrorNotification('Error', 'Could not connect to the wallet');
        setConnected(false);
        setWallet(undefined);
        setProvider(undefined);
        setSigner(undefined);
      }
    },
    [onboard, addInfoNotification, addErrorNotification],
  );

  useEffect(() => {
    const previouslySelectedWallet = LocalStorage.get('walletName');

    if (previouslySelectedWallet && onboard.walletSelect) {
      connect(previouslySelectedWallet);
    }
  }, [onboard, connect]);

  const reset = useCallback(() => {
    onboard.walletReset();
    LocalStorage.removeItem('walletName');
    setWallet(undefined);
    setConnected(false);
    setProvider(undefined);
    setSigner(undefined);
  }, [onboard]);

  return (
    <context.Provider
      value={useMemo(
        () => ({
          infuraProvider,
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
export const useWallet = (): State['wallet'] => useContext(context).wallet;
export const useProvider = (): State['provider'] =>
  useContext(context).provider;
export const useWalletAddress = (): State['address'] =>
  useContext(context).address;
export const useConnect = (): State['connect'] => useContext(context).connect;
export const useSigner = (): State['signer'] => useContext(context).signer;
export const useConnected = (): State['connected'] =>
  useContext(context).connected;

export const useReset = (): State['reset'] => useContext(context).reset;

export const useSignerOrInfuraProvider = (): Signer | Provider => {
  const { signer } = useContext(context);
  return signer ?? infuraProvider;
};
