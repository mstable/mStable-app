import type { FC, ChangeEventHandler } from 'react'

import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import { useEffectOnce } from 'react-use'

import { useNetworkPrices } from '../../context/NetworkProvider'

import { useGas } from './TransactionGasProvider'
import { Button } from '../core/Button'

enum GasPriceType {
  Standard = 'standard',
  Fast = 'fast',
  Instant = 'instant',
  Custom = 'custom',
}

const OPTIONS: {
  type: GasPriceType
  label: string
}[] = [
  {
    type: GasPriceType.Standard,
    label: 'Standard',
  },
  {
    type: GasPriceType.Fast,
    label: 'Fast',
  },
  {
    type: GasPriceType.Instant,
    label: 'Instant',
  },
  {
    type: GasPriceType.Custom,
    label: 'Custom',
  },
]

const Price = styled.div`
  ${({ theme }) => theme.mixins.numeric}
`

const Fee = styled(Price)`
  color: grey;
`

const Input = styled.input<{ error?: string | void; disabled?: boolean }>`
  appearance: none;
  background: ${({ theme, disabled }) => (disabled ? theme.color.blackTransparenter : theme.color.background)};

  border: ${({ theme, disabled }) => `1px ${disabled ? theme.color.blackTransparent : 'rgba(0, 0, 0, 0.5)'} solid`};

  color: ${({ theme, disabled }) => (disabled ? '#404040' : theme.color.black)};
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: bold;
  min-width: 0;
  outline: none;
  height: 1.5rem;
  width: 3.5rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'auto')};
  text-align: center;

  &:focus {
    border-color: ${({ theme }) => theme.color.primary};
    background: ${({ theme }) => theme.color.blueTransparent};
  }

  ${({ theme }) => theme.mixins.numeric};
`

const OptionButton = styled(Button)`
  font-size: 0.8rem;
  padding: 0 1rem;
  height: 1.75rem;
`

const Option = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  border-radius: 1rem;
  min-height: 5rem;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  &:before {
    display: block;
    content: '';
    position: absolute;
    top: 0;
    width: 100%;
    height: 1.75rem;
    background: ${({ theme }) => theme.color.backgroundAccent};
    border-radius: 1rem;
    z-index: 0;
  }
`

export const GasStation: FC = () => {
  const networkPrices = useNetworkPrices()
  const { gasLimit, gasPrice, setGasPrice } = useGas()

  const [gasPriceType, setGasPriceType] = useState<GasPriceType>(GasPriceType.Standard)

  const customTransactionFee =
    gasPriceType === GasPriceType.Custom && gasPrice && networkPrices.value?.nativeToken && gasLimit
      ? (gasPrice / 1e9) * (networkPrices.value.nativeToken / 1e9) * gasLimit.toNumber()
      : undefined

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    event => {
      setGasPrice(parseFloat(event.target.value) * 1e9)
    },
    [setGasPrice],
  )

  useEffectOnce(() => {
    setGasPrice((networkPrices.value?.gas?.[gasPriceType as 'fast'] ?? 0) * 1e9)
  })

  return (
    <Container>
      {OPTIONS.map(({ type, label }) => {
        const _gasPrice = networkPrices.value?.gas?.[type as 'fast']

        const transactionFee =
          _gasPrice && networkPrices.value?.nativeToken && gasLimit
            ? _gasPrice * (networkPrices.value?.nativeToken / 1e9) * gasLimit.toNumber()
            : undefined

        const selected = type === gasPriceType
        return (
          <Option key={type}>
            <OptionButton
              highlighted={selected}
              onClick={() => {
                setGasPrice((_gasPrice as number) * 1e9)
                setGasPriceType(type)
              }}
            >
              {label}
            </OptionButton>
            <div>
              {type === GasPriceType.Custom ? (
                <div>
                  <Input disabled={type !== gasPriceType} placeholder="10" onChange={handleChange} />
                  <Fee>{customTransactionFee ? `$${customTransactionFee.toFixed(2)}` : '$–'}</Fee>
                </div>
              ) : (
                <div>
                  <Price>{_gasPrice?.toFixed(0)}</Price>
                  <Fee>{transactionFee ? `$${transactionFee.toFixed(2)}` : '–'}</Fee>
                </div>
              )}
            </div>
          </Option>
        )
      })}
    </Container>
  )
}
