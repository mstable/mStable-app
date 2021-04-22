import { Reducer, useMemo, useReducer } from 'react'

import { BigDecimal } from '../web3/BigDecimal'

export interface UseBigDecimalInputsArg {
  [address: string]: {
    decimals: number
    defaultValue?: BigDecimal
  }
}

export type BigDecimalInputValue = {
  address: string
  decimals: number
  formValue?: string
  touched?: boolean
  amount?: BigDecimal
} & ({ touched: true; amount: BigDecimal } | {})

export interface BigDecimalInputValues {
  [address: string]: BigDecimalInputValue
}

export interface BigDecimalInputCallbacks {
  [address: string]: {
    setAmount(amount?: BigDecimal): void
    setFormValue(formValue?: string): void
  }
}

enum Actions {
  SetAmount,
  SetFormValue,
}

type Action =
  | {
      type: Actions.SetAmount
      payload: { address: string; amount?: BigDecimal }
    }
  | {
      type: Actions.SetFormValue
      payload: { address: string; formValue?: string }
    }

interface State {
  values: BigDecimalInputValues
  serializedAddresses: string
}

const setFormValue = (
  value: BigDecimalInputValue,
  { payload: { formValue } }: Extract<Action, { type: Actions.SetFormValue }>,
): BigDecimalInputValue => ({
  ...value,
  amount: BigDecimal.maybeParse(formValue, value.decimals),
  touched: !!(formValue && formValue !== '0'),
  formValue,
})

const setAmount = (
  value: BigDecimalInputValue,
  { payload: { amount } }: Extract<Action, { type: Actions.SetAmount }>,
): BigDecimalInputValue => ({
  ...value,
  amount,
  touched: !!(amount?.simple && amount.simple > 0),
  formValue: amount?.simple !== 0 ? amount?.string : undefined,
})

const reducer: Reducer<State, Action> = ({ values, serializedAddresses }, action) => ({
  serializedAddresses,
  values: {
    ...values,
    [action.payload.address]:
      action.type === Actions.SetFormValue
        ? setFormValue(values[action.payload.address], action)
        : setAmount(values[action.payload.address], action),
  },
})

const initialise = (initialiserArg: UseBigDecimalInputsArg): State => {
  const values = Object.fromEntries(
    Object.entries(initialiserArg).map(([address, { decimals, defaultValue: amount }]) => {
      return [
        address,
        {
          address,
          decimals,
          amount,
          formValue: amount?.string,
        },
      ]
    }),
  )

  const serializedAddresses = Object.keys(values).join(',')

  return { values, serializedAddresses }
}

/**
 * Hook to abstract getting/setting form values and BigDecimals for a map
 * of addresses to decimals.
 *
 * @note The map of inputs will only contain what it received at first call.
 *
 * @param initialiserArg: Map of addresses to decimals/default value
 */
export const useBigDecimalInputs = (initialiserArg: UseBigDecimalInputsArg): [BigDecimalInputValues, BigDecimalInputCallbacks] => {
  const [state, dispatch] = useReducer(reducer, initialiserArg, initialise)

  const callbacks = useMemo<BigDecimalInputCallbacks>(
    () =>
      Object.fromEntries(
        state.serializedAddresses.split(',').map(address => [
          address,
          {
            setAmount: amount => {
              dispatch({
                type: Actions.SetAmount,
                payload: { address, amount },
              })
            },
            setFormValue: formValue => {
              dispatch({
                type: Actions.SetFormValue,
                payload: { address, formValue },
              })
            },
          },
        ]),
      ),
    [state.serializedAddresses],
  )

  return [state.values, callbacks]
}
