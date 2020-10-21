import { BigNumber } from 'ethers/utils';
import { BlockTimestamp, Platforms, Token } from '../../types';
import { BigDecimal } from '../../web3/BigDecimal';
import {
  StakingRewardsContractsQueryResult,
  StakingRewardsContractType,
} from '../../graphql/mstable';
import { PoolsQueryResult as BalancerPoolsQueryResult } from '../../graphql/balancer';
// import { PoolsQueryResult as CurvePoolsQueryResult } from '../../graphql/curve';
import { PairsQueryResult } from '../../graphql/uniswap';
import { CurveBalances, CurveJsonData } from './CurveProvider';

export type RawPoolData = NonNullable<
  BalancerPoolsQueryResult['data']
>['current'][number];

export type RawPairData = NonNullable<
  PairsQueryResult['data']
>['current'][number];

// export type RawCurvePoolsData = CurvePoolsQueryResult['data'];

export interface RawPlatformPools {
  [Platforms.Balancer]: { current: RawPoolData[]; historic: RawPoolData[] };
  [Platforms.Uniswap]: { current: RawPairData[]; historic: RawPairData[] };
  // [Platforms.Curve]: RawCurvePoolsData;
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
  merkleDrops: { merkleDrops: MerkleDropsMap; refresh(): void };
  curveJsonData?: CurveJsonData;
  // rawCurveData?: RawCurveData;
}

export interface SyncedEarnData {
  block24hAgo?: BlockTimestamp;
  pools: {
    current: NormalizedPoolsMap;
    historic: NormalizedPoolsMap;
  };
  tokenPrices: TokenPricesMap;
  merkleDrops: { merkleDrops: MerkleDropsMap; refresh(): void };
  curveJsonData?: CurveJsonData;
}

// export interface RawCurveData {
//   virtualPrice: BigNumber;
//   inflationRate: BigNumber;
//   relativeWeight: BigNumber;
//   workingSupply: BigNumber;
//   balance0: BigNumber;
//   balance1: BigNumber;
// }

export interface RawEarnData {
  block24hAgo?: BlockTimestamp;
  curveBalances: CurveBalances;
  rawStakingRewardsContracts: RawStakingRewardsContracts;
}

export type NormalizedPool = {
  address: string;
  platform: Platforms;
  onlyStablecoins: boolean;
  tokens: (Token & {
    liquidity?: BigDecimal;
    price?: BigDecimal;
    ratio?: number;
  })[];
  totalSupply?: BigDecimal;
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
  | {}
);

export interface CurvePool {
  address: string;
  platform: Platforms.Curve;
  onlyStablecoins: true;
  tokens: {}[];
}

export interface StakingRewardsContract {
  address: string;
  earnUrl: string;
  title: string;
  curve?: {
    rewardsEarned?: BigDecimal;
    platformRewardsEarned?: BigDecimal;
  };
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
    yieldApy?: BigDecimal;
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

export interface MerkleDrop {
  address: string;
  token: Token;
  totalUnclaimed: BigDecimal;
  unclaimedTranches: {
    trancheNumber: number;
    allocation: string;
    proof: string[];
  }[];
}

export interface MerkleDropsMap {
  [address: string]: MerkleDrop;
}

export interface EarnData {
  block24hAgo?: BlockTimestamp;
  stakingRewardsContractsMap: StakingRewardsContractsMap;
  tokenPricesMap: TokenPricesMap;
  merkleDrops: { merkleDrops: MerkleDropsMap; refresh(): void };
}
