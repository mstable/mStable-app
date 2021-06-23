import type { ERC20, BoostedSavingsVault, ISavingsContractV2, Masset, FeederPool, BoostDirector } from '@mstable/protocol/types/generated'

import type { UniswapRouter02, SaveWrapper, FeederWrapper, StakingRewardsDualV3FRAXIQ } from './typechain'

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
  SaveWrapper,
  UniswapRouter02,
  FeederPool,
  FeederWrapper,
  BoostedSavingsVault,
  BoostDirector,
  FraxStakingRewardsDual,
}

export interface Instances {
  [Interfaces.Masset]: Masset
  [Interfaces.ERC20]: ERC20
  [Interfaces.SavingsContract]: ISavingsContractV2
  [Interfaces.SaveWrapper]: SaveWrapper
  [Interfaces.UniswapRouter02]: UniswapRouter02
  [Interfaces.FeederPool]: FeederPool
  [Interfaces.FeederWrapper]: FeederWrapper
  [Interfaces.BoostedSavingsVault]: BoostedSavingsVault
  [Interfaces.BoostDirector]: BoostDirector
  [Interfaces.FraxStakingRewardsDual]: StakingRewardsDualV3FRAXIQ
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

export interface AddressOption {
  address: string
  balance?: BigDecimal
  symbol?: string
  label?: string
  custom?: boolean
  tip?: string
}
