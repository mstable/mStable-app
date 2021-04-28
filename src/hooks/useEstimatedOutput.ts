import { useCallback, useEffect, useMemo, useState } from 'react'
import { FeederPool, FeederPool__factory, Masset, Masset__factory } from '@mstable/protocol/types/generated'
import { usePrevious, useDebounce } from 'react-use'

import { BigDecimal } from '../web3/BigDecimal'
import { useSelectedMassetState } from '../context/DataProvider/DataProvider'
import { MassetState } from '../context/DataProvider/types'
import { useSigner } from '../context/AccountProvider'
import { sanitizeMassetError } from '../utils/strings'

import type { BigDecimalInputValue } from './useBigDecimalInputs'
import { FetchState, useFetchState } from './useFetchState'
import { MassetName } from '../types'
import { useSelectedMassetName } from '../context/SelectedMassetNameProvider'
import { getPenaltyPercentage, PriceImpact } from '../utils/ammUtils'

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

// ~ $1
export const inputValueLow: Record<MassetName, BigDecimal> = {
  musd: new BigDecimal((1e18).toString()),
  mbtc: new BigDecimal((1e18).toString()).divPrecisely(BigDecimal.parse('58000')), // rough approximation
}

const inputValuesAreEqual = (a?: BigDecimalInputValue, b?: BigDecimalInputValue): boolean =>
  !!((!a && !b) || (a && b && a.amount?.exact.toString() === b.amount?.exact.toString() && a.address === b.address))

/**
 * This hook is designed to route to correct hook based on input/output
 */
