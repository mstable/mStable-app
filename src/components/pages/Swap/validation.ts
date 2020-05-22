import { parseUnits } from 'ethers/utils';
import { State, StateValidator } from './types';
import { EXP_SCALE, RATIO_SCALE } from '../../../web3/constants';

enum Reasons {
  AmountMustBeGreaterThanZero = 'Amount must be greater than zero',
  AmountMustBeSet = 'Amount must be set',
  BAssetNotAllowedInSwap = 'bAsset not allowed in swap',
  CannotRedeemMoreBAssetsThanAreInTheVault = 'Cannot redeem more bAssets than are in the vault',
  FetchingData = 'Fetching data',
  InsufficientBalance = 'Insufficient balance',
  MustBeBelowMaxWeighting = 'Must be below max weighting',
  TokenMustBeApproved = 'Token must be approved',
  TokenMustBeSelected = 'Token must be selected',
  TokenNotAllowedInMint = 'Token not allowed in mint',
}

const formValidator: StateValidator = ({
  needsUnlock,
  touched,
  values: { input, output },
  mAssetData: { loading, bAssets },
}) => {
  if (!touched) {
    return [true, {}];
  }

  if (!input.token.address) {
    return [false, { input: Reasons.TokenMustBeSelected }];
  }

  if (!output.token.address) {
    return [false, { output: Reasons.TokenMustBeSelected }];
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
    return [false, { output: Reasons.TokenMustBeApproved }];
  }

  if (loading) {
    return [false, { output: Reasons.FetchingData }];
  }

  const inputToken = bAssets.find(b => b.address === input.token.address);
  if (input.amount.exact && inputToken?.token.balance?.lt(input.amount.exact)) {
    return [false, { input: Reasons.InsufficientBalance }];
  }

  return [true, {}];
};

const swapValidator: StateValidator = ({
  touched,
  values: { input, output },
  mAssetData: {
    bAssets,
    token: { totalSupply: totalVault },
  },
}) => {
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
      inputBasset.vaultBalance &&
      inputBasset.maxWeight &&
      outputBasset?.ratio &&
      outputBasset.vaultBalance &&
      outputBasset.maxWeight &&
      totalVault
    )
  ) {
    return [false, { output: Reasons.FetchingData }];
  }

  if (inputBasset.status !== 'Normal') {
    return [false, { input: Reasons.BAssetNotAllowedInSwap }];
  }

  if (outputBasset.status !== 'Normal') {
    return [false, { output: Reasons.BAssetNotAllowedInSwap }];
  }

  // How much mAsset is this bAsset quantity worth?
  const inputAmountInMasset = input.amount.exact
    .mul(inputBasset.ratio)
    .div(RATIO_SCALE);

  // 1. Determine output bAsset valid
  //  - Enough units in the bank
  const outputAmount = inputAmountInMasset
    .div(outputBasset.ratio)
    .mul(RATIO_SCALE);

  const outputVaultBalance = parseUnits(
    outputBasset.vaultBalance,
    output.token.decimals,
  );

  if (outputAmount.gt(outputVaultBalance)) {
    return [
      false,
      { output: Reasons.CannotRedeemMoreBAssetsThanAreInTheVault },
    ];
  }

  const outputBalanceInMasset = outputVaultBalance
    .mul(outputBasset.ratio)
    .div(RATIO_SCALE);

  const outputMaxWeightInUnits = parseUnits(totalVault)
    .mul(outputBasset.maxWeight)
    .div(EXP_SCALE);

  // 1.1. If it is currently overweight, then no fee
  if (outputBalanceInMasset.gt(outputMaxWeightInUnits)) {
    applySwapFee = false;
  }

  // 2. Calculate input bAsset valid - If incoming basket goes above weight, then fail
  // How much of this bAsset do we have in the vault, in terms of mAsset?
  const newInputBalanceInMasset = parseUnits(
    inputBasset.vaultBalance,
    input.token.decimals,
  )
    .mul(inputBasset.ratio)
    .div(RATIO_SCALE)
    .add(inputAmountInMasset);

  // What is the max weight of this bAsset in the basket?
  const inputMaxWeightInUnits = parseUnits(totalVault)
    .add(inputAmountInMasset)
    .mul(inputBasset.maxWeight)
    .div(EXP_SCALE);

  if (newInputBalanceInMasset.gt(inputMaxWeightInUnits)) {
    return [false, { input: Reasons.MustBeBelowMaxWeighting }];
  }

  return [true, { applySwapFee }];
};

const mintSingleValidator: StateValidator = state => {
  const {
    values: { input },
    mAssetData: { bAssets, token: mAssetToken },
  } = state;

  const bAssetData = bAssets.find(b => b.address === input.token.address);

  if (
    !(
      input.amount.exact &&
      input.token.decimals &&
      bAssetData &&
      bAssetData.status &&
      bAssetData.maxWeight &&
      bAssetData.ratio &&
      bAssetData.vaultBalance &&
      bAssetData.token.balance &&
      bAssetData.token.allowance &&
      mAssetToken.decimals &&
      mAssetToken.totalSupply
    )
  ) {
    return [false, { input: Reasons.FetchingData }];
  }

  if (
    ['BrokenBelowPeg', 'Liquidating', 'Blacklisted'].includes(bAssetData.status)
  ) {
    return [false, { input: Reasons.TokenNotAllowedInMint }];
  }

  const mintAmountInMasset = input.amount.exact
    .mul(bAssetData.ratio)
    .div(RATIO_SCALE);

  // How much of this bAsset do we have in the vault, in terms of mAsset?
  const newBalanceInMasset = parseUnits(
    bAssetData.vaultBalance,
    input.token.decimals,
  )
    .mul(bAssetData.ratio)
    .div(RATIO_SCALE)
    .add(mintAmountInMasset);

  // What is the max weight of this bAsset in the basket?
  const maxWeightInUnits = parseUnits(
    mAssetToken.totalSupply,
    mAssetToken.decimals,
  )
    .add(mintAmountInMasset)
    .mul(bAssetData.maxWeight)
    .div(EXP_SCALE);

  if (newBalanceInMasset.gt(maxWeightInUnits)) {
    return [false, { input: Reasons.MustBeBelowMaxWeighting }];
  }

  return [true, {}];
};

export const applyValidation = (state: State): State => {
  const {
    touched,
    values: { input, output },
    mAssetData: {
      token: { address: mAssetAddress, allowance },
    },
  } = state;

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

  const needsUnlock = !!(
    isMint &&
    input.token.address &&
    input.amount.exact &&
    allowance?.[input.token.address]?.lt(input.amount.exact)
  );

  return {
    ...state,
    ...(typeof applySwapFee === 'boolean'
      ? { applySwapFee }
      : // FIXME: Defaulting to true as symptom-fighting (see above)
        { applySwapFee: true }),
    needsUnlock,
    inputError: formInputError || txInputError,
    outputError: formOutputError || txOutputError,
    valid: touched && formValid && txValid,
  };
};
