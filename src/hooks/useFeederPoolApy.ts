import { useSelectedMassetState } from '../context/DataProvider/DataProvider'
import { useTokenSubscription } from '../context/TokensProvider'
import { useNetworkAddresses } from '../context/NetworkProvider'

import { calculateBoost, getCoeffs, MAX_BOOST } from '../utils/boost'
import { calculateApy } from '../utils/calculateApy'
import { useSelectedMassetPrice } from './usePrice'
import { FetchState } from './useFetchState'
import { useFetchPriceCtx } from '../context'
import { BoostedCombinedAPY } from '../types'

export const useFeederPoolApy = (poolAddress: string): FetchState<BoostedCombinedAPY> => {
  const massetState = useSelectedMassetState()
  const massetPrice = useSelectedMassetPrice()
  const useFetchPrice = useFetchPriceCtx()
  const networkAddresses = useNetworkAddresses()
  const vMta = useTokenSubscription(networkAddresses?.vMTA)

  const pool = massetState?.feederPools[poolAddress]
  const vault = pool?.vault
  const rewardsTokenPrice = useFetchPrice(vault?.rewardsToken.address)
  const platformTokenPrice = useFetchPrice(vault?.platformRewardsToken?.address)

  if (!pool || !vault || !massetPrice || rewardsTokenPrice.fetching) return { fetching: true }

  const rewardRateSimple = parseInt(vault.rewardRate.toString()) / 1e18

  if (rewardRateSimple.toString() === '0') return { fetching: true }

  const stakingTokenPrice = pool.price.simple * massetPrice

  const base = calculateApy(stakingTokenPrice, rewardsTokenPrice.value, rewardRateSimple, vault.totalSupply) as number
  const basePlatform = calculateApy(stakingTokenPrice, platformTokenPrice.value, rewardRateSimple, vault.totalSupply)

  const maxBoost = MAX_BOOST * base

  let userBoost = base
  let userBoostPlatform = basePlatform

  const coeffs = getCoeffs(vault)
  if (vault.account && vMta && coeffs) {
    const boost = calculateBoost(...coeffs, vault.account.rawBalance, vMta.balance)

    if (boost) {
      const boostedRewardRate = rewardRateSimple * boost

      userBoost = calculateApy(stakingTokenPrice, rewardsTokenPrice.value, boostedRewardRate, vault.totalSupply) as number

      if (vault.platformRewardRate) {
        const platformRewardRateSimple = parseInt(vault.platformRewardRate.toString()) / 1e18
        const boostedPlatformRewardRate = platformRewardRateSimple * boost
        userBoostPlatform = calculateApy(
          stakingTokenPrice,
          platformTokenPrice.value,
          boostedPlatformRewardRate,
          vault.totalSupply,
        ) as number
      }
    }
  }

  const rewards = { base, userBoost, maxBoost }
  let combined = rewards

  let platformRewards
  if (basePlatform) {
    platformRewards = { base: basePlatform, userBoost: userBoostPlatform as number, maxBoost: MAX_BOOST * basePlatform }
    combined = {
      userBoost: rewards.userBoost + platformRewards.userBoost,
      maxBoost: rewards.maxBoost + platformRewards.maxBoost,
      base: rewards.base + platformRewards.base,
    }
  }

  return {
    value: { rewards, platformRewards, combined },
  }
}
