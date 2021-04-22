import type { BigDecimal } from '../web3/BigDecimal'

const MIN_FACTOR = 0.996
const MAX_FACTOR = 1.004

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
  return amount > 0 ? `There is a price bonus of +${abs}%` : `WARNING: There is a price penalty of -${abs}%`
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

  if (output < min || output > max) {
    if (reverse) {
      return penalty > 1 ? (penalty - 1) * -100 : (1 - penalty) * 100
    }
    return penalty > 1 ? (penalty - 1) * 100 : (1 - penalty) * -100
  }
}
