import { TokenDetails, TokenQuantity } from '../../../types';
import { DataState } from '../../../context/DataProvider/types';

export enum Fields {
  Input = 'input',
  Output = 'output',
}

export enum Actions {
  Data,
  SetToken,
  SetQuantity,
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
      type: Actions.Data;
      payload?: DataState;
    };

export interface State {
  values: {
    input: TokenQuantity;
    output: TokenQuantity;
    feeAmountSimple: string | null;
  };
  applySwapFee: boolean;
  dataState?: DataState;
  touched: boolean;
  needsUnlock: boolean;
  inputError?: string;
  outputError?: string;
  valid: boolean;
}

export interface Dispatch {
  setToken(field: Fields, token: NonNullable<TokenDetails> | null): void;
  setQuantity(field: Fields, formValue: string): void;
}

export type ValidationResult = [
  boolean,
  { [Fields.Input]?: string; [Fields.Output]?: string; applySwapFee?: boolean },
];

export type StateValidator = (state: State) => ValidationResult;
