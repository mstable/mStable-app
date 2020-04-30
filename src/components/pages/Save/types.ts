import { TokenDetails, TokenQuantity } from '../../../types';

export enum TransactionType {
  Deposit,
  Withdraw,
}

export enum Reasons {
  AmountMustBeSet,
  AmountMustBeGreaterThanZero,
  DepositAmountMustNotExceedTokenBalance,
  WithdrawAmountMustNotExceedSavingsBalance,
  TokenMustBeSelected,
  FetchingData,
  MUSDMustBeUnlocked,
}

export enum Actions {
  SetQuantity,
  SetToken,
  SetTransactionType,
  SetError,
}

export type Action =
  | {
      type: Actions.SetError;
      payload: { reason: Reasons | null };
    }
  | { type: Actions.SetQuantity; payload: { formValue: string | null } }
  | {
      type: Actions.SetToken;
      payload: TokenDetails;
    }
  | {
      type: Actions.SetTransactionType;
      payload: { transactionType: TransactionType };
    };

export interface Dispatch {
  setError(reason: Reasons | null): void;
  setQuantity(formValue: string | null): void;
  setToken(token: TokenDetails): void;
  setTransactionType(transactionType: TransactionType): void;
}

export interface State {
  error: Reasons | null;
  transactionType: TransactionType;
  input: TokenQuantity;
}
