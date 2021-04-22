import React, { FC, useMemo } from 'react'
import styled from 'styled-components'

import { BigDecimal } from '../../web3/BigDecimal'
import { Tooltip } from './ReactTooltip'
import { CollapseBox } from '../forms/CollapseBox'
import { SlippageInput } from '../forms/SlippageInput'

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
}

const DollarEstimate = styled.span`
  color: ${({ theme }) => theme.color.bodyAccent};
`

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  height: fit-content;
  padding: 0.75rem 1.25rem;
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
  background: ${({ theme }) => theme.color.backgroundAccent};
  border-radius: 0.75rem;
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
}) => {
  const showAdditionalInfo = feeAmount || minOutputAmount || maxOutputAmount || (!minOutputAmount && !maxOutputAmount)

  const { min, max, fee } = useMemo<{
    fee?: BigDecimal
    min?: BigDecimal
    max?: BigDecimal
  }>(() => {
    if (!price) return {}

    const _fee = feeAmount && price * feeAmount?.simple
    const _min = minOutputAmount && price * minOutputAmount?.simple
    const _max = maxOutputAmount && price * maxOutputAmount?.simple

    const prices = {
      fee: (_fee && BigDecimal.parse(_fee.toString(), 2)) || undefined,
      min: (_min && BigDecimal.parse(_min.toString(), 2)) || undefined,
      max: (_max && BigDecimal.parse(_max.toString(), 2)) || undefined,
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
                {feeAmount?.format(8, false)}
                {fee && <DollarEstimate>{` ≈ $${fee?.format(2)}`}</DollarEstimate>}
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
                {minOutputAmount?.format(8, false)}
                {min && <DollarEstimate>{` ≈ $${min?.format(2)}`}</DollarEstimate>}
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
                {maxOutputAmount?.format(8, false)}
                {max && <DollarEstimate>{` ≈ $${max?.format(2)}`}</DollarEstimate>}
              </span>
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
