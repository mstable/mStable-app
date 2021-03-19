import React, { FC, createContext, useContext, useState, useMemo } from 'react';
import { useInterval, useToggle } from 'react-use';
import { addDays, getUnixTime } from 'date-fns';

import { calculateRewards, Rewards } from './utils';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { BoostedSavingsVaultState } from '../../../../context/DataProvider/types';

type RewardsTimeTravel = [boolean, () => void, (time: number) => void];

const rewardsTimeTravelCtx = createContext<RewardsTimeTravel>(null as never);

const rewardsCtx = createContext<Rewards | undefined>(null as never);

export const useRewardsTimeTravel = (): RewardsTimeTravel =>
  useContext(rewardsTimeTravelCtx);

export const useRewards = (): Rewards | undefined => useContext(rewardsCtx);

export const RewardsProvider: FC = ({ children }) => {
  const [rewards, setRewards] = useState<Rewards>();
  const [timeTravel, toggleTimeTravel] = useToggle(false);
  const [time, setTime] = useState<number | undefined>(
    getUnixTime(addDays(Date.now(), 90)),
  );

  const massetState = useSelectedMassetState();
  const vault = massetState?.savingsContracts?.v2?.boostedSavingsVault;

  useInterval(() => {
    const currentTime = timeTravel && time ? time : getUnixTime(Date.now());
    const newRewards = calculateRewards(vault, currentTime, timeTravel);
    setRewards(newRewards);
  }, 1000);

  return (
    <rewardsTimeTravelCtx.Provider
      value={useMemo(() => [timeTravel, toggleTimeTravel, setTime], [
        timeTravel,
        toggleTimeTravel,
      ])}
    >
      <rewardsCtx.Provider value={rewards}>{children}</rewardsCtx.Provider>
    </rewardsTimeTravelCtx.Provider>
  );
};

// TODO separate this out
export const VaultRewardsProvider: FC<{ vault: BoostedSavingsVaultState }> = ({
  children,
  vault,
}) => {
  const [rewards, setRewards] = useState<Rewards>();

  useInterval(() => {
    const currentTime = getUnixTime(Date.now());
    const newRewards = calculateRewards(vault, currentTime);
    setRewards(newRewards);
  }, 1000);

  return <rewardsCtx.Provider value={rewards}>{children}</rewardsCtx.Provider>;
};
