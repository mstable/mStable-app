import { Token, TokenQuantity } from '../../../types';
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
      } & {
        address: string | null;
        decimals: number | null;
        symbol: string | null;
      };
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
  setToken(field: Fields, token: NonNullable<Token> | null): void;
  setQuantity(field: Fields, formValue: string): void;
}

export enum Reasons {
  AmountMustBeGreaterThanZero,
  AmountMustBeSet,
  AssetNotAllowedInSwap,
  CannotRedeemMoreAssetsThanAreInTheVault,
  FetchingData,
  AmountExceedsBalance,
  AssetsMustRemainBelowMaxWeight,
  TransferMustBeApproved,
  AssetMustBeSelected,
  AssetNotAllowedInMint,
}

export type ValidationResult = [
  boolean,
  {
    [Fields.Input]?: Reasons;
    [Fields.Output]?: Reasons;
    applySwapFee?: boolean;
  },
];

export type StateValidator = (state: State) => ValidationResult;
