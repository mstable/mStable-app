import type { FeederPool, Masset } from '@mstable/protocol/types/generated'
import { useEffect, useMemo } from 'react'
import { useDebounce } from 'react-use'
import { BigNumber } from 'ethers'

import { useSelectedMassetName } from '../context/SelectedMassetNameProvider'
import { getPriceImpact, inputValueLow, PriceImpact, useScaleAsset } from '../utils/ammUtils'
import { sanitizeMassetError } from '../utils/strings'
import { BigDecimal } from '../web3/BigDecimal'
import type { BigDecimalInputValues } from './useBigDecimalInputs'
import { FetchState, useFetchState } from './useFetchState'

type MintableContract = Masset | FeederPool

export enum Route {
  Mint = 'mint',
  Redeem = 'redeem',
}

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
 * This hook is designed for use with contracts that support mint & mintMulti, redeemExact
 */
export const useEstimatedOutputMulti = (contract?: MintableContract, inputValues?: BigDecimalInputValues, route?: Route): Output => {
  const [estimatedOutputRange, setEstimatedOutputRange] = useFetchState<{ low: BigDecimal; high: BigDecimal }>()
  const massetName = useSelectedMassetName()
  const { scaleAsset } = useScaleAsset()

  const priceImpact = useMemo<FetchState<PriceImpact>>(() => {
    if (estimatedOutputRange.fetching || !estimatedOutputRange?.value || !inputValues) return { fetching: true }

    const touched = Object.values(inputValues).filter(v => v.touched)
    if (!touched.length) return {}

    const totalInputLow = touched.map(() => inputValueLow[massetName]).reduce((a, b) => a.add(b))
    const scaledInputHigh = touched.map(({ address, amount }) => scaleAsset(address, amount ?? BigDecimal.ZERO)).reduce((a, b) => a.add(b))

    if (!scaledInputHigh.exact.gt(0)) return { fetching: true }

    const value = getPriceImpact({ low: totalInputLow, high: scaledInputHigh }, estimatedOutputRange?.value, route === Route.Redeem)

    return { value }
  }, [estimatedOutputRange, inputValues, scaleAsset, massetName, route])

  const [update] = useDebounce(
    () => {
      if (!inputValues || !contract) return

      const touched = Object.values(inputValues).filter(v => v.touched)
      if (!touched.length) return {}

      setEstimatedOutputRange.fetching()
      if (!route) return setEstimatedOutputRange.value()

      const addresses = touched.map(v => v.address)
      const scaledInputsLow = touched.map(({ address, decimals }) => scaleAsset(address, inputValueLow[massetName], decimals).exact)
      const amounts = touched.map(v => (v.amount as BigDecimal).exact)

      const paths = ((): Promise<BigNumber>[] => {
        switch (route) {
          case Route.Mint: {
            const outputLow = contract.getMintMultiOutput(addresses, scaledInputsLow)
            const outputHigh = contract.getMintMultiOutput(addresses, amounts)
            return [outputLow, outputHigh]
          }
          case Route.Redeem: {
            const outputLow = contract.getRedeemExactBassetsOutput(addresses, scaledInputsLow)
            const outputHigh = contract.getRedeemExactBassetsOutput(addresses, amounts)
            return [outputLow, outputHigh]
          }
          default:
            return []
        }
      })()

      Promise.all(paths)
        .then(data => {
          const [_low, _high] = data
          const low = new BigDecimal(_low)
          const high = new BigDecimal(_high)

          setEstimatedOutputRange.value({ low, high })
        })
        .catch((_error: Error): void => {
          setEstimatedOutputRange.error(sanitizeMassetError(_error))
        })
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
