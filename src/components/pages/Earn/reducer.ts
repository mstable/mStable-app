import { Reducer } from 'react'
import { pipeline } from 'ts-pipe-compose'

import { BigDecimal } from '../../../web3/BigDecimal'
import { Action, Actions, State } from './types'
import { validate } from './validate'

const reduce: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Data:
      return {
        ...state,
        stakingRewardsContract: action.payload.stakingRewardsContract,
        tokens: action.payload.tokens,
      }

    case Actions.SetActiveTab:
      return { ...state, activeTab: action.payload }

    case Actions.SetMaxStakeAmount: {
      if (!state.stakingRewardsContract) return state

      const {
        stakingRewardsContract: {
          stakingToken: { address: stakingTokenAddress },
        },
        tokens: { [stakingTokenAddress]: stakingToken },
      } = state

      if (!stakingToken?.balance) return state

      const amount = stakingToken.balance

      return {
        ...state,
        stake: {
          ...state.stake,
          touched: true,
          amount,
          formValue: amount.format(stakingToken.decimals, false),
        },
      }
    }

    case Actions.SetStakeAmount: {
      return {
        ...state,
        stake: {
          ...state.stake,
          touched: !!action.payload,
          amount: BigDecimal.maybeParse(action.payload, 18),
          formValue: action.payload,
        },
      }
    }

    case Actions.SetAddLiquidityAmount: {
      const collateralToken = state.addLiquidity.token ? state.tokens[state.addLiquidity.token] : undefined

      return {
        ...state,
        addLiquidity: {
          ...state.addLiquidity,
          touched: !!action.payload,
          amount: collateralToken ? BigDecimal.maybeParse(action.payload, collateralToken.decimals) : undefined,
          formValue: action.payload,
        },
      }
    }

    case Actions.SetAddLiquidityMaxAmount: {
      const {
        addLiquidity: { token },
        tokens,
      } = state

      const collateralToken = token ? tokens[token] : undefined

      if (!collateralToken?.balance) return state

      const amount = collateralToken.balance

      return {
        ...state,
        addLiquidity: {
          ...state.addLiquidity,
          touched: true,
          amount,
          formValue: amount.format(collateralToken.decimals, false),
        },
      }
    }

    case Actions.SetAddLiquidityToken: {
      const token = action.payload || undefined
      const collateralToken = token ? state.tokens[token] : undefined
      return {
        ...state,
        addLiquidity: {
          ...state.addLiquidity,
          token,
          touched: true,
          amount: collateralToken ? BigDecimal.maybeParse(state.addLiquidity.formValue, collateralToken.decimals) : undefined,
        },
      }
    }

    case Actions.SetWithdrawAmount: {
      return {
        ...state,
        exit: {
          ...state.exit,
          touched: !!action.payload,
          amount: BigDecimal.maybeParse(action.payload, 18),
          formValue: action.payload,
          isExiting: false,
        },
      }
    }

    case Actions.SetMaxWithdrawAmount: {
      if (!state.stakingRewardsContract) return state

      const {
        stakingRewardsContract: { stakingBalance },
      } = state

      if (!stakingBalance) return state

      return {
        ...state,
        exit: {
          ...state.exit,
          touched: true,
          amount: stakingBalance,
          formValue: stakingBalance.format(stakingBalance.decimals, false),
          isExiting: true,
        },
      }
    }

    default:
      throw new Error('Unhandled action type')
  }
}

export const reducer: Reducer<State, Action> = pipeline(reduce, validate)
