import { Amount } from '../../../types';
import { MassetData } from '../../../context/DataProvider/types';

export enum Reasons {
  AmountExceedsApprovedAmount = 'Amount exceeds approved amount',
  AmountExceedsBalance = 'Amount exceeds balance',
  AmountMustBeGreaterThanZero = 'Amount must be greater than zero',
  AmountMustBeSet = 'Amount must be set',
  BasketFailed = 'Basket failed',
  BasketUndergoingRecollateralisation = 'Basket undergoing recollateralisation',
  FetchingData = 'Fetching data',
  MustBeBelowMaxWeighting = 'Must be below max weighting',
  NoTokenSelected = 'No token selected',
  NoTokensSelected = 'No tokens selected',
  TokenNotAllowedInMint = 'Token not allowed in mint',
}

export enum Actions {
  SetBassetAmount,
  SetBassetMaxAmount,
  ToggleBassetEnabled,
  UpdateMassetData,
}

export type Action =
  | {
      type: Actions.SetBassetAmount;
      payload: { amount: Amount; formValue: string | null; bAsset: string };
    }
  | {
      type: Actions.SetBassetMaxAmount;
    }
  | {
      type: Actions.ToggleBassetEnabled;
      payload: string;
    }
  | {
      type: Actions.UpdateMassetData;
      payload: MassetData;
    };

export enum BassetStatus {
  Default = 'Default',
  Normal = 'Normal',
  BrokenBelowPeg = 'BrokenBelowPeg',
  BrokenAbovePeg = 'BrokenAbovePeg',
  Blacklisted = 'Blacklisted',
  Liquidating = 'Liquidating',
  Liquidated = 'Liquidated',
  Failed = 'Failed',
}

export enum Mode {
  MintSingle,
  MintMulti,
}

export interface BassetInput {
  address: string;
  amount: Amount;
  enabled: boolean;
  error?: string;
  formValue: string | null;
}

export interface State {
  bAssetInputs: BassetInput[];
  error?: string;
  mAssetData?: MassetData;
  mintAmount: Amount;
  mode: Mode;
  valid: boolean;
  touched: boolean;
}

export interface Dispatch {
  setBassetAmount(
    bAsset: string,
    formValue: string | null,
    amount: Amount,
  ): void;
  setBassetMaxAmount(): void;
  toggleBassetEnabled(bAsset: string): void;
  // setCollateralType(): void; // TODO
}

export type ValidationResult =
  | [boolean]
  | [boolean, string]
  | [boolean, string, Record<string, string | undefined>];

export type StateValidator = (state: State) => ValidationResult;
