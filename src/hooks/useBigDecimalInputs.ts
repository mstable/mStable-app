import { Reducer, useMemo, useReducer } from 'react';

import { BigDecimal } from '../web3/BigDecimal';

export interface InitialiserArg {
  [address: string]: {
    decimals: number;
    defaultValue?: BigDecimal;
    balance?: BigDecimal;
    symbol?: string;
  };
}

interface InputValue {
  amount?: BigDecimal;
  balance?: BigDecimal;
  formValue?: string;
  decimals: number;
  symbol?: string;
}

interface InputValues {
  [address: string]: InputValue;
}

interface InputCallbacks {
  [address: string]: {
    setAmount(amount?: BigDecimal): void;
    setMaxAmount(): void;
    setFormValue(formValue?: string): void;
  };
}

enum Actions {
  SetAmount,
  SetMaxAmount,
  SetFormValue,
}

type Action =
  | {
      type: Actions.SetAmount;
      payload: { address: string; amount?: BigDecimal };
    }
  | {
      type: Actions.SetMaxAmount;
      payload: { address: string };
    }
  | {
      type: Actions.SetFormValue;
      payload: { address: string; formValue?: string };
    };

interface State {
  values: InputValues;
  serializedAddresses: string;
}

const setFormValue = (
  value: InputValue,
  { payload: { formValue } }: Extract<Action, { type: Actions.SetFormValue }>,
): InputValue => ({
  ...value,
  amount: BigDecimal.maybeParse(formValue, value.decimals),
  formValue,
});

const setAmount = (
  value: InputValue,
  { payload: { amount } }: Extract<Action, { type: Actions.SetAmount }>,
): InputValue => ({
  ...value,
  amount,
  formValue: amount?.simple !== 0 ? amount?.format(2, false) : undefined,
});

const setMaxAmount = (value: InputValue): InputValue => {
  const amount = value.balance;
  const formValue = amount?.format(2, false);
  return {
    ...value,
    amount,
    formValue,
  };
};

const reducer: Reducer<State, Action> = (
  { values, serializedAddresses },
  action,
) => ({
  serializedAddresses,
  values: {
    ...values,
    [action.payload.address]:
      action.type === Actions.SetFormValue
        ? setFormValue(values[action.payload.address], action)
        : action.type === Actions.SetAmount
        ? setAmount(values[action.payload.address], action)
        : setMaxAmount(values[action.payload.address]),
  },
});

const initialise = (initialiserArg: InitialiserArg): State => {
  const values = Object.fromEntries(
    Object.entries(initialiserArg).map(
      ([address, { decimals, defaultValue: amount, balance, symbol }]) => {
        return [
          address,
          {
            decimals,
            amount,
            formValue: amount?.format(2, false),
            balance,
            symbol,
          },
        ];
      },
    ),
  );

  const serializedAddresses = Object.keys(values).join(',');

  return { values, serializedAddresses };
};

/**
 * Hook to abstract getting/setting form values and BigDecimals for a map
 * of addresses to decimals.
 *
 * @note The map of inputs will only contain what it received at first call.
 *
 * @param initialiserArg: Map of addresses to decimals/default value
 */
export const useBigDecimalInputs = (
  initialiserArg: InitialiserArg,
): [InputValues, InputCallbacks] => {
  const [state, dispatch] = useReducer(reducer, initialiserArg, initialise);

  const callbacks = useMemo<InputCallbacks>(
    () =>
      Object.fromEntries(
        state.serializedAddresses.split(',').map(address => [
          address,
          {
            setAmount: amount => {
              dispatch({
                type: Actions.SetAmount,
                payload: { address, amount },
              });
            },
            setMaxAmount: () => {
              dispatch({
                type: Actions.SetMaxAmount,
                payload: { address },
              });
            },
            setFormValue: formValue => {
              dispatch({
                type: Actions.SetFormValue,
                payload: { address, formValue },
              });
            },
          },
        ]),
      ),
    [state.serializedAddresses],
  );

  return [state.values, callbacks];
};
