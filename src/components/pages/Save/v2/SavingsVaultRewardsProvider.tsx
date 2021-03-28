import React, { FC, createContext, useContext, useState } from 'react';
import { useInterval } from 'react-use';
import { getUnixTime } from 'date-fns';

import { calculateRewards, Rewards } from './utils';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { BoostedSavingsVaultState } from '../../../../context/DataProvider/types';

const rewardsCtx = createContext<Rewards | undefined>(null as never);

const updateRewards = (
  vault: BoostedSavingsVaultState | undefined,
): Rewards | undefined => {
  const currentTime = getUnixTime(Date.now());
  return calculateRewards(vault, currentTime);
};

/**
 * @deprecated
 */
export const useRewards = (): Rewards | undefined => useContext(rewardsCtx);

/**
 * @deprecated
 */
export const SavingsVaultRewardsProvider: FC = ({ children }) => {
  const [rewards, setRewards] = useState<Rewards>();

  const massetState = useSelectedMassetState();
  const vault = massetState?.savingsContracts?.v2?.boostedSavingsVault;

  useInterval(() => {
    setRewards(updateRewards(vault));
  }, 1000);

  return <rewardsCtx.Provider value={rewards}>{children}</rewardsCtx.Provider>;
};
