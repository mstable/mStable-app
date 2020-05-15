import { TokenDetails, TokenQuantity } from '../../../types';
import { MassetData } from '../../../context/DataProvider/types';

export enum Fields {
  Input = 'input',
  Output = 'output',
}

export enum Mode {
  Swap,
  MintSingle,
}

export enum Actions {
  InvertDirection,
  SetError,
  SetToken,
  SetQuantity,
  UpdateMassetData,
}

export type Action =
  | { type: Actions.InvertDirection }
  | {
      type: Actions.SetError;
      payload: null | { reason: string; field?: Fields };
    }
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
  mode: Mode;
  mAssetData: MassetData | null;
  error: null | { reason: string; field?: Fields };
}

export interface Dispatch {
  updateMassetData(mAssetData: MassetData): void;
  setError(reason: string | null, field?: Fields): void;
  invertDirection(): void;
  setToken(field: Fields, token: NonNullable<TokenDetails> | null): void;
  setQuantity(field: Fields, formValue: string): void;
}
