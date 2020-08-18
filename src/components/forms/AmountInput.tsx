import React, {
  ChangeEventHandler,
  FC,
  KeyboardEventHandler,
  useCallback,
} from 'react';
import { Input } from './Input';

interface Props {
  className?: string;
  error?: string;
  value: string | null;
  balance?: string | null;
  placeholder?: string;
  onChange?(formValue: string | null): void;
  disabled?: boolean;
}

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
      onChange?.(event.target.value || null);
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
