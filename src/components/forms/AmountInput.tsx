import React, {
  ChangeEventHandler,
  FC,
  KeyboardEventHandler,
  useCallback,
  useMemo,
} from 'react';
import { MaxUint256 } from 'ethers/constants';
import { decimalsStep } from '../../web3/strings';
import styles from './AmountInput.module.css';

interface Props {
  error?: string;
  value: string | void;
  decimals: number | void;
  onChange?(value: string): void;
  onSetMax?(): void;
  disabled?: boolean;
}

const maxUint256 = MaxUint256.toString();

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
    <div className={styles.container}>
      <input
        className={error ? styles.error : ''}
        type="number"
        min="0"
        max={maxUint256}
        placeholder="0.0"
        step={step}
        value={value || ''}
        onKeyPress={handleKeyPress}
        onChange={handleChange}
        disabled={disabled}
      />
      {onSetMax ? (
        <button type="button" onClick={handleMax}>
          Max
        </button>
      ) : null}
    </div>
  );
};
