import { DataState } from '../../../context/DataProvider/types';
import { BigDecimal } from '../../../web3/BigDecimal';

export enum Reasons {
  AmountExceedsBalance,
  AmountMustBeGreaterThanZero,
  AmountMustBeSet,
  BasketContainsBlacklistedAsset,
  AssetsMustRemainBelowMaxWeight,
  CannotRedeemMoreAssetsThanAreInTheVault,
  FetchingData,
  MustRedeemOverweightAssets,
  MustRedeemWithAllAssets,
  NoAssetSelected,
  NoAssetsSelected,
  NothingInTheBasketToRedeem,
  RedemptionPausedDuringRecol,
}

export enum Mode {
  RedeemMasset,
  RedeemSingle,
  RedeemMulti,
}

export enum Actions {
  Data,
  SetRedemptionAmount,
  SetMaxRedemptionAmount,
  ToggleBassetEnabled,
  ToggleMode,
}

export type Action =
  | {
      type: Actions.Data;
      payload?: DataState;
    }
  | {
      type: Actions.SetRedemptionAmount;
      payload: string | null;
    }
  | {
      type: Actions.SetMaxRedemptionAmount;
    }
  | { type: Actions.ToggleMode }
  | {
      type: Actions.ToggleBassetEnabled;
      payload: string;
    };

export interface BassetOutput {
  address: string;
  amount?: BigDecimal;
  amountMinusFee?: BigDecimal;
  enabled: boolean;
  hasError?: boolean;
  formValue?: string;
}

export interface State {
  amountInMasset?: BigDecimal;
  amountInMassetPlusFee?: BigDecimal;
  bAssets: { [address: string]: BassetOutput };
  dataState?: DataState;
  error?: string;
  feeAmount?: BigDecimal;
  formValue?: string;
  initialized: boolean;
  mode: Mode;
  simulated?: DataState;
  touched?: boolean;
  valid: boolean;
}

export interface Dispatch {
  setMaxRedemptionAmount(): void;
  setRedemptionAmount(formValue: string | null): void;
  toggleMode(): void;
  toggleBassetEnabled(bAsset: string): void;
}

export type ValidationResult =
  | [boolean]
  | [boolean, Reasons]
  | [boolean, Reasons, string[]];

export type StateValidator = (state: State) => ValidationResult;
