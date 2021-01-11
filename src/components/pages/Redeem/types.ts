import { MassetState } from '../../../context/DataProvider/types';
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
      payload?: MassetState;
    }
  | {
      type: Actions.SetBassetAmount;
      payload: { formValue?: string; address: string };
    }
  | {
      type: Actions.SetMassetAmount;
      payload?: string;
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
  formValue?: string;
  amountMinusFee?: BigDecimal;
  enabled: boolean;
  hasError?: boolean;
}

export interface State {
  amountInMasset?: BigDecimal;
  amountInMassetPlusFee?: BigDecimal;
  bAssets: { [address: string]: BassetOutput };
  massetState?: MassetState;
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
  simulation?: MassetState;
  cappedSimulation?: MassetState;
}

export interface Dispatch {
  setBassetAmount(address: string, formValue?: string): void;
  setMassetMaxAmount(): void;
  setMassetAmount(formValue?: string): void;
  toggleRedeemMasset(): void;
  toggleBassetEnabled(bAsset: string): void;
}

export type ValidationResult =
  | [boolean]
  | [boolean, Reasons]
  | [boolean, Reasons, string[]];

export type StateValidator = (state: State) => ValidationResult;
