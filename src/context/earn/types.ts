import { BigNumber } from 'ethers/utils';
import { BlockTimestamp, Platforms, Token } from '../../types';
import { BigDecimal } from '../../web3/BigDecimal';
import {
  StakingRewardsContractsQueryResult,
  StakingRewardsContractType,
} from '../../graphql/mstable';
import { PoolsQueryResult } from '../../graphql/balancer';
import { PairsQueryResult } from '../../graphql/uniswap';

export type RawPoolData = NonNullable<
  PoolsQueryResult['data']
>['current'][number];

export type RawPairData = NonNullable<
  PairsQueryResult['data']
>['current'][number];

export interface RawPlatformPools {
  [Platforms.Balancer]: { current: RawPoolData[]; historic: RawPoolData[] };
  [Platforms.Uniswap]: { current: RawPairData[]; historic: RawPairData[] };
}

export interface TokenPricesMap {
  [address: string]: BigDecimal;
}

export interface NormalizedPoolsMap {
  [address: string]: NormalizedPool;
}

export type RawStakingRewardsContracts = StakingRewardsContractsQueryResult['data'];

export interface RawSyncedEarnData {
  block24hAgo?: BlockTimestamp;
  tokenPrices: TokenPricesMap;
  rawPlatformPools: RawPlatformPools;
}

export interface SyncedEarnData {
  block24hAgo?: BlockTimestamp;
  pools: {
    current: NormalizedPoolsMap;
    historic: NormalizedPoolsMap;
  };
  tokenPrices: TokenPricesMap;
}

export interface RawEarnData {
  block24hAgo?: BlockTimestamp;
  rawStakingRewardsContracts: RawStakingRewardsContracts;
}

export type NormalizedPool = {
  address: string;
  platform: Platforms;
  onlyStablecoins: boolean;
  tokens: (Token & {
    liquidity: BigDecimal;
    price?: BigDecimal;
    ratio: number;
  })[];
  totalSupply: BigDecimal;
} & (
  | {
      // Uniswap
      reserveUSD: BigDecimal;
    }
  | {
      // Balancer
      totalSwapVolume: BigDecimal;
      swapFee: BigDecimal;
    }
);

export interface StakingRewardsContract {
  address: string;
  earnUrl: string;
  title: string;
  pool: NormalizedPool;
  pool24hAgo?: NormalizedPool;
  duration: number;
  lastUpdateTime: number;
  periodFinish: number;
  expired: boolean;
  rewardRate: BigNumber;
  rewardPerTokenStoredNow: BigNumber;
  rewardPerTokenStored24hAgo?: BigNumber;
  rewardsToken: Token & { price?: BigDecimal };
  stakingBalance: BigDecimal;
  stakingBalancePercentage: BigDecimal;
  stakingReward: { amount: BigDecimal; amountPerTokenPaid: BigDecimal };
  stakingToken: Token & { totalSupply: BigDecimal; price?: BigDecimal };
  totalSupply: BigDecimal;
  totalStakingRewards: BigDecimal;
  totalRemainingRewards: BigDecimal;
  type: StakingRewardsContractType;
  apy: {
    value?: BigDecimal;
    waitingForData: boolean;
  };
  platformRewards?: {
    platformRewardPerTokenStoredNow: BigNumber;
    platformRewardPerTokenStored24hAgo?: BigNumber;
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
