import React, { createContext, useContext, FC, useMemo } from 'react';
import { useSignerContext } from '../EthereumProvider';
import { ContractNames } from '../../types';
import { useKnownAddress } from './KnownAddressProvider';
import {
  ForgeValidatorFactory,
  MassetFactory,
  SavingsContractFactory,
} from '../../typechain';
import { Erc20DetailedFactory } from '../../typechain/Erc20DetailedContract';
import { Erc20Detailed } from '../../typechain/Erc20Detailed.d';
import { ForgeValidator } from '../../typechain/ForgeValidator.d';
import { Masset } from '../../typechain/Masset.d';
import { SavingsContract } from '../../typechain/SavingsContract.d';

interface State {
  [ContractNames.mUSD]: Masset | null;
  [ContractNames.mUSDForgeValidator]: ForgeValidator | null;
  [ContractNames.mUSDSavings]: SavingsContract | null;
}

const context = createContext<State>({} as State);

export const ContractsProvider: FC<{}> = ({ children }) => {
  const signer = useSignerContext();

  const mUsdAddress = useKnownAddress(ContractNames.mUSD);
  const savingsContractAddress = useKnownAddress(ContractNames.mUSDSavings);
  const forgeValidatorAddress = useKnownAddress(
    ContractNames.mUSDForgeValidator,
  );

  const state = useMemo<State>(
    () => ({
      [ContractNames.mUSD]:
        signer && mUsdAddress
          ? MassetFactory.connect(mUsdAddress, signer)
          : null,
      [ContractNames.mUSDSavings]:
        signer && savingsContractAddress
          ? SavingsContractFactory.connect(savingsContractAddress, signer)
          : null,
      [ContractNames.mUSDForgeValidator]:
        signer && forgeValidatorAddress
          ? ForgeValidatorFactory.connect(forgeValidatorAddress, signer)
          : null,
    }),
    [signer, mUsdAddress, savingsContractAddress, forgeValidatorAddress],
  );

  return <context.Provider value={state}>{children}</context.Provider>;
};

export const useContractsState = (): State => useContext(context);

export const useMusdContract = (): State[ContractNames.mUSD] =>
  useContractsState()[ContractNames.mUSD];

export const useSavingsContract = (): State[ContractNames.mUSDSavings] =>
  useContractsState()[ContractNames.mUSDSavings];

export const useForgeValidatorContract = (): State[ContractNames.mUSDForgeValidator] =>
  useContractsState()[ContractNames.mUSDForgeValidator];

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
