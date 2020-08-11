import { Reducer } from 'react';
import { pipe, pipeline } from 'ts-pipe-compose';

import { Action, Actions, Mode, State } from './types';
import { applyValidation } from './validate';
import { BigDecimal } from '../../../web3/BigDecimal';
import { SCALE } from '../../../web3/constants';
import { DataState } from '../../../context/DataProvider/types';
import { recalculateState } from '../../../context/DataProvider/recalculateState';

const reduce: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Data:
      return { ...state, dataState: action.payload };

    case Actions.SetRedemptionAmount: {
      const formValue = action.payload;
      const amountInMasset = BigDecimal.maybeParse(
        formValue,
        state.dataState?.mAsset.decimals || 18,
      );
      return {
        ...state,
        touched: true,
        amountInMasset,
        formValue: formValue || undefined,
      };
    }

    case Actions.ToggleBassetEnabled: {
      const address = action.payload;

      const bAssets = Object.values(state.bAssets).reduce(
        (_bAssets, bAsset) => {
          let enabled = false;

          if (bAsset.address === address) {
            // It should be enabled if switching from RedeemMasset;
            // otherwise it should be toggled.
            enabled = state.mode === Mode.RedeemMasset || !bAsset.enabled;
          }

          return {
            ..._bAssets,
            [bAsset.address]: {
              ...bAsset,
              enabled,
              amount: enabled ? bAsset.amount : undefined,
            },
          };
        },
        state.bAssets,
      );

      return {
        ...state,
        bAssets,
        touched: true,
        // In any case, toggling bAssets means redeeming single.
        mode: Mode.RedeemSingle,
      };
    }

    case Actions.SetMaxRedemptionAmount: {
      const { dataState, mode } = state;

      if (!dataState || mode !== Mode.RedeemMasset) return state;

      const maxAmount = dataState.mAsset.balance;

      return {
        ...state,
        amountInMasset: maxAmount,
        formValue: maxAmount.format(2, false),
        touched: true,
      };
    }

    case Actions.ToggleMode: {
      // TODO redeemMulti
      const mode =
        state.mode === Mode.RedeemSingle
          ? Mode.RedeemMasset
          : Mode.RedeemSingle;

      const enabled = mode !== Mode.RedeemSingle;
      return {
        ...state,
        mode,
        bAssets: Object.values(state.bAssets).reduce(
          (_bAssets, bAsset) => ({
            ..._bAssets,
            [bAsset.address]: {
              ...bAsset,
              enabled,
              amount: enabled ? bAsset.amount : undefined,
            },
          }),
          state.bAssets,
        ),
      };
    }

    default:
      throw new Error('Unhandled action type');
  }
};

const initialize = (state: State): State =>
  !state.initialized && state.dataState
    ? {
        ...state,
        initialized: true,
        bAssets: Object.keys(state.dataState.bAssets).reduce(
          (_bAssets, address) => ({
            ..._bAssets,
            [address]: { address, enabled: true },
          }),
          {},
        ),
      }
    : state;

const resetTouched = (state: State): State =>
  state.touched
    ? {
        ...state,
        touched:
          !!state.amountInMasset ||
          Object.values(state.bAssets).some(b => b.enabled),
      }
    : state;

const updateFeeAmount = (state: State): State => {
  if (state.initialized && state.dataState) {
    if (state.amountInMasset) {
      if (state.mode === Mode.RedeemMasset) {
        const feeAmount = state.amountInMasset.mulTruncate(
          state.dataState.mAsset.redemptionFeeRate,
        );

        const amountInMassetPlusFee = state.amountInMasset.sub(feeAmount);

        return {
          ...state,
          feeAmount,
          amountInMassetPlusFee,
        };
      }
      if (state.dataState.mAsset.overweightBassets.length === 0) {
        const feeAmount = state.amountInMasset.mulTruncate(
          state.dataState.mAsset.feeRate,
        );

        const amountInMassetPlusFee = state.amountInMasset.sub(feeAmount);

        return {
          ...state,
          feeAmount,
          amountInMassetPlusFee,
        };
      }
    }

    // Reset the values if necessary
    return state.feeAmount
      ? {
          ...state,
          feeAmount: undefined,
          amountInMassetPlusFee: state.amountInMasset,
        }
      : state;
  }

  return state;
};

const updateBassetAmountsRedeemMasset = (
  state: State & { dataState: DataState; amountInMasset: BigDecimal },
): State['bAssets'] => {
  const {
    dataState: { mAsset, bAssets },
    amountInMasset,
  } = state;

  const total = Object.values(bAssets).reduce(
    (_total, { totalVaultInMasset }) => _total.add(totalVaultInMasset),
    new BigDecimal(0, mAsset.decimals),
  );

  return Object.values(bAssets).reduce((_bAssets, bAsset) => {
    if (total.exact.eq(0)) return _bAssets;

    const { address, ratio, totalVaultInMasset, decimals } = bAsset;

    const percentage = totalVaultInMasset.divPrecisely(total);
    const scaledAmount = percentage.mulTruncate(amountInMasset.exact);
    const amount = scaledAmount.divRatioPrecisely(ratio).setDecimals(decimals);
    // e.g. (1e8 * (1000e15-1e15)) / 1e18 = (1e8 * (999e15)) / 1e18 = 9.99e7
    // e.g. (1e8 * (1e18-0)) / 1e18 = 1e8
    const amountMinusFee = amount.mulTruncate(
      SCALE.sub(mAsset.redemptionFeeRate),
    );

    return {
      ..._bAssets,
      [address]: {
        ...state.bAssets[address],
        amount,
        amountMinusFee,
      },
    };
  }, state.bAssets);
};

