import { BigNumber } from 'ethers/utils';

import { ISavingsContract } from './typechain/ISavingsContract.d';
import { SaveWrapper } from './typechain/SaveWrapper.d';
import { LegacyMasset } from './typechain/LegacyMasset';
import { MusdGauge } from './typechain/MusdGauge.d';
import { StakingRewards } from './typechain/StakingRewards.d';
import { StakingRewardsWithPlatformToken } from './typechain/StakingRewardsWithPlatformToken.d';
import { RewardsDistributor } from './typechain/RewardsDistributor.d';
import { MerkleDrop } from './typechain/MerkleDrop.d';
import { TokenMinter as CurveTokenMinter } from './typechain/TokenMinter.d';
import { CurveDeposit } from './typechain/CurveDeposit.d';
import { BoostedSavingsVault } from './typechain/BoostedSavingsVault.d';
import { Masset } from './typechain/Masset.d';
import { BigDecimal } from './web3/BigDecimal';
import { Erc20Detailed } from './typechain/Erc20Detailed';
import { UniswapRouter02 } from './typechain/UniswapRouter02';

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
  BoostedSavingsVault,
  UniswapRouter02,
}
/* eslint-enable @typescript-eslint/no-shadow */

export interface Instances {
  [Interfaces.LegacyMasset]: LegacyMasset;
  [Interfaces.Masset]: Masset;
  [Interfaces.ERC20]: Erc20Detailed;
  [Interfaces.SavingsContract]: ISavingsContract;
  [Interfaces.StakingRewards]: StakingRewards;
  [Interfaces.StakingRewardsWithPlatformToken]: StakingRewardsWithPlatformToken;
  [Interfaces.RewardsDistibutor]: RewardsDistributor;
  [Interfaces.MerkleDrop]: MerkleDrop;
  [Interfaces.CurveGauge]: MusdGauge;
  [Interfaces.CurveTokenMinter]: CurveTokenMinter;
  [Interfaces.CurveDeposit]: CurveDeposit;
  [Interfaces.SaveWrapper]: SaveWrapper;
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

export type TransactionOption = {
  address?: string;
  balance?: BigDecimal;
  symbol?: string;
  label?: string;
  custom?: boolean;
};
