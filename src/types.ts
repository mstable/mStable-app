import { BigNumber } from 'ethers/utils';

import { ISavingsContract } from './typechain/ISavingsContract.d';
import { IMasset } from './typechain/IMasset.d';
import { MusdGauge } from './typechain/MusdGauge.d';
import { StakingRewards as IStakingRewards } from './typechain/StakingRewards.d';
import { StakingRewardsWithPlatformToken as IStakingRewardsWithPlatformToken } from './typechain/StakingRewardsWithPlatformToken.d';
import { RewardsDistributor as IRewardsDistributor } from './typechain/RewardsDistributor.d';
import { MerkleDrop as IMerkleDrop } from './typechain/MerkleDrop.d';
import { TokenMinter as ICurveTokenMinter } from './typechain/TokenMinter.d';
import { CurveDeposit as ICurveDeposit } from './typechain/CurveDeposit.d';
import { BigDecimal } from './web3/BigDecimal';
import { Erc20Detailed } from './typechain/Erc20Detailed';

export type MassetName = 'mUSD' | 'mBTC';

export interface Purpose {
  present: string;
  past: string;
}

export enum Interfaces {
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
}

export interface Instances {
  [Interfaces.Masset]: IMasset;
  [Interfaces.ERC20]: Erc20Detailed;
  [Interfaces.SavingsContract]: ISavingsContract;
  [Interfaces.StakingRewards]: IStakingRewards;
  [Interfaces.StakingRewardsWithPlatformToken]: IStakingRewardsWithPlatformToken;
  [Interfaces.RewardsDistibutor]: IRewardsDistributor;
  [Interfaces.MerkleDrop]: IMerkleDrop;
  [Interfaces.CurveGauge]: MusdGauge;
  [Interfaces.CurveTokenMinter]: ICurveTokenMinter;
  [Interfaces.CurveDeposit]: ICurveDeposit;
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

export interface Amount {
  simple: number | null;
  exact: BigNumber | null;
}

export interface TokenQuantity {
  formValue: string | null;
  amount: Amount;
  token: {
    address: string | null;
    decimals: number | null;
    symbol: string | null;
  };
}

export interface TokenQuantityV2 {
  formValue: string | null;
  amount: BigDecimal | null;
  token?: SubscribedToken;
  needsUnlock?: boolean;
}

export interface Connector {
  id: string;
  subType?: string;
  label: string;
}

export enum Platforms {
  Balancer = 'Balancer',
  Uniswap = 'Uniswap',
  Curve = 'Curve',
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
