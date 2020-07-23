import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { providers } from 'ethers';
import { useWallet } from 'use-wallet';
import type { JsonRpcSigner, ExternalProvider} from '@ethersproject/providers';

import { NETWORKS } from '../web3/constants';

interface InjectedEthereum {
  enable(): Promise<string[]>;
}

interface State {
  signer?: JsonRpcSigner;
  provider: providers.AlchemyProvider
}

const provider = new providers.AlchemyProvider(
  NETWORKS[
    parseInt(process.env.REACT_APP_CHAIN_ID, 10) as keyof typeof NETWORKS
  ],
  process.env.REACT_APP_ALCHEMY_KEY,
);

const initialState: State = Object.freeze({
  provider,
});

const context = createContext<State>(initialState);

/**
 * Provider for setting and getting a transaction signer (via `use-wallet`).
 */
export const EthereumProvider: FC<{}> = ({ children }) => {
  const [state, setState] = useState<State>(initialState);
  const { ethereum, account } = useWallet<InjectedEthereum>();

  useEffect((): void => {
    if (!ethereum) {
      setState(initialState);
      return;
    }

    ethereum.enable().then(() => {
      const web3Provider = new providers.Web3Provider(ethereum as ExternalProvider);
      setState({ ...initialState, signer: web3Provider.getSigner() });
    });
  }, [ethereum, account]);

  return <context.Provider value={state}>{children}</context.Provider>;
};

export const useSignerContext = (): State['signer'] =>
  useContext(context).signer;

export const useProviderContext = (): State['provider'] =>
  useContext(context).provider;
