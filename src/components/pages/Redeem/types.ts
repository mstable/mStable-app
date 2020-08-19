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
  SetBassetAmount,
  SetMassetAmount,
  SetMassetMaxAmount,
  ToggleBassetEnabled,
  ToggleRedeemMasset,
}

export type Action =
  | {
      type: Actions.Data;
      payload?: DataState;
    }
  | {
      type: Actions.SetBassetAmount;
      payload: { formValue: string | null; address: string };
    }
  | {
      type: Actions.SetMassetAmount;
      payload: string | null;
    }
  | {
      type: Actions.SetMassetMaxAmount;
    }
  | { type: Actions.ToggleRedeemMasset }
  | {
      type: Actions.ToggleBassetEnabled;
      payload: string;
    };

export interface BassetOutput {
  address: string;
  amount?: BigDecimal;
  formValue: string | null;
  amountMinusFee?: BigDecimal;
  enabled: boolean;
  hasError?: boolean;
}

export interface State {
  amountInMasset?: BigDecimal;
  amountInMassetPlusFee?: BigDecimal;
  bAssets: { [address: string]: BassetOutput };
  dataState?: DataState;
  error?: {
    message?: string;
    affectedBassets: string[];
  };
  feeAmount?: BigDecimal;
  formValue?: string;
  initialized: boolean;
  mode: Mode;
  touched?: boolean;
  valid: boolean;
  /**
   * Two simulations are used for redemption: one to validate the basket,
   * and one with "capped" totalVault and totalSupply in order to
   * make a usable graphic of the basket composition.
   */
  simulation?: DataState;
  cappedSimulation?: DataState;
}

export interface Dispatch {
  setBassetAmount(address: string, formValue: string | null): void;
  setMassetMaxAmount(): void;
  setMassetAmount(formValue: string | null): void;
  toggleRedeemMasset(): void;
  toggleBassetEnabled(bAsset: string): void;
}

export type ValidationResult =
  | [boolean]
  | [boolean, Reasons]
  | [boolean, Reasons, string[]];

export type StateValidator = (state: State) => ValidationResult;
