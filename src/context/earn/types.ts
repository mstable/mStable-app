import { BigNumber } from 'ethers'

import { Platforms, Token } from '../../types'
import { BigDecimal } from '../../web3/BigDecimal'
import { StakingRewardsContractsQueryResult, StakingRewardsContractType } from '../../graphql/ecosystem'
import { PoolsQueryResult as BalancerPoolsQueryResult } from '../../graphql/balancer'
import { PairsQueryResult } from '../../graphql/uniswap'
import { CurveBalances } from './CurveProvider'

export type RawPoolData = NonNullable<BalancerPoolsQueryResult['data']>['pools'][number]

export type RawPairData = NonNullable<PairsQueryResult['data']>['pairs'][number]

export interface RawPlatformPools {
  [Platforms.Balancer]: RawPoolData[]
  [Platforms.Uniswap]: RawPairData[]
  [Platforms.Sushi]: RawPairData[]
}

export interface TokenPricesMap {
  [address: string]: BigDecimal
}

export interface NormalizedPoolsMap {
  [address: string]: NormalizedPool
}

export type RawStakingRewardsContracts = StakingRewardsContractsQueryResult['data']

export interface RawSyncedEarnData {
  tokenPrices: TokenPricesMap
  rawPlatformPools: RawPlatformPools
  merkleDrops: { merkleDrops: MerkleDropsMap; refresh(): void }
}

export interface SyncedEarnData {
  pools: NormalizedPoolsMap
  tokenPrices: TokenPricesMap
  merkleDrops: { merkleDrops: MerkleDropsMap; refresh(): void }
}

export interface RawEarnData {
  curveBalances: CurveBalances
  rawStakingRewardsContracts: RawStakingRewardsContracts
}

export type NormalizedPool = {
  address: string
  platform: Platforms
  onlyStablecoins: boolean
  tokens: (Token & {
    liquidity?: BigDecimal
    price?: BigDecimal
    ratio?: number
  })[]
  totalSupply?: BigDecimal
} & (
  | {
      // Uniswap
      reserveUSD: BigDecimal
    }
  | {
      // Balancer
      totalSwapVolume: BigDecimal
      swapFee: BigDecimal
    }
  | {}
)

export interface StakingRewardsContract {
  address: string
  earnUrl: string
  title: string
  curve?: {
    rewardsEarned?: BigDecimal
    platformRewardsEarned?: BigDecimal
  }
  pool: NormalizedPool
  duration: number
  lastUpdateTime: number
  periodFinish: number
  expired: boolean
  rewardRate: BigNumber
  rewardPerTokenStoredNow: BigNumber
  rewardsToken: Token & { price?: BigDecimal }
  stakingBalance: BigDecimal
  stakingBalancePercentage: BigDecimal
  stakingReward: { amount: BigDecimal; amountPerTokenPaid: BigDecimal }
  stakingToken: Token & { totalSupply: BigDecimal; price?: BigDecimal }
  totalSupply: BigDecimal
  totalStakingRewards: BigDecimal
  totalRemainingRewards: BigDecimal
  type: StakingRewardsContractType
  apy: {
    value?: BigDecimal
    yieldApy?: BigDecimal
    waitingForData: boolean
  }
  platformRewards?: {
    platformRewardPerTokenStoredNow: BigNumber
    platformRewardRate: BigNumber
    platformReward: { amount: BigDecimal; amountPerTokenPaid: BigDecimal }
    platformToken: Token & { price?: BigDecimal }
    totalPlatformRewards: BigDecimal
    totalRemainingPlatformRewards: BigDecimal
  }
}

export interface StakingRewardsContractsMap {
  [address: string]: StakingRewardsContract
}

export interface MerkleDrop {
  address: string
  token: Token
  totalUnclaimed: BigDecimal
  unclaimedTranches: {
    trancheNumber: number
    allocation: string
    proof: string[]
  }[]
}

export interface MerkleDropsMap {
  [address: string]: MerkleDrop
}

export interface EarnData {
  stakingRewardsContractsMap: StakingRewardsContractsMap
  tokenPricesMap: TokenPricesMap
  merkleDrops: { merkleDrops: MerkleDropsMap; refresh(): void }
}
