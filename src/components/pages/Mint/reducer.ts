import { Reducer } from 'react';
import { pipe, pipeline } from 'ts-pipe-compose';

import { DataState } from '../../../context/DataProvider/types';
import { recalculateState } from '../../../context/DataProvider/recalculateState';
import { SCALE } from '../../../web3/constants';
import { BigDecimal } from '../../../web3/BigDecimal';
import { validate } from './validate';
import { Action, Actions, Mode, State } from './types';

const getMaxMintAmount = (state: State): BigDecimal | undefined => {
  if (!state.dataState) return undefined;

  const enabledBassets = Object.values(state.bAssets).filter(
    ({ enabled }) => enabled,
  );

  if (enabledBassets.length !== 1) return undefined;

  const [{ address }] = enabledBassets;
  const {
    balanceInMasset,
    decimals: bAssetDecimals,
    maxWeight,
    maxWeightInMasset,
    ratio,
    totalVaultInMasset,
  } = state.dataState.bAssets[address];

  // Determining max possible mint without pushing bAsset over max weight uses below formula
  // M = ((t * maxW) - c)/(1-maxW)
  // num = ((t * maxW) - c)

  const num = maxWeightInMasset.sub(totalVaultInMasset);

  // den = (1-maxW)
  const den = new BigDecimal(SCALE.sub(maxWeight), num.decimals);

  const maxMint = den.exact.gt(0) ? num.divPrecisely(den) : num;

  const clampedMax = maxMint.exact.gt(balanceInMasset.exact)
    ? balanceInMasset
    : maxMint;

  // Convert the max amount back to bAsset units
  return clampedMax.divRatioPrecisely(ratio).setDecimals(bAssetDecimals);
};

const updateBalances = (dataState: DataState, state: State): DataState =>
  Object.values(dataState.bAssets).reduce((_dataState, bAssetData) => {
    const { address } = bAssetData;
    const { mAsset, bAssets } = _dataState;
    const bAsset = state.bAssets[address];

    if (!(bAsset && bAsset.enabled && bAsset.amount)) return _dataState;

    const { amount } = bAsset;

    // Update mAsset totalSupply and balance
    const mAssetInc = amount
      .mulRatioTruncate(bAssetData.ratio)
      .setDecimals(mAsset.decimals);
    const mAssetTotalSupply = mAsset.totalSupply.add(mAssetInc);
    const mAssetBalance = mAsset.balance.add(mAssetInc);

    // Update bAsset balance and totalVault
    const balance = bAssetData.balance.sub(amount);
    const totalVault = bAssetData.totalVault.add(amount);

    return {
      ..._dataState,
      mAsset: {
        ...mAsset,
        totalSupply: mAssetTotalSupply,
        balance: mAssetBalance,
      },
      bAssets: {
        ...bAssets,
        [address]: {
          ...bAssetData,
          balance,
          totalVault,
        },
      },
    };
  }, dataState);

export const simulate = (state: State): State => ({
  ...state,
  simulation: state.dataState
    ? pipe<DataState, DataState>(
        updateBalances(state.dataState, state),
        recalculateState,
      )
    : undefined,
});

const enableFirstBasset = (state: State): State => {
  const { dataState, toggleTouched } = state;
  if (!dataState || toggleTouched) return state;

  const bAssetsArr = Object.values(state.bAssets);

  if (bAssetsArr.find(b => b.enabled)) return state;

  const [first] = bAssetsArr
    .map(b => dataState.bAssets[b.address])
    .filter(b => !b.overweight && b.balanceInMasset.simple)
    .sort((a, b) => b.balanceInMasset.simple - a.balanceInMasset.simple);

  return first
    ? {
        ...state,
        mode: Mode.MintSingle,
        bAssets: {
          ...state.bAssets,
          [first.address]: { ...state.bAssets[first.address], enabled: true },
        },
      }
    : state;
};

const initialize = (state: State): State =>
  !state.initialized && !!state.dataState
    ? {
        ...state,
        initialized: true,
        bAssets: Object.values(state.dataState.bAssets).reduce<
          State['bAssets']
        >(
          (_bAssets, { address, decimals }) => ({
            ..._bAssets,
            [address]: {
              address,
              decimals,
              enabled: false,
              formValue: null,
            },
          }),
          {},
        ),
      }
    : state;

const resetTouched = (state: State): State =>
  state.amountTouched
    ? {
        ...state,
        amountTouched: Object.values(state.bAssets).some(b => b.formValue),
      }
    : state;

const updateMintAmount = (state: State): State =>
  state.dataState
    ? {
        ...state,
        mintAmount: Object.values(state.bAssets).reduce(
          (_mintAmount, { enabled, amount, address }) =>
            enabled && amount
              ? _mintAmount.add(
                  amount.mulRatioTruncate(
                    (state.dataState as DataState).bAssets[address].ratio,
                  ),
                )
              : _mintAmount,
          new BigDecimal(0, state.dataState.mAsset.decimals),
        ),
      }
    : state;

const reduce: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case Actions.Data:
      return { ...state, dataState: action.payload };

    case Actions.SetBassetAmount: {
      const { formValue, address } = action.payload;
      const { [address]: bAsset, ...bAssets } = state.bAssets;
      const amount = BigDecimal.maybeParse(formValue, bAsset.decimals);
      return {
        ...state,
        amountTouched: true,
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

    case Actions.SetBassetMaxAmount: {
      const enabled = Object.values(state.bAssets).find(b => b.enabled);

      if (!(state.mode === Mode.MintSingle && enabled)) return state;

      const amount = getMaxMintAmount(state);
      return {
        ...state,
        amountTouched: true,
        bAssets: {
          ...state.bAssets,
          [enabled.address]: {
            ...enabled,
            amount,
            formValue: amount?.format(2, false) || null,
          },
        },
      };
    }

    case Actions.ToggleBassetEnabled: {
      const address = action.payload;
      const { [address]: bAsset, ..._bAssets } = state.bAssets;

      const bAssets = {
        ..._bAssets,
        [address]: {
          ...bAsset,
          enabled: !bAsset.enabled,
          amount: !bAsset.enabled ? bAsset.amount : undefined,
          formValue: !bAsset.enabled ? bAsset.formValue : null,
        },
      };

      const mode =
        Object.values(bAssets).filter(b => b.enabled).length === 1
          ? Mode.MintSingle
          : Mode.MintMulti;

      return {
        ...state,
        toggleTouched: true,
        bAssets,
        mode,
      };
    }

    default:
      throw new Error('Unhandled action type');
  }
};

export const reducer: Reducer<State, Action> = pipeline(
  reduce,
  initialize,
  resetTouched,
  enableFirstBasset,
  updateMintAmount,
  simulate,
  validate,
);
