import React, {
  ChangeEventHandler,
  FC,
  KeyboardEventHandler,
  useCallback,
} from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  error?: string;
  value: string | null;
  balance?: string | null;
  placeholder?: string;
  name: string;
  onChange?(name: string, simpleAmount: string | null): void;
  onSetMax?(): void;
  disabled?: boolean;
}

const Input = styled.input<{ error: string | void }>`
  appearance: none;
  background: ${({ theme, error }) =>
    error ? theme.color.redTransparenter : theme.color.white};
  border: ${({ theme, error }) =>
    `1px ${
      error ? theme.color.redTransparent : theme.color.blackTransparent
    } solid`};
  border-radius: 3px;
  color: ${({ error, theme }) => (error ? theme.color.red : theme.color.black)};
  font-size: 16px;
  font-weight: bold;
  min-width: 0;
  width: 100%;
  outline: none;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.s}`};
  height: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.s};

  ${({ theme }) => theme.mixins.numeric}
`;

/**
 * AmountInput component
 * Form input for selecting an amount denominated in given decimals.
 *
 * @param name Field name sent to onChange handler
 * @param value Controlled form value
 * @param error Error message, e.g. 'Amount too low'
 * @param disabled Flag for disabling the input
 * @param onChange Optional callback with the amount value
 */
export const AmountInput: FC<Props> = ({
  className,
  name,
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
      onChange?.(name, event.target.value || null);
    },
    [onChange, name],
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
