import React, {
  ChangeEventHandler,
  FC,
  KeyboardEventHandler,
  useCallback,
  useMemo,
} from 'react';
import styled from 'styled-components';
import { decimalsStep } from '../../web3/strings';
import { FontSize } from '../../theme';

interface Props {
  error?: string;
  value: string | void;
  decimals: number | void;
  balance?: string | null;
  name: string;
  onChange?(name: string, simpleAmount: string | null): void;
  onSetMax?(): void;
  disabled?: boolean;
}

const Input = styled.input<{ error: string | void }>`
  appearance: none;
  background: ${({ error }) => (error ? `rgba(255, 0, 0, 0.1)` : 'white')};
  border: ${({ theme, error }) =>
    `2px ${error ? theme.color.red : theme.color.foregroundTransparent} solid`};
  border-radius: 4px;
  color: ${({ error, theme }) =>
    error ? theme.color.red : theme.color.foreground};
  font-size: ${FontSize.l};
  font-weight: bold;
  min-width: 0;
  width: 100%;
  outline: none;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.s}`};
  height: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;

/**
 * AmountInput component
 * Form input for selecting an amount denominated in given decimals.
 *
 * @param name @TODO
 * @param value @TODO
 * @param error Error message, e.g. 'Amount too low'
 * @param disabled Flag for disabling the input
 * @param decimals Given amount decimals, e.g. `18`
 * @param onChange Optional callback with the amount value
 */
export const AmountInput: FC<Props> = ({
  name,
  error,
  disabled = false,
  decimals,
  onChange,
  value,
}) => {
  const step = useMemo(() => (decimals ? decimalsStep(decimals) : ''), [
    decimals,
  ]);

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
      error={error}
      type="number"
      min="0"
      placeholder="0.0"
      step={step}
      value={value || ''}
      onKeyPress={handleKeyPress}
      onChange={handleChange}
      disabled={disabled}
    />
  );
};
