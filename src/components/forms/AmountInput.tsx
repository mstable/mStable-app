import React, {
  ChangeEventHandler,
  FC,
  KeyboardEventHandler,
  useCallback,
  useMemo,
} from 'react';
import styled from 'styled-components';
import { decimalsStep } from '../../web3/strings';
import { Button } from '../core/Button';
import { FontSize, Size } from '../../theme';

interface Props {
  error?: string;
  value: string | void;
  decimals: number | void;
  onChange?(value: string): void;
  onSetMax?(): void;
  disabled?: boolean;
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  flex-basis: 100%;
  min-width: 0;
`;

const Input = styled.input<{ error: string | void }>`
  background: transparent;
  border: none
    ${props =>
      props.error ? props.theme.color.red : props.theme.color.foreground};
  border-bottom: 2px solid;
  color: ${props =>
    props.error ? props.theme.color.red : props.theme.color.foreground};
  font-size: ${FontSize.l};
  font-weight: bold;
  min-width: 0;
  outline: none;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.s};
`;

const MaxButton = styled(Button)`
  border: 0;
`;

/**
 * AmountInput component
 * Form input for selecting an amount denominated in given decimals.
 *
 * @param error Error message, e.g. 'Amount too low'
 * @param disabled Flag for disabling the input
 * @param decimals Given amount decimals, e.g. `18`
 * @param onChange Optional callback with the amount value
 * @param onSetMax Optional callback called on setting the max value
 */
export const AmountInput: FC<Props> = ({
  error,
  disabled = false,
  decimals,
  onChange,
  onSetMax,
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
      onChange?.(event.target.value);
    },
    [onChange],
  );

  const handleMax = useCallback(() => {
    onSetMax?.();
  }, [onSetMax]);

  return (
    <Container>
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
      {onSetMax ? (
        <MaxButton type="button" onClick={handleMax} size={Size.xs}>
          Max
        </MaxButton>
      ) : null}
    </Container>
  );
};
