import { BigNumber, parseUnits } from 'ethers/utils';
import {
  BassetInput,
  Mode,
  State,
  StateValidator,
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
    return [false, 'Token not allowed in mint'];
  }

  if (
    (bAssetInput.amount.exact as BigNumber).gt(
      bAssetData.token.balance as BigNumber,
    )
  ) {
    return [false, 'Amount exceeds balance'];
  }

  if (
    mAssetData.token.allowance?.[bAssetInput.address]?.lt(
      bAssetInput.amount.exact as BigNumber,
    )
  ) {
    return [false, 'Amount exceeds approved amount'];
  }

  return [true, null];
};

const mintSingleValidator: StateValidator = state => {
  const { bAssetInputs, mAssetData } = state;
  const [bAssetInput] = bAssetInputs.filter(b => b.enabled);

  if (!bAssetInput) {
    return [false, 'No token selected'];
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
    return [false, 'Fetching data'];
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
    return [false, 'Must be below max weighting'];
  }

  return [true, null];
};

const mintMultiValidator: StateValidator = state => {
  const { bAssetInputs, mAssetData } = state;

  const enabled = bAssetInputs.filter(b => b.enabled);

  if (enabled.length === 0) {
    return [false, 'No tokens selected'];
  }

  if (!mAssetData?.bAssets) {
    return [false, 'Fetching data'];
  }

  const bAssets: {
    input: BassetInput;
    data: BassetData | undefined;
  }[] = enabled.map(input => ({
    input,
    data: mAssetData.bAssets.find(b => b.address === input.address),
  }));

  const newBalances: BigNumber[] = [];
  let newTotalVault: BigNumber = new BigNumber(0);

  return bAssets
    .map<ValidationResult>(({ input, data }, index) => {
      if (!data) return [false, 'Fetching data'];

      if (!statusValidator(data.status))
        return [false, 'Token not allowed in mint'];

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

      // What is the max weight of this bAsset in the basket?
      const maxWeightInUnits = parseUnits(
        mAssetData.token.totalSupply as string,
        mAssetData.token.decimals,
      )
        .add(mintAmountInMasset)
        .mul(data.maxWeight as string)
        .div(EXP_SCALE);

      if (newBalances[index].gt(maxWeightInUnits)) {
        return [false, 'Must be below max weighting'];
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

  if (touched && !mAsset.amount.exact) {
    return [false, 'Amount must be set'];
  }

  if (touched && mAsset.amount.exact?.lte(0)) {
    return [false, 'Amount must be greater than zero'];
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
    return [false, 'Fetching data'];
  }

  if (mAssetData.basket.failed) {
    return [false, 'Basket failed'];
  }

  if (mAssetData.basket.undergoingRecol) {
    return [false, 'Basket undergoing recollateralisation'];
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
