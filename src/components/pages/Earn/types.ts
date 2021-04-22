import { BigDecimal } from '../../../web3/BigDecimal'
import { Tokens } from '../../../context/TokensProvider'
import { StakingRewardsContract } from '../../../context/earn/types'
import { AccentColors, Token } from '../../../types'

export interface PlatformMetadata {
  colors: AccentColors
  name: string
  getPlatformLink(stakingRewardsContract: StakingRewardsContract): string
  slug: string
}

export enum Tabs {
  AddLiquidity = 'addLiquidity',
  Stake = 'stake',
  Claim = 'claim',
  Exit = 'exit',
}

export interface State {
  stakingRewardsContract?: StakingRewardsContract
  activeTab: Tabs
  tokens: Tokens
  claim: {
    touched: boolean
  }
  addLiquidity: {
    amount?: BigDecimal
    formValue?: string
    needsUnlock: boolean
    error?: string
    valid: boolean
    token?: string
    touched: boolean
  }
  stake: {
    amount?: BigDecimal
    formValue?: string
    needsUnlock: boolean
    error?: string
    valid: boolean
    touched: boolean
  }
  exit: {
    amount?: BigDecimal
    formValue?: string
    error?: string
    valid: boolean
    touched: boolean
    isExiting: boolean
  }
}

export interface Dispatch {
  setActiveTab(tab: Tabs): void
  setStakeAmount(formValue?: string): void
  setMaxStakeAmount(): void
  setWithdrawAmount(formValue?: string): void
  setMaxWithdrawAmount(): void
  setAddLiquidityToken(name: string, token?: Token): void
  setAddLiquidityAmount(formValue?: string): void
  setAddLiquidityMaxAmount(): void
}

export enum Actions {
  Data,
  SetActiveTab,
  SetAddLiquidityAmount,
  SetAddLiquidityMaxAmount,
  SetAddLiquidityToken,
  SetStakeAmount,
  SetStakeToken,
  SetMaxStakeAmount,
  SetWithdrawAmount,
  SetMaxWithdrawAmount,
}

export type Action =
  | {
      type: Actions.Data
      payload: {
        stakingRewardsContract?: StakingRewardsContract
        tokens: Tokens
      }
    }
  | { type: Actions.SetActiveTab; payload: Tabs }
  | { type: Actions.SetStakeAmount; payload?: string }
  | { type: Actions.SetMaxStakeAmount }
  | { type: Actions.SetWithdrawAmount; payload?: string }
  | { type: Actions.SetMaxWithdrawAmount }
  | { type: Actions.SetAddLiquidityToken; payload?: string }
  | { type: Actions.SetAddLiquidityAmount; payload?: string }
  | { type: Actions.SetAddLiquidityMaxAmount }

export enum Reasons {
  AmountExceedsApprovedAmount,
  AmountExceedsBalance,
  AmountMustBeGreaterThanZero,
  AmountMustBeSet,
  FetchingData,
}

export interface RewardsEarned {
  rewards?: BigDecimal
  rewardsUsd?: BigDecimal
  platformRewards?: BigDecimal
  platformRewardsUsd?: BigDecimal
}
