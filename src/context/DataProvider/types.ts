import { BigNumber } from 'ethers/utils';

import { BigDecimal } from '../../web3/BigDecimal';
import { SubscribedToken } from '../../types';

export enum BassetStatus {
  Default = 'Default',
  Normal = 'Normal',
  BrokenBelowPeg = 'BrokenBelowPeg',
  BrokenAbovePeg = 'BrokenAbovePeg',
  Blacklisted = 'Blacklisted',
  Liquidating = 'Liquidating',
  Liquidated = 'Liquidated',
  Failed = 'Failed',
}

export interface BassetState {
  address: string;
  balanceInMasset: BigDecimal;
  basketShare: BigDecimal;
  isTransferFeeCharged: boolean;
  maxWeight?: BigNumber;
  maxWeightInMasset?: BigDecimal;
  overweight: boolean;
  ratio: BigNumber;
  status: BassetStatus;
  totalVault: BigDecimal;
  totalVaultInMasset: BigDecimal;
  token: SubscribedToken;
}

export interface MassetState {
  address: string;
  allBassetsNormal: boolean;
  bAssets: { [address: string]: BassetState };
  removedBassets: { [address: string]: SubscribedToken };
  blacklistedBassets: string[];
  collateralisationRatio?: BigNumber;
  failed: boolean;
  feeRate: BigNumber;
  forgeValidator: string;
  overweightBassets: string[];
  redemptionFeeRate: BigNumber;
  token: SubscribedToken;
  undergoingRecol: boolean;
  savingsContracts: {
    v1?: Extract<SavingsContractState, { version: 1 }>;
    v2?: Extract<SavingsContractState, { version: 2 }>;
  };
}

export interface BoostedSavingsVaultAccountState {
  boostedBalance: BigDecimal;
  boostMultiplier: number;
  rawBalance: BigDecimal;
  lastAction: number;
  lastClaim: number;
  rewardCount: number;
  rewardPerTokenPaid: BigNumber;
  rewards: BigNumber;
  rewardEntries: {
    finish: number;
    start: number;
    index: number;
    rate: BigNumber;
  }[];
}

export interface BoostedSavingsVaultState {
  address: string;
  account?: BoostedSavingsVaultAccountState;
  lastUpdateTime: number;
  lockupDuration: number;
  periodDuration: number;
  periodFinish: number;
  rewardPerTokenStored: BigNumber;
  rewardRate: BigNumber;
  stakingContract: string;
  totalStakingRewards: BigDecimal;
  totalSupply: BigDecimal;
  unlockPercentage: BigNumber;
}

export type SavingsContractState = {
  active: boolean;
  current: boolean;
  address: string;
  massetAddress: string;
  latestExchangeRate?: {
    timestamp: number;
    rate: BigDecimal;
  };
  totalSavings: BigDecimal;
  dailyAPY: number;
  savingsBalance: {
    balance?: BigDecimal;
    credits?: BigDecimal;
  };
} & (
  | {
      version: 1;
      creditBalance?: BigDecimal;
      totalCredits: BigDecimal;
      massetAllowance: BigDecimal;
    }
  | {
      version: 2;
      token?: SubscribedToken;
      boostedSavingsVault?: BoostedSavingsVaultState;
    }
);

export interface DataState {
  musd?: MassetState;
  mbtc?: MassetState;
}
