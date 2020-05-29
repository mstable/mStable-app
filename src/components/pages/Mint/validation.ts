import { BigNumber, parseUnits } from 'ethers/utils';
import {
  BassetInput,
  Mode,
  State,
  StateValidator,
  Reasons,
  ValidationResult,
} from './types';
import { BassetData, MassetData } from '../../../context/DataProvider/types';
import { EXP_SCALE, RATIO_SCALE } from '../../../web3/constants';

const statusValidator = (status: string | undefined): boolean =>
  !!status &&
  !['BrokenBelowPeg', 'Liquidating', 'Blacklisted'].includes(status);

const amountValidator = (
  bAssetInput: BassetInput,
  bAssetData: BassetData,
  mAssetData: MassetData,
): ValidationResult => {
  if (!statusValidator(bAssetData.status)) {
    return [false, Reasons.TokenNotAllowedInMint];
  }

  if (
    (bAssetInput.amount.exact as BigNumber).gt(
      bAssetData.token.balance as BigNumber,
    )
  ) {
    return [false, Reasons.AmountExceedsBalance];
  }

  if (
    mAssetData.token.allowance?.[bAssetInput.address]?.lt(
      bAssetInput.amount.exact as BigNumber,
    )
  ) {
    return [false, Reasons.AmountExceedsApprovedAmount];
  }

  return [true, null];
};

const mintSingleValidator: StateValidator = state => {
  const { bAssetInputs, mAssetData } = state;
  const [bAssetInput] = bAssetInputs.filter(b => b.enabled);

  if (!bAssetInput) {
    return [false, Reasons.NoTokenSelected];
  }

  const bAssetData = mAssetData?.bAssets.find(
    b => b.address === bAssetInput.address,
  );

  if (
    !(
      bAssetInput.amount.exact &&
      bAssetData?.status &&
      bAssetData.maxWeight &&
      bAssetData.ratio &&
      bAssetData.vaultBalance &&
      bAssetData.token.balance &&
      bAssetData.token.allowance &&
      bAssetData.token?.decimals &&
      mAssetData?.token?.address &&
      mAssetData?.token.decimals &&
      mAssetData.token.totalSupply
    )
  ) {
    return [false, Reasons.FetchingData];
  }

  const [amountValid, amountError] = amountValidator(
    bAssetInput,
    bAssetData,
    mAssetData,
  );
  if (!amountValid) {
    return [amountValid, amountError];
  }

  const mintAmountInMasset = bAssetInput.amount.exact
    .mul(bAssetData.ratio)
    .div(RATIO_SCALE);

  // How much of this bAsset do we have in the vault, in terms of mAsset?
  const newBalanceInMasset = parseUnits(
    bAssetData.vaultBalance,
    bAssetData.token.decimals,
  )
    .mul(bAssetData.ratio)
    .div(RATIO_SCALE)
    .add(mintAmountInMasset);

  // What is the max weight of this bAsset in the basket?
  const maxWeightInUnits = parseUnits(
    mAssetData.token.totalSupply,
    mAssetData.token.decimals,
  )
    .add(mintAmountInMasset)
    .mul(bAssetData.maxWeight)
    .div(EXP_SCALE);

  if (newBalanceInMasset.gt(maxWeightInUnits)) {
    return [false, Reasons.MustBeBelowMaxWeighting];
  }

  return [true, null];
};

const mintMultiValidator: StateValidator = state => {
  const { bAssetInputs, mAssetData } = state;

  const enabled = bAssetInputs.filter(b => b.enabled);

  if (enabled.length === 0) {
    return [false, Reasons.NoTokensSelected];
  }

  if (!mAssetData?.bAssets) {
    return [false, Reasons.FetchingData];
  }

  const bAssets: {
    input: BassetInput;
    data: BassetData | undefined;
  }[] = enabled.map(input => ({
    input,
    data: mAssetData.bAssets.find(b => b.address === input.address),
  }));

  const newBalances: BigNumber[] = [];
  let newTotalVault: BigNumber = parseUnits(
    mAssetData.token.totalSupply as string,
    mAssetData.token.decimals,
  );

  const initialValidation = bAssets.map<ValidationResult>(({ input, data }) => {
    if (!data) return [false, Reasons.FetchingData];

    if (!statusValidator(data.status))
      return [false, Reasons.TokenNotAllowedInMint];

    const amountValidation = amountValidator(input, data, mAssetData);
    if (!amountValidation[0]) return amountValidation;

    // How much mAsset is this bassetquantity worth?
    const mintAmountInMasset = (input.amount.exact as BigNumber)
      .mul(data.ratio as string)
      .div(RATIO_SCALE);

    // How much of this bAsset do we have in the vault, in terms of mAsset?
    newBalances.push(
      parseUnits(data.vaultBalance as string, data.token.decimals)
        .mul(data.ratio as string)
        .div(RATIO_SCALE)
        .add(mintAmountInMasset),
    );

    newTotalVault = newTotalVault.add(mintAmountInMasset);

    return [true, null];
  });
  return bAssets
    .map<ValidationResult>(({ data }, index) => {
      if (!initialValidation[index][0]) {
        return initialValidation[index];
      }
      if (!data) return [false, Reasons.FetchingData];
      // What is the max weight of this bAsset in the basket?
      const maxWeightInUnits = newTotalVault
        .mul(data.maxWeight as string)
        .div(EXP_SCALE);

      if (newBalances?.[index]?.gt?.(maxWeightInUnits)) {
        return [false, Reasons.MustBeBelowMaxWeighting];
      }
      return [true, null];
    })
    .reduce<ValidationResult>(
      ([_valid, _error, _errorMap], [bAssetValid, bAssetError], index) => {
        const {
          input: { address },
        } = bAssets[index];

        const error = _error || bAssetError;
        const valid = _valid && bAssetValid;
        const errorMap = { ..._errorMap, [address]: bAssetError };

        return [valid, error, errorMap];
      },
      [true, null, {}],
    );
};

const mintValidator: StateValidator = state => {
  const { mode, touched, mAsset, bAssetInputs } = state;

  if (!touched) {
    return [true, ''];
  }

  if (touched && !mAsset.amount.exact) {
    return [false, Reasons.AmountMustBeSet];
  }

  if (touched && mAsset.amount.exact?.lte(0)) {
    return [false, Reasons.AmountMustBeGreaterThanZero];
  }

  if (mode === Mode.Single) {
    const [valid, error] = mintSingleValidator(state);
    const [enabled] = bAssetInputs.filter(b => b.enabled);
    return enabled
      ? [valid, error, { [enabled.address]: error }]
      : [valid, error];
  }

  return mintMultiValidator(state);
};

const basketValidator: StateValidator = state => {
  const { mAssetData } = state;

  if (!mAssetData?.basket) {
    return [false, Reasons.FetchingData];
  }

  if (mAssetData.basket.failed) {
    return [false, Reasons.BasketFailed];
  }

  if (mAssetData.basket.undergoingRecol) {
    return [false, Reasons.BasketUndergoingRecollateralisation];
  }

  return [true, null];
};

export const applyValidation = (state: State): State => {
  const { touched, mAsset, bAssetInputs } = state;

  const [basketValid, basketError] = basketValidator(state);
  const [mintValid, mintError, bAssetInputErrors] = mintValidator(state);

  const formValid = !!(touched && mAsset.amount.exact);

  return {
    ...state,
    bAssetInputs: bAssetInputs.map(b => ({
      ...b,
      error: bAssetInputErrors?.[b.address] || null,
    })),
    error: basketError || mintError || null,
    valid: basketValid && mintValid && formValid,
  };
};
