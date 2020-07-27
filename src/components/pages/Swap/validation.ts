import { State, StateValidator, Reasons } from './types';
import { EXP_SCALE, RATIO_SCALE } from '../../../web3/constants';
import { BassetState, DataState } from '../../../context/DataProvider/types';
import { getReasonMessage } from './getReasonMessage';

// TODO later: refactor this validation to use the current state interface
const getBassetsArr = (dataState?: DataState): BassetState[] =>
  Object.keys(dataState?.bAssets || {})
    .sort()
    .map(address => (dataState as DataState).bAssets[address]);

const formValidator: StateValidator = ({
  needsUnlock,
  touched,
  values: { input, output },
  dataState,
}) => {
  const bAssets = getBassetsArr(dataState);

  if (!touched) {
    return [true, {}];
  }

  if (!dataState) {
    return [false, { input: Reasons.FetchingData }];
  }

  if (!input.token.address) {
    return [false, { input: Reasons.AssetMustBeSelected }];
  }

  if (!output.token.address) {
    return [false, { output: Reasons.AssetMustBeSelected }];
  }

  if (!input.formValue) {
    return [false, { input: Reasons.AmountMustBeSet }];
  }

  if (!output.formValue) {
    return [false, { output: Reasons.AmountMustBeSet }];
  }

  if (input.amount.exact?.lte(0)) {
    return [false, { input: Reasons.AmountMustBeGreaterThanZero }];
  }

  if (output.amount.exact?.lte(0)) {
    return [false, { output: Reasons.AmountMustBeGreaterThanZero }];
  }

  if (input.amount.exact?.lte(0)) {
    return [false, { input: Reasons.AmountMustBeGreaterThanZero }];
  }

  if (needsUnlock) {
    return [false, { input: Reasons.TransferMustBeApproved }];
  }

  const inputToken = bAssets.find(b => b.address === input.token.address);
  if (input.amount.exact && inputToken?.balance.exact.lt(input.amount.exact)) {
    return [false, { input: Reasons.AmountExceedsBalance }];
  }

  return [true, {}];
};

const swapValidator: StateValidator = ({
  touched,
  values: { input, output },
  dataState,
}) => {
  const bAssets = getBassetsArr(dataState);
  const totalVault = dataState?.mAsset.totalSupply.exact;

  let applySwapFee = true;

  if (
    !(
      touched &&
      input.token.address &&
      input.token.decimals &&
      input.amount.exact &&
      output.token.address &&
      output.token.decimals &&
      output.amount.exact
    )
  ) {
    return [true, {}];
  }

  const inputBasset = bAssets.find(b => b.address === input.token.address);
  const outputBasset = bAssets.find(b => b.address === output.token.address);
  if (
    !(
      inputBasset?.ratio &&
      inputBasset.totalVault.exact &&
      inputBasset.maxWeight &&
      outputBasset?.ratio &&
      outputBasset.totalVault.exact &&
      outputBasset.maxWeight &&
      totalVault
    )
  ) {
    return [false, { output: Reasons.FetchingData }];
  }

  if (inputBasset.status !== 'Normal') {
    return [false, { input: Reasons.AssetNotAllowedInSwap }];
  }

  if (outputBasset.status !== 'Normal') {
    return [false, { output: Reasons.AssetNotAllowedInSwap }];
  }

  // How much mAsset is this bAsset quantity worth?
  const inputAmountInMasset = input.amount.exact
    .mul(inputBasset.ratio)
    .div(RATIO_SCALE);

  const outputVaultBalance = outputBasset.totalVault.exact;

  if (inputAmountInMasset.gt(outputBasset.totalVaultInMasset.exact)) {
    return [false, { output: Reasons.CannotRedeemMoreAssetsThanAreInTheVault }];
  }

  const outputBalanceInMasset = outputVaultBalance
    .mul(outputBasset.ratio)
    .div(RATIO_SCALE);

  const outputMaxWeightInUnits = totalVault
    .mul(outputBasset.maxWeight)
    .div(EXP_SCALE);

  // 1.1. If it is currently overweight, then no fee
  if (outputBalanceInMasset.gt(outputMaxWeightInUnits)) {
    applySwapFee = false;
  }

  // 2. Calculate input bAsset valid - If incoming basket goes above weight, then fail
  // How much of this bAsset do we have in the vault, in terms of mAsset?
  const newInputBalanceInMasset = inputBasset.totalVault.exact
    .mul(inputBasset.ratio)
    .div(RATIO_SCALE)
    .add(inputAmountInMasset);

  // What is the max weight of this bAsset in the basket?
  const inputMaxWeightInUnits = totalVault
    .mul(inputBasset.maxWeight)
    .div(EXP_SCALE);

  if (newInputBalanceInMasset.gt(inputMaxWeightInUnits)) {
    return [false, { input: Reasons.AssetsMustRemainBelowMaxWeight }];
  }

  return [true, { applySwapFee }];
};

