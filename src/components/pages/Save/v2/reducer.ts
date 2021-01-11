import { Reducer } from 'react';
import { pipeline } from 'ts-pipe-compose';

import { BigDecimal } from '../../../../web3/BigDecimal';
import { Fields } from '../../../../types';
import { Action, Actions, ExchangeState, SaveMode, State } from './types';
import { validate } from './validate';

interface TokenPayload {
  field: Fields;
  tokenAddress?: string;
}

const getExchangeRate = (state: State): BigDecimal | undefined => {
  const { massetState, mode } = state;
  if (!massetState) return undefined;

  const rate = massetState.savingsContracts.v2?.latestExchangeRate?.rate;

  if (!rate) return undefined;

  if (mode === SaveMode.Deposit) return rate;

  return new BigDecimal((1e18).toString()).divPrecisely(rate);
};

const initialize = (state: State): State => {
  if (!state.initialized && state.massetState) {
    const defaultInputTokenAddress = state.massetState.address;
    const defaultOutputTokenAddress =
      state.massetState.savingsContracts.v2?.address;

    if (!defaultOutputTokenAddress) return state;

    return {
      ...state,
      initialized: true,
      exchange: {
        rate: getExchangeRate(state),
        input: {
          formValue: state.exchange.input.formValue,
          tokenAddress: defaultInputTokenAddress,
        },
        output: {
          tokenAddress: defaultOutputTokenAddress,
        },
        feeAmountSimple: null,
      },
    };
  }
  return state;
};

const updateExchangeState = (
  state: State,
  payload: TokenPayload,
): ExchangeState => {
  const { field, tokenAddress } = payload;
  return {
    ...state.exchange,
    [field]: {
      tokenAddress,
      ...(tokenAddress ? { token: state.tokens[tokenAddress] } : {}),
    },
    rate: getExchangeRate(state),
  };
};

const calcOutput = (
  state: State,
  inputAmount?: BigDecimal,
): State['exchange']['output'] => {
  const { exchange } = state;
  const exchangeRate = exchange.rate;

  const amount =
    inputAmount && exchangeRate && inputAmount.mulTruncate(exchangeRate.exact);

  const formValue = amount?.format(2, false);

  return {
    ...state.exchange.output,
    amount,
    formValue,
  };
};

// TODO split up this logic for different forms
const reduce: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Data: {
      const { tokens, massetState } = action.payload;

      const { input, output } = state.exchange;

      const exchange = {
        ...state.exchange,
        input: input.tokenAddress
          ? {
              ...input,
              token: tokens[input.tokenAddress],
            }
          : input,
        output: output.tokenAddress
          ? {
              ...output,
              token: tokens[output.tokenAddress],
            }
          : output,
      };

      const nextState: State = { ...state, massetState, exchange };

      return {
        ...nextState,
        exchange: {
          ...nextState.exchange,
          rate: getExchangeRate(nextState),
        },
      };
    }

    // input change only for now.
    case Actions.SetInput: {
      const { exchange } = state;
      const { formValue } = action.payload;

      // will only work with musd - imusd, not other assets.
      const amount = BigDecimal.maybeParse(
        formValue,
        exchange.input.token?.decimals,
      );

      return {
        ...state,
        exchange: {
          ...state.exchange,
          input: {
            ...state.exchange.input,
            amount,
            formValue,
          },
          output: calcOutput(state, amount),
        },
        touched: true,
      };
    }

    case Actions.SetToken:
      return {
        ...state,
        exchange: updateExchangeState(state, action.payload),
      };

    case Actions.SetMaxInput: {
      const { exchange, massetState } = state;
      const inputAddress = exchange.input.tokenAddress;
      if (!inputAddress || !massetState) return state;

      const inputToken = exchange.input.token;
      const amount = inputToken?.balance;
      const formValue = amount?.format(2, false);

      return {
        ...state,
        exchange: {
          ...state.exchange,
          input: {
            ...state.exchange.input,
            amount,
            formValue,
          },
          output: calcOutput(state, amount),
        },
        touched: true,
      };
    }

    case Actions.SetModeType: {
      const mode = action.payload;

      // disable switching until initialised, or if same tab clicked
      if (!state.initialized || mode === state.mode) return state;

      const nextState = {
        ...state,
        mode,
      };

      // switch exchange assets
      const { input, output } = state.exchange;
      return {
        ...nextState,
        exchange: {
          ...state.exchange,
          input: output,
          output: input,
          rate: getExchangeRate(nextState),
        },
      };
    }

    default:
      throw new Error('Unhandled action type');
  }
};

export const reducer: Reducer<State, Action> = pipeline(
  reduce,
  initialize,
  validate,
);
