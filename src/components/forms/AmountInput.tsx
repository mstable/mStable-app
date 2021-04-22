import React, { ChangeEventHandler, FC, KeyboardEventHandler, useCallback } from 'react'
import styled from 'styled-components'

interface Props {
  className?: string
  error?: boolean
  value?: string
  balance?: string
  placeholder?: string
  step?: string
  onChange?(formValue?: string): void
  disabled?: boolean
  min?: string
  max?: string
}

export const Input = styled.input<{
  error?: boolean
  disabled?: boolean
}>`
  appearance: none;
  background: ${({ theme, error, disabled }) =>
    error ? theme.color.redTransparenter : disabled ? theme.color.disabledInput : 'transparent'};

  border: ${({ theme, error }) => `1px ${error ? theme.color.redTransparent : theme.color.defaultBorder} solid`};

  color: ${({ error, theme, disabled }) => (error ? theme.color.red : disabled ? '#404040' : theme.color.body)};

  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  min-width: 0;
  width: 100%;
  outline: none;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.s}`};
  height: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.s};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'auto')};

  &:focus {
    border-color: ${({ theme }) => theme.color.primary};
    background: ${({ theme }) => theme.color.primaryTransparent};
  }

  ${({ theme }) => theme.mixins.numeric};
`

/**
 * @deprecated
 */
export const AmountInput: FC<Props> = ({
  className,
  error,
  disabled = false,
  placeholder = '0.0',
  onChange,
  value,
  min = '0',
  max,
  step = '0.01',
}) => {
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
    <Input
      className={className}
      error={error}
      type="number"
      min={min}
      max={max}
      placeholder={placeholder}
      step={step}
      value={value || ''}
      onKeyPress={handleKeyPress}
      onChange={handleChange}
      disabled={disabled}
    />
  )
}
