import React, { FC, useCallback, useState } from 'react'
import { isAddress } from 'web3-utils'
import styled from 'styled-components'
import { Color } from '../../../../theme'

interface Props {
  placeholder?: string
  onChangeValue(address?: string): void
}

const Container = styled.div<{ valid: boolean; touched: boolean }>`
  input {
    display: block;
    margin: 0;
    border-radius: 2px;
    color: ${({ valid, touched }) => (touched ? (valid ? Color.green : Color.red) : Color.blackTransparent)};
    border: 1px ${({ valid, touched }) => (touched ? (valid ? Color.green : Color.red) : Color.blackTransparent)} solid;
    padding: 4px 16px;
    outline: 0;
    background: ${({ theme }) => theme.color.backgroundAccent};
  }
`

export const AddressInput: FC<Props> = ({ onChangeValue, placeholder = 'Ethereum address' }) => {
  const [touched, setTouched] = useState<boolean>(false)
  const [valid, setValid] = useState<boolean>(true)

  const handleChange = useCallback(
    ({ target: { value: _address } }) => {
      const _valid = isAddress(_address)
      onChangeValue(_valid ? _address : undefined)
      setValid(_valid)
      setTouched(!!_address)
    },
    [onChangeValue],
  )

  return (
    <Container valid={valid} touched={touched}>
      <input type="text" placeholder={placeholder} onChange={handleChange} />
    </Container>
  )
}
