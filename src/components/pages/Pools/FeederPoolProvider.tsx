import type { FC } from 'react';
import React, { createContext, useContext, useMemo } from 'react';
import type {
  BoostedSavingsVault,
  FeederPool,
} from '@mstable/protocol/types/generated';
import {
  BoostedSavingsVault__factory,
  FeederPool__factory,
} from '@mstable/protocol/types/generated';

import type { FeederPoolState } from '../../../context/DataProvider/types';
import { useFeederPool } from '../../../context/DataProvider/DataProvider';
import { useSigner } from '../../../context/OnboardProvider';
import { useTokenSubscription } from '../../../context/TokensProvider';
import { UseBigDecimalInputsArg } from '../../../hooks/useBigDecimalInputs';
import { PoolVaultRewardsProvider } from '../Save/v2/SavingsVaultRewardsProvider';

interface PoolState {
  poolAddress: string;
  vaultAddress: string;
  contracts?: {
    feederPool: FeederPool;
    vault: BoostedSavingsVault;
  };
}

const ctx = createContext<PoolState>(null as never);

export const useSelectedFeederPoolAddress = (): string => {
  return useContext(ctx).poolAddress;
};
export const useSelectedFeederPoolState = (): FeederPoolState => {
  const { poolAddress } = useContext(ctx);
  // Should be mounted below a check for this state
  return useFeederPool(poolAddress) as FeederPoolState;
};

export const useSelectedFeederPoolContract = (): FeederPool | undefined => {
  return useContext(ctx).contracts?.feederPool;
};

export const useSelectedFeederPoolVaultContract = ():
  | BoostedSavingsVault
  | undefined => {
  return useContext(ctx).contracts?.vault;
};

export const useSelectedFeederPoolAssets = (): UseBigDecimalInputsArg => {
  const feederPool = useSelectedFeederPoolState();
  return useMemo(
    () =>
      Object.fromEntries(
        [
          feederPool.masset.token,
          feederPool.fasset.token,
        ].map(({ address, decimals }) => [address, { decimals }]),
      ),
    [feederPool],
  );
};

export const FeederPoolProvider: FC<{ poolAddress: string }> = ({
  poolAddress,
  children,
}) => {
  // Should be mounted below a check for this state
  const feederPool = useFeederPool(poolAddress) as FeederPoolState;
  const vaultAddress = feederPool.vault.address;

  // Subscribe at provider level so we can rely on the data being there
  // in child components
  useTokenSubscription(poolAddress);
  useTokenSubscription(feederPool.masset.address);
  useTokenSubscription(feederPool.fasset.address);

  const signer = useSigner();

  const poolState = useMemo<PoolState>(
    () => ({
      poolAddress,
      vaultAddress,
      contracts: signer
        ? {
            feederPool: FeederPool__factory.connect(poolAddress, signer),
            vault: BoostedSavingsVault__factory.connect(vaultAddress, signer),
          }
        : undefined,
    }),
    [signer, poolAddress, vaultAddress],
  );

  return (
    <ctx.Provider value={poolState}>
      <PoolVaultRewardsProvider poolAddress={poolAddress}>
        {children}
      </PoolVaultRewardsProvider>
    </ctx.Provider>
  );
};
