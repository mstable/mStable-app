import React, { createContext, FunctionComponent, useEffect } from 'react';
import { useWallet } from 'use-wallet';

interface InjectedEthereum {
  enable(): Promise<string[]>;
}

const ContractContext = createContext<null>(null);

export const ContractProvider: FunctionComponent<{}> = ({ children }) => {
  // const [contract, setContract] = useState();
  const { ethereum } = useWallet<InjectedEthereum>();

  useEffect(() => {
    if (!ethereum) return;

    ethereum.enable().then(() => {
      // eslint-disable-next-line no-console
      console.log('Got unlocked injected connector');
      // const provider = new Web3Provider(ethereum);
      // const signer = provider.getSigner();
      // TODO get contract instance(s)
    });
  }, [ethereum]);

  return (
    <ContractContext.Provider value={null}>{children}</ContractContext.Provider>
  );
};
