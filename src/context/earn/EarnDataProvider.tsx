import React, { FC, createContext, useContext, useMemo } from 'react';

import { SubscribedToken } from '../../types';
import { useToken } from '../DataProvider/TokensProvider';
import { useRawEarnData } from './useRawEarnData';
import { useSyncedEarnData } from './useSyncedEarnData';
import { transformEarnData } from './transformEarnData';
import {
  EarnData,
  StakingRewardsContractsMap,
  StakingRewardsContract,
  TokenPricesMap,
} from './types';

const ctx = createContext<EarnData>({} as never);

export const EarnDataProvider: FC<{}> = ({ children }) => {
  // Data that we only want to get once per session:
  // - Staking rewards contract IDs
  // - Pool data from each platform
  // - Token prices for pool tokens, rewards tokens, and platform tokens
  const syncedEarnData = useSyncedEarnData();

  // Data that we subscribe to on each block:
  // - Staking rewards contracts
  const rawEarnData = useRawEarnData(syncedEarnData);

  const earnData = useMemo(
    () => transformEarnData(syncedEarnData, rawEarnData),
    [syncedEarnData, rawEarnData],
  );

  return <ctx.Provider value={earnData}>{children}</ctx.Provider>;
};

export const useEarnData = (): EarnData => useContext(ctx);

export const useStakingRewardsContracts = (): StakingRewardsContractsMap =>
  useEarnData().stakingRewardsContractsMap;

export const useStakingRewardsContract = (
  address: string,
): StakingRewardsContract | undefined => useStakingRewardsContracts()[address];

export const useTokenPrices = (): TokenPricesMap =>
  useEarnData().tokenPricesMap;

export const useTokenWithPrice = (address?: string): SubscribedToken | undefined => {
  const tokenPricesMap = useTokenPrices();
  const token = useToken(address);
  const price = address ? tokenPricesMap[address] : undefined;
  return token ? { ...token, price } : undefined;
};

export const useRewardsToken = (address: string): SubscribedToken | undefined => {
  const stakingRewards = useStakingRewardsContract(address);
  return useTokenWithPrice(stakingRewards?.rewardsToken.address);
};

export const usePlatformToken = (address: string): SubscribedToken | undefined => {
  const stakingRewards = useStakingRewardsContract(address);
  return useTokenWithPrice(
    stakingRewards?.platformRewards?.platformToken.address,
  );
};

export const useStakingToken = (address: string): SubscribedToken | undefined => {
  const stakingRewards = useStakingRewardsContract(address);
  return useTokenWithPrice(stakingRewards?.stakingToken.address);
};
