import React, { createContext, useContext, useMemo, FC, Context } from 'react'
import { BigNumber } from 'ethers'
import { useQuery } from '@apollo/client'

import {
  StakingRewardsContractDocument,
  StakingRewardsContractQuery,
  StakingRewardsContractQueryResult,
  StakingRewardsContractQueryVariables,
  StakingRewardsForStakingTokenDocument,
  StakingRewardsForStakingTokenQuery,
  StakingRewardsForStakingTokenQueryResult,
  StakingRewardsForStakingTokenQueryVariables,
} from '../graphql/staking-rewards'
import { useAccount } from '../context/AccountProvider'
import { BigDecimal } from '../web3/BigDecimal'
import { Token } from '../types'

interface State {
  address: string
  duration: number
  lastUpdateTime: number
  periodFinish: number
  rewardRate: number
  rewardPerTokenStoredNow: BigNumber
  rewardsToken: Token
  stakingBalance: BigDecimal
  stakingBalancePercentage: BigDecimal
  stakingReward: { amount: BigDecimal; amountPerTokenPaid: BigDecimal }
  stakingToken: Token & { totalSupply: BigDecimal }
  totalSupply: BigDecimal
  totalStakingRewards: BigDecimal
  totalRemainingRewards: BigDecimal
  platformRewards?: {
    platformRewardPerTokenStoredNow: BigNumber
    platformRewardRate: number
    platformReward: { amount: BigDecimal; amountPerTokenPaid: BigDecimal }
    platformToken: Omit<Token, 'totalSupply'>
    totalPlatformRewards: BigDecimal
    totalRemainingPlatformRewards: BigDecimal
  }
}

const currentTime = BigNumber.from(Math.floor(Date.now() / 1e3))

const transformStakingContract = (
  data: NonNullable<NonNullable<StakingRewardsContractQueryResult['data']>['stakingRewardsContract']>,
): State => {
  const {
    duration,
    address,
    lastUpdateTime,
    periodFinish,
    rewardPerTokenStored,
    rewardRate,
    platformRewardPerTokenStored,
    platformRewardRate,
    platformToken,
    totalPlatformRewards,
  } = data

  const stakingToken = {
    ...data.stakingToken,
    totalSupply: BigDecimal.fromMetric(data.stakingToken.totalSupply),
  }

  const rewardsToken = {
    ...data.rewardsToken,
    totalSupply: BigDecimal.fromMetric(data.rewardsToken.totalSupply),
  }

  const stakingReward = {
    amount: new BigDecimal(data.stakingRewards[0]?.amount || 0, rewardsToken.decimals),
    amountPerTokenPaid: new BigDecimal(data.stakingRewards[0]?.amountPerTokenPaid || 0, rewardsToken.decimals),
  }

  const stakingBalance = new BigDecimal(data.stakingBalances[0]?.amount || 0, stakingToken.decimals)

  const totalSupply = new BigDecimal(data.totalSupply, stakingToken.decimals)

  const totalStakingRewards = new BigDecimal(data.totalStakingRewards, rewardsToken.decimals)
  const totalRemainingRewards = new BigDecimal(
    currentTime.gt(periodFinish) ? 0 : BigNumber.from(periodFinish).sub(currentTime).mul(rewardRate),
    rewardsToken.decimals,
  )

  const stakingBalancePercentage = BigDecimal.parse(
    (stakingBalance.exact.gt(0) && totalSupply.exact.gt(0) ? stakingBalance.simple / totalSupply.simple : 0).toFixed(20),
    stakingToken.decimals,
  )

  return {
    address,
    duration,
    lastUpdateTime,
    periodFinish,
    stakingToken,
    rewardsToken,
    rewardRate: parseInt(rewardRate),
    rewardPerTokenStoredNow: BigNumber.from(rewardPerTokenStored),
    totalSupply,
    totalStakingRewards,
    totalRemainingRewards,
    stakingBalance,
    stakingBalancePercentage,
    stakingReward,
    ...(platformToken && platformRewardRate && platformRewardPerTokenStored && totalPlatformRewards
      ? {
          platformRewards: {
            platformToken,
            platformRewardPerTokenStoredNow: BigNumber.from(platformRewardPerTokenStored),
            platformRewardRate: parseInt(platformRewardRate),
            platformReward: {
              amount: new BigDecimal(data.platformRewards[0]?.amount || 0, platformToken.decimals),
              amountPerTokenPaid: new BigDecimal(data.platformRewards[0]?.amountPerTokenPaid || 0, platformToken.decimals),
            },
            totalPlatformRewards: new BigDecimal(totalPlatformRewards, platformToken.decimals),
            totalRemainingPlatformRewards: new BigDecimal(
              currentTime.gt(periodFinish) ? 0 : BigNumber.from(periodFinish).sub(currentTime).mul(platformRewardRate),
              platformToken.decimals,
            ),
          },
        }
      : undefined),
  }
}

export const createStakingRewardsContext = (): Readonly<
  [() => State | undefined, FC<{ address?: string; stakingTokenAddress?: string }>, Context<State | undefined>]
> => {
  const stateCtx = createContext<State | undefined>(undefined)

  const StakingRewardsProvider: FC<{ address?: string; stakingTokenAddress?: string }> = ({ address, stakingTokenAddress, children }) => {
    const account = useAccount()

    const query = useQuery<StakingRewardsForStakingTokenQuery | StakingRewardsContractQuery>(
      stakingTokenAddress ? StakingRewardsForStakingTokenDocument : StakingRewardsContractDocument,
      {
        skip: !address && !stakingTokenAddress,
        variables: {
          account,
          ...(stakingTokenAddress
            ? ({ stakingToken: stakingTokenAddress as string } as StakingRewardsForStakingTokenQueryVariables)
            : ({ id: address as string } as StakingRewardsContractQueryVariables)),
        },
      },
    )

    const value = useMemo(() => {
      if (!query.data) return undefined
      const stakingRewardsContract =
        (query as NonNullable<StakingRewardsContractQueryResult>).data?.stakingRewardsContract ??
        (query as NonNullable<StakingRewardsForStakingTokenQueryResult>).data?.stakingRewardsContracts?.[0]

      return stakingRewardsContract ? transformStakingContract(stakingRewardsContract) : undefined
    }, [query])

    return <stateCtx.Provider value={value}>{children}</stateCtx.Provider>
  }

  const useStakingRewardsContext = (): State | undefined => useContext(stateCtx)

  return [useStakingRewardsContext, StakingRewardsProvider, stateCtx] as const
}
