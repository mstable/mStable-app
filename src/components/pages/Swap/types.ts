import { BigNumber } from 'ethers/utils';
import { TokenDetails, TokenQuantity } from '../../../types';

export enum Fields {
  Input = 'input',
  Output = 'output',
}

export enum TransactionType {
  Mint,
  Redeem,
}

export enum Actions {
  SetError,
  SetToken,
  SetMUSD,
  SetFeeRate,
  SetQuantity,
  SetTransactionType,
  StartSubmission,
  EndSubmission,
}

export enum Reasons {
  AmountMustBeSet,
  AmountMustBeGreaterThanZero,
  AmountMustNotExceedBalance,
  AmountCouldNotBeParsed,
  TokenMustBeSelected,
  TokenMustBeUnlocked,
  FetchingData,
  ValidationFailed,
  BAssetNotAllowedInMint,
  MustBeBelowImplicitMaxWeighting,
  MustRedeemOverweightBAssets,
  BAssetsMustRemainUnderMaxWeight,
  BAssetsMustRemainAboveImplicitMinWeight,
  InputLengthShouldBeEqual,
}

export type Action =
  | {
      type: Actions.SetError;
      payload: null | { reason: Reasons; field?: Fields };
    }
  | { type: Actions.StartSubmission }
  | { type: Actions.EndSubmission }
  | {
      type: Actions.SetToken;
      payload: {
        field: Fields;
        swapType?: boolean;
      } & TokenDetails;
    }
  | {
      type: Actions.SetMUSD;
      payload: TokenDetails;
    }
  | {
      type: Actions.SetFeeRate;
      payload: BigNumber;
    }
  | {
      type: Actions.SetQuantity;
      payload: { field: Fields; formValue: string | null };
    }
  | { type: Actions.SetTransactionType; payload: TransactionType };

export interface State {
  values: {
    input: TokenQuantity;
    output: TokenQuantity;
    feeAmountSimple: string | null;
  };
  mUSD: TokenDetails;
  transactionType: TransactionType;
  error: null | { reason: Reasons; field?: Fields };
  submitting: boolean;
  feeRate: BigNumber | null;
}

export interface Dispatch {
  setError(reason: Reasons | null, field?: Fields): void;
  setToken(field: Fields, token: NonNullable<TokenDetails> | null): void;
  setMUSD(token: NonNullable<TokenDetails>): void;
  setFeeRate(feeRate: BigNumber): void;
  setQuantity(field: Fields, formValue: string): void;
  startSubmission(): void;
  endSubmission(): void;
  swapTransactionType(): void;
}
