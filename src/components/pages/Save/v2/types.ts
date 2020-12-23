import { MassetState } from '../../../../context/DataProvider/types';
import { Fields, Token, TokenQuantityV2 } from '../../../../types';
import { BigDecimal } from '../../../../web3/BigDecimal';

export enum TransactionType {
  Deposit,
  Withdraw,
}

export enum SaveMode {
  Deposit,
  Withdraw,
}

export type TokenPayload = {
  field: Fields, 
  token: Token | null
}

export type ExchangeState = {
  input: TokenQuantityV2;
  output: TokenQuantityV2;
  feeAmountSimple: string | null;
  rate?: BigDecimal;
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
  SetInputQuantity,
  SetMaxAmount,
  ToggleTransactionType,
  SetModeType,
  SetToken,
}

export interface State {
  error?: string;
  // can be removed?
  transactionType: TransactionType;
  amount?: BigDecimal;
  amountInCredits?: BigDecimal;
  formValue: string | null;
  //
  touched: boolean;
  valid: boolean;
  initialized: boolean;
  simulated?: MassetState;
  massetState?: MassetState;
  needsUnlock?: boolean;
  mode: SaveMode;
  exchange: ExchangeState;
}

export type Action =
  | {
      type: Actions.Data;
      payload?: MassetState;
    }
  | {
      type: Actions.SetInputQuantity;
      payload: {
        formValue: string | null;
      };
    }
  | { type: Actions.SetMaxAmount }
  | { 
      type: Actions.SetToken; 
      payload: {
        field: Fields;
        token: Token | null;
      };  
    }
  | { type: Actions.ToggleTransactionType }
  | { type: Actions.SetModeType; payload: SaveMode };

export interface Dispatch {
  setInputQuantity(formValue: string | null): void;
  toggleTransactionType(): void;
  setModeType(modeType: SaveMode): void;
  setToken(field: Fields, token: Token | null): void;
}
