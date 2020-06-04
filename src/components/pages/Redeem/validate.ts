/* eslint-disable @typescript-eslint/no-use-before-define */

import { BigNumber, bigNumberify, parseUnits } from 'ethers/utils';
import { BassetData, MassetData } from '../../../context/DataProvider/types';
import { applyRatioBassetToMasset } from '../../../web3/ratio';
import { EXP_SCALE, PERCENT_SCALE } from '../../../web3/constants';
import { BassetStatus } from '../Mint/types';
import { BassetOutput, Mode, Reasons, State, StateValidator } from './types';

const WEIGHT_THRESHOLD = new BigNumber(50000).mul(EXP_SCALE);

/**
 * Combine bAsset output state with data from the mAsset
 */
const combineBassetsData = ({
  mAssetData,
  bAssetOutputs,
}: State): {
  data: BassetData;
  output: BassetOutput;
  vaultBalanceExact: BigNumber;
}[] =>
  (mAssetData?.bAssets || []).map(data => ({
    data,
    output: bAssetOutputs.find(b => b.address === data.address) as BassetOutput,
    vaultBalanceExact: parseUnits(data.vaultBalance, data.token.decimals),
  }));

/**
 * Validate redemption outputs state (not applicable for `redeemMasset`)
 */
const redeemOutputValidator: StateValidator = state => {
  const { token } = state.mAssetData as NonNullable<MassetData>;

  const totalVault = parseUnits(token.totalSupply, token.decimals);

  const bAssets = combineBassetsData(state);
  const enabled = bAssets.filter(b => b.output.enabled);

  const onePercentOfTotal = totalVault.mul(PERCENT_SCALE).div(EXP_SCALE);

  const weightBreachThreshold = onePercentOfTotal.gt(WEIGHT_THRESHOLD)
    ? WEIGHT_THRESHOLD
    : onePercentOfTotal;

  const maxWeightsInUnits = bAssets.map(({ data: { maxWeight } }) =>
    totalVault.mul(maxWeight).div(EXP_SCALE),
  );

  const ratioedBassetVaults = bAssets.map(
    ({ data: { ratio }, vaultBalanceExact }) =>
      applyRatioBassetToMasset(vaultBalanceExact, ratio),
  );

  const breachedBassets = bAssets.filter((_, index) => {
    const lowerBound = weightBreachThreshold.gt(maxWeightsInUnits[index])
      ? new BigNumber(0)
      : maxWeightsInUnits[index].sub(weightBreachThreshold);
    return (
      ratioedBassetVaults[index].gt(lowerBound) &&
      ratioedBassetVaults[index].lte(maxWeightsInUnits[index])
    );
  });

  if (
    breachedBassets.length > 0 &&
    bAssets.filter(b => b.data.overweight).length === 0
  ) {
    return [
      false,
      Reasons.MustRedeemProportionally,
      breachedBassets.map(b => b.data.address),
    ];
  }

  const overweightBassetsNotEnabled = bAssets.filter(
    b => b.data.overweight && !b.output.enabled,
  );

  if (overweightBassetsNotEnabled.length > 0) {
    return [
      false,
      Reasons.MustRedeemOverweightBassets,
      overweightBassetsNotEnabled.map(b => b.data.address),
    ];
  }

  const amountsRequired = enabled.filter(
    ({
      output: {
        amount: { exact },
      },
    }) => !exact,
  );

  if (amountsRequired.length > 0) {
    return [
      false,
      Reasons.AmountMustBeSet,
      amountsRequired.map(b => b.data.address),
    ];
  }

  const amountsZero = enabled.filter(({ output: { amount: { exact } } }) =>
    (exact as NonNullable<BigNumber>).lte(0),
  );

  if (amountsZero.length > 0) {
    return [
      false,
      Reasons.AmountMustBeGreaterThanZero,
      amountsZero.map(b => b.data.address),
    ];
  }

  const vaultBalancesExceeded = enabled.filter(
    ({
      vaultBalanceExact,
      output: {
        amount: { exact },
      },
    }) => (exact as NonNullable<BigNumber>).gt(vaultBalanceExact),
  );

  if (vaultBalancesExceeded.length > 0) {
    return [
      false,
      Reasons.CannotRedeemMoreBassetsThanAreInTheVault,
      vaultBalancesExceeded.map(b => b.data.address),
    ];
  }

  const ratioedRedemptionAmounts = bAssets.map(
    ({
      data: { ratio },
      output: {
        amount: { exact },
      },
    }) => (exact ? applyRatioBassetToMasset(exact, ratio) : new BigNumber(0)),
  );

  const newRatioedBassetVaults = ratioedBassetVaults.map((r, index) =>
    r.sub(ratioedRedemptionAmounts[index]),
  );

  const newTotalVault = ratioedRedemptionAmounts.reduce(
    (_newTotalVault, amount) => _newTotalVault.sub(amount),
    totalVault,
  );

  const newMaxWeightsInUnits = bAssets.map(({ data: { maxWeight } }) =>
    newTotalVault.mul(maxWeight).div(EXP_SCALE),
  );

  const newOverweightBassets = bAssets.filter(
    ({ data: { overweight: previouslyOverweight } }, index) => {
      const isOverweight = newRatioedBassetVaults[index].gt(
        newMaxWeightsInUnits[index],
      );
      return !previouslyOverweight && isOverweight;
    },
  );

  if (newOverweightBassets.length > 0) {
    return [
      false,
      Reasons.BassetsMustRemainBelowMaxWeight,
      newOverweightBassets.map(b => b.data.address),
    ];
  }

  return [true];
};

