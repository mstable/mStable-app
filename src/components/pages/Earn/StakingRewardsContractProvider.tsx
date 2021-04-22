import React, { createContext, FC, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import useInterval from 'react-use/lib/useInterval'
import { StakingRewards__factory } from '../../../typechain'
import type { StakingRewards } from '../../../typechain/StakingRewards.d'
import type { SubscribedToken } from '../../../types'

import { SCALE } from '../../../constants'
import { useSigner } from '../../../context/AccountProvider'
import { useTokensState } from '../../../context/TokensProvider'
import { useStakingRewardsContract, useTokenWithPrice } from '../../../context/earn/EarnDataProvider'

import { Actions, Dispatch, RewardsEarned, State, Tabs } from './types'
import { reducer } from './reducer'

interface Props {
  address: string
}

const initialState: State = {
  activeTab: Tabs.Stake,
  tokens: {},
  addLiquidity: {
    valid: false,
    touched: false,
    needsUnlock: false,
  },
  claim: {
    touched: false,
  },
  stake: {
    valid: false,
    touched: false,
    needsUnlock: false,
  },
  exit: {
    valid: false,
    touched: false,
    isExiting: false,
  },
}

const initializer = (address: string): State =>
  address === '0xe6e6e25efda5f69687aa9914f8d750c523a1d261' // Curve MTA staking rewards
    ? { ...initialState, activeTab: Tabs.AddLiquidity }
    : initialState

const dispatchCtx = createContext<Dispatch>({} as never)

const stateCtx = createContext<State>({} as never)

const rewardsEarnedCtx = createContext<RewardsEarned>({})

const contractCtx = createContext<StakingRewards | undefined>(undefined)

export const useStakingRewardsContractState = (): State => useContext(stateCtx)

export const useStakingRewardContractDispatch = (): Dispatch => useContext(dispatchCtx)

export const useCurrentStakingRewardsContractCtx = (): StakingRewards | undefined => useContext(contractCtx)

export const useRewardsEarned = (): RewardsEarned => useContext(rewardsEarnedCtx)

export const useCurrentStakingRewardsContract = (): State['stakingRewardsContract'] =>
  useStakingRewardsContractState().stakingRewardsContract

export const useCurrentRewardsToken = (): SubscribedToken | undefined => {
  const stakingRewards = useCurrentStakingRewardsContract()
  return useTokenWithPrice(stakingRewards?.rewardsToken.address)
}

export const useCurrentPlatformToken = (): SubscribedToken | undefined => {
  const stakingRewards = useCurrentStakingRewardsContract()
  return useTokenWithPrice(stakingRewards?.platformRewards?.platformToken.address)
}

export const useCurrentStakingToken = (): SubscribedToken | undefined => {
  const stakingRewards = useCurrentStakingRewardsContract()
  return useTokenWithPrice(stakingRewards?.stakingToken.address)
}

const useRewardsEarnedInterval = (): RewardsEarned => {
  const [value, setValue] = useState<ReturnType<typeof useRewardsEarnedInterval>>({})
  const stakingRewardsContract = useCurrentStakingRewardsContract()
  const rewardsToken = useCurrentRewardsToken()

  useInterval(() => {
    if (!stakingRewardsContract) {
      return setValue({})
    }

    const {
      curve,
      lastUpdateTime,
      periodFinish,
      platformRewards: { platformReward, platformRewardPerTokenStoredNow, platformRewardRate, platformToken } = {},
      rewardPerTokenStoredNow,
      rewardRate,
      stakingBalance,
      stakingReward,
      totalSupply: { exact: totalTokens },
    } = stakingRewardsContract

    if (curve) {
      return setValue({
        rewards: curve.rewardsEarned,
        rewardsUsd: curve.rewardsEarned && rewardsToken?.price ? curve.rewardsEarned.mulTruncate(rewardsToken.price.exact) : undefined,
        platformRewards: curve.platformRewardsEarned,
        platformRewardsUsd:
          curve.platformRewardsEarned && platformToken?.price
            ? curve.platformRewardsEarned.mulTruncate(platformToken.price.exact)
            : undefined,
      })
    }

    const rewardPerToken = (() => {
      if (totalTokens.eq(0)) {
        // If there is no StakingToken liquidity, avoid div(0)
        return { rewardPerTokenStoredNow, platformRewardPerTokenStoredNow }
      }

      const lastTimeRewardApplicable = Math.min(periodFinish, Math.floor(Date.now() / 1e3))

      const timeSinceLastUpdate = lastTimeRewardApplicable - lastUpdateTime

      // New reward units to distribute = rewardRate * timeSinceLastUpdate
      const rewardUnitsToDistribute = rewardRate.mul(timeSinceLastUpdate)
      const platformRewardUnitsToDistribute = platformRewardRate?.mul(timeSinceLastUpdate)

      // New reward units per token = (rewardUnitsToDistribute * 1e18) / totalTokens
      const unitsToDistributePerToken = rewardUnitsToDistribute.mul(SCALE).div(totalTokens)
      const platformUnitsToDistributePerToken = platformRewardUnitsToDistribute?.mul(SCALE).div(totalTokens)

      return {
        rewardPerTokenStoredNow: rewardPerTokenStoredNow.add(unitsToDistributePerToken),
        platformRewardPerTokenStoredNow: platformRewardPerTokenStoredNow?.add(platformUnitsToDistributePerToken || 0),
      }
    })()

    // Current rate per token - rate user previously received
    const userRewardDelta = rewardPerToken.rewardPerTokenStoredNow.sub(stakingReward.amountPerTokenPaid.exact)
    const platformUserRewardDelta = rewardPerToken.platformRewardPerTokenStoredNow?.sub(platformReward?.amountPerTokenPaid.exact || 0)

    // New reward = staked tokens * difference in rate
    const userNewReward = stakingBalance.mulTruncate(userRewardDelta)
    const userNewPlatformReward = platformUserRewardDelta ? stakingBalance.mulTruncate(platformUserRewardDelta) : undefined

    // Add to previous rewards
    const summedRewards = stakingReward.amount.add(userNewReward)
    const summedPlatformRewards = userNewPlatformReward && platformReward ? platformReward.amount.add(userNewPlatformReward) : undefined

    return setValue({
      rewards: summedRewards,
      rewardsUsd: rewardsToken?.price ? summedRewards.mulTruncate(rewardsToken.price.exact) : undefined,
      platformRewards: summedPlatformRewards,
      platformRewardsUsd:
        summedPlatformRewards && platformToken?.price ? summedPlatformRewards.mulTruncate(platformToken.price.exact) : undefined,
    })
  }, 1e3)

  return value
}

const RewardsEarnedProvider: FC = ({ children }) => {
  const rewardsEarned = useRewardsEarnedInterval()
  return <rewardsEarnedCtx.Provider value={rewardsEarned}>{children}</rewardsEarnedCtx.Provider>
}

export const StakingRewardsContractProvider: FC<Props> = ({ children, address }) => {
  const [state, dispatch] = useReducer(reducer, address, initializer)

  const stakingRewardsContract = useStakingRewardsContract(address)

  const { tokens } = useTokensState()

  useEffect(() => {
    dispatch({
      type: Actions.Data,
      payload: { stakingRewardsContract, tokens },
    })
  }, [stakingRewardsContract, tokens, dispatch])

  const setActiveTab = useCallback<Dispatch['setActiveTab']>(
    tab => {
      dispatch({ type: Actions.SetActiveTab, payload: tab })
    },
    [dispatch],
  )

  const setStakeAmount = useCallback<Dispatch['setStakeAmount']>(
    amount => {
      dispatch({ type: Actions.SetStakeAmount, payload: amount })
    },
    [dispatch],
  )

  const setMaxStakeAmount = useCallback<Dispatch['setMaxStakeAmount']>(() => {
    dispatch({ type: Actions.SetMaxStakeAmount })
  }, [dispatch])

  const setWithdrawAmount = useCallback<Dispatch['setWithdrawAmount']>(
    amount => {
      dispatch({ type: Actions.SetWithdrawAmount, payload: amount })
    },
    [dispatch],
  )

  const setMaxWithdrawAmount = useCallback<Dispatch['setMaxWithdrawAmount']>(() => {
    dispatch({ type: Actions.SetMaxWithdrawAmount })
  }, [dispatch])

  const setAddLiquidityAmount = useCallback<Dispatch['setAddLiquidityAmount']>(
    amount => {
      dispatch({ type: Actions.SetAddLiquidityAmount, payload: amount })
    },
    [dispatch],
  )

  const setAddLiquidityToken = useCallback<Dispatch['setAddLiquidityToken']>(
    (_, token) => {
      dispatch({
        type: Actions.SetAddLiquidityToken,
        payload: token?.address,
      })
    },
    [dispatch],
  )

  const setAddLiquidityMaxAmount = useCallback<Dispatch['setAddLiquidityMaxAmount']>(() => {
    dispatch({ type: Actions.SetAddLiquidityMaxAmount })
  }, [dispatch])

  const signer = useSigner()

  const contract = useMemo(() => (signer ? StakingRewards__factory.connect(address, signer) : undefined), [address, signer])

  return (
    <dispatchCtx.Provider
      value={useMemo(
        () => ({
          setActiveTab,
          setMaxStakeAmount,
          setStakeAmount,
          setWithdrawAmount,
          setMaxWithdrawAmount,
          setAddLiquidityAmount,
          setAddLiquidityMaxAmount,
          setAddLiquidityToken,
        }),
        [
          setActiveTab,
          setMaxStakeAmount,
          setStakeAmount,
          setWithdrawAmount,
          setMaxWithdrawAmount,
          setAddLiquidityAmount,
          setAddLiquidityMaxAmount,
          setAddLiquidityToken,
        ],
      )}
    >
      <stateCtx.Provider value={state}>
        <contractCtx.Provider value={contract}>
          <RewardsEarnedProvider>{children}</RewardsEarnedProvider>
        </contractCtx.Provider>
      </stateCtx.Provider>
    </dispatchCtx.Provider>
  )
}
