import React, { FC, useMemo } from 'react'
import styled from 'styled-components'

import { BigDecimal } from '../../web3/BigDecimal'
import { Tooltip } from './ReactTooltip'
import { CollapseBox } from '../forms/CollapseBox'
import { SlippageInput } from '../forms/SlippageInput'
import { PriceImpact } from '../../utils/ammUtils'

interface Props {
  className?: string
  feeAmount?: BigDecimal
  feeLabel?: string
  feeTip?: string
  minOutputAmount?: BigDecimal
  maxOutputAmount?: BigDecimal
  slippageFormValue?: string
  onSetSlippage?(formValue?: string): void
  saveExchangeRate?: BigDecimal
  price?: number
  priceImpact?: PriceImpact
}

const Impact = styled.span<{ warning: boolean }>`
  color: ${({ warning }) => warning && 'red'};
`

const Percentage = styled.span<{ isBonus: boolean }>`
  color: ${({ isBonus }) => isBonus && 'green'};
`

const DollarEstimate = styled.span`
  color: ${({ theme }) => theme.color.bodyAccent};
`

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  height: fit-content;
  padding: 0.375rem 0;
  font-size: 0.875rem;

  > span:last-child {
    font-size: 1rem;
    ${({ theme }) => theme.mixins.numeric}
  }
`

const AdvancedBox = styled(CollapseBox)`
  margin-top: 0.5rem;
`

const AdditionalInfo = styled.div`
  border-radius: 0.75rem;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  padding: 0.5rem 1.25rem;
`

export const TransactionInfo: FC<Props> = ({
  feeAmount,
  feeLabel = 'Fee',
  feeTip = 'The received amount includes a small fee.',
  minOutputAmount,
  maxOutputAmount,
  className,
  onSetSlippage,
  slippageFormValue,
  saveExchangeRate,
  price,
  priceImpact: { impactPercentage, impactWarning = false, distancePercentage } = {},
}) => {
  const showAdditionalInfo = feeAmount || minOutputAmount || maxOutputAmount || impactPercentage || distancePercentage

  const formattedDistancePercentage =
    (distancePercentage && (distancePercentage > 0 ? `+${distancePercentage.toFixed(4)}%` : `${distancePercentage.toFixed(4)}%`)) ||
    undefined

  const { min, max, fee } = useMemo<{
    fee?: BigDecimal
    min?: BigDecimal
    max?: BigDecimal
  }>(() => {
    if (!price) return {}

    const _fee = feeAmount && price * feeAmount.simple
    const _min = minOutputAmount && price * minOutputAmount.simple
    const _max = maxOutputAmount && price * maxOutputAmount.simple

    const prices = {
      fee: _fee ? BigDecimal.fromSimple(_fee, 2) : undefined,
      min: _min ? BigDecimal.fromSimple(_min, 2) : undefined,
      max: _max ? BigDecimal.fromSimple(_max, 2) : undefined,
    }

    if (saveExchangeRate) {
      return {
        fee: prices.fee?.divPrecisely(saveExchangeRate),
        min: prices.min?.divPrecisely(saveExchangeRate),
        max: prices.max?.divPrecisely(saveExchangeRate),
      }
    }

    return prices
  }, [price, feeAmount, saveExchangeRate, minOutputAmount, maxOutputAmount])

  return (
    <>
      {onSetSlippage && (
        <AdvancedBox title="Advanced">
          <SlippageInput handleSetSlippage={onSetSlippage} slippageFormValue={slippageFormValue} />
        </AdvancedBox>
      )}
      {showAdditionalInfo && (
        <AdditionalInfo className={className}>
          {feeAmount && (
            <Info>
              <p>
                <Tooltip tip={feeTip}>{feeLabel}</Tooltip>
              </p>
              <span>
                {feeAmount.format(8, false)}
                {fee && <DollarEstimate>{` ≈ $${fee.format(2)}`}</DollarEstimate>}
              </span>
            </Info>
          )}

          {minOutputAmount && (
            <Info>
              <p>
                <Tooltip tip="The minimum amount received (based on the estimated output and the selected slippage).">
                  Minimum received
                </Tooltip>
              </p>
              <span>
                {minOutputAmount.format(8, false)}
                {min && <DollarEstimate>{` ≈ $${min.format(2)}`}</DollarEstimate>}
              </span>
            </Info>
          )}
          {maxOutputAmount && (
            <Info>
              <p>
                <Tooltip tip="The maximum amount that will be sent (based on the estimated output and the selected slippage).">
                  Maximum cost
                </Tooltip>
              </p>
              <span>
                {maxOutputAmount.format(8, false)}
                {max && <DollarEstimate>{` ≈ $${max.format(2)}`}</DollarEstimate>}
              </span>
            </Info>
          )}
          {!!impactPercentage && (
            <Info>
              <p>
                <Tooltip tip="The difference between the current rate and estimated rate due to trade size">Price impact</Tooltip>
              </p>
              <Impact warning={impactWarning}>{impactPercentage < 0.01 ? `<0.01%` : `${impactPercentage?.toFixed(2)}%`}</Impact>
            </Info>
          )}
          {formattedDistancePercentage && (
            <Info>
              <p>
                <Tooltip tip="A bonus or penalty is determined from the current basket weights">
                  {formattedDistancePercentage.includes('+') ? 'Bonus pricing' : 'Penalty pricing'}
                </Tooltip>
              </p>
              <Percentage isBonus={formattedDistancePercentage.includes('+')}>{formattedDistancePercentage}</Percentage>
            </Info>
          )}
          {!minOutputAmount && !maxOutputAmount && (
            <Info>
              <p>&nbsp;</p>
            </Info>
          )}
        </AdditionalInfo>
      )}
    </>
  )
}
