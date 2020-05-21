import { TokenDetails, TokenQuantity } from '../../../types';
import { MassetData } from '../../../context/DataProvider/types';

export enum Fields {
  Input = 'input',
  Output = 'output',
}

export enum Actions {
  SetToken,
  SetQuantity,
  UpdateMassetData,
}

export type Action =
  | {
      type: Actions.SetToken;
      payload: {
        field: Fields;
      } & TokenDetails;
    }
  | {
      type: Actions.SetQuantity;
      payload: { field: Fields; formValue: string | null };
    }
  | {
      type: Actions.UpdateMassetData;
      payload: MassetData;
    };

export interface State {
  values: {
    input: TokenQuantity;
    output: TokenQuantity;
    feeAmountSimple: string | null;
  };
  applySwapFee: boolean;
  mAssetData: MassetData;
  touched: boolean;
  needsUnlock: boolean;
  inputError?: string;
  outputError?: string;
  valid: boolean;
}

export interface Dispatch {
  updateMassetData(mAssetData: MassetData): void;
  setToken(field: Fields, token: NonNullable<TokenDetails> | null): void;
  setQuantity(field: Fields, formValue: string): void;
}

export type ValidationResult = [
  boolean,
  { [Fields.Input]?: string; [Fields.Output]?: string; applySwapFee?: boolean },
];

export type StateValidator = (state: State) => ValidationResult;
