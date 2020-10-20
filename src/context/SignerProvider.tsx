import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Web3Provider as EthersWeb3Provider,
  Provider,
  AsyncSendable,
  InfuraProvider,
} from 'ethers/providers';
import { Signer, providers } from 'ethers';
import { useWallet } from 'use-wallet';
import { CHAIN_ID } from '../web3/constants';

interface InjectedEthereum {
  enable(): Promise<string[]>;
}

interface SignerState {
  signer?: Signer;
  infuraProvider: InfuraProvider;
}

const initialState = {
  infuraProvider: new providers.InfuraProvider(
    CHAIN_ID,
    process.env.REACT_APP_RPC_API_KEY,
  ),
};

const context = createContext<SignerState>({} as never);

/**
 * Provider for setting and getting a transaction signer (via `use-wallet`).
 */
export const SignerProvider: FC<{}> = ({ children }) => {
  const [state, setState] = useState<SignerState>(initialState);
  const { ethereum, account } = useWallet<InjectedEthereum>();

  useEffect((): void => {
    if (!ethereum) {
      setState(initialState);
      return;
    }

    ethereum.enable().then(() => {
      const web3Provider = new EthersWeb3Provider(ethereum as AsyncSendable);
      const signer = web3Provider.getSigner();
      setState({ ...initialState, signer });
    });
  }, [ethereum, account]);

  return <context.Provider value={state}>{children}</context.Provider>;
};

export const useInfuraProvider = (): SignerState['infuraProvider'] =>
  useContext(context).infuraProvider;

export const useSignerContext = (): SignerState['signer'] =>
  useContext(context).signer;

export const useSignerOrInfuraProvider = (): Signer | Provider => {
  const { signer, infuraProvider } = useContext(context);
  return signer ?? infuraProvider;
};
