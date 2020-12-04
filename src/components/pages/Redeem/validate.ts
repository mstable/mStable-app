import {
  Mode,
  Reasons,
  State,
  StateValidator,
  ValidationResult,
} from './types';
import { MassetState } from '../../../context/DataProvider/types';
import { BigDecimal } from '../../../web3/BigDecimal';
import { getReasonMessage } from './getReasonMessage';

/**
 * Validate redemption outputs state (not applicable for `redeemMasset`)
 */
const redeemOutputValidator: StateValidator = state => {
  const { simulation, massetState } = state as State & {
    simulation: MassetState;
    massetState: MassetState;
    amount: BigDecimal;
  };

  const newOverweightBassets = Object.values(simulation.bAssets).filter(
    ({ address, overweight }) =>
      overweight && !massetState.bAssets[address].overweight,
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
 * Validate `redeemSingle` and `redeemMulti` state
 */
const redeemSingleOrMultiValidator: StateValidator = state => {
  const { bAssets, massetState } = state as State & {
    massetState: MassetState;
  };
  const enabledBassets = Object.values(bAssets).filter(b => b.enabled);

  if (enabledBassets.length === 0) {
    return [false, Reasons.NoAssetSelected];
  }

  const currentOverweightBassets = Object.values(massetState.bAssets)
    .filter(b => b.overweight)
    .map(b => b.address);

  if (
    currentOverweightBassets.length > 1 ||
    (currentOverweightBassets.length === 1 &&
      !enabledBassets.find(b => b.address === currentOverweightBassets[0]))
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
    amount?.exact.gt(massetState.bAssets[address].totalVault.exact),
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

const amountValidator: StateValidator = state => {
  const { massetState, amountInMasset, bAssets, mode } = state;
  const isRedeemMasset = mode === Mode.RedeemMasset;
  const enabled = Object.values(bAssets).filter(b => b.enabled);

  if (!massetState?.token.balance) {
    return [false, Reasons.FetchingData];
  }

  if (!amountInMasset) {
    const affectedBassets = isRedeemMasset
      ? []
      : enabled.filter(b => !b.amount).map(b => b.address);

    return [false, Reasons.AmountMustBeSet, affectedBassets];
  }

  if (amountInMasset.exact.gt(massetState.token.balance.exact)) {
    return [false, Reasons.AmountExceedsBalance];
  }

  if (amountInMasset.exact.eq(0)) {
    return [false, Reasons.AmountMustBeGreaterThanZero];
  }

  if (!isRedeemMasset) {
    const noAmount = enabled.filter(b => !b.amount).map(b => b.address);

    if (noAmount.length) {
      return [false, Reasons.AmountMustBeSet, noAmount];
    }

    const amountZero = enabled
      .filter(b => b.amount?.exact.eq(0))
      .map(b => b.address);

    if (amountZero.length) {
      return [false, Reasons.AmountMustBeGreaterThanZero, amountZero];
    }
  }

  return [true];
};

/**
 * Validate `redeemMasset` state
 */
const redeemMassetValidator: StateValidator = state => {
  const { massetState } = state as State & {
    amountInMasset: BigDecimal;
    massetState: MassetState;
  };

  const {
    token: { decimals },
  } = massetState;

  const totalBassetVault = Object.values(massetState.bAssets).reduce(
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
const basketValidator: StateValidator = ({ simulation, mode }) => {
  if (!simulation) {
    return [false, Reasons.FetchingData];
  }

  const {
    allBassetsNormal,
    blacklistedBassets,
    failed,
    overweightBassets,
    undergoingRecol,
  } = simulation;

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
  if (state.mode === Mode.RedeemMasset) {
    return redeemMassetValidator(state);
  }

  return redeemSingleOrMultiValidator(state);
};

const getValidationResult = (state: State): ValidationResult => {
  const ready = state.touched && state.initialized;

  if (!ready) {
    return [false];
  }

  const amountValidation = amountValidator(state);

  if (!amountValidation[0]) {
    return amountValidation;
  }

  const basketValidation = basketValidator(state);

  if (!basketValidation[0]) {
    return basketValidation;
  }

  return redemptionValidator(state);
};

export const applyValidation = (state: State): State => {
  const { massetState } = state as State & { massetState: MassetState };

  const [valid, reason, affectedBassets = []] = getValidationResult(state);

  const error = valid
    ? undefined
    : {
        affectedBassets,
        message: getReasonMessage(
          reason,
          affectedBassets.map(b => massetState.bAssets[b]),
        ),
      };

  const bAssets = Object.values(state.bAssets).reduce<State['bAssets']>(
    (_bAssets, bAsset) => ({
      ..._bAssets,
      [bAsset.address]: {
        ...bAsset,
        hasError: affectedBassets.includes(bAsset.address),
      },
    }),
    state.bAssets,
  );

  return {
    ...state,
    bAssets,
    error,
    valid,
  };
};
