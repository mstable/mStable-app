import type { FeederPool, Masset } from '@mstable/protocol/types/generated'
import { useEffect, useMemo } from 'react'
import { useDebounce } from 'react-use'
import { BigNumber } from 'ethers'

import { useSelectedMassetConfig } from '../context/MassetProvider'
import { getPriceImpact, PriceImpact } from '../utils/ammUtils'
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
export const useEstimatedOutputMulti = (
  contract?: MintableContract,
  inputValues?: BigDecimalInputValues,
  lpPriceAdjustment?: { price: BigDecimal; isInput: boolean },
  route?: Route,
): Output => {
  const [estimatedOutputRange, setEstimatedOutputRange] = useFetchState<[BigDecimal, BigDecimal]>()
  const massetConfig = useSelectedMassetConfig()

  const touched = Object.values(inputValues ?? {}).filter(v => v.touched)

  const priceImpact = useMemo<FetchState<PriceImpact>>(() => {
    if (estimatedOutputRange.fetching || !estimatedOutputRange.value) return { fetching: true }

    if (!touched.length) return {}

    const totalInputLow = touched.reduce(prev => prev.add(massetConfig.lowInputValue), BigDecimal.ZERO)
    const scaledInputHigh = touched.reduce((prev, v) => (v.amount ? prev.add(v.amount.scale()) : prev), BigDecimal.ZERO)

    if (!scaledInputHigh.exact.gt(0)) return { fetching: true }

    const value = getPriceImpact([totalInputLow, scaledInputHigh], estimatedOutputRange.value, lpPriceAdjustment, route === Route.Redeem)

    return { value }
  }, [estimatedOutputRange.fetching, estimatedOutputRange.value, touched, route, lpPriceAdjustment, massetConfig.lowInputValue])

  const [update] = useDebounce(
    () => {
      if (!contract || !touched.length) return {}

      setEstimatedOutputRange.fetching()
      if (!route) return setEstimatedOutputRange.value()

      const addresses = touched.map(v => v.address)
      const scaledInputsLow = touched.map(({ decimals }) => massetConfig.lowInputValue.scale(decimals).exact)
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
          setEstimatedOutputRange.value([low, high])
        })
        .catch((_error: Error): void => {
          setEstimatedOutputRange.error(sanitizeMassetError(_error))
        })
    },
    2500,
    [contract, inputValues],
  )

  useEffect(() => {
    if (contract) {
      if (touched.length) {
        setEstimatedOutputRange.fetching()
        update()
      } else {
        setEstimatedOutputRange.value()
      }
    }
  }, [contract, setEstimatedOutputRange, touched.length, update])

  return useMemo(
    () => ({
      estimatedOutputAmount: {
        fetching: estimatedOutputRange.fetching,
        error: estimatedOutputRange.error,
        value: estimatedOutputRange.value?.[1],
      },
      priceImpact,
    }),
    [estimatedOutputRange, priceImpact],
  )
}
