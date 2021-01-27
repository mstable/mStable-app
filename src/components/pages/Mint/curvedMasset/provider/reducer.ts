import { Reducer } from 'react';
import { pipeline } from 'ts-pipe-compose';
import { BigDecimal } from '../../../../../web3/BigDecimal';
import { AssetState } from '../../../../forms/MultiAssetExchange';
import { Action, Actions, State } from './types';

const BIG_ZERO = new BigDecimal((0e18).toString());
const BIG_ONE = new BigDecimal((1e18).toString());

const indexMapping: { [key: string]: number } = {
  WBTC: 0,
  RENBTC: 1,
  SBTC: 2,
};

const mockExchangeMapping: { [key: string]: BigDecimal } = {
  WBTC: new BigDecimal((1e18).toString()),
  RENBTC: new BigDecimal((2e18).toString()),
  SBTC: new BigDecimal((0.5e18).toString()),
};

const calculateOutputAmount = (
  state: State,
): { [address: string]: AssetState } => {
  if (!state.massetState) return state.outputAssets;

  const { inputAssets, massetState } = state;
  const massetTokenAddress = massetState.token.address;

  const {
    [state.massetState.token.address]: outputAsset,
    ...outputAssets
  } = state.outputAssets;

  // TODO: - Plug in actual exchange rates
  const cumulativeAmount = Object.values(inputAssets)
    .map<BigDecimal>(({ amount, exchangeRate }) =>
      exchangeRate && amount ? amount : BIG_ZERO,
    )
    .reduce((a, b) => a.add(b));

  const weightedAmount = Object.values(inputAssets)
    .map<BigDecimal>(({ amount, exchangeRate }) =>
      exchangeRate && amount
        ? amount?.mulTruncate(exchangeRate.exact)
        : BIG_ZERO,
    )
    .reduce((a, b) => a.add(b));

  const exchangeRate =
    weightedAmount.simple > 0
      ? weightedAmount.divPrecisely(cumulativeAmount)
      : undefined;

  return {
    ...outputAssets,
    [massetTokenAddress]: {
      ...outputAsset,
      exchangeRate,
      amount: weightedAmount,
      formValue: weightedAmount?.format(2, false),
    },
  };
};

const initialize = (state: State): State =>
  !state.initialized && !!state.massetState
    ? {
        ...state,
        initialized: true,
        inputAssets: Object.values(state.massetState.bAssets).reduce<
          State['inputAssets']
        >(
          (_bAssets, { address, token, token: { decimals, symbol } }) => ({
            ..._bAssets,
            [address]: {
              address,
              decimals,
              enabled: false,
              token,
              index: indexMapping[symbol.toUpperCase()],
              exchangeRate: mockExchangeMapping[symbol.toUpperCase()],
            },
          }),
          {},
        ),
        outputAssets: {
          [state.massetState.token.address]: {
            index: 0,
            address: state.massetState.token.address,
            decimals: state.massetState.token.decimals,
            enabled: false,
            token: state.massetState.token,
          },
        },
      }
    : state;

const reduce: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Data:
      return { ...state, massetState: action.payload };

    case Actions.SetBassetAmount: {
      const { formValue, address } = action.payload;
      const { [address]: inputAsset, ...inputAssets } = state.inputAssets;
      const amount = BigDecimal.maybeParse(formValue, inputAsset.decimals);

      const newState: State = {
        ...state,
        inputAssets: {
          ...inputAssets,
          [address]: {
            ...inputAsset,
            amount,
            formValue,
          },
        },
      };

      return {
        ...newState,
        outputAssets: calculateOutputAmount(newState),
      };
    }

    case Actions.SetBassetMaxAmount: {
      const { address } = action.payload;
      const { [address]: inputAsset, ...inputAssets } = state.inputAssets;
      const amount = inputAsset.token.balance;
      const formValue = inputAsset.token.balance?.format(2, false);

      return {
        ...state,
        amountTouched: true,
        inputAssets: {
          ...inputAssets,
          [address]: {
            ...inputAsset,
            amount,
            formValue,
          },
        },
      };
    }

    default:
      throw new Error('Unhandled action type');
  }
};

export const reducer: Reducer<State, Action> = pipeline(reduce, initialize);
