import { MassetState } from '../../../../context/DataProvider/types';
import { BigDecimal } from '../../../../web3/BigDecimal';

export enum TransactionType {
  Deposit,
  Withdraw,
}

export enum SaveMode {
  Deposit,
  Withdraw,
}

export enum Reasons {
  AmountMustBeGreaterThanZero = 'Amount must be greater than zero',
  AmountMustBeSet = 'Amount must be set',
  DepositAmountMustNotExceedTokenBalance = 'Deposit amount must not exceed token balance',
  FetchingData = 'Fetching data',
  MUSDMustBeApproved = 'Transfers must be approved',
  TokenMustBeSelected = 'Token must be selected',
  WithdrawAmountMustNotExceedSavingsBalance = 'Withdraw amount must not exceed savings balance',
}

export enum Actions {
  Data,
  SetAmount,
  SetMaxAmount,
  ToggleTransactionType,
  SetModeType,
}

export interface State {
  error?: string;
  transactionType: TransactionType;
  amount?: BigDecimal;
  amountInCredits?: BigDecimal;
  formValue: string | null;
  touched: boolean;
  valid: boolean;
  initialized: boolean;
  simulated?: MassetState;
  massetState?: MassetState;
  needsUnlock?: boolean;
  mode: SaveMode;
}

export type Action =
  | {
      type: Actions.Data;
      payload?: MassetState;
    }
  | {
      type: Actions.SetAmount;
      payload: {
        formValue: string | null;
      };
    }
  | { type: Actions.SetMaxAmount }
  | { type: Actions.ToggleTransactionType }
  | { type: Actions.SetModeType; payload: SaveMode };

export interface Dispatch {
  setAmount(formValue: string | null, isCreditAmount?: boolean): void;
  setMaxAmount(): void;
  toggleTransactionType(): void;
  setModeType(modeType: SaveMode): void;
}
