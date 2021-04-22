import React, { ChangeEventHandler, FC, KeyboardEventHandler, useCallback } from 'react'
import styled from 'styled-components'

import { Button } from '../core/Button'

interface Props {
  className?: string
  value?: string
  placeholder?: string
  onChange?(formValue?: string): void
  disabled?: boolean
  min?: string
  max?: string
}

const StyledButton = styled(Button)`
  background-color: transparent;
  border: 1px ${({ theme }) => theme.color.bodyTransparent} solid;
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  input {
    appearance: none;
    background: transparent;
    border: none;
    font-size: 1rem;
    min-width: 0;
    width: 100%;
    text-align: center;
    outline: none;
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
    }
    ${({ theme }) => theme.mixins.numeric};
  }
`

export const AmountInputButton: FC<Props> = ({ className, disabled = false, placeholder = '0.00', onChange, value, min = '0', max }) => {
  const handleKeyPress = useCallback<KeyboardEventHandler<HTMLInputElement>>(event => {
    // Prevent 'minus' key
    if ((event.which || event.keyCode) === 45) {
      event.preventDefault()
      event.stopPropagation()
    }
  }, [])

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    event => {
      onChange?.(event.target.value ?? undefined)
    },
    [onChange],
  )

  return (
    <StyledButton className={className}>
      <input
        type="number"
        min={min}
        max={max}
        placeholder={placeholder}
        step="0.01"
        value={value || ''}
        onKeyPress={handleKeyPress}
        onChange={handleChange}
        disabled={disabled}
      />
    </StyledButton>
  )
}
