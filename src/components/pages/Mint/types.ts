import { BigDecimal } from '../../../web3/BigDecimal';
import { DataState } from '../../../context/DataProvider/types';

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
  | [boolean, string]
  | [boolean, string, Record<string, string | undefined>];

export type StateValidator = (state: State) => ValidationResult;
