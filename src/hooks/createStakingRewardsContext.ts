import { createContext, useMemo, FC, Context } from 'react'
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

import { createUseContextFn, providerFactory } from './utils'
import { useFetchPriceCtx } from '../context'
import { calculateApy } from '../utils/calculateApy'
import { useTokenSubscription } from '../context/TokensProvider'
import { useSelectedMassetState } from '../context/DataProvider/DataProvider'

export interface StakingRewardsContract {
  address: string
  duration: number
  lastUpdateTime: number
  periodFinish: number
  rewardRate: BigDecimal
  rewardPerTokenStoredNow: BigDecimal
  rewardsToken: Token
  stakingBalance: BigDecimal
  stakingBalancePercentage: BigDecimal
  stakingReward: { amount: BigDecimal; amountPerTokenPaid: BigDecimal }
  stakingToken: Token & { totalSupply: BigDecimal }
  totalSupply: BigDecimal
  totalStakingRewards: BigDecimal
  totalRemainingRewards: BigDecimal
  platformRewards?: {
    platformRewardPerTokenStoredNow: BigDecimal
    platformRewardRate: BigDecimal
    platformReward: { amount: BigDecimal; amountPerTokenPaid: BigDecimal }
    platformToken: Omit<Token, 'totalSupply'>
    totalPlatformRewards: BigDecimal
    totalRemainingPlatformRewards: BigDecimal
  }
}

export interface Reward {
  id: string
  name: string
  apy: number
  apyTip: string
  stakeLabel: string
  balance: BigDecimal
  amounts: (BigDecimal | undefined)[]
  tokens: string[]
  priority?: boolean
}

export interface StakingRewardsExtended {
  stakingRewardsContract?: StakingRewardsContract
  rewards?: Reward[]
  earned?: { amount: BigDecimal; symbol: string }[]
  stakedBalance?: BigDecimal
  unstakedBalance?: BigDecimal
  hasStakedBalance?: boolean
  hasUnstakedBalance?: boolean
}

const currentTime = BigNumber.from(Math.floor(Date.now() / 1e3))

