import { DataState } from '../../../context/DataProvider/types';
import { BigDecimal } from '../../../web3/BigDecimal';

export enum Reasons {
  AmountExceedsBalance = 'Amount exceeds balance',
  AmountMustBeGreaterThanZero = 'Amount must be greater than zero',
  AmountMustBeSet = 'Amount must be set',
  BasketContainsBlacklistedAsset = 'Basket contains blacklisted asset',
  BassetsMustRemainBelowMaxWeight = 'bAssets must remain below max weight',
  CannotRedeemMoreBassetsThanAreInTheVault = 'Cannot redeem more bAssets than are in the vault',
  FetchingData = 'Fetching data',
  MustRedeemOverweightBassets = 'Redemption must use overweight bAssets',
  MustRedeemWithAllBassets = 'Must redeem with all bAssets',
  NoTokenSelected = 'No token selected',
  NoTokensSelected = 'No tokens selected',
  NotEnoughLiquidity = 'Not enough liquidity',
  NothingInTheBasketToRedeem = 'Nothing in the basket to redeem',
  RedemptionPausedDuringRecol = 'Redemption paused during recollateralisation',
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
  error?: string;
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
  | [boolean, string]
  | [boolean, string, string[]];

export type StateValidator = (state: State) => ValidationResult;
