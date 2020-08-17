import { Reducer } from 'react';
import { pipeline } from 'ts-pipe-compose';

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

    case Actions.SetBassetAmount: {
      if (state.mode === Mode.RedeemMasset) return state;

      const { formValue, address } = action.payload;

      const {
        bAssets: { [address]: bAsset, ...bAssets },
        dataState: { bAssets: { [address]: { decimals } } = {} } = {},
      } = state;

      if (!decimals) return state;

      const amount = BigDecimal.maybeParse(formValue, decimals);
      return {
        ...state,
        touched: true,
        bAssets: {
          ...bAssets,
          [address]: {
            ...bAsset,
            amount,
            formValue,
          },
        },
      };
    }

    case Actions.SetMassetAmount: {
      const formValue = action.payload;
      const amountInMasset = BigDecimal.maybeParse(
        formValue,
        state.dataState?.mAsset.decimals || 18,
      );
      return {
        ...state,
        amountInMasset,
        formValue: formValue || undefined,
        touched: true,
      };
    }

    case Actions.ToggleBassetEnabled: {
      const address = action.payload;
      const { [address]: bAsset } = state.bAssets;
      let { mode } = state;

      // Toggle the selected bAsset.
      let bAssets = {
        ...state.bAssets,
        [address]: {
          ...bAsset,
          enabled: !bAsset.enabled,
        },
      };

      const bAssetsArr = Object.values(bAssets);
      const enabled = bAssetsArr.filter(b => b.enabled);

      // When toggling bAssets, the mode will either be set to RedeemSingle or
      // RedeemMulti; setting the mode to RedeemMasset must be done explicity.
      if (enabled.length === 1) {
        mode = Mode.RedeemSingle;
      } else if (mode !== Mode.RedeemMulti) {
        mode = Mode.RedeemMulti;
      }

      // Unset the amounts of other values if switching to RedeemMulti
      // from RedeemMasset.
      if (state.mode === Mode.RedeemMasset && mode === Mode.RedeemMulti) {
        bAssets = Object.values(bAssets).reduce<State['bAssets']>(
          (prev, current) =>
            current.address === address
              ? prev
              : {
                  ...prev,
                  [current.address]: {
                    ...current,
                    amount: undefined,
                    formValue: null,
                  },
                },
          bAssets,
        );
      }

      return {
        ...state,
        bAssets,
        mode,
        touched: true,
      };
    }

    case Actions.SetMassetMaxAmount: {
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

    case Actions.ToggleRedeemMasset: {
      const mode =
        state.mode === Mode.RedeemMasset
          ? Mode.RedeemSingle
          : Mode.RedeemMasset;

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

const initialize = (state: State): State => {
  const { initialized, dataState } = state;

  if (!initialized && dataState) {
    return {
      ...state,
      initialized: true,
      bAssets: Object.keys(dataState.bAssets).reduce(
        (_bAssets, address) => ({
          ..._bAssets,
          [address]: { address, enabled: true },
        }),
        {},
      ),
    };
  }

  return state;
};

const resetTouched = (state: State): State => {
  const { touched, amountInMasset, bAssets } = state;

  if (touched) {
    return {
      ...state,
      touched: !!amountInMasset || Object.values(bAssets).some(b => b.enabled),
    };
  }

  return state;
};

const updateFeeAmount = (state: State): State => {
  const { initialized, dataState, amountInMasset, mode } = state;
  if (initialized && dataState && amountInMasset) {
    if (amountInMasset) {
      if (mode === Mode.RedeemMasset) {
        const feeAmount = amountInMasset.mulTruncate(
          dataState.mAsset.redemptionFeeRate,
        );

        const amountInMassetPlusFee = amountInMasset.sub(feeAmount);

        return {
          ...state,
          feeAmount,
          amountInMassetPlusFee,
        };
      }

      if (dataState.mAsset.overweightBassets.length === 0) {
        const feeAmount = amountInMasset.mulTruncate(dataState.mAsset.feeRate);

        const amountInMassetPlusFee = amountInMasset.sub(feeAmount);

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

const updateBassetAmounts = (state: State): State => {
  if (state.dataState && state.mode === Mode.RedeemMasset) {
    const {
      dataState: { mAsset, bAssets: bAssetsData },
      amountInMasset,
    } = state;

    if (amountInMasset) {
      const enabled = Object.values(bAssetsData).filter(
        b => state.bAssets[b.address].enabled,
      );

      const total = enabled.reduce(
        (_total, { totalVaultInMasset }) => _total.add(totalVaultInMasset),
        new BigDecimal(0, mAsset.decimals),
      );

      const bAssets = enabled.reduce<State['bAssets']>((_bAssets, bAsset) => {
        if (total.exact.eq(0)) return _bAssets;

        const { address, ratio, totalVaultInMasset, decimals } = bAsset;

        const percentage = totalVaultInMasset.divPrecisely(total);
        const scaledAmount = percentage.mulTruncate(amountInMasset.exact);
        const amount = scaledAmount
          .divRatioPrecisely(ratio)
          .setDecimals(decimals);
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
            // Important: the amount shown should have the fee subtracted
            formValue: amountMinusFee.format(2, false),
          },
        };
      }, state.bAssets);

      return {
        ...state,
        bAssets,
      };
    }

    return {
      ...state,
      bAssets: Object.values(state.bAssets).reduce(
        (_bAssets, bAsset) => ({
          ..._bAssets,
          [bAsset.address]: {
            ...bAsset,
            amount: undefined,
            formValue: null,
          },
        }),
        state.bAssets,
      ),
    };
  }
  return state;
};

const updateMassetAmount = (state: State): State => {
  const { dataState, mode, bAssets } = state;

  if (dataState && mode !== Mode.RedeemMasset) {
    const amountInMasset = Object.values(bAssets).reduce<
      State['amountInMasset']
    >((prev, { enabled, amount, address }) => {
      if (enabled && amount) {
        const scaledBassetAmount = amount.mulRatioTruncate(
          dataState.bAssets[address].ratio,
        );

        return (prev || new BigDecimal(0, dataState.mAsset.decimals)).add(
          scaledBassetAmount,
        );
      }

      return prev;
    }, undefined);

    return {
      ...state,
      amountInMasset,
      formValue: amountInMasset?.format(2, false),
    };
  }

  return state;
};

const unsetDisabledBassetAmounts = (state: State): State => ({
  ...state,
  bAssets: Object.values(state.bAssets).reduce(
    (_bAssets, bAsset) =>
      bAsset.enabled
        ? _bAssets
        : {
            ..._bAssets,
            [bAsset.address]: { ...bAsset, amount: undefined, formValue: null },
          },
    state.bAssets,
  ),
});

const simulateRedemption = ({ capped }: { capped?: boolean } = {}) => ({
  amountInMasset: _amountInMasset,
  bAssets,
  dataState: {
    mAsset: { totalSupply, balance: mAssetBalance, ...mAsset },
  },
  dataState,
}: State & { dataState: DataState }): DataState => {
  let amountInMasset = _amountInMasset;

  // If simulating with capped values, the redemption amount should be
  // capped to the users's mAsset balance, so that we don't simulate
  // redemptions that would not be possible or that would go beyond the
  // mAsset total supply.
  if (capped) {
    amountInMasset = amountInMasset?.exact.gt(mAssetBalance.exact)
      ? mAssetBalance
      : amountInMasset;
  }

  if (!amountInMasset) {
    return dataState;
  }

  return {
    ...dataState,
    mAsset: {
      ...mAsset,
      totalSupply: totalSupply.sub(amountInMasset),
      balance: mAssetBalance.sub(amountInMasset),
    },
    bAssets: Object.values(bAssets).reduce(
      (_bAssets, { address, amount: _amount }) => {
        const { balance, totalVault } = dataState.bAssets[address];

        let amount = _amount;

        // If simulating with capped values, the amount should be limited to
        // the total vault of each bAsset, so that vaults are not pushed into
        // negative balances.
        if (capped) {
          amount = amount?.exact.gt(totalVault.exact) ? totalVault : amount;
        }

        return {
          ..._bAssets,
          [address]: {
            ...dataState.bAssets[address],
            balance: amount ? balance.add(amount) : balance,
            totalVault: amount ? totalVault.sub(amount) : totalVault,
          },
        };
      },
      dataState.bAssets,
    ),
  };
};

const runSimulation = pipeline(simulateRedemption(), recalculateState);

const runCappedSimulation = pipeline(
  simulateRedemption({ capped: true }),
  recalculateState,
);

const simulate = (state: State): State => {
  const { initialized, dataState } = state;

  if (initialized && dataState) {
    const simulation = runSimulation(state as State & { dataState: DataState });
    const cappedSimulation = runCappedSimulation(
      state as State & { dataState: DataState },
    );

    return {
      ...state,
      simulation,
      cappedSimulation,
    };
  }

  return state;
};

export const reducer: Reducer<State, Action> = pipeline(
  reduce,
  initialize,
  unsetDisabledBassetAmounts,
  updateMassetAmount,
  updateBassetAmounts,
  updateFeeAmount,
  resetTouched,
  simulate,
  applyValidation,
);
