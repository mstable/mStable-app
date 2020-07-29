import { BigNumber } from 'ethers/utils';
import { BlockTimestamp, Platforms, Token } from '../../types';
import { BigDecimal } from '../../web3/BigDecimal';
import {
  StakingRewardsContractsQueryResult,
  StakingRewardsContractType,
} from '../../graphql/mstable';
import { PoolsQueryResult, TokenPrice } from '../../graphql/balancer';
import { PairsQueryResult } from '../../graphql/uniswap';

export type RawPoolData = NonNullable<
  PoolsQueryResult['data']
>['pools'][number];

export type RawPairData = NonNullable<
  PairsQueryResult['data']
>['pairs'][number];

export interface RawPlatformPoolsData {
  [Platforms.Balancer]: RawPoolData[];
  [Platforms.Uniswap]: RawPairData[];
}

export interface TokenPricesMap {
  [address: string]: BigDecimal;
}

export interface NormalizedPoolsMap {
  [address: string]: NormalizedPool;
}

export type RawStakingRewardsContracts = NonNullable<
  StakingRewardsContractsQueryResult['data']
>['stakingRewardsContracts'];

export type RawTokenPrices = Pick<TokenPrice, 'decimals' | 'price' | 'id'>[];

export interface RawSyncedEarnData {
  block24hAgo?: BlockTimestamp;
  rawTokenPrices: RawTokenPrices;
  rawPlatformPoolsData: RawPlatformPoolsData;
  rawPlatformPoolsData24hAgo: RawPlatformPoolsData;
}

export interface SyncedEarnData {
  block24hAgo?: BlockTimestamp;
  normalizedPoolsMap: NormalizedPoolsMap;
  normalizedPoolsMap24hAgo: NormalizedPoolsMap;
  tokenPricesMap: TokenPricesMap;
}

export interface RawEarnData {
  block24hAgo?: BlockTimestamp;
  rawStakingRewardsContracts: RawStakingRewardsContracts;
  rawStakingRewardsContracts24hAgo: Pick<
    RawStakingRewardsContracts[number],
    'id' | 'rewardPerTokenStored' | 'platformRewardPerTokenStored'
  >[];
}

export interface NormalizedPool {
  address: string;
  platform: Platforms;
  tokens: (Token & { liquidity: BigDecimal; price?: BigDecimal })[];
  [Platforms.Uniswap]?: { totalSupply: BigDecimal; reserveUSD: BigDecimal };
  [Platforms.Balancer]?: {
    totalShares: BigDecimal;
    totalSwapVolume: BigDecimal;
    swapFee: BigDecimal;
  };
}

export interface StakingRewardsContract {
  address: string;
  earnUrl: string;
  title: string;
  pool: NormalizedPool;
  pool24hAgo: NormalizedPool;
  duration: number;
  lastUpdateTime: number;
  periodFinish: number;
  rewardRate: BigNumber;
  rewardPerTokenStoredNow: BigNumber;
  rewardPerTokenStored24hAgo: BigNumber;
  rewardsToken: Token & { price?: BigDecimal };
  stakingBalance: BigDecimal;
  stakingReward: { amount: BigDecimal; amountPerTokenPaid: BigDecimal };
  stakingToken: Token & { totalSupply: BigDecimal; price?: BigDecimal };
  totalSupply: BigDecimal;
  totalStakingRewards: BigDecimal;
  totalRemainingRewards: BigDecimal;
  type: StakingRewardsContractType;
  stakingTokenApy?: BigDecimal;
  combinedRewardsTokensApy?: BigDecimal;
  platformRewards?: {
    platformRewardPerTokenStoredNow: BigNumber;
    platformRewardPerTokenStored24hAgo: BigNumber;
    platformRewardRate: BigNumber;
    platformReward: { amount: BigDecimal; amountPerTokenPaid: BigDecimal };
    platformToken: Token & { price?: BigDecimal };
    totalPlatformRewards: BigDecimal;
    totalRemainingPlatformRewards: BigDecimal;
  };
}

export interface StakingRewardsContractsMap {
  [address: string]: StakingRewardsContract;
}

export interface EarnData {
  block24hAgo?: BlockTimestamp;
  stakingRewardsContractsMap: StakingRewardsContractsMap;
  tokenPricesMap: TokenPricesMap;
}
