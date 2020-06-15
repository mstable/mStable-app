/* eslint-disable @typescript-eslint/no-use-before-define */

import { Mode, Reasons, State, StateValidator } from './types';
import { DataState } from '../../../context/DataProvider/types';
import { BigDecimal } from '../../../web3/BigDecimal';

/**
 * Validate redemption outputs state (not applicable for `redeemMasset`)
 */
const redeemOutputValidator: StateValidator = state => {
  const { simulated, dataState, bAssets } = state as State & {
    simulated: DataState;
    dataState: DataState;
    amount: BigDecimal;
  };

  const enabledBassets = Object.values(bAssets).filter(b => b.enabled);

  const { breachedBassets } = simulated.mAsset;

  if (breachedBassets.length > 0) {
    return [false, Reasons.MustRedeemWithAllBassets, breachedBassets];
  }

  const overweightBassetsNotEnabled = Object.values(bAssets).filter(
    ({ address, enabled }) => !enabled && simulated.bAssets[address].overweight,
  );

  if (overweightBassetsNotEnabled.length > 0) {
    return [
      false,
      Reasons.MustRedeemOverweightBassets,
      overweightBassetsNotEnabled.map(b => b.address),
    ];
  }

  const amountsRequired = enabledBassets.filter(({ amount }) => !amount);

  if (amountsRequired.length > 0) {
    return [
      false,
      Reasons.AmountMustBeSet,
      amountsRequired.map(b => b.address),
    ];
  }

  const amountsZero = enabledBassets.filter(({ amount }) =>
    amount?.exact.lte(0),
  );

  if (amountsZero.length > 0) {
    return [
      false,
      Reasons.AmountMustBeGreaterThanZero,
      amountsZero.map(b => b.address),
    ];
  }

  const vaultBalancesExceeded = enabledBassets.filter(({ address, amount }) =>
    amount?.exact.gt(simulated.bAssets[address].totalVaultInMasset.exact),
  );

  if (vaultBalancesExceeded.length > 0) {
    return [
      false,
      Reasons.CannotRedeemMoreBassetsThanAreInTheVault,
      vaultBalancesExceeded.map(b => b.address),
    ];
  }

  const newOverweightBassets = Object.values(simulated.bAssets).filter(
    ({ address, overweight }) =>
      overweight && !dataState.bAssets[address].overweight,
  );

  if (newOverweightBassets.length > 0) {
    return [
      false,
      Reasons.BassetsMustRemainBelowMaxWeight,
      newOverweightBassets.map(b => b.address),
    ];
  }

  return [true];
};

/**
 * Validate `redeemSingle` state
 */
const redeemSingleValidator: StateValidator = state => {
  const { bAssets, simulated } = state as State & { simulated: DataState };
  const enabled = Object.values(bAssets).filter(b => b.enabled)[0];

  if (!enabled) {
    return [false, Reasons.NoTokenSelected];
  }

  const overweightBassets = Object.values(simulated.bAssets)
    .filter(b => b.overweight)
    .map(b => b.address);

  if (
    overweightBassets.length === 1 &&
    overweightBassets[0] !== enabled.address
  ) {
    return [false, Reasons.MustRedeemOverweightBassets, overweightBassets];
  }

  return validate.redeemOutputValidator(state);
};

/**
 * Validate `redeemMulti` state
 * TODO: support redeemMulti validation
 */
const redeemMultiValidator: StateValidator = () => {
  throw new Error('redeemMulti not supported');
};

const amountValidator: StateValidator = state => {
  const { dataState, amountInMasset } = state;

  if (!dataState?.mAsset.balance) {
    return [false, Reasons.FetchingData];
  }

  if (!amountInMasset) {
    return [false, Reasons.AmountMustBeSet];
  }

  if (amountInMasset.exact.gt(dataState.mAsset.balance.exact)) {
    return [false, Reasons.AmountExceedsBalance];
  }

  if (amountInMasset.exact.eq(0)) {
    return [false, Reasons.AmountMustBeGreaterThanZero];
  }

  return [true];
};

/**
 * Validate `redeemMasset` state
 */
const redeemMassetValidator: StateValidator = state => {
  const { amountInMasset, simulated } = state as State & {
    amountInMasset: BigDecimal;
    simulated: DataState;
  };

  const {
    mAsset: { collateralisationRatio, decimals },
  } = simulated;

  const collateralisedMassetQuantity = amountInMasset.mulTruncate(
    collateralisationRatio,
  );

  const totalBassetVault = Object.values(simulated.bAssets).reduce(
    (_totalBassetVault, { totalVaultInMasset }) =>
      _totalBassetVault.add(totalVaultInMasset),
    new BigDecimal(0, decimals),
  );

  if (totalBassetVault.exact.eq(0)) {
    return [false, Reasons.NothingInTheBasketToRedeem];
  }

  if (collateralisedMassetQuantity.exact.gt(totalBassetVault.exact)) {
    return [false, Reasons.NotEnoughLiquidity];
  }

  return [true];
};

/**
 * Validate the basket state for all redemption modes
 */
const basketValidator: StateValidator = ({ simulated, mode }) => {
  if (!simulated) {
    return [false, Reasons.FetchingData];
  }

  const {
    mAsset: {
      allBassetsNormal,
      blacklistedBassets,
      failed,
      overweightBassets,
      undergoingRecol,
    },
  } = simulated;

  if (blacklistedBassets.length > 0) {
    return [false, Reasons.BasketContainsBlacklistedAsset, blacklistedBassets];
  }

  if (undergoingRecol) {
    return [false, Reasons.RedemptionPausedDuringRecol];
  }

  if (
    mode !== Mode.RedeemMasset &&
    (failed || !allBassetsNormal || overweightBassets.length > 1)
  ) {
    return [false, Reasons.MustRedeemWithAllBassets, overweightBassets];
  }

  return [true];
};

const redemptionValidator: StateValidator = state => {
  const amountValidation = validate.amountValidator(state);
  if (!amountValidation[0]) return amountValidation;

  if (state.mode === Mode.RedeemMasset) {
    return validate.redeemMassetValidator(state);
  }

  if (state.mode === Mode.RedeemSingle) {
    return validate.redeemSingleValidator(state);
  }

  return validate.redeemMultiValidator(state);
};

export const applyValidation = (state: State): State => {
  const { touched, initialized, bAssets } = state;
  const ready = touched && initialized;

  const [basketValid, basketError] = validate.basketValidator(state);
  const [redeemValid, redeemError, bAssetErrors] = validate.redemptionValidator(
    state,
  );

  const error = ready ? redeemError || basketError : undefined;
  const valid = !!(ready && redeemValid && basketValid);

  return {
    ...state,
    bAssets: Object.values(bAssets).reduce(
      (_bAssets, bAsset) => ({
        ..._bAssets,
        [bAsset.address]: {
          ...bAsset,
          error:
            error && bAssetErrors?.includes(bAsset.address) ? error : undefined,
        },
      }),
      bAssets,
    ),
    error,
    valid,
  };
};

export const validate = {
  applyValidation,
  amountValidator,
  basketValidator,
  redeemMassetValidator,
  redeemMultiValidator,
  redeemSingleValidator,
  redeemOutputValidator,
  redemptionValidator,
};
