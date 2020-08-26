import React, { createContext, useContext, FC, useMemo } from 'react';
import { useSignerContext } from '../SignerProvider';
import { Erc20Detailed } from '../../typechain/Erc20Detailed.d';
import { Erc20DetailedFactory } from '../../typechain/Erc20DetailedFactory';
import { Masset } from '../../typechain/Masset.d';
import { MassetFactory } from '../../typechain/MassetFactory';
import { SavingsContract } from '../../typechain/SavingsContract.d';
import { SavingsContractFactory } from '../../typechain/SavingsContractFactory';

interface State {
  mUSD: Masset | null;
  mUSDSavings: SavingsContract | null;
}

const context = createContext<State>({} as State);

export const ContractsProvider: FC<{}> = ({ children }) => {
  const signer = useSignerContext();

  const state = useMemo<State>(
    () => ({
      mUSD: signer
        ? MassetFactory.connect(
            process.env.REACT_APP_MUSD_ADDRESS as string,
            signer,
          )
        : null,
      mUSDSavings: signer
        ? SavingsContractFactory.connect(
            process.env.REACT_APP_MUSD_SAVINGS_ADDRESS as string,
            signer,
          )
        : null,
    }),
    [signer],
  );

  return <context.Provider value={state}>{children}</context.Provider>;
};

export const useContractsState = (): State => useContext(context);

export const useMusdContract = (): State['mUSD'] => useContractsState().mUSD;

export const useSavingsContract = (): State['mUSDSavings'] =>
  useContractsState().mUSDSavings;

export const useErc20Contract = (
  address: string | null,
): Erc20Detailed | null => {
  const signer = useSignerContext();
  return useMemo(
    () =>
      signer && address ? Erc20DetailedFactory.connect(address, signer) : null,
    [address, signer],
  );
};
