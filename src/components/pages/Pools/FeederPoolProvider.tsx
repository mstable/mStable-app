import type { FC } from 'react';
import React, { createContext, useContext, useMemo } from 'react';
import type { FeederPool } from '@mstable/protocol/types/generated';
import { FeederPool__factory } from '@mstable/protocol/types/generated';

import type { FeederPoolState } from '../../../context/DataProvider/types';
import { useFeederPool } from '../../../context/DataProvider/DataProvider';
import { useSigner } from '../../../context/OnboardProvider';
import { useTokenSubscription } from '../../../context/TokensProvider';
import { VaultRewardsProvider } from '../Save/v2/RewardsProvider';
import { UseBigDecimalInputsArg } from '../../../hooks/useBigDecimalInputs';

interface PoolState {
  poolAddress: string;
  contract?: FeederPool;
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
  const { contract } = useContext(ctx);
  return contract;
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

  // Subscribe at provider level so we can rely on the data being there
  // in child components
  useTokenSubscription(poolAddress);
  useTokenSubscription(feederPool.masset.address);
  useTokenSubscription(feederPool.fasset.address);

  const signer = useSigner();

  const poolState = useMemo<PoolState>(
    () => ({
      poolAddress,
      contract: signer
        ? FeederPool__factory.connect(poolAddress, signer)
        : undefined,
    }),
    [signer, poolAddress],
  );

  return (
    <ctx.Provider value={poolState}>
      <VaultRewardsProvider vault={feederPool.vault}>
        {children}
      </VaultRewardsProvider>
    </ctx.Provider>
  );
};
