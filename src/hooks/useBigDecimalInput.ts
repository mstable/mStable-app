import { useCallback, useState } from 'react';

import { BigDecimal } from '../web3/BigDecimal';

/**
 * This hook is designed to be used in tandem with amount inputs.
 *
 * @param initialValue Initial BigDecimal value (optional)
 * @param decimals Decimals to create BigNumber values with
 * @returns [value, formValue, onChange]
 */
export const useBigDecimalInput = (
  initialValue?: BigDecimal | string,
  decimals = 18,
): [
  BigDecimal | undefined,
  string | null,
  (formValue: string | null) => void,
] => {
  const [value, setValue] = useState<BigDecimal | undefined>(
    initialValue instanceof BigDecimal
      ? initialValue
      : BigDecimal.maybeParse(initialValue, decimals),
  );

  const [formValue, setFormValue] = useState<string | null>(
    value?.format(2, false) ?? null,
  );

  const onChange = useCallback(
    (_formValue: string | null) => {
      setFormValue(_formValue);
      setValue(BigDecimal.maybeParse(_formValue, decimals));
    },
    [decimals],
  );

  return [value, formValue, onChange];
};
