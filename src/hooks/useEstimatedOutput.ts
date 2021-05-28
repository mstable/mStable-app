import { useEffect, useMemo, useState } from 'react'
import { FeederPool, FeederPool__factory, Masset, Masset__factory } from '@mstable/protocol/types/generated'
import { usePrevious, useDebounce } from 'react-use'
import type { BigNumber } from 'ethers'

import { BigDecimal } from '../web3/BigDecimal'
import { useSelectedMassetState } from '../context/DataProvider/DataProvider'
import { MassetState } from '../context/DataProvider/types'
import { useSigner } from '../context/AccountProvider'
import { sanitizeMassetError } from '../utils/strings'

import type { BigDecimalInputValue } from './useBigDecimalInputs'
import { FetchState, useFetchState } from './useFetchState'
import { useSelectedMassetConfig } from '../context/MassetProvider'
import { getPriceImpact, PriceImpact } from '../utils/ammUtils'

type Contract = Masset | FeederPool

interface Output {
  estimatedOutputAmount: FetchState<BigDecimal>
  priceImpact: FetchState<PriceImpact>
  exchangeRate: FetchState<BigDecimal>
  feeRate: FetchState<BigDecimal>
}

enum Action {
  SWAP,
  REDEEM,
  MINT,
}

const withFee = new Set<Action | undefined>([Action.SWAP, Action.REDEEM])

const inputValuesAreEqual = (a?: BigDecimalInputValue, b?: BigDecimalInputValue): boolean =>
  !!((!a && !b) || (a && b && a.amount?.exact.toString() === b.amount?.exact.toString() && a.address === b.address))

/**
 * This hook is designed to route to correct hook based on input/output
 */
