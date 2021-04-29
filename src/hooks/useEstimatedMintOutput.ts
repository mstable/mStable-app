import type { FeederPool, Masset } from '@mstable/protocol/types/generated'
import { useEffect, useMemo } from 'react'
import { useDebounce } from 'react-use'
import { useSelectedMassetName } from '../context/SelectedMassetNameProvider'
import { getPenaltyPercentage, inputValueLow, PriceImpact, useScaleAsset } from '../utils/ammUtils'

import { sanitizeMassetError } from '../utils/strings'
import { BigDecimal } from '../web3/BigDecimal'

import type { BigDecimalInputValues } from './useBigDecimalInputs'
import { FetchState, useFetchState } from './useFetchState'

type MintableContract = Masset | FeederPool

interface Output {
  estimatedOutputAmount: FetchState<BigDecimal>
  priceImpact: FetchState<PriceImpact>
}

/*
 * |--------------------------------------------------------|
 * | ROUTES                                                 |
 * | -------------------------------------------------------|
 * | Input    | Output | Function      | Tokens             |
 * | -------------------------------------------------------|
 * | bassets  | masset | masset mint   | bassets, 1 masset  |
 * | fassets  | lp     | lp mint       | 1 masset, 1 basset |
 * |--------------------------------------------------------|
 */

/**
 * This hook is designed for use with contracts that support mint & mintMulti
 */
export const useEstimatedMintOutput = (contract?: MintableContract, inputValues?: BigDecimalInputValues): Output => {
  const [estimatedOutputRange, setEstimatedOutputRange] = useFetchState<{ low: BigDecimal; high: BigDecimal }>()
  const massetName = useSelectedMassetName()
  const scaleAsset = useScaleAsset()

  const priceImpact = useMemo<FetchState<PriceImpact>>(() => {
    if (estimatedOutputRange.fetching || !estimatedOutputRange?.value || !inputValues) return { fetching: true }

    const touched = Object.values(inputValues).filter(v => v.touched)

    if (touched.length) {
      // 1
      if (touched.length === 1) {
        const [{ address, amount }] = touched
        const scaledInputValue = scaleAsset(address, amount ?? BigDecimal.ZERO)

        if (!scaledInputValue.exact.gt(0)) return { fetching: true }

        const startRate = estimatedOutputRange?.value?.low.divPrecisely(inputValueLow[massetName])?.simple
        const endRate = estimatedOutputRange?.value?.high.divPrecisely(scaledInputValue)?.simple

        const impactPercentage = (startRate - endRate) * 100
        const impactWarning = (impactPercentage ?? 0) > 0.1

        const distancePercentage = getPenaltyPercentage(amount, estimatedOutputRange.value.high, false)

        return {
          value: {
            distancePercentage,
            impactPercentage,
            impactWarning,
          },
        }
      }
      // many
    }

    // none

    return {
      error: 'err',
    }
  }, [estimatedOutputRange, inputValues, scaleAsset, massetName])

  const [update] = useDebounce(
    () => {
      if (!inputValues || !contract) return

      const touched = Object.values(inputValues).filter(v => v.touched)

      if (touched.length) {
        setEstimatedOutputRange.fetching()

        const outputs = (() => {
          if (touched.length === 1) {
            const [{ address, amount, decimals }] = touched

            const scaledInputLow = scaleAsset(address, inputValueLow[massetName], decimals)
            const outputLow = contract.getMintOutput(address, scaledInputLow.exact)
            const outputHigh = contract.getMintOutput(address, (amount as BigDecimal).exact)

            return [outputLow, outputHigh]
          }

          const inputs = touched.map(v => v.address)
          const amounts = touched.map(v => (v.amount as BigDecimal).exact)
          return [contract.getMintMultiOutput(inputs, amounts), contract.getMintMultiOutput(inputs, amounts)]
        })()

        Promise.all(outputs)
          .then(data => {
            const [_low, _high] = data
            const low = new BigDecimal(_low)
            const high = new BigDecimal(_high)

            setEstimatedOutputRange.value({
              low,
              high,
            })
          })
          .catch((_error: Error): void => {
            setEstimatedOutputRange.error(sanitizeMassetError(_error))
          })
      }
      setEstimatedOutputRange.value()
    },
    2500,
    [contract, inputValues],
  )

  useEffect(() => {
    if (contract && inputValues) {
      const touched = Object.values(inputValues).filter(v => v.touched)
      if (touched.length) {
        setEstimatedOutputRange.fetching()
        update()
      } else {
        setEstimatedOutputRange.value()
      }
    }
  }, [contract, inputValues, setEstimatedOutputRange, update])

  return {
    estimatedOutputAmount: {
      fetching: estimatedOutputRange?.fetching,
      error: estimatedOutputRange?.error,
      value: estimatedOutputRange?.value?.high,
    },
    priceImpact,
  }
}
