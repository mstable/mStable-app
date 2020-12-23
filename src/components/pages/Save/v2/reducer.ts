import { Reducer } from 'react';
import { pipeline } from 'ts-pipe-compose';

import { BigDecimal } from '../../../../web3/BigDecimal';
import { Action, Actions, ExchangeState, State, TokenPayload } from './types';
import { TokenQuantityV2 } from '../../../../types';

const initialize = (state: State): State =>
  !state.initialized && state.massetState
    ? {
        ...state,
        initialized: true,
      }
    : state;

const getExchangeRate = (state: State): BigDecimal | undefined => {
  const { massetState } = state;
  if (!massetState) return undefined;
  
  // for now, return musd exchange.
  return massetState.savingsContracts.v2?.latestExchangeRate?.rate
}
    
const setInitialExchangePair = (state: State): State => {
  const { massetState, exchange } = state;
  
  if (massetState && !exchange.rate) {
    const defaultInputToken = massetState.token;
    const defaultOutputToken = massetState.savingsContracts.v2?.token
    
    if (!defaultOutputToken) return state;
    
    return {
      ...state,
      exchange: {
        rate: getExchangeRate(state),
        input: {
          formValue: state.exchange.input.formValue,
          amount: null,
          token: {
            address: defaultInputToken.address,
            decimals: defaultInputToken.decimals,
            symbol: defaultInputToken.symbol,
          },
        },
        output: {
          formValue: null,
          amount: null,
          token: {
            address: defaultOutputToken.address,
            decimals: defaultOutputToken.decimals,
            symbol: defaultOutputToken.symbol,
          },
        },
        feeAmountSimple: null
      }
    }
  }
  return state;
};

const updateToken = (payload: TokenPayload): {[field: string]: TokenQuantityV2 } => {
  const { field, token } = payload;
  
  const formValue = null;
  const amount = BigDecimal.maybeParse(formValue) ?? null;
    
  return {
    [field]: {
      formValue,
      amount,
      token,
    },
  }
}

const updateExchangeState = (state: State, payload: TokenPayload ): ExchangeState => {
  return  {
    ...state.exchange,
    ...updateToken(payload as TokenPayload),
    rate: getExchangeRate(state),
  }
}

const calcOutput = (state: State, inputAmount?: BigDecimal): TokenQuantityV2 => {
  const { exchange } = state;
  const exchangeRate = exchange.rate;
  
  const amount = ((inputAmount && exchangeRate)
          && inputAmount.mulTruncate(exchangeRate.exact)) ?? null
  const formValue = amount?.format(2, false) ?? null;
          
  return {
    ...state.exchange.output,
    amount,
    formValue,
  }
}

const reduce: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Data:
      return { ...state, massetState: action.payload };

    // input change only for now.
    case Actions.SetInput: {
      const { exchange, massetState } = state;
      const { formValue } = action.payload;

      if (!massetState) return state;

      // will only work with musd - imusd, not other assets.
      const amount = BigDecimal.maybeParse(formValue, exchange.input.token?.decimals);
      
      return {
        ...state,
        exchange: {
          ...state.exchange,
          input: {
            ...state.exchange.input,
            amount: amount ?? null,
            formValue,
          },
          output: calcOutput(state, amount),
        }
      }
    }
    
    case Actions.SetToken:
      return {
        ...state,
        exchange: updateExchangeState(state, action.payload)
      };
      
    case Actions.SetMaxInput: {
      const { exchange, massetState } = state;
      const inputAddress = exchange.input.token?.address; 
      if (!inputAddress || !massetState) return state;
      
      const { bAssets } = massetState;
      
      // TODO - include imUSD in this, current fallback is mUSD
      const amount = bAssets[inputAddress]?.token?.balance ?? massetState.token?.balance
      const formValue = amount?.format(2, false);
      
      return {
        ...state,
        exchange: {
          ...state.exchange,
          input: {
            ...state.exchange.input,
            amount,
            formValue
          },
          output: calcOutput(state, amount)
        }
      }
    }

    case Actions.SetModeType: {
      const mode = action.payload;
      // disable switching until initialised
      if (!state.initialized) return state;
      // reject if same tab clicked
      if (mode === state.mode) return state;
      
      const {input, output} = state.exchange;
      return {
        ...state,
        mode,
        // switch exchange assets
        exchange: {
          ...state.exchange,
          input: output,
          output: input,
        }
      };
    }

    default:
      throw new Error('Unhandled action type');
  }
};

export const reducer: Reducer<State, Action> = pipeline(
  reduce,
  initialize,
  setInitialExchangePair,
  // validate,
);
