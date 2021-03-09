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
  min?: string;
  max?: string;
  step?: string;
}

export const InputV2 = styled.input<{
  error?: boolean;
  disabled?: boolean;
}>`
  ${({ theme }) => theme.mixins.numeric};

  font-size: 1.125rem;
  padding: 0 0.75rem;
  appearance: none;
  background: none;
  border: none;

  color: ${({ error, theme, disabled }) =>
    error ? theme.color.red : disabled ? '#404040' : theme.color.body};

  border-radius: 0.5rem;
  outline: none;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.s}`};
  height: 3rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'auto')};
`;

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
    <InputV2
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
  );
};
