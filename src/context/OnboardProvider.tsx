import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
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

export interface State {
  onboard?: API;
  address?: string;
  network?: number;
  balance?: BigDecimal;
  wallet?: Wallet;
  signer?: Signer;
  infuraProvider?: InfuraProvider;
  provider?: Provider;
}

const initialState = {
  infuraProvider: new providers.InfuraProvider(
    CHAIN_ID,
    process.env.REACT_APP_RPC_API_KEY,
  ),
};

const context = createContext<State>({} as never);

export const OnboardProvider: FC<{}> = ({ children }) => {
  const [state, setState] = useState<State>(initialState);
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState(3);
  const [balance, setBalance] = useState('');
  const [wallet, setWallet] = useState({} as Wallet);
  const [signer, setSigner] = useState({} as JsonRpcSigner);
  const [provider, setProvider] = useState({} as EthersWeb3Provider);

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
          window.localStorage.setItem(
            'selectedWallet',
            walletInstance.name as string,
          );
        } else {
          setWallet({} as Wallet);
        }
      },
    });
    setState({
      ...initialState,
      onboard: onboardModal,
      address,
      network,
      balance: new BigDecimal(balance, 10),
      wallet,
      signer,
      provider,
    });
  }, [address, network, balance, wallet, signer, provider]);
  return <context.Provider value={state}>{children}</context.Provider>;
};

export const useOnboard = (): State['onboard'] => useContext(context).onboard;
export const useWalletContext = (): State['wallet'] =>
  useContext(context).wallet;
