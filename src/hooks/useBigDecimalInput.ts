import { useCallback, useEffect, useState } from 'react'
import { usePrevious } from 'react-use'

import { BigDecimal } from '../web3/BigDecimal'

/**
 * This hook is designed to be used in tandem with amount inputs.
 *
 * @param initialValue Initial BigDecimal value (optional)
 * @param options Options to create BigNumber values with
 * @returns [value, formValue, onChange, setValue]
 */
export const useBigDecimalInput = (
  initialValue?: BigDecimal | string,
  options?: number | { min?: number; max?: number; decimals?: number },
): [
  BigDecimal | undefined,
  string | undefined,
  (formValue: (string | null) | (string | undefined)) => void,
  (amount?: BigDecimal) => void,
] => {
  const decimals = (typeof options === 'number' ? options : options?.decimals) ?? 18
  const prevDecimals = usePrevious(decimals)

  const [value, setValue] = useState<BigDecimal | undefined>(
    initialValue instanceof BigDecimal ? initialValue : BigDecimal.maybeParse(initialValue, decimals),
  )

  const [formValue, setFormValue] = useState<string | undefined>(value?.simple !== 0 ? value?.string : undefined)

  const onChange = useCallback(
    _formValue => {
      const amount = BigDecimal.maybeParse(_formValue, decimals)

      if (
        amount &&
        typeof options === 'object' &&
        ((options.min && amount.simple < options.min) || (options.max && amount.simple > options.max))
      ) {
        // Ignore inputs outside parameters
        return
      }

      setFormValue(_formValue ?? undefined)
      setValue(BigDecimal.maybeParse(_formValue, decimals))
    },
    [decimals, options],
  )

  useEffect(() => {
    if (decimals !== prevDecimals) {
      setValue(BigDecimal.maybeParse(formValue, decimals))
    }
  }, [decimals, formValue, prevDecimals])

  return [value, formValue, onChange, setValue]
}
