import {
  BassetInput,
  Mode,
  State,
  StateValidator,
  Reasons,
  ValidationResult,
  BassetStatus,
} from './types';

const amountValidator = (
  bAsset: BassetInput,
  dataState: NonNullable<State['dataState']>,
): ValidationResult => {
  const bAssetData = dataState.bAssets[bAsset.address];

  if (
    [
      BassetStatus.BrokenBelowPeg,
      BassetStatus.Liquidating,
      BassetStatus.Blacklisted,
    ].includes(bAssetData.status)
  ) {
    return [false, Reasons.TokenNotAllowedInMint];
  }

  if (!bAsset.amount) {
    return [false, Reasons.AmountMustBeSet];
  }

  if (bAsset.amount.exact.lte(0)) {
    return [false, Reasons.AmountMustBeGreaterThanZero];
  }

  if (bAsset.amount.exact.gt(bAssetData.balance.exact)) {
    return [false, Reasons.AmountExceedsBalance];
  }

  if (bAssetData.mAssetAllowance.exact.lt(bAsset.amount.exact)) {
    return [false, Reasons.AmountExceedsApprovedAmount];
  }

  return [true];
};

const mintSingleValidator: StateValidator = state => {
  const { bAssets, simulation, dataState } = state;

  if (!dataState || !simulation) return [false, Reasons.FetchingData];

  const [enabled] = Object.values(bAssets).filter(b => b.enabled);

  if (!enabled) return [false, Reasons.NoTokenSelected];

  const [amountValid, amountError] = amountValidator(enabled, dataState);
  if (!amountValid) {
    return [
      amountValid,
      amountError as string,
      { [enabled.address]: amountError },
    ];
  }

  const { totalVaultInMasset, maxWeightInMasset } = simulation.bAssets[
    enabled.address
  ];

  if (totalVaultInMasset.exact.gt(maxWeightInMasset.exact)) {
    return [
      false,
      Reasons.MustBeBelowMaxWeighting,
      { [enabled.address]: Reasons.MustBeBelowMaxWeighting },
    ];
  }

  return [true];
};

const mintMultiValidator: StateValidator = state => {
  const { bAssets, simulation, dataState } = state;

  if (!simulation || !dataState) return [false, Reasons.FetchingData];

  const enabled = Object.values(bAssets).filter(b => b.enabled);

  if (enabled.length === 0) {
    return [false, Reasons.NoTokensSelected];
  }

  const bAssetsArr = Object.values(bAssets);
  return bAssetsArr
    .map<ValidationResult>(bAsset => {
      if (!bAsset.enabled) return [true];

      const amountValidation = amountValidator(bAsset, dataState);
      if (!amountValidation[0]) return amountValidation;

      const { totalVaultInMasset, maxWeightInMasset } = simulation.bAssets[
        bAsset.address
      ];

      if (totalVaultInMasset.exact.gt(maxWeightInMasset.exact)) {
        return [
          false,
          Reasons.MustBeBelowMaxWeighting,
          { [bAsset.address]: Reasons.MustBeBelowMaxWeighting },
        ];
      }

      return [true];
    })
    .reduce<ValidationResult>(
      ([_valid, _error, _errorMap], [bAssetValid, bAssetError], index) => {
        const { address } = bAssetsArr[index];

        const error = _error || bAssetError;
        const valid = _valid && bAssetValid;
        const errorMap = { ..._errorMap, [address]: bAssetError };

        return valid ? [valid] : [valid, error as string, errorMap];
      },
      [true, '', {}],
    );
};

const mintValidator: StateValidator = state => {
  const { bAssets, mode } = state;

  if (mode === Mode.MintSingle) {
    const [valid, error] = mintSingleValidator(state);
    const [bAssetInput] = Object.values(bAssets).filter(b => b.enabled);
    return [valid, error as string, { [bAssetInput.address]: error }];
  }

  return mintMultiValidator(state);
};

const basketValidator: StateValidator = state => {
  const { simulation } = state;

  if (!simulation) {
    return [false, Reasons.FetchingData];
  }

  if (simulation.mAsset.failed) {
    return [false, Reasons.BasketFailed];
  }

  if (simulation.mAsset.undergoingRecol) {
    return [false, Reasons.BasketUndergoingRecollateralisation];
  }

  return [true];
};

export const validate = (state: State): State => {
  const { amountTouched, initialized, bAssets } = state;
  const ready = amountTouched && initialized;

  const [basketValid, basketError] = basketValidator(state);
  const [mintValid, mintError, bAssetErrors] = mintValidator(state);

  return {
    ...state,
    bAssets: Object.values(bAssets).reduce(
      (_bAssets, bAsset) => ({
        ..._bAssets,
        [bAsset.address]: {
          ...bAsset,
          error: ready ? bAssetErrors?.[bAsset.address] : undefined,
        },
      }),
      bAssets,
    ),
    error: ready ? mintError || basketError : undefined,
    valid: ready && mintValid && basketValid,
  };
};