export const useEstimatedOutput = (inputValue?: BigDecimalInputValue, outputValue?: BigDecimalInputValue, shouldSkip?: boolean): Output => {
  const inputValuePrev = usePrevious(inputValue)
  const outputValuePrev = usePrevious(outputValue)

  const [estimatedOutputRange, setEstimatedOutputRange] = useFetchState<{ low: BigDecimal; high: BigDecimal }>()

  const [action, setAction] = useState<Action | undefined>()

  const signer = useSigner()
  const massetState = useSelectedMassetState() as MassetState
  const massetName = useSelectedMassetName()
  const { address: massetAddress, fAssets, bAssets, feeRate: swapFeeRate, redemptionFeeRate } = massetState

  const poolAddress = Object.keys(fAssets)
    .filter(address => fAssets[address].address !== massetAddress)
    .find(
      address =>
        fAssets[address].address === inputValue?.address ||
        fAssets[address].address === outputValue?.address ||
        address === inputValue?.address ||
        address === outputValue?.address,
    )

  const contract: Contract | undefined = useMemo(() => {
    if (!signer) return

    // use feeder pool to do swap
    if (poolAddress && poolAddress !== massetAddress) {
      return FeederPool__factory.connect(poolAddress, signer)
    }
    return Masset__factory.connect(massetAddress, signer)
  }, [poolAddress, massetAddress, signer])

  const isFeederPool = contract?.address === poolAddress

  // Scale asset via ratio
  const scaleAsset = useCallback(
    (address: string, amount: BigDecimal, decimals?: number): BigDecimal => {
      if (!amount?.simple) return BigDecimal.ZERO

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
    [bAssets, fAssets, massetAddress, poolAddress],
  )

  const exchangeRate = useMemo<FetchState<BigDecimal>>(() => {
    if (shouldSkip) return {}

    if (estimatedOutputRange.fetching) return { fetching: true }
    if (!inputValue?.amount || !outputValue) return {}

    const { amount: inputAmount, address: inputAddress } = inputValue
    const { address: outputAddress } = outputValue

    if (!estimatedOutputRange.value) return {}

    if (!estimatedOutputRange.value.high.exact.gt(0) || !inputAmount.exact.gt(0)) {
      return { error: 'Amount must be greater than zero' }
    }

    const scaledInput = scaleAsset(inputAddress, inputAmount)
    const scaledOutput = scaleAsset(outputAddress, estimatedOutputRange.value.high)

    const value = scaledOutput.divPrecisely(scaledInput)
    return { value }
  }, [estimatedOutputRange, inputValue, outputValue, shouldSkip, scaleAsset])

  const feeRate = useMemo<FetchState<BigDecimal>>(() => {
    if (shouldSkip) return {}

    // if not swap or redeem, return
    if (action === Action.MINT) return {}

    if (estimatedOutputRange.fetching) return { fetching: true }

    const feeRateBN = action === Action.SWAP ? swapFeeRate : redemptionFeeRate
    const feeRateSimple = feeRateBN ? parseInt(feeRateBN.toString(), 10) / 1e18 : undefined

    const outputSimple = estimatedOutputRange.value?.high.simple

    const swapFee = outputSimple && feeRateSimple ? outputSimple / (1 - feeRateSimple) - outputSimple : undefined

    const value = BigDecimal.maybeParse(swapFee?.toFixed(18))

    if (value) {
      return { value }
    }
    return {}
  }, [action, estimatedOutputRange, swapFeeRate, redemptionFeeRate, shouldSkip])

  const priceImpact = useMemo<FetchState<PriceImpact>>(() => {
    if (estimatedOutputRange.fetching || !estimatedOutputRange?.value || !inputValue) return { fetching: true }

    const scaledInputValue = scaleAsset(inputValue.address, inputValue.amount ?? BigDecimal.ZERO)
    if (!scaledInputValue.exact.gt(0)) return { fetching: true }

    const startRate = estimatedOutputRange?.value?.low.divPrecisely(inputValueLow[massetName])?.simple
    const endRate = estimatedOutputRange?.value?.high.divPrecisely(scaledInputValue)?.simple

    const impactPercentage = (startRate - endRate) * 100
    const impactWarning = (impactPercentage ?? 0) > 0.1

    const distancePercentage = getPenaltyPercentage(inputValue?.amount, estimatedOutputRange.value.high, false)

    return {
      value: {
        distancePercentage,
        impactPercentage,
        impactWarning,
      },
    }
  }, [estimatedOutputRange, massetName, scaleAsset, inputValue])

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

      if (!inputAmount?.exact.gt(0)) return

      if (isMassetMint || isLPMint) {
        setAction(Action.MINT)
        setEstimatedOutputRange.fetching()

        const scaledInputLow = scaleAsset(inputAddress, inputValueLow[massetName], inputDecimals)
        const outputLow = contract.getMintOutput(inputAddress, scaledInputLow.exact)
        const outputHigh = contract.getMintOutput(inputAddress, (inputAmount as BigDecimal).exact)

        Promise.all([outputLow, outputHigh])
          .then(data => {
            const [_low, _high] = data
            const low = new BigDecimal(_low)
            const high = new BigDecimal(_high)
            setEstimatedOutputRange.value({
              low,
              high,
            })
          })
          .catch(_error => {
            setEstimatedOutputRange.error(sanitizeMassetError(_error))
          })

        return
      }

      if ((isFeederPool || isBassetSwap) && !isLPRedeem) {
        setAction(Action.SWAP)
        setEstimatedOutputRange.fetching()

        const scaledInputLow = scaleAsset(inputAddress, inputValueLow[massetName], inputDecimals)
        const outputLow = contract.getSwapOutput(inputAddress, outputAddress, scaledInputLow.exact)
        const outputHigh = contract.getSwapOutput(inputAddress, outputAddress, inputAmount.exact)

        Promise.all([outputLow, outputHigh])
          .then(data => {
            const [_low, _high] = data
            const low = new BigDecimal(_low, outputDecimals)
            const high = new BigDecimal(_high, outputDecimals)
            setEstimatedOutputRange.value({
              low,
              high,
            })
          })
          .catch(_error => {
            setEstimatedOutputRange.error(sanitizeMassetError(_error))
          })

        return
      }

      if (!isFeederPool || isLPRedeem) {
        setAction(Action.REDEEM)
        setEstimatedOutputRange.fetching()

        const scaledInputLow = scaleAsset(inputAddress, inputValueLow[massetName], inputDecimals)
        const outputLow = contract.getRedeemOutput(outputAddress, scaledInputLow.exact)
        const outputHigh = contract.getRedeemOutput(outputAddress, inputAmount.exact)

        Promise.all([outputLow, outputHigh])
          .then(data => {
            const [_low, _high] = data
            const low = new BigDecimal(_low, outputDecimals)
            const high = new BigDecimal(_high, outputDecimals)
            setEstimatedOutputRange.value({
              low,
              high,
            })
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

  return {
    estimatedOutputAmount: {
      fetching: estimatedOutputRange?.fetching,
      error: estimatedOutputRange?.error,
      value: estimatedOutputRange?.value?.high,
    },
    priceImpact,
    exchangeRate,
    feeRate,
  }
}
