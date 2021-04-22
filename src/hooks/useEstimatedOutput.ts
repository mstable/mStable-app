import { useEffect, useMemo, useState } from 'react'
import { FeederPool, FeederPool__factory, Masset, Masset__factory } from '@mstable/protocol/types/generated'
import { usePrevious, useDebounce } from 'react-use'

import { BigDecimal } from '../web3/BigDecimal'
import { useSelectedMassetState } from '../context/DataProvider/DataProvider'
import { MassetState } from '../context/DataProvider/types'
import { useSigner } from '../context/AccountProvider'
import { sanitizeMassetError } from '../utils/strings'

import type { BigDecimalInputValue } from './useBigDecimalInputs'
import { FetchState, useFetchState } from './useFetchState'

type Contract = Masset | FeederPool

interface Output {
  estimatedOutputAmount: FetchState<BigDecimal>
  exchangeRate: FetchState<BigDecimal>
  feeRate: FetchState<BigDecimal>
}

enum Action {
  SWAP,
  REDEEM,
  MINT,
}

const inputValuesAreEqual = (a?: BigDecimalInputValue, b?: BigDecimalInputValue): boolean =>
  !!((!a && !b) || (a && b && a.amount?.exact.toString() === b.amount?.exact.toString() && a.address === b.address))

/**
 * This hook is designed to route to correct hook based on input/output
 */
export const useEstimatedOutput = (inputValue?: BigDecimalInputValue, outputValue?: BigDecimalInputValue, shouldSkip?: boolean): Output => {
  const inputValuePrev = usePrevious(inputValue)
  const outputValuePrev = usePrevious(outputValue)

  const [estimatedOutputAmount, setEstimatedOutputAmount] = useFetchState<BigDecimal>()

  const [action, setAction] = useState<Action | undefined>()

  const signer = useSigner()
  const massetState = useSelectedMassetState() as MassetState
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

  const exchangeRate = useMemo<FetchState<BigDecimal>>(() => {
    if (shouldSkip) return {}

    if (estimatedOutputAmount.fetching) return { fetching: true }
    if (!inputValue?.amount || !outputValue) return {}

    const { amount: inputAmount, address: inputAddress } = inputValue
    const { address: outputAddress } = outputValue

    if (!estimatedOutputAmount.value) return {}

    if (!estimatedOutputAmount.value.exact.gt(0) || !inputAmount.exact.gt(0)) {
      return { error: 'Amount must be greater than zero' }
    }

    // Scale asset via ratio
    const scaleAsset = (address: string, amount: BigDecimal): BigDecimal => {
      if (!amount?.simple) return BigDecimal.ZERO

      // Only bAsset/fAsset amounts are scaled
      if (address === massetAddress || address === poolAddress) return amount

      // Scale w/ ratio
      const ratio = bAssets[address]?.ratio ?? (poolAddress && fAssets[poolAddress].ratio)

      // shouldn't hit but better to have this can crash
      if (!ratio) return amount

      return amount.mulRatioTruncate(ratio).setDecimals(18)
    }

    const scaledInput = scaleAsset(inputAddress, inputAmount)
    const scaledOutput = scaleAsset(outputAddress, estimatedOutputAmount.value)

    const value = scaledOutput.divPrecisely(scaledInput)
    return { value }
  }, [bAssets, estimatedOutputAmount, fAssets, poolAddress, inputValue, massetAddress, outputValue, shouldSkip])

  const feeRate = useMemo<FetchState<BigDecimal>>(() => {
    if (shouldSkip) return {}

    // if not swap or redeem, return
    if (action === Action.MINT) return {}

    if (estimatedOutputAmount.fetching) return { fetching: true }

    const feeRateBN = action === Action.SWAP ? swapFeeRate : redemptionFeeRate
    const feeRateSimple = feeRateBN ? parseInt(feeRateBN.toString(), 10) / 1e18 : undefined

    const outputSimple = estimatedOutputAmount.value?.simple

    const swapFee = outputSimple && feeRateSimple ? outputSimple / (1 - feeRateSimple) - outputSimple : undefined

    const value = BigDecimal.maybeParse(swapFee?.toFixed(18))

    if (value) {
      return { value }
    }
    return {}
  }, [action, estimatedOutputAmount, swapFeeRate, redemptionFeeRate, shouldSkip])

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
      if (!inputValue || !outputValue) return
      if (shouldSkip) return {}

      if (!contract) return setEstimatedOutputAmount.fetching()

      const { address: inputAddress, amount: inputAmount } = inputValue
      const { address: outputAddress, decimals: outputDecimals } = outputValue

      const isLPRedeem = contract.address === inputAddress
      const isLPMint = contract.address === outputAddress

      const isMassetMint = bAssets[inputAddress]?.address && outputAddress === massetAddress

      const isBassetSwap = [inputAddress, outputAddress].filter(address => bAssets[address]?.address).length === 2

      if (!inputAmount?.exact.gt(0)) return

      if (isMassetMint || isLPMint) {
        setAction(Action.MINT)
        setEstimatedOutputAmount.fetching()
        contract
          .getMintOutput(inputAddress, (inputAmount as BigDecimal).exact)
          .then(_amount => {
            setEstimatedOutputAmount.value(new BigDecimal(_amount))
          })
          .catch(_error => {
            setEstimatedOutputAmount.error(sanitizeMassetError(_error))
          })
        return
      }

      if ((isFeederPool || isBassetSwap) && !isLPRedeem) {
        setAction(Action.SWAP)
        setEstimatedOutputAmount.fetching()
        contract
          .getSwapOutput(inputAddress, outputAddress, inputAmount.exact)
          .then(_swapOutput => {
            setEstimatedOutputAmount.value(new BigDecimal(_swapOutput, outputDecimals))
          })
          .catch(_error => {
            setEstimatedOutputAmount.error(sanitizeMassetError(_error))
          })
        return
      }

      if (!isFeederPool || isLPRedeem) {
        setAction(Action.REDEEM)
        setEstimatedOutputAmount.fetching()
        contract
          .getRedeemOutput(outputAddress, inputAmount.exact)
          .then(_amount => {
            setEstimatedOutputAmount.value(new BigDecimal(_amount, outputDecimals))
          })
          .catch((_error: Error): void => {
            setEstimatedOutputAmount.error(sanitizeMassetError(_error))
          })
        return
      }

      setEstimatedOutputAmount.value()
    },
    2500,
    [eq],
  )

  useEffect(() => {
    if (shouldSkip) return

    if (!eq && contract && inputValue && outputValue) {
      if (inputValue.amount?.exact.gt(0)) {
        setEstimatedOutputAmount.fetching()
        update()
      } else {
        setEstimatedOutputAmount.value()
      }
    }
  }, [eq, contract, setEstimatedOutputAmount, update, inputValue, outputValue, shouldSkip])

  return { estimatedOutputAmount, exchangeRate, feeRate }
}
