import { BigDecimal } from '../../../web3/BigDecimal';
import { DataState } from '../../../context/DataProvider/types';

export enum Reasons {
  AmountExceedsApprovedAmount,
  AmountExceedsBalance,
  AmountMustBeGreaterThanZero,
  AmountMustBeSet,
  BasketFailed,
  BasketUndergoingRecollateralisation,
  FetchingData,
  MustBeBelowMaxWeighting,
  NoAssetSelected,
  NoAssetsSelected,
  AssetNotAllowedInMint,
}

export enum Actions {
  Data,
  SetBassetAmount,
  SetBassetMaxAmount,
  ToggleBassetEnabled,
}

export type Action =
  | { type: Actions.Data; payload?: DataState }
  | {
      type: Actions.SetBassetAmount;
      payload: { formValue: string | null; address: string };
    }
  | {
      type: Actions.SetBassetMaxAmount;
    }
  | {
      type: Actions.ToggleBassetEnabled;
      payload: string;
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
  amount?: BigDecimal;
  formValue: string | null;
  decimals: number;
  enabled: boolean;
  error?: string;
  reason?: Reasons;
}

export interface State {
  bAssets: { [address: string]: BassetInput };
  error?: string;
  mintAmount: BigDecimal;
  mode: Mode;
  valid: boolean;
  amountTouched: boolean;
  toggleTouched: boolean;
  initialized: boolean;
  dataState?: DataState;
  simulation?: DataState;
}

export interface Dispatch {
  setBassetAmount(address: string, formValue: string | null): void;
  setBassetMaxAmount(): void;
  toggleBassetEnabled(bAsset: string): void;
  // setCollateralType(): void; // TODO
}

export type ValidationResult =
  | [boolean]
  | [boolean, Reasons]
  | [boolean, Reasons | undefined, { [address: string]: Reasons | undefined }];

export type StateValidator = (state: State) => ValidationResult;