const mintSingleValidator: StateValidator = state => {
  const {
    values: { input },
    dataState,
  } = state;
  const mAsset = dataState?.mAsset;

  const bAssetData = dataState?.bAssets[input.token.address as string];

  if (
    !(
      input.amount.exact &&
      input.token.decimals &&
      bAssetData &&
      bAssetData.status &&
      mAsset?.decimals &&
      mAsset.totalSupply
    )
  ) {
    return [false, { input: Reasons.FetchingData }];
  }

  if (
    ['BrokenBelowPeg', 'Liquidating', 'Blacklisted'].includes(bAssetData.status)
  ) {
    return [false, { input: Reasons.AssetNotAllowedInMint }];
  }

  const mintAmountInMasset = input.amount.exact
    .mul(bAssetData.ratio)
    .div(RATIO_SCALE);

  // How much of this bAsset do we have in the vault, in terms of mAsset?
  const newBalanceInMasset = bAssetData.totalVault.exact
    .mul(bAssetData.ratio)
    .div(RATIO_SCALE)
    .add(mintAmountInMasset);

  // What is the max weight of this bAsset in the basket?
  const maxWeightInUnits = mAsset.totalSupply.exact
    .add(mintAmountInMasset)
    .mul(bAssetData.maxWeight)
    .div(EXP_SCALE);

  if (newBalanceInMasset.gt(maxWeightInUnits)) {
    return [false, { input: Reasons.AssetsMustRemainBelowMaxWeight }];
  }

  return [true, {}];
};

export const applyValidation = (state: State): State => {
  const {
    touched,
    values: { input, output },
    dataState,
  } = state;

  const mAsset = dataState?.mAsset;
  const mAssetAddress = mAsset?.address;

  const [
    formValid,
    { input: formInputError, output: formOutputError },
  ] = formValidator(state);

  const isMint = output.token.address === mAssetAddress;

  // FIXME bug: applySwapFee is set here, but needs to be set before the
  // action is processed; in other words, this is doing more than validation,
  // but it shouldn't be.
  const [
    txValid,
    { input: txInputError, output: txOutputError, applySwapFee },
  ] = isMint ? mintSingleValidator(state) : swapValidator(state);

  const inputAsset = dataState?.bAssets[input.token.address as string];
  const outputAsset = isMint
    ? dataState?.mAsset
    : dataState?.bAssets[output.token.address as string];

  const needsUnlock = !!(
    input.token.address &&
    input.amount.exact &&
    mAssetAddress &&
    inputAsset?.allowances[mAssetAddress]?.exact.lt(input.amount.exact)
  );

  const inputError = getReasonMessage(
    typeof formInputError !== 'undefined' ? formInputError : txInputError,
    inputAsset,
  );
  const outputError = getReasonMessage(
    typeof formOutputError !== 'undefined' ? formOutputError : txOutputError,
    outputAsset,
  );

  return {
    ...state,
    ...(typeof applySwapFee === 'boolean'
      ? { applySwapFee }
      : // FIXME: Defaulting to true as symptom-fighting (see above)
        { applySwapFee: true }),
    needsUnlock,
    inputError,
    outputError,
    valid: touched && formValid && txValid,
  };
};
