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
import { BigDecimal } from '../web3/BigDecimal';
import { CHAIN_ID } from '../web3/constants';
import { initOnboard } from './onboardUtils';
import { LocalStorage, Storage } from '../localStorage';

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
  const [onboard, setOnboard] = useState<API>({} as API);
  useEffect(() => {
    const onboardModal = initOnboard({
      address: setAddress,
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
          // LocalStorage.set('walletName', walletInstance.name);
        } else {
          setWallet({} as Wallet);
        }
      },
    });
    setOnboard(onboardModal);
  }, []);

  const connect = useCallback(async () => {
    const userSelectedWallet = await onboard.walletSelect();
    const userCheckedWallet = await onboard.walletCheck();
    Promise.all([userSelectedWallet, userCheckedWallet]);
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
          connect,
        }),
        [onboard, address, network, balance, wallet, signer, provider, connect],
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
export const useAddressContext = (): State['address'] =>
  useContext(context).address;
export const useConnect = (): State['connect'] => useContext(context).connect;
