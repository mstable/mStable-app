import { BigNumber } from 'ethers/utils';
import { Amount } from '../../../types';
import { MassetData } from '../../../context/DataProvider/types';

export enum Reasons {
  AmountExceedsBalance = 'Amount exceeds balance',
  AmountMustBeGreaterThanZero = 'Amount must be greater than zero',
  AmountMustBeSet = 'Amount must be set',
  BasketContainsBlacklistedAsset = 'Basket contains blacklisted asset',
  BassetsMustRemainBelowMaxWeight = 'bAssets must remain below max weight',
  CannotRedeemMoreBassetsThanAreInTheVault = 'Cannot redeem more bAssets than are in the vault',
  FetchingData = 'Fetching data',
  MustRedeemOverweightBassets = 'Redemption must use overweight bAssets',
  MustRedeemProportionally = 'Proportional redemption is required',
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
  SetExactRedemptionAmount,
  SetRedemptionAmount,
  ToggleBassetEnabled,
  ToggleMode,
  UpdateMassetData,
}

export type Action =
  | {
      type: Actions.SetRedemptionAmount;
      payload: string | null;
    }
  | {
      type: Actions.SetExactRedemptionAmount;
      payload: BigNumber;
    }
  | { type: Actions.ToggleMode }
  | {
      type: Actions.ToggleBassetEnabled;
      payload: string;
    }
  | {
      type: Actions.UpdateMassetData;
      payload: MassetData;
    };

export interface BassetOutput {
  address: string;
  amount: Amount;
  enabled: boolean;
  error?: string;
  formValue?: string;
}

export interface State {
  bAssetOutputs: BassetOutput[];
  error?: string;
  mAssetData?: MassetData;
  mode: Mode;
  redemption: {
    amount: Amount;
    formValue?: string;
  };
  touched?: boolean;
  valid: boolean;
  applyFee: boolean;
  feeAmountSimple?: number;
}

export interface Dispatch {
  setRedemptionAmount(amount: string | null): void;
  setExactRedemptionAmount(amount: BigNumber): void;
  toggleMode(): void;
  toggleBassetEnabled(bAsset: string): void;
}

export type ValidationResult =
  | [boolean]
  | [boolean, string]
  | [boolean, string, string[]];

export type StateValidator = (state: State) => ValidationResult;