const updateBassetAmountsRedeemSingle = (
  state: State & { dataState: DataState; amountInMasset: BigDecimal },
): State['bAssets'] => {
  const { amountInMasset, feeAmount } = state;
  const [enabledBasset] = Object.values(state.bAssets).filter(b => b.enabled);

  if (!(enabledBasset && amountInMasset)) {
    return state.bAssets;
  }

  const { address } = enabledBasset;
  const {
    [address]: { ratio, decimals },
  } = state.dataState.bAssets;

  const amount = amountInMasset.divRatioPrecisely(ratio).setDecimals(decimals);
  const amountMinusFee = feeAmount
    ? amount.sub(feeAmount.divRatioPrecisely(ratio).setDecimals(decimals))
    : amount;

  return Object.values(state.bAssets).reduce(
    (_bAssets, bAsset) => ({
      ..._bAssets,
      [bAsset.address]: {
        ...bAsset,
        amount: bAsset.address === address ? amount : undefined,
        amountMinusFee: bAsset.address === address ? amountMinusFee : undefined,
      },
    }),
    state.bAssets,
  );
};

const unsetBassetAmounts = (state: State): State => ({
  ...state,
  bAssets: Object.values(state.bAssets).reduce(
    (_bAssets, bAsset) =>
      bAsset.amount
        ? {
            ..._bAssets,
            [bAsset.address]: { ...bAsset, amount: undefined },
          }
        : _bAssets,
    state.bAssets,
  ),
});

const updateBassetAmounts = (state: State): State => {
  if (state.initialized && state.dataState) {
    if (state.amountInMasset) {
      return {
        ...state,
        bAssets:
          state.mode === Mode.RedeemMasset
            ? updateBassetAmountsRedeemMasset(
                state as State & {
                  dataState: DataState;
                  amountInMasset: BigDecimal;
                },
              )
            : updateBassetAmountsRedeemSingle(
                state as State & {
                  dataState: DataState;
                  amountInMasset: BigDecimal;
                },
              ),
      };
    }
    // Unset the values if necessary
    return unsetBassetAmounts(state);
  }

  return state;
};

const simulateRedeemSingle = ({
  amountInMasset,
  bAssets,
  dataState,
}: State & { dataState: DataState }): DataState => {
  const [bAsset] = Object.values(bAssets).filter(b => b.enabled);
  const { address, amount } = bAsset || {};

  if (!(bAsset && amount && amountInMasset)) {
    return dataState;
  }

  const { totalSupply, balance: mAssetBalance, ...mAsset } = dataState.mAsset;

  const {
    [address]: { balance, totalVault },
  } = dataState.bAssets;

  return {
    ...dataState,
    mAsset: {
      ...mAsset,
      totalSupply: totalSupply.sub(amountInMasset),
      balance: mAssetBalance.sub(amountInMasset),
    },
    bAssets: {
      ...dataState.bAssets,
      [address]: {
        ...dataState.bAssets[address],
        balance: balance.add(amount),
        totalVault: totalVault.sub(amount),
      },
    },
  };
};

const simulateRedeemMasset = ({
  amountInMasset,
  bAssets,
  dataState: {
    mAsset: { totalSupply, balance: mAssetBalance, ...mAsset },
  },
  dataState,
}: State & { dataState: DataState }): DataState => {
  if (!amountInMasset) return dataState;

  return {
    ...dataState,
    mAsset: {
      ...mAsset,
      totalSupply: totalSupply.sub(amountInMasset),
      balance: mAssetBalance.sub(amountInMasset),
    },
    bAssets: Object.values(bAssets).reduce((_bAssets, { address, amount }) => {
      const { balance, totalVault } = dataState.bAssets[address];
      return {
        ..._bAssets,
        [address]: {
          ...dataState.bAssets[address],
          balance: amount ? balance.add(amount) : balance,
          totalVault: amount ? totalVault.sub(amount) : totalVault,
        },
      };
    }, dataState.bAssets),
  };
};

const simulate = (state: State): State =>
  state.initialized && state.dataState
    ? {
        ...state,
        simulated: pipe(
          state as State & { dataState: DataState },
          state.mode === Mode.RedeemMasset
            ? simulateRedeemMasset
            : simulateRedeemSingle,
          recalculateState,
        ),
      }
    : state;

export const reducer: Reducer<State, Action> = pipeline(
  reduce,
  initialize,
  updateFeeAmount,
  updateBassetAmounts,
  resetTouched,
  simulate,
  applyValidation,
);
