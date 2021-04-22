import { useCallback, useState } from 'react'

export const useSimpleInput = (
  initialValue?: number,
  options?: { min?: number; max?: number },
): [number | undefined, string | undefined, (formValue?: string) => void] => {
  const [value, setValue] = useState<number>(initialValue ?? 0)

  const [formValue, setFormValue] = useState<string | undefined>(value.toString())

  const onChange = useCallback(
    _formValue => {
      const amount = parseFloat(_formValue)

      if (amount && typeof options === 'object' && ((options.min && amount < options.min) || (options.max && amount > options.max))) {
        // Ignore inputs outside parameters
        return
      }

      setFormValue(_formValue ?? undefined)
      setValue(amount)
    },
    [options],
  )

  return [value, formValue, onChange]
}

export const useSlippage = useSimpleInput.bind(null, 0.1, {
  min: 0.01,
  max: 99.99,
})
