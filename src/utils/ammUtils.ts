import { useCallback } from 'react'
import { useSelectedMassetState } from '../context/DataProvider/DataProvider'
import { MassetState } from '../context/DataProvider/types'
import { useNetworkPrices } from '../context/NetworkProvider'
import { useSelectedMassetPrice } from '../hooks/usePrice'
import { MassetName } from '../types'
import { BigDecimal } from '../web3/BigDecimal'

const MIN_FACTOR = 0.996
const MAX_FACTOR = 1.004

export type PriceImpact = {
  distancePercentage?: number
  impactPercentage: number
  impactWarning: boolean
}

// ~ $1
export const inputValueLow: Record<MassetName, BigDecimal> = {
  musd: new BigDecimal((1e18).toString()),
  mbtc: new BigDecimal((1e18).toString()).divPrecisely(BigDecimal.parse('58000')), // rough approximation, just needs to be small
}

export const getBounds = (amount: number): { min: number; max: number } => {
  const min = amount * MIN_FACTOR
  const max = amount * MAX_FACTOR
  return { min, max }
}

/**
 * @deprecated
 */
export const getEstimatedOutput = (amount: number | undefined, slippage: number | undefined): number | undefined => {
  if (!amount || !slippage) return
  return amount / (1 - slippage / 100)
}

export const getPenaltyMessage = (amount: number | undefined): string | undefined => {
  if (!amount) return undefined

  const abs = Math.abs(amount).toFixed(4)
  return amount > 0 ? `There is a price bonus of +${abs}%` : `There is a price penalty of -${abs}%`
}

export const getPenaltyPercentage = (
  inputAmount?: BigDecimal,
  outputAmount?: BigDecimal, // min or max output
  reverse?: boolean,
): number | undefined => {
  if (!inputAmount || !outputAmount) return

  const { min, max } = getBounds(inputAmount.simple)
  if (!min || !max) return

  const output = outputAmount.simple
  const penalty = output / inputAmount.simple

  // if (output < min || output > max) {
  if (reverse) {
    return penalty > 1 ? (penalty - 1) * -100 : (1 - penalty) * 100
  }
  return penalty > 1 ? (penalty - 1) * 100 : (1 - penalty) * -100
  // }
}

// Scale asset via ratio
export const useScaleAsset = (): {
  scaleAsset: (address: string, amount: BigDecimal, decimals?: number) => BigDecimal
  scaleNetworkAsset: (amount: BigDecimal) => BigDecimal
} => {
  const massetState = useSelectedMassetState() as MassetState
  const networkPrices = useNetworkPrices()
  const nativeTokenPrice = networkPrices.value?.nativeToken
  const massetPrice = useSelectedMassetPrice()

  const { address: massetAddress, fAssets, bAssets } = massetState

  const scaleAsset = useCallback(
    (address: string, amount: BigDecimal, decimals?: number): BigDecimal => {
      if (!amount?.simple) return BigDecimal.ZERO

      // Find fasset address from feederpools
      const poolAddress = Object.keys(fAssets)
        .filter(a => fAssets[a].address !== massetAddress)
        .find(a => fAssets[a].address === address || fAssets[a].address === address || a === address)

      // Only bAsset/fAsset amounts are scaled
      if (address === massetAddress || address === poolAddress) return amount

      // Scale w/ ratio
      const ratio = bAssets[address]?.ratio ?? (poolAddress && fAssets[poolAddress].ratio)

      // shouldn't hit but better to have this can crash
      if (!ratio) return amount

      // scale from 18 down to user input
      if (decimals) return amount.divRatioPrecisely(ratio).setDecimals(decimals)

      // scale from input to 18
      return amount.mulRatioTruncate(ratio).setDecimals(18)
    },
    [bAssets, fAssets, massetAddress],
  )

  const scaleNetworkAsset = useCallback(
    (amount: BigDecimal): BigDecimal => {
      const nativeTokenPriceDecimal = BigDecimal.parse(nativeTokenPrice?.toFixed(10) ?? '')
      return amount.mulTruncate(nativeTokenPriceDecimal.exact).divPrecisely(BigDecimal.parse(massetPrice?.toFixed(10) ?? ''))
    },
    [massetPrice, nativeTokenPrice],
  )

  return {
    scaleAsset,
    scaleNetworkAsset,
  }
}

export const getPriceImpact = (
  inputValueRange: { low: BigDecimal; high: BigDecimal },
  estimatedOutputRange: { low: BigDecimal; high: BigDecimal },
): PriceImpact | undefined => {
  const startRate = estimatedOutputRange?.low.divPrecisely(inputValueRange.low)?.simple
  const endRate = estimatedOutputRange?.high.divPrecisely(inputValueRange.high)?.simple

  const impactPercentage = (startRate - endRate) * 100
  const impactWarning = (impactPercentage ?? 0) > 0.1
  const distancePercentage = getPenaltyPercentage(inputValueRange.high, estimatedOutputRange.high, false)

  return {
    distancePercentage,
    impactPercentage,
    impactWarning,
  }
}
