import { BigNumber } from 'ethers/utils';

import { BigDecimal } from '../../../../web3/BigDecimal';
import {
  BoostedSavingsVaultAccountState,
  BoostedSavingsVaultState,
} from '../../../../context/DataProvider/types';
import { SCALE } from '../../../../constants';

export interface Rewards {
  now: {
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

const ZERO = new BigDecimal(0);

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
    return { total: ZERO, locked: ZERO, unlocked: ZERO };
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

  // It is assumed that rewardEntries is sorted by start (ascending)
  const first = lastClaim
    ? (rewardEntries.find(entry => entry.start > lastClaim)?.index as number)
    : 0;

  const last =
    ([...rewardEntries].reverse().find(entry => currentTime > entry.start)
      ?.index as number) ?? 0;

  const nextUnlock = rewardEntries.find(entry => entry.start > currentTime)
    ?.start;

  const vesting = rewardEntries
    .filter(entry => entry.start > lastClaim)
    .reduce(
      (prev, { finish, start, rate }) => {
        const amount = new BigDecimal(
          new BigNumber(finish).sub(start).mul(rate),
        );

        if (currentTime < start) {
          return {
            locked: prev.locked.add(amount),
            unlocked: prev.unlocked,
          };
        }

        if (currentTime > finish) {
          return {
            locked: prev.locked,
            unlocked: prev.unlocked.add(amount),
          };
        }

        const lockedAmount = new BigDecimal(
          new BigNumber(currentTime).sub(start).mul(rate),
        );
        const unlockedAmount = new BigDecimal(
          new BigNumber(finish).sub(currentTime).mul(rate),
        );
        return {
          locked: prev.unlocked.add(lockedAmount),
          unlocked: prev.unlocked.add(unlockedAmount),
        };
      },
      { locked: ZERO, unlocked: ZERO },
    );

  const transferred = vesting.unlocked.add(earned.unlocked);

  const afterClaimVesting = {
    locked: vesting.locked.sub(vesting.unlocked).add(earned.locked),
  };

  return {
    now: {
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