export const useEstimatedOutput = (
  inputValue?: BigDecimalInputValue,
  outputValue?: BigDecimalInputValue,
  lpPriceAdjustment?: { price: BigDecimal; isInput: boolean },
  shouldSkip?: boolean,
): Output => {
  const inputValuePrev = usePrevious(inputValue)
  const outputValuePrev = usePrevious(outputValue)

  const [estimatedOutputRange, setEstimatedOutputRange] = useFetchState<[BigDecimal, BigDecimal]>()

  const [action, setAction] = useState<Action | undefined>()

  const signer = useSigner()
  const massetState = useSelectedMassetState() as MassetState
  const massetConfig = useSelectedMassetConfig()
  const { address: massetAddress, fAssets, bAssets, feeRate: swapFeeRate, redemptionFeeRate } = massetState

  const poolAddress = Object.values(fAssets).find(
    f =>
      f.feederPoolAddress === inputValue?.address ||
      f.feederPoolAddress === outputValue?.address ||
      f.address === inputValue?.address ||
      f.address === outputValue?.address,
  )?.feederPoolAddress

  const contract: Contract | undefined = useMemo(() => {
    if (!signer) return

    // use feeder pool to do swap
    if (poolAddress) {
      return FeederPool__factory.connect(poolAddress, signer)
    }
    return Masset__factory.connect(massetAddress, signer)
  }, [poolAddress, massetAddress, signer])

  const isFeederPool = contract?.address === poolAddress

  const exchangeRate = useMemo<FetchState<BigDecimal>>(() => {
    if (shouldSkip) return {}

    if (estimatedOutputRange.fetching) return { fetching: true }
    if (!inputValue?.amount || !outputValue) return {}

    const { amount: inputAmount } = inputValue

    if (!estimatedOutputRange.value || !inputAmount) return {}

    const [, high] = estimatedOutputRange.value

    if (!high.exact.gt(0) || !inputAmount.exact.gt(0)) {
      return { error: 'Amount must be greater than zero' }
    }

    const value = high.scale().divPrecisely(inputAmount.scale())
    return { value }
  }, [estimatedOutputRange, inputValue, outputValue, shouldSkip])

  const feeRate = useMemo<FetchState<BigDecimal>>(() => {
    if (shouldSkip || !withFee.has(action) || !estimatedOutputRange.value?.[1]) return {}

    if (estimatedOutputRange.fetching) return { fetching: true }

    const _feeRate = action === Action.SWAP ? swapFeeRate : redemptionFeeRate

    const swapFee = estimatedOutputRange.value[1]
      .scale()
      .divPrecisely(BigDecimal.ONE.sub(_feeRate))
      .sub(estimatedOutputRange.value[1].scale())

    return { value: swapFee }
  }, [action, estimatedOutputRange, swapFeeRate, redemptionFeeRate, shouldSkip])

  const priceImpact = useMemo<FetchState<PriceImpact>>(() => {
    if (estimatedOutputRange.fetching || !estimatedOutputRange.value || !inputValue) return { fetching: true }

    if (!inputValue.amount) return {}

    if (!inputValue.amount.exact.gt(0)) return { fetching: true }

    const value = getPriceImpact([massetConfig.lowInputValue, inputValue.amount.scale()], estimatedOutputRange.value, lpPriceAdjustment)

    return { value }
  }, [estimatedOutputRange.fetching, estimatedOutputRange.value, inputValue, massetConfig.lowInputValue, lpPriceAdjustment])

  /*
   * |------------------------------------------------------|
   * | ROUTES                                               |
   * | -----------------------------------------------------|
   * | Input  | Output | Function      | Tokens             |
   * | -----------------------------------------------------|
   * | basset | masset | masset mint   | 1 basset, 1 masset |
   * | masset | basset | masset redeem | 1 masset, 1 basset |
   * | basset | basset | masset swap   | 2 bassets          |
   * | fasset | basset | fpool swap    | 1 fasset           |
   * | fasset | masset | fpool swap    | 1 fasset           |
   * |------------------------------------------------------|
   */

  const inputEq = inputValuesAreEqual(inputValue, inputValuePrev)
  const outputEq = inputValuesAreEqual(outputValue, outputValuePrev)
  const eq = inputEq && outputEq

  const [update] = useDebounce(
    () => {
      if (!inputValue || !outputValue || shouldSkip || !contract) return

      const { address: inputAddress, amount: inputAmount, decimals: inputDecimals } = inputValue
      const { address: outputAddress, decimals: outputDecimals } = outputValue

      const isLPRedeem = contract.address === inputAddress
      const isLPMint = contract.address === outputAddress
      const isMassetMint = bAssets[inputAddress]?.address && outputAddress === massetAddress
      const isBassetSwap = [inputAddress, outputAddress].filter(address => bAssets[address]?.address).length === 2
      const isInvalid = inputAddress === outputAddress

      if (!inputAmount?.exact.gt(0)) return

      // same -> same; fallback to input value 1:1
      if (isInvalid) {
        setEstimatedOutputRange.value([massetConfig.lowInputValue, inputAmount])
        return
      }

      const scaledInputLow = massetConfig.lowInputValue.scale(inputDecimals)

      let outputLowPromise: Promise<BigNumber> | undefined
      let outputHighPromise: Promise<BigNumber> | undefined

      if (isMassetMint || isLPMint) {
        setAction(Action.MINT)
        outputLowPromise = contract.getMintOutput(inputAddress, scaledInputLow.exact)
        outputHighPromise = contract.getMintOutput(inputAddress, (inputAmount as BigDecimal).exact)
      } else if ((isFeederPool || isBassetSwap) && !isLPRedeem) {
        setAction(Action.SWAP)
        outputLowPromise = contract.getSwapOutput(inputAddress, outputAddress, scaledInputLow.exact)
        outputHighPromise = contract.getSwapOutput(inputAddress, outputAddress, inputAmount.exact)
      } else if (!isFeederPool || isLPRedeem) {
        setAction(Action.REDEEM)
        outputLowPromise = contract.getRedeemOutput(outputAddress, scaledInputLow.exact)
        outputHighPromise = contract.getRedeemOutput(outputAddress, inputAmount.exact)
      }

      if (outputLowPromise && outputHighPromise) {
        setEstimatedOutputRange.fetching()

        Promise.all([outputLowPromise, outputHighPromise])
          .then(data => {
            const [_low, _high] = data
            const low = new BigDecimal(_low, outputDecimals)
            const high = new BigDecimal(_high, outputDecimals)
            setEstimatedOutputRange.value([low, high])
          })
          .catch(_error => {
            setEstimatedOutputRange.error(sanitizeMassetError(_error))
          })
        return
      }

      setEstimatedOutputRange.value()
    },
    2500,
    [eq],
  )

  useEffect(() => {
    if (shouldSkip) return

    if (!eq && contract && inputValue && outputValue) {
      if (inputValue.amount?.exact.gt(0)) {
        setEstimatedOutputRange.fetching()
        update()
      } else {
        setEstimatedOutputRange.value()
      }
    }
  }, [eq, contract, setEstimatedOutputRange, update, inputValue, outputValue, shouldSkip])

  return useMemo(
    () => ({
      estimatedOutputAmount: {
        fetching: estimatedOutputRange.fetching,
        error: estimatedOutputRange.error,
        value: estimatedOutputRange.value?.[1],
      },
      priceImpact,
      exchangeRate,
      feeRate,
    }),
    [estimatedOutputRange, priceImpact, exchangeRate, feeRate],
  )
}
