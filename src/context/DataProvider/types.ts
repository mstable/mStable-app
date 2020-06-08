import { BigNumber } from 'ethers/utils';
import { BigDecimal } from '../../web3/BigDecimal';
import {
  CreditBalancesQueryResult,
  LatestExchangeRateQueryResult,
  MassetQueryResult,
  SavingsContractQueryResult,
} from '../../graphql/generated';
import { State as TokensState } from './TokensProvider';

export interface RawData {
  creditBalances?: NonNullable<
    NonNullable<CreditBalancesQueryResult['data']>['account']
  >['creditBalances'];
  latestExchangeRate?: NonNullable<
    LatestExchangeRateQueryResult['data']
  >['exchangeRates'][0];
  mAsset: NonNullable<NonNullable<MassetQueryResult['data']>['masset']>;
  savingsContract: NonNullable<
    SavingsContractQueryResult['data']
  >['savingsContracts'][0];
  tokens: TokensState;
}

export type PartialRawData = {
  creditBalances: RawData['creditBalances'];
  latestExchangeRate: RawData['latestExchangeRate'];
  mAsset?: RawData['mAsset'];
  savingsContract?: RawData['savingsContract'];
  tokens: RawData['tokens'];
};

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
  mAssetAllowance: BigDecimal;
  balance: BigDecimal;
  balanceInMasset: BigDecimal;
  decimals: number;
  basketShare: BigDecimal;
  isTransferFeeCharged: boolean;
  mAssetAddress: string;
  maxWeight: BigNumber;
  maxWeightInMasset: BigDecimal;
  overweight: boolean;
  ratio: BigNumber;
  status: BassetStatus;
  symbol: string;
  totalSupply: BigDecimal;
  totalVault: BigDecimal;
  totalVaultInMasset: BigDecimal;
  weightBreachThreshold: BigDecimal;
  weightBreached: boolean;
}

export interface MassetState {
  address: string;
  allBassetsNormal: boolean;
  balance: BigDecimal;
  collateralisationRatio: BigNumber;
  decimals: number;
  failed: boolean;
  feeRate: BigNumber;
  breachedBassets: string[];
  blacklistedBassets: string[];
  overweightBassets: string[];
  symbol: string;
  totalSupply: BigDecimal;
  undergoingRecol: boolean;
}

export interface SavingsContractState {
  address: string;
  automationEnabled: boolean;
  creditBalances: BigDecimal[];
  latestExchangeRate?: {
    timestamp: number;
    exchangeRate: BigDecimal;
  };
  mAssetAllowance: BigDecimal;
  savingsRate: BigDecimal;
  totalCredits: BigDecimal;
  totalSavings: BigDecimal;
  savingsBalance: {
    balance?: BigDecimal;
    credits?: BigDecimal;
  };
}

export interface DataState {
  mAsset: MassetState;
  savingsContract: SavingsContractState;
  bAssets: {
    [address: string]: BassetState;
  };
}
