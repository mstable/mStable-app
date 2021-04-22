import type { FeederPool, Masset } from '@mstable/protocol/types/generated'
import { useEffect } from 'react'
import { useDebounce } from 'react-use'
import type { BigDecimalInputValues } from './useBigDecimalInputs'

import { sanitizeMassetError } from '../utils/strings'
import { BigDecimal } from '../web3/BigDecimal'

import { FetchState, useFetchState } from './useFetchState'

type RedeemableContract = Pick<Masset | FeederPool, 'getRedeemExactBassetsOutput'>

/**
 * This hook is designed for use with contracts that support redeemExact
 */
export const useEstimatedRedeemOutput = (contract?: RedeemableContract, inputValues?: BigDecimalInputValues): FetchState<BigDecimal> => {
  const [estimatedOutputAmount, setEstimatedOutputAmount] = useFetchState<BigDecimal>()

  // Get the swap output with a throttle so it's not called too often
  const [update] = useDebounce(
    () => {
      if (!inputValues) return
      if (!contract) return setEstimatedOutputAmount.fetching()

      const touched = Object.values(inputValues).filter(v => v.touched)

      if (touched.length) {
        setEstimatedOutputAmount.fetching()

        const promise = (() => {
          const inputs = touched.map(v => v.address)
          const amounts = touched.map(v => (v.amount as BigDecimal).exact)
          return contract.getRedeemExactBassetsOutput(inputs, amounts)
        })()

        return promise
          .then(amount => {
            setEstimatedOutputAmount.value(new BigDecimal(amount))
          })
          .catch((_error: Error): void => {
            setEstimatedOutputAmount.error(sanitizeMassetError(_error))
          })
      }
      setEstimatedOutputAmount.value()
    },
    2500,
    [contract, inputValues],
  )

  useEffect(() => {
    if (contract && inputValues) {
      const touched = Object.values(inputValues).filter(v => v.touched)
      if (touched.length) {
        setEstimatedOutputAmount.fetching()
        update()
      } else {
        setEstimatedOutputAmount.value()
      }
    }
  }, [contract, inputValues, setEstimatedOutputAmount, update])

  return estimatedOutputAmount
}
