import { Context, createContext, FC, useContext, useState } from 'react'
import { useInterval } from 'react-use'
import { getUnixTime } from 'date-fns'

import { BigDecimal } from '../web3/BigDecimal'
import { StakingRewardsExtended } from './createStakingRewardsContext'

import { createUseContextFn, providerFactory } from './utils'
import { BigNumber } from 'ethers'
import { SCALE } from '../constants'

export interface RewardsEarned {
  canClaim?: boolean
  rewards: { earned: BigDecimal; token: string }[]
}

export const createRewardsEarnedContext = (
  stakingRewardsCtx: Context<StakingRewardsExtended>,
): Readonly<[() => RewardsEarned, FC, Context<RewardsEarned>]> => {
  const context = createContext<RewardsEarned>(null as never)

  const RewardEarnedProvider: FC = ({ children }) => {
    const stakingRewards = useContext(stakingRewardsCtx)

    const [value, setValue] = useState<RewardsEarned>({ rewards: [] })

    useInterval(() => {
      if (!stakingRewards.stakingRewardsContract) {
        return setValue({ rewards: [] })
      }

      const {
        lastUpdateTime,
        periodFinish,
        platformRewards: { platformReward, platformRewardPerTokenStoredNow, platformRewardRate, platformToken } = {},
        rewardPerTokenStoredNow,
        rewardRate,
        rewardsToken,
        stakingBalance,
        stakingReward,
        totalSupply,
      } = stakingRewards.stakingRewardsContract
      const totalTokens = totalSupply.exact

      const rewardPerToken = (() => {
        if (totalTokens.eq(0)) {
          // If there is no StakingToken liquidity, avoid div(0)
          return { rewardPerTokenStoredNow, platformRewardPerTokenStoredNow }
        }

        const lastTimeRewardApplicable = Math.min(periodFinish, getUnixTime(Date.now()))

        const timeSinceLastUpdate = lastTimeRewardApplicable - lastUpdateTime

        // New reward units to distribute = rewardRate * timeSinceLastUpdate
        const rewardUnitsToDistribute = rewardRate.exact.mul(timeSinceLastUpdate)
        const platformRewardUnitsToDistribute = platformRewardRate?.exact.mul(timeSinceLastUpdate)

        // New reward units per token = (rewardUnitsToDistribute * 1e18) / totalTokens
        const unitsToDistributePerToken = rewardUnitsToDistribute.mul(SCALE).div(totalTokens)
        const platformUnitsToDistributePerToken = platformRewardUnitsToDistribute?.mul(SCALE).div(totalTokens)

        return {
          rewardPerTokenStoredNow: rewardPerTokenStoredNow.add(unitsToDistributePerToken),
          platformRewardPerTokenStoredNow: platformRewardPerTokenStoredNow?.add(platformUnitsToDistributePerToken ?? BigDecimal.ZERO),
        }
      })()

      // Current rate per token - rate user previously received
      const userRewardDelta = rewardPerToken.rewardPerTokenStoredNow.sub(stakingReward.amountPerTokenPaid).exact
      const platformUserRewardDelta = rewardPerToken.platformRewardPerTokenStoredNow?.sub(
        platformReward?.amountPerTokenPaid ?? BigDecimal.ZERO,
      )

      // New reward = staked tokens * difference in rate
      const userNewReward = stakingBalance.mulTruncate(userRewardDelta)
      const userNewPlatformReward = platformUserRewardDelta ? stakingBalance.mulTruncate(platformUserRewardDelta.exact) : undefined

      // Add to previous rewards
      const summedRewards = stakingReward.amount.add(userNewReward)
      const summedPlatformRewards =
        userNewPlatformReward && platformReward ? platformReward.amount.add(userNewPlatformReward) : BigDecimal.ZERO

      return setValue({
        canClaim: summedRewards.exact.gt(0) || summedPlatformRewards.exact.gt(0),
        rewards: [
          {
            earned: summedRewards,
            token: rewardsToken.symbol,
          },
          ...(platformToken
            ? [
                {
                  earned: summedPlatformRewards,
                  token: platformToken.symbol,
                },
              ]
            : []),
        ],
      })
    }, 1e3)

    return providerFactory(context, { value }, children)
  }

  return [createUseContextFn(context), RewardEarnedProvider, context] as const
}
