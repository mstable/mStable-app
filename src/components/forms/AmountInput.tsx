import React, {
  ChangeEventHandler,
  FC,
  KeyboardEventHandler,
  useCallback,
} from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  error?: boolean;
  value?: string;
  balance?: string;
  placeholder?: string;
  onChange?(formValue?: string): void;
  disabled?: boolean;
}

export const Input = styled.input<{
  error?: boolean;
  disabled?: boolean;
}>`
  appearance: none;
  background: ${({ theme, error, disabled }) =>
    error
      ? theme.color.redTransparenter
      : disabled
      ? theme.color.blackTransparenter
      : theme.color.white};

  border: ${({ theme, error, disabled }) =>
    `1px ${
      error
        ? theme.color.redTransparent
        : disabled
        ? theme.color.blackTransparent
        : 'rgba(0, 0, 0, 0.5)'
    } solid`};

  color: ${({ error, theme, disabled }) =>
    error ? theme.color.red : disabled ? '#404040' : theme.color.black};

  border-radius: 1rem;
  font-size: 16px;
  font-weight: bold;
  min-width: 0;
  width: 100%;
  outline: none;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.s}`};
  height: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.s};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'auto')};

  &:focus {
    border-color: ${({ theme }) => theme.color.blue};
    background: ${({ theme }) => theme.color.blueTransparent};
  }

  ${({ theme }) => theme.mixins.numeric};
`;

export const AmountInput: FC<Props> = ({
  className,
  error,
  disabled = false,
  placeholder = '0.00',
  onChange,
  value,
}) => {
  const handleKeyPress = useCallback<KeyboardEventHandler<HTMLInputElement>>(
    event => {
      // Prevent 'minus' key
      if ((event.which || event.keyCode) === 45) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [],
  );

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    event => {
      onChange?.(event.target.value ?? undefined);
    },
    [onChange],
  );

  return (
    <Input
      className={className}
      error={error}
      type="number"
      min="0"
      placeholder={placeholder}
      step="0.01"
      value={value || ''}
      onKeyPress={handleKeyPress}
      onChange={handleChange}
      disabled={disabled}
    />
  );
};
