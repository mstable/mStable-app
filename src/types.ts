import type { ERC20, BoostedSavingsVault, ISavingsContractV2, Masset, FeederPool } from '@mstable/protocol/types/generated'

import type {
  CurveDeposit,
  MerkleDrop,
  MusdGauge,
  RewardsDistributor,
  StakingRewards,
  StakingRewardsWithPlatformToken,
  UniswapRouter02,
  SaveWrapper,
  TokenMinter,
  FeederWrapper,
} from './typechain'

import type { BigDecimal } from './web3/BigDecimal'

export type MassetName = 'musd' | 'mbtc'

export interface Purpose {
  present: string
  past: string
}

/* eslint-disable @typescript-eslint/no-shadow */
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
  SaveWrapper,
  BoostedSavingsVault,
  UniswapRouter02,
  FeederPool,
  FeederWrapper,
}
/* eslint-enable @typescript-eslint/no-shadow */

export interface Instances {
  [Interfaces.Masset]: Masset
  [Interfaces.ERC20]: ERC20
  [Interfaces.SavingsContract]: ISavingsContractV2
  [Interfaces.StakingRewards]: StakingRewards
  [Interfaces.StakingRewardsWithPlatformToken]: StakingRewardsWithPlatformToken
  [Interfaces.RewardsDistibutor]: RewardsDistributor
  [Interfaces.MerkleDrop]: MerkleDrop
  [Interfaces.CurveGauge]: MusdGauge
  [Interfaces.CurveTokenMinter]: TokenMinter
  [Interfaces.CurveDeposit]: CurveDeposit
  [Interfaces.SaveWrapper]: SaveWrapper
  [Interfaces.BoostedSavingsVault]: BoostedSavingsVault
  [Interfaces.UniswapRouter02]: UniswapRouter02
  [Interfaces.FeederPool]: FeederPool
  [Interfaces.FeederWrapper]: FeederWrapper
}

export interface Token {
  address: string
  decimals: number
  symbol: string
  name?: string
  totalSupply: BigDecimal
  price?: BigDecimal
}

export interface Allowances {
  [spender: string]: BigDecimal
}

export interface SubscribedToken extends Token {
  balance: BigDecimal
  allowances: Allowances
}

export enum Platforms {
  Balancer = 'Balancer',
  Uniswap = 'Uniswap',
  Curve = 'Curve',
  Cream = 'Cream',
  Sushi = 'Sushi',
  Badger = 'Badger',
}

export interface AccentColors {
  light: string
  accent: string
  base: string
  text: string
}

export enum Fields {
  Input = 'input',
  Output = 'output',
}

export interface AddressOption {
  address: string
  balance?: BigDecimal
  symbol?: string
  label?: string
  custom?: boolean
  tip?: string
}
