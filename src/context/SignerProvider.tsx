import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Web3Provider as EthersWeb3Provider,
  AsyncSendable,
} from 'ethers/providers';
import { Signer } from 'ethers';
import { useWallet } from 'use-wallet';

interface InjectedEthereum {
  enable(): Promise<string[]>;
}

type State = Signer | null;

const context = createContext<State>(null);

/**
 * Provider for setting and getting a transaction signer (via `use-wallet`).
 */
export const SignerProvider: FC<{}> = ({ children }) => {
  const [signer, setSigner] = useState<State>(null);
  const { ethereum, account } = useWallet<InjectedEthereum>();

  useEffect((): void => {
    if (!ethereum) {
      setSigner(null);
      return;
    }

    ethereum.enable().then(() => {
      const web3Provider = new EthersWeb3Provider(ethereum as AsyncSendable);
      setSigner(web3Provider.getSigner());
    });
  }, [ethereum, account]);

  return <context.Provider value={signer}>{children}</context.Provider>;
};

export const useSignerContext = (): State => useContext(context);

export const useWeb3Provider = (): EthersWeb3Provider | null => {
  const signer = useSignerContext();
  return signer && signer.provider
    ? (signer.provider as EthersWeb3Provider)
    : null;
};
