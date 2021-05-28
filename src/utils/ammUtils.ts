import { BigDecimal } from '../web3/BigDecimal'

const MIN_FACTOR = 0.996
const MAX_FACTOR = 1.004

export interface PriceImpact {
  distancePercentage?: number
  impactPercentage: number
  impactWarning: boolean
}

const getBounds = (amount: number): [number, number] => {
  const min = amount * MIN_FACTOR
  const max = amount * MAX_FACTOR
  return [min, max]
}

export const getPenaltyMessage = (amount: number | undefined): string | undefined => {
  if (!amount) return undefined

  const abs = Math.abs(amount).toFixed(4)
  return amount > 0 ? `There is a price bonus of +${abs}%` : `There is a price penalty of -${abs}%`
}

export const getPenaltyPercentage = (
  inputAmount?: BigDecimal,
  outputAmount?: BigDecimal, // min or max output
  lpPriceAdjustment?: { price: BigDecimal; isInput: boolean },
  reverse?: boolean,
): number | undefined => {
  if (!inputAmount || !outputAmount) return

  const [min, max] = getBounds(inputAmount.simple)
  if (!min || !max) return

  const isInput = lpPriceAdjustment?.isInput ?? false
  const lpPrice = lpPriceAdjustment?.price

  const input = isInput ? inputAmount.simple * (lpPrice?.simple ?? 1) : inputAmount.simple
  const output = isInput ? outputAmount.simple : outputAmount.simple * (lpPrice?.simple ?? 1)
  const penalty = output / input
  const percentage = ((): number => {
    if (reverse) return penalty > 1 ? (penalty - 1) * -100 : (1 - penalty) * 100
    return penalty > 1 ? (penalty - 1) * 100 : (1 - penalty) * -100
  })()

  return percentage
}

export const getPriceImpact = (
  [inputLow, inputHigh]: [BigDecimal, BigDecimal],
  [outputLow, outputHigh]: [BigDecimal, BigDecimal],
  lpPriceAdjustment?: { price: BigDecimal; isInput: boolean },
  reverse = false,
): PriceImpact | undefined => {
  const startRate = outputLow.divPrecisely(inputLow).simple
  const endRate = outputHigh.divPrecisely(inputHigh).simple

  const impactPercentage = Math.abs(startRate - endRate) * 100
  const impactWarning = impactPercentage > 0.1
  const distancePercentage = getPenaltyPercentage(inputHigh, outputHigh, lpPriceAdjustment, reverse)

  return {
    distancePercentage,
    impactPercentage,
    impactWarning,
  }
}
