import { MassetState } from '../../../../../context/DataProvider/types';
import { AssetState } from '../../../../forms/MultiAssetExchange';

export enum Actions {
  Data,
  SetBassetAmount,
  SetBassetMaxAmount,
}

export type Action =
  | {
      type: Actions.SetBassetAmount;
      payload: { formValue?: string; address: string };
    }
  | { type: Actions.Data; payload?: MassetState }
  | {
      type: Actions.SetBassetMaxAmount;
      payload: { address: string };
    };

export interface State {
  inputAssets: { [address: string]: AssetState };
  outputAssets: { [address: string]: AssetState };
  // error?: string;
  // mintAmount: BigDecimal;
  // mode: Mode;
  // valid: boolean;
  // amountTouched: boolean;
  // toggleTouched: boolean;
  initialized: boolean;
  massetState?: MassetState;
  // simulation?: MassetState;
}

export interface Dispatch {
  setAssetAmount(address: string, formValue?: string): void;
  setAssetMaxAmount(address: string): void;
  // toggleBassetEnabled(bAsset: string): void;
}

// export type ValidationResult =
//   | [boolean]
//   | [boolean, Reasons]
//   | [boolean, Reasons | undefined, { [address: string]: Reasons | undefined }];

// export type StateValidator = (state: State) => ValidationResult;
