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
  maxWeight: BigNumber;
  maxWeightInMasset: BigDecimal;
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
  collateralisationRatio: BigNumber;
  failed: boolean;
  feeRate: BigNumber;
  overweightBassets: string[];
  redemptionFeeRate: BigNumber;
  token: SubscribedToken;
  undergoingRecol: boolean;
  savingsContracts: {
    v1?: Extract<SavingsContractState, { version: 1 }>;
    v2?: Extract<SavingsContractState, { version: 2 }>;
  };
}

export type SavingsContractState = {
  address: string;
  massetAddress: string;
  automationEnabled: boolean;
  latestExchangeRate?: {
    timestamp: number;
    rate: BigDecimal;
  };
  totalSavings: BigDecimal;
  dailyAPY: number;
} & (
  | {
      version: 1;
      creditBalance?: BigDecimal;
      totalCredits: BigDecimal;
      mAssetAllowance: BigDecimal;
      savingsBalance: {
        balance?: BigDecimal;
        credits?: BigDecimal;
      };
    }
  | {
      version: 2;
      token?: SubscribedToken;
      savingsBalance: {
        balance?: BigDecimal;
        credits?: BigDecimal;
      };
    }
);

export interface DataState {
  mUSD?: MassetState;
  mBTC?: MassetState;
}
