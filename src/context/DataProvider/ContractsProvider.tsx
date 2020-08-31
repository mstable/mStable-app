import React, { createContext, useContext, FC, useMemo } from 'react';

import { Erc20Detailed } from '../../typechain/Erc20Detailed.d';
import { Erc20DetailedFactory } from '../../typechain/Erc20DetailedFactory';
import { Masset } from '../../typechain/Masset.d';
import { MassetFactory } from '../../typechain/MassetFactory';
import { SavingsContract } from '../../typechain/SavingsContract.d';
import { SavingsContractFactory } from '../../typechain/SavingsContractFactory';
import { useSigner } from '../OnboardProvider';
import { useMassets, useSelectedMasset } from '../MassetsProvider';
import { MassetName } from '../../types';

interface State {
  massets: Record<
    MassetName,
    { contract?: Masset; savingsContract?: SavingsContract }
  >;
}

const context = createContext<State>({} as State);

export const ContractsProvider: FC<{}> = ({ children }) => {
  const massets = useMassets();
  const signer = useSigner();

  const state = useMemo<State>(
    () => ({
      massets: Object.fromEntries(
        massets.map(({ name, address, savingsContract }) => {
          const value = signer
            ? {
                contract: MassetFactory.connect(address, signer),
                ...(savingsContract?.address
                  ? {
                      savingsContract: SavingsContractFactory.connect(
                        savingsContract.address,
                        signer,
                      ),
                    }
                  : {}),
              }
            : {};
          return [name, value];
        }),
      ) as State['massets'],
    }),
    [massets, signer],
  );

  return <context.Provider value={state}>{children}</context.Provider>;
};

export const useContractsState = (): State => useContext(context);

export const useSelectedMassetContract = (): Masset | undefined => {
  const { massets } = useContractsState();
  const selectedMasset = useSelectedMasset();
  return massets[selectedMasset.name]?.contract;
};

export const useSelectedMassetSavingsContract = ():
  | SavingsContract
  | undefined => {
  const { massets } = useContractsState();
  const selectedMasset = useSelectedMasset();
  return massets[selectedMasset.name]?.savingsContract;
};

export const useErc20Contract = (
  address: string | null,
): Erc20Detailed | null => {
  const signer = useSigner();
  return useMemo(
    () =>
      signer && address ? Erc20DetailedFactory.connect(address, signer) : null,
    [address, signer],
  );
};
