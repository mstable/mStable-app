import React, { ChangeEventHandler, FC, KeyboardEventHandler, useCallback, useMemo } from 'react'
import styled from 'styled-components'

interface Props {
  className?: string
  error?: boolean
  value?: string
  balance?: string
  placeholder?: string
  onChange?(formValue?: string): void
  disabled?: boolean
  min?: string
  max?: string
  step?: string
  decimals?: number
}

export const InputV2 = styled.input<{
  error?: boolean
  disabled?: boolean
}>`
  ${({ theme }) => theme.mixins.numeric};

  font-size: 1.125rem;
  padding: 0 0.75rem;
  appearance: none;
  background: none;
  border: none;
  color: ${({ error, theme, disabled }) => (error ? theme.color.red : disabled ? theme.color.disabled : theme.color.body)};
  background: ${({ theme, disabled }) => (disabled ? theme.color.disabledInput : 'none')};
  opacity: ${({ disabled }) => (disabled ? 0.85 : 1)};
  font-weight: normal;
  border-radius: 0.5rem;
  outline: none;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.s}`};
  height: 3rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'auto')};
`

const trimInput = (value?: string, decimals?: number): string => {
  if (!value) return ''
  if (!decimals) return value

  const split = value?.split('.')
  if (split.length > 1) {
    if (split[1].length >= decimals) {
      return [split[0], split[1].substr(0, decimals)].join('.')
    }
  }
  return value
}

export const AmountInputV2: FC<Props> = ({
  className,
  error,
  disabled = false,
  placeholder = '0.0',
  onChange,
  value,
  min = '0',
  max,
  step = '0.01',
  decimals,
}) => {
  const trimmedValue = useMemo(() => trimInput(value, decimals), [value, decimals])

  const handleKeyPress = useCallback<KeyboardEventHandler<HTMLInputElement>>(event => {
    // Prevent 'minus' key
    if ((event.which || event.keyCode) === 45) {
      event.preventDefault()
      event.stopPropagation()
    }
  }, [])

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(event => onChange?.(event.target.value ?? undefined), [onChange])

  return (
    <InputV2
      className={className}
      error={error}
      min={min}
      max={max}
      type="number"
      placeholder={placeholder}
      step={step}
      value={trimmedValue}
      onKeyPress={handleKeyPress}
      onChange={handleChange}
      disabled={disabled}
    />
  )
}
