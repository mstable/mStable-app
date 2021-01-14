import { BigNumber } from 'ethers/utils';

import { BigDecimal } from '../../../../web3/BigDecimal';
import {
  BoostedSavingsVaultAccountState,
  BoostedSavingsVaultState,
} from '../../../../context/DataProvider/types';
import { SCALE } from '../../../../constants';

export interface Rewards {
  now: {
    claimable: BigDecimal;
    earned: {
      locked: BigDecimal;
      unlocked: BigDecimal;
      total: BigDecimal;
    };
    vesting: {
      locked: BigDecimal;
      unlocked: BigDecimal;
    };
  };
  afterClaim: {
    transferred: BigDecimal;
    vesting: {
      locked: BigDecimal;
    };
  };
  first: number;
  last: number;
  nextUnlock?: number;
  currentTime: number;
}

const getRewardPerToken = (
  {
    lastUpdateTime,
    periodFinish,
    rewardRate,
    rewardPerTokenStored,
    totalSupply,
  }: BoostedSavingsVaultState,
  currentTime: number,
  simulateConstantRewards?: boolean,
): BigNumber => {
  const lastApplicableTime = simulateConstantRewards
    ? currentTime
    : Math.min(periodFinish, currentTime);
  const timeDelta = lastApplicableTime - lastUpdateTime;

  if (timeDelta === 0) {
    return rewardPerTokenStored;
  }

  // New reward units to distribute = rewardRate * timeSinceLastUpdate
  const rewardUnitsToDistribute = rewardRate.mul(timeDelta);

  // If there is no StakingToken liquidity, avoid div(0)
  // If there is nothing to distribute, short circuit
  if (totalSupply.exact.eq(0) || rewardUnitsToDistribute.eq(0)) {
    return rewardPerTokenStored;
  }

  // New reward units per token = (rewardUnitsToDistribute * 1e18) / totalTokens
  const unitsToDistributePerToken = rewardUnitsToDistribute
    .mul(SCALE)
    .div(totalSupply.exact);

  // Return summed rate
  return rewardPerTokenStored.add(unitsToDistributePerToken);
};

const calculateEarned = (
  boostedSavingsVault: BoostedSavingsVaultState & {
    account: BoostedSavingsVaultAccountState;
  },
  currentTime: number,
  simulateConstantRewards?: boolean,
): Rewards['now']['earned'] => {
  const rewardPerToken = getRewardPerToken(
    boostedSavingsVault,
    currentTime,
    simulateConstantRewards,
  );
  const {
    unlockPercentage,
    account: { boostedBalance, rewardPerTokenPaid },
  } = boostedSavingsVault;

  // Current rate per token - rate user previously received
  const userRewardDelta = rewardPerToken.sub(rewardPerTokenPaid);

  if (userRewardDelta.eq(0)) {
    // Short circuit if there is nothing new to distribute
    return {
      locked: BigDecimal.ZERO,
      unlocked: BigDecimal.ZERO,
      total: BigDecimal.ZERO,
    };
  }

  // New reward = staked tokens * difference in rate
  const earned = boostedBalance.mulTruncate(userRewardDelta);

  const earnedUnlocked = earned.mulTruncate(unlockPercentage);

  return {
    unlocked: earnedUnlocked,
    locked: earned.sub(earnedUnlocked),
    total: earned,
  };
};

export const calculateRewards = (
  boostedSavingsVault: BoostedSavingsVaultState | undefined,
  currentTime: number,
  simulateConstantRewards?: boolean,
): Rewards | undefined => {
  if (!(boostedSavingsVault && boostedSavingsVault.account)) {
    return undefined;
  }

  const {
    account: { rewardEntries, lastClaim },
  } = boostedSavingsVault as BoostedSavingsVaultState & {
    account: BoostedSavingsVaultAccountState;
  };

  const earned = calculateEarned(
    boostedSavingsVault as BoostedSavingsVaultState & {
      account: BoostedSavingsVaultAccountState;
    },
    currentTime,
    simulateConstantRewards,
  );

  const claimableEntries = rewardEntries.filter(
    entry => currentTime >= entry.start && lastClaim <= entry.finish,
  );

  // It is assumed that rewardEntries is sorted by start (ascending)
  const first = claimableEntries[0]?.index ?? 0;
  const last = claimableEntries[claimableEntries.length - 1]?.index ?? 0;

  const nextUnlock = rewardEntries[first]?.start;

  // doesn't include claims that have completely been claimed (obvs)
  // but this means that the 'after vested' locked amount is off - in some cases, this should go down.
  // what if we isolate the finished ones?
  const vesting = rewardEntries
    .filter(entry => lastClaim < entry.finish)
    .reduce(
      (prev, { finish, start, rate }) => {
        const fullAmount = new BigDecimal(
          new BigNumber(finish).sub(start).mul(rate),
        );

        if (currentTime < start) {
          return {
            locked: prev.locked.add(fullAmount),
            unlocked: prev.unlocked,
          };
        }

        if (currentTime > finish) {
          return {
            locked: prev.locked,
            unlocked: prev.unlocked.add(fullAmount),
          };
        }

        const endTime = Math.min(finish, currentTime);
        const startTime = Math.max(start, lastClaim);

        const unlockedAmount = new BigDecimal(
          new BigNumber(endTime).sub(startTime).mul(rate),
        );

        const lockedAmount = fullAmount.sub(unlockedAmount);

        return {
          locked: prev.locked.add(lockedAmount),
          unlocked: prev.unlocked.add(unlockedAmount),
        };
      },
      { locked: BigDecimal.ZERO, unlocked: BigDecimal.ZERO },
    );

  const transferred = vesting.unlocked.add(earned.unlocked);

  const afterClaimVesting = {
    locked: vesting.locked.add(earned.locked),
  };

  const claimable = vesting.unlocked.add(earned.total);

  return {
    now: {
      claimable,
      earned,
      vesting,
    },
    afterClaim: {
      transferred,
      vesting: afterClaimVesting,
    },
    first,
    last,
    currentTime,
    nextUnlock,
  };
};