/**
 * Validate `redeemSingle` state
 */
const redeemSingleValidator: StateValidator = state => {
  const { bAssetOutputs, mAssetData } = state;
  const enabled = bAssetOutputs.filter(b => b.enabled)[0];

  if (!enabled) {
    return [false, Reasons.NoTokenSelected];
  }

  const overweightBassets = (mAssetData as NonNullable<MassetData>).bAssets
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
  const {
    mAssetData,
    redemption: { amount },
  } = state;

  if (!mAssetData?.token.balance) {
    return [false, Reasons.FetchingData];
  }

  if (!amount.exact) {
    return [false, Reasons.AmountMustBeSet];
  }

  if (amount.exact.gt(mAssetData.token.balance)) {
    return [false, Reasons.AmountExceedsBalance];
  }

  if (amount.exact.eq(0)) {
    return [false, Reasons.AmountMustBeGreaterThanZero];
  }

  return [true];
};

/**
 * Validate `redeemMasset` state
 */
const redeemMassetValidator: StateValidator = state => {
  const {
    mAssetData,
    bAssetOutputs,
    redemption: { amount },
  } = state;

  const enabled = bAssetOutputs.filter(b => b.enabled);

  if (enabled.length === 0) {
    return [false, Reasons.NoTokensSelected];
  }

  const bAssets = combineBassetsData(state);

  const basketCollateralisationRatio = bigNumberify(
    (mAssetData as NonNullable<MassetData>).basket.collateralisationRatio,
  );

  const collateralisationRatio = EXP_SCALE.lt(basketCollateralisationRatio)
    ? EXP_SCALE
    : basketCollateralisationRatio;

  const collateralisedMassetQuantity = (amount.exact as NonNullable<BigNumber>)
    .mul(collateralisationRatio)
    .div(EXP_SCALE);

  const ratioedBassetVaults = bAssets.map(
    ({ vaultBalanceExact, data: { ratio } }) =>
      applyRatioBassetToMasset(vaultBalanceExact, ratio),
  );

  const totalBassetVault = ratioedBassetVaults.reduce(
    (_totalBassetVault, ratioedBassetVault) =>
      _totalBassetVault.add(ratioedBassetVault),
    new BigNumber(0),
  );

  if (totalBassetVault.eq(0)) {
    return [false, Reasons.NothingInTheBasketToRedeem];
  }

  if (collateralisedMassetQuantity.gt(totalBassetVault)) {
    return [false, Reasons.NotEnoughLiquidity];
  }

  return [true];
};

/**
 * Validate the basket state for all redemption modes
 */
const basketValidator: StateValidator = ({ mAssetData, mode }) => {
  if (!(mAssetData?.basket && mAssetData.token.balance)) {
    return [false, Reasons.FetchingData];
  }

  if (mAssetData.bAssets.some(b => b.status === BassetStatus.Blacklisted)) {
    return [false, Reasons.BasketContainsBlacklistedAsset];
  }

  if (mAssetData.basket.undergoingRecol) {
    return [false, Reasons.RedemptionPausedDuringRecol];
  }

  if (
    mode !== Mode.RedeemMasset &&
    (mAssetData.basket.failed ||
      mAssetData.bAssets.some(b => b.status !== BassetStatus.Normal) ||
      mAssetData.bAssets.filter(b => b.overweight).length > 1)
  ) {
    return [false, Reasons.MustRedeemProportionally];
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
  const [basketValid, basketError] = validate.basketValidator(state);
  const [redeemValid, redeemError, errors = []] = validate.redemptionValidator(
    state,
  );

  const error = state.touched ? basketError || redeemError : undefined;
  const valid = !!(state.touched && basketValid && redeemValid);

  return {
    ...state,
    bAssetOutputs: state.bAssetOutputs.map(bAsset => ({
      ...bAsset,
      error: error && errors.includes(bAsset.address) ? error : undefined,
    })),
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
