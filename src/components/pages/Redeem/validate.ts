import {
  Mode,
  Reasons,
  State,
  StateValidator,
  ValidationResult,
} from './types';
import { DataState } from '../../../context/DataProvider/types';
import { BigDecimal } from '../../../web3/BigDecimal';
import { getReasonMessage } from './getReasonMessage';

/**
 * Validate redemption outputs state (not applicable for `redeemMasset`)
 */
const redeemOutputValidator: StateValidator = state => {
  const { simulated, dataState } = state as State & {
    simulated: DataState;
    dataState: DataState;
    amount: BigDecimal;
  };

  const newOverweightBassets = Object.values(simulated.bAssets).filter(
    ({ address, overweight }) =>
      overweight && !dataState.bAssets[address].overweight,
  );

  if (newOverweightBassets.length > 0) {
    return [
      false,
      Reasons.AssetsMustRemainBelowMaxWeight,
      newOverweightBassets.map(b => b.address),
    ];
  }

  return [true];
};

/**
 * Validate `redeemSingle` state
 */
const redeemSingleValidator: StateValidator = state => {
  const { bAssets, dataState } = state as State & {
    dataState: DataState;
  };
  const enabledBassets = Object.values(bAssets).filter(b => b.enabled);
  const enabledBasset = enabledBassets[0];

  if (!enabledBasset) {
    return [false, Reasons.NoAssetSelected];
  }

  const currentOverweightBassets = Object.values(dataState.bAssets)
    .filter(b => b.overweight)
    .map(b => b.address);

  if (
    currentOverweightBassets.length > 1 ||
    (currentOverweightBassets.length === 1 &&
      currentOverweightBassets[0] !== enabledBasset.address)
  ) {
    return [
      false,
      Reasons.MustRedeemOverweightAssets,
      currentOverweightBassets,
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
    amount?.exact.gt(dataState.bAssets[address].totalVault.exact),
  );

  if (vaultBalancesExceeded.length > 0) {
    return [
      false,
      Reasons.CannotRedeemMoreAssetsThanAreInTheVault,
      vaultBalancesExceeded.map(b => b.address),
    ];
  }

  return redeemOutputValidator(state);
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
  const { dataState } = state as State & {
    amountInMasset: BigDecimal;
    dataState: DataState;
  };

  const {
    mAsset: { decimals },
  } = dataState;

  const totalBassetVault = Object.values(dataState.bAssets).reduce(
    (_totalBassetVault, { totalVaultInMasset }) =>
      _totalBassetVault.add(totalVaultInMasset),
    new BigDecimal(0, decimals),
  );

  if (totalBassetVault.exact.eq(0)) {
    return [false, Reasons.NothingInTheBasketToRedeem];
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

  if (mode !== Mode.RedeemMasset) {
    if (overweightBassets.length > 1) {
      return [false, Reasons.MustRedeemOverweightAssets, overweightBassets];
    }

    if (failed || !allBassetsNormal) {
      return [false, Reasons.MustRedeemWithAllAssets];
    }
  }
  return [true];
};

const redemptionValidator: StateValidator = state => {
  const amountValidation = amountValidator(state);
  if (!amountValidation[0]) return amountValidation;

  if (state.mode === Mode.RedeemMasset) {
    return redeemMassetValidator(state);
  }

  if (state.mode === Mode.RedeemSingle) {
    return redeemSingleValidator(state);
  }

  return redeemMultiValidator(state);
};

const getValidationResult = (state: State): ValidationResult => {
  const ready = state.touched && state.initialized;

  if (!ready) return [false];

  const basketValidation = basketValidator(state);

  if (!basketValidation[0]) return basketValidation;

  return redemptionValidator(state);
};

export const applyValidation = (state: State): State => {
  const { bAssets, dataState } = state;

  const [valid, reason, affectedBassets = []] = getValidationResult(state);

  const error = valid
    ? undefined
    : getReasonMessage(
        reason,
        dataState ? affectedBassets.map(b => dataState.bAssets[b]) : undefined,
      );

  return {
    ...state,
    bAssets: Object.values(bAssets).reduce(
      (_bAssets, bAsset) => ({
        ..._bAssets,
        [bAsset.address]: {
          ...bAsset,
          hasError: affectedBassets.includes(bAsset.address),
        },
      }),
      bAssets,
    ),
    error,
    valid,
  };
};
