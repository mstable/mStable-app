import React, { FC, createContext, useContext, useMemo } from 'react'

import { SubscribedToken } from '../../types'
import { useTokenSubscription } from '../TokensProvider'
import { useRawEarnData } from './useRawEarnData'
import { useSyncedEarnData } from './useSyncedEarnData'
import { transformEarnData } from './transformEarnData'
import { EarnData, StakingRewardsContractsMap, StakingRewardsContract, TokenPricesMap, MerkleDropsMap } from './types'

const ctx = createContext<EarnData>({} as never)

export const EarnDataProvider: FC<{}> = ({ children }) => {
  // Data that we only want to get once per session:
  // - Staking rewards contract addresses
  // - Pool data from each platform
  // - Token prices for pool tokens, rewards tokens, and platform tokens
  // - Merkle drops
  const syncedEarnData = useSyncedEarnData()

  // Data that we subscribe to on each block:
  // - Staking rewards contracts
  // - Curve pool balances (if available)
  const rawEarnData = useRawEarnData()

  const earnData = useMemo(() => transformEarnData(syncedEarnData, rawEarnData), [syncedEarnData, rawEarnData])

  return <ctx.Provider value={earnData}>{children}</ctx.Provider>
}

export const useEarnData = (): EarnData => useContext(ctx)

export const useStakingRewardsContracts = (): StakingRewardsContractsMap => useEarnData().stakingRewardsContractsMap

export const useStakingRewardsContract = (address: string): StakingRewardsContract | undefined => useStakingRewardsContracts()[address]

export const useTokenPrices = (): TokenPricesMap => useEarnData().tokenPricesMap

export const useTokenWithPrice = (address?: string): SubscribedToken | undefined => {
  const tokenPricesMap = useTokenPrices()
  const token = useTokenSubscription(address)
  let price = address ? tokenPricesMap[address] : undefined

  // Map mock tokens to real tokens
  if (token?.symbol === 'MK-MTA') {
    price = tokenPricesMap['0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2']
  }
  if (token?.symbol === 'MK-BAL') {
    price = tokenPricesMap['0xba100000625a3754423978a60c9317c58a424e3d']
  }

  return token ? { ...token, price } : undefined
}

export const useRewardsToken = (address: string): SubscribedToken | undefined => {
  const stakingRewards = useStakingRewardsContract(address)
  return useTokenWithPrice(stakingRewards?.rewardsToken.address)
}

export const usePlatformToken = (address: string): SubscribedToken | undefined => {
  const stakingRewards = useStakingRewardsContract(address)
  return useTokenWithPrice(stakingRewards?.platformRewards?.platformToken.address)
}

export const useStakingToken = (address: string): SubscribedToken | undefined => {
  const stakingRewards = useStakingRewardsContract(address)
  return useTokenWithPrice(stakingRewards?.stakingToken.address)
}

export const useMerkleDrops = (): {
  merkleDrops: MerkleDropsMap
  refresh(): void
} => useEarnData().merkleDrops
