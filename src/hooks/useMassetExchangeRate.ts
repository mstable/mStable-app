import { useMemo } from 'react'

import { useSelectedMassetState } from '../context/DataProvider/DataProvider'
import { useSelectedFeederPoolState } from '../components/pages/Pools/FeederPoolProvider'
import { BigDecimal } from '../web3/BigDecimal'

import type { MassetState } from '../context/DataProvider/types'
import type { FetchState } from './useFetchState'
import type { BigDecimalInputValue, BigDecimalInputValues } from './useBigDecimalInputs'

export const useExchangeRateForMassetInputs = (
  estimatedOutputAmount?: FetchState<BigDecimal>,
  inputValues?: BigDecimalInputValues,
): FetchState<BigDecimal> => {
  const massetState = useSelectedMassetState() as MassetState

  return useMemo(() => {
    if (!inputValues) return {}

    const touched = Object.values(inputValues).filter(v => v.touched)

    if (!touched.length) return {}
    if (estimatedOutputAmount?.error) return {}
    if (!estimatedOutputAmount?.value) return { fetching: true }

    // Scale asset via ratio
    const scaleAssetValue = (input: BigDecimalInputValue): BigDecimal => {
      const { address, amount } = input
      if (!amount) return BigDecimal.ZERO

      if (massetState.bAssets[address]) {
        const ratio = massetState.bassetRatios[address]
        return ratio ? amount.mulRatioTruncate(ratio) : amount
      }
      return amount
    }

    const totalAmount = Object.values(touched).reduce((prev, v) => prev.add(scaleAssetValue(v)), BigDecimal.ZERO)

    if (totalAmount) {
      if (estimatedOutputAmount.value.exact.eq(0) || totalAmount.exact.eq(0)) {
        return { error: 'Output amount must be greater than zero' }
      }

      const value = estimatedOutputAmount.value.divPrecisely(totalAmount)
      return { value }
    }

    return {}
  }, [estimatedOutputAmount, inputValues, massetState])
}

export const useExchangeRateForFPInputs = (
  poolAddress: string,
  estimatedOutputAmount?: FetchState<BigDecimal>,
  inputValues?: BigDecimalInputValues,
): FetchState<BigDecimal> => {
  const feederPool = useSelectedFeederPoolState()

  return useMemo(() => {
    if (!inputValues) return {}

    const touched = Object.values(inputValues).filter(v => v.touched)

    if (!touched.length) return {}
    if (estimatedOutputAmount?.error) return {}
    if (!estimatedOutputAmount?.value) return { fetching: true }

    // Scale asset via ratio
    const scaleAssetValue = (input: BigDecimalInputValue): BigDecimal => {
      const { amount } = input
      if (!amount) return BigDecimal.ZERO

      if (input.address === feederPool.masset.address) {
        // The mAsset amount is not scaled
        return amount
      }

      // The fAsset amount can be scaled
      return amount.mulRatioTruncate(feederPool.fasset.ratio)
    }

    const totalAmount = Object.values(touched).reduce((prev, v) => prev.add(scaleAssetValue(v)), BigDecimal.ZERO)

    if (totalAmount) {
      if (estimatedOutputAmount.value.exact.eq(0) || totalAmount.exact.eq(0)) {
        return { error: 'Output amount must be greater than zero' }
      }

      const value = estimatedOutputAmount.value.divPrecisely(totalAmount)
      return { value }
    }

    return {}
  }, [inputValues, estimatedOutputAmount, feederPool.masset.address, feederPool.fasset.ratio])
}