const transform = (
  data: NonNullable<NonNullable<StakingRewardsContractQueryResult['data']>['stakingRewardsContract']>,
): StakingRewardsContract => {
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
    rewardRate: new BigDecimal(rewardRate),
    rewardPerTokenStoredNow: new BigDecimal(rewardPerTokenStored),
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
            platformRewardPerTokenStoredNow: new BigDecimal(platformRewardPerTokenStored),
            platformRewardRate: new BigDecimal(platformRewardRate),
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
  [() => StakingRewardsExtended, FC<{ address?: string; stakingTokenAddress?: string }>, Context<StakingRewardsExtended>]
> => {
  const context = createContext<StakingRewardsExtended>({})

  const StakingRewardsProvider: FC<{ address?: string; stakingTokenAddress?: string }> = ({ address, stakingTokenAddress, children }) => {
    const useFetchPrice = useFetchPriceCtx()
    const massetState = useSelectedMassetState()
    const account = useAccount()

    // 1. Subgraph query
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

    // 2. Transform query result into StakingRewards
    const stakingRewardsContract = useMemo<StakingRewardsContract | undefined>(() => {
      if (!query.data) return undefined
      const data =
        (query as NonNullable<StakingRewardsContractQueryResult>).data?.stakingRewardsContract ??
        (query as NonNullable<StakingRewardsForStakingTokenQueryResult>).data?.stakingRewardsContracts?.[0]

      return data ? transform(data) : undefined
    }, [query])

    // 3. Use StakingRewards for prices etc
    const stakingToken = useTokenSubscription(stakingRewardsContract?.stakingToken.address)
    // TODO find price of wrapped token on main chain rather than hardcode these:
    // const rewardsPrice = useFetchPrice(stakingRewards?.rewardsToken.address)
    // const platformRewardsPrice = useFetchPrice(stakingRewards?.platformRewards?.platformToken.address)
    const rewardsPrice = useFetchPrice('0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2') // MTA (Eth mainnet)
    const platformRewardsPrice = useFetchPrice('0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0') // MATIC (Eth mainnet)

    // 4. Transform all into StakingRewardsExtended
    const value = useMemo<StakingRewardsExtended>(() => {
      if (!stakingRewardsContract || !massetState) return {}

      const isSave = stakingToken?.address === massetState.savingsContracts.v2.address

      const unstakedBalance = stakingToken?.balance ?? BigDecimal.ZERO
      const stakedBalance = stakingRewardsContract.stakingBalance ?? BigDecimal.ZERO

      // TODO find value of stakingToken based on collateral (when needed)
      const exchangeRate = (isSave && massetState.savingsContracts.v2.latestExchangeRate?.rate) || BigDecimal.ONE
      const stakingTokenPrice = 1 * exchangeRate.simple

      const rewardsApy =
        calculateApy(stakingTokenPrice, rewardsPrice.value, stakingRewardsContract.rewardRate.simple, stakingRewardsContract.totalSupply) ??
        0

      const platformApy =
        calculateApy(
          stakingTokenPrice,
          platformRewardsPrice.value,
          stakingRewardsContract.platformRewards?.platformRewardRate.simple,
          stakingRewardsContract.totalSupply,
        ) ?? 0

      const yieldEntry = isSave
        ? {
            id: 'yieldRewards',
            name: 'yield',
            apy: massetState.savingsContracts.v2.dailyAPY,
            apyTip: 'This APY is derived from internal swap fees and lending markets, and is not reflective of future rates.',
            stakeLabel: 'Deposit stablecoins',
            balance: unstakedBalance.mulTruncate(exchangeRate.exact),
            tokens: [],
            amounts: [],
            priority: true,
          }
        : undefined

      const rewardsEntry = {
        id: 'rewards',
        name: 'rewards',
        apy: rewardsApy,
        apyTip: 'This APY is derived from currently available staking rewards, and is not reflective of future rates.',
        stakeLabel: 'Stake',
        balance: stakedBalance.mulTruncate(exchangeRate.exact),
        tokens: [stakingRewardsContract.rewardsToken.symbol],
        amounts: [stakingRewardsContract.totalStakingRewards],
      }

      const platformRewardsEntry = stakingRewardsContract.platformRewards?.platformToken
        ? {
            ...rewardsEntry,
            id: 'platformRewards',
            apy: platformApy,
            tokens: [stakingRewardsContract.platformRewards.platformToken.symbol],
            amounts: [stakingRewardsContract.platformRewards.totalPlatformRewards],
          }
        : undefined

      const combinedRewardsEntry =
        rewardsEntry || platformRewardsEntry
          ? {
              ...(rewardsEntry || platformRewardsEntry),
              id: 'combinedRewards',
              apy: (rewardsApy ?? 0) + (platformApy ?? 0),
              priority: true,
              tokens: [...rewardsEntry?.tokens, ...(platformRewardsEntry?.tokens ?? [])].filter(Boolean),
              amounts: [...rewardsEntry?.amounts, ...(platformRewardsEntry?.amounts ?? [])].filter(Boolean),
            }
          : undefined

      const rewards = [yieldEntry, rewardsEntry, platformRewardsEntry, combinedRewardsEntry].filter(
        Boolean,
      ) as StakingRewardsExtended['rewards']

      return {
        stakingRewardsContract,
        rewards,
        stakedBalance,
        unstakedBalance,
        hasStakedBalance: stakedBalance.exact.gt(0),
        hasUnstakedBalance: unstakedBalance.exact.gt(0),
      }
    }, [stakingRewardsContract, massetState, stakingToken, platformRewardsPrice.value, rewardsPrice.value])

    return providerFactory(context, { value }, children)
  }

  return [createUseContextFn(context), StakingRewardsProvider, context] as const
}
