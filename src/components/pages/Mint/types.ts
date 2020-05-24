import { Amount, TokenQuantity } from '../../../types';
import { MassetData } from '../../../context/DataProvider/types';

export enum Mode {
  Single,
  Multi,
}

export enum Actions {
  // SetBassetAmount,
  SetMassetAmount,
  ToggleBassetEnabled,
  ToggleMode,
  UpdateMassetData,
}

export type Action =
  // | {
  //     type: Actions.SetBassetAmount;
  //     payload: { amount: string; basset: string };
  //   }
  | { type: Actions.SetMassetAmount; payload: string | null }
  | { type: Actions.ToggleMode }
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

export interface BassetInput {
  address: string;
  amount: Amount;
  enabled: boolean;
  error: null | string;
  formValue: string | null;
}

export interface State {
  bAssetInputs: BassetInput[];
  error: null | string;
  mAsset: TokenQuantity;
  mAssetData?: MassetData;
  mode: Mode;
  valid: boolean;
  touched: boolean;
}

export interface Dispatch {
  // setBassetAmount(basset: string, amount: string): void;
  setMassetAmount(amount: string | null): void;
  toggleMode(): void;
  toggleBassetEnabled(basset: string): void;
}

export type ValidationResult =
  | [boolean, string | null]
  | [boolean, string | null, Record<string, string | null>];

export type StateValidator = (state: State) => ValidationResult;
