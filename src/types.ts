import { BigNumber } from 'ethers';

import {
  ERC20,
  BoostedSavingsVault,
  ISavingsContractV2,
  Masset,
} from '@mstable/protocol/types/generated';

import {
  CurveDeposit,
  MerkleDrop,
  MusdGauge,
  RewardsDistributor,
  StakingRewards,
  StakingRewardsWithPlatformToken,
  UniswapRouter02,
  LegacyMasset,
  SaveWrapper,
  SaveWrapperV2,
  TokenMinter,
} from './typechain';

import { BigDecimal } from './web3/BigDecimal';

export type MassetName = 'musd' | 'mbtc';

export interface Purpose {
  present: string;
  past: string;
}

/* eslint-disable @typescript-eslint/no-shadow */
export enum Interfaces {
  LegacyMasset,
  Masset,
  ERC20,
  SavingsContract,
  StakingRewards,
  StakingRewardsWithPlatformToken,
  RewardsDistibutor,
  MerkleDrop,
  CurveGauge,
  CurveTokenMinter,
  CurveDeposit,
  SaveWrapper,
  SaveWrapperV2,
  BoostedSavingsVault,
  UniswapRouter02,
}
/* eslint-enable @typescript-eslint/no-shadow */

export interface Instances {
  [Interfaces.LegacyMasset]: LegacyMasset;
  [Interfaces.Masset]: Masset;
  [Interfaces.ERC20]: ERC20;
  [Interfaces.SavingsContract]: ISavingsContractV2;
  [Interfaces.StakingRewards]: StakingRewards;
  [Interfaces.StakingRewardsWithPlatformToken]: StakingRewardsWithPlatformToken;
  [Interfaces.RewardsDistibutor]: RewardsDistributor;
  [Interfaces.MerkleDrop]: MerkleDrop;
  [Interfaces.CurveGauge]: MusdGauge;
  [Interfaces.CurveTokenMinter]: TokenMinter;
  [Interfaces.CurveDeposit]: CurveDeposit;
  [Interfaces.SaveWrapper]: SaveWrapper;
  [Interfaces.SaveWrapperV2]: SaveWrapperV2;
  [Interfaces.BoostedSavingsVault]: BoostedSavingsVault;
  [Interfaces.UniswapRouter02]: UniswapRouter02;
}

export interface Token {
  address: string;
  decimals: number;
  symbol: string;
  totalSupply: BigDecimal;
  price?: BigDecimal;
}

export interface Allowances {
  [spender: string]: BigDecimal;
}

export interface SubscribedToken extends Token {
  balance: BigDecimal;
  allowances: Allowances;
}

/**
 * @deprecated
 */
export interface Amount {
  simple: number | null;
  exact: BigNumber | null;
}

/**
 * @deprecated
 */
export interface TokenQuantityV1 {
  formValue?: string;
  amount: Amount;
  token: {
    address: string | null;
    decimals: number | null;
    symbol: string | null;
  };
}

export enum Platforms {
  Balancer = 'Balancer',
  Uniswap = 'Uniswap',
  Curve = 'Curve',
  Cream = 'Cream',
  Sushi = 'Sushi',
  Badger = 'Badger',
}

export interface BlockTimestamp {
  blockNumber: number;
  timestamp: number;
}

export interface AccentColors {
  light: string;
  accent: string;
  base: string;
  text: string;
}

export enum Fields {
  Input = 'input',
  Output = 'output',
}

export interface TransactionOption {
  address?: string;
  balance?: BigDecimal;
  symbol?: string;
  label?: string;
  custom?: boolean;
}
