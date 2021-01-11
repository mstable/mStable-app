import { Fields, Token, TokenQuantityV1 } from '../../../types';
import { MassetState } from '../../../context/DataProvider/types';

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
      payload: { field: Fields; formValue?: string };
    }
  | {
      type: Actions.Data;
      payload?: MassetState;
    };

export interface State {
  values: {
    input: TokenQuantityV1;
    output: TokenQuantityV1;
    feeAmountSimple: string | null;
  };
  applySwapFee: boolean;
  massetState?: MassetState;
  touched: boolean;
  needsUnlock: boolean;
  inputError?: string;
  outputError?: string;
  valid: boolean;
}

export interface Dispatch {
  setToken(
    field: Fields,
    token: Pick<Token, 'address' | 'decimals' | 'symbol'> | null,
  ): void;
  setInputQuantity(formValue: string): void;
  setOutputQuantity(formValue: string): void;
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
