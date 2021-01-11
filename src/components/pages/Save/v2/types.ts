import { BigDecimal } from '../../../../web3/BigDecimal';
import { Tokens } from '../../../../context/TokensProvider';
import { MassetState } from '../../../../context/DataProvider/types';
import { Fields, SubscribedToken } from '../../../../types';

export enum SaveMode {
  Deposit,
  Withdraw,
}

interface ExchangeStateToken {
  formValue?: string;
  amount?: BigDecimal;
  tokenAddress?: string;
  token?: SubscribedToken;
}

export interface ExchangeState {
  input: ExchangeStateToken;
  output: ExchangeStateToken;
  feeAmountSimple: string | null;
  rate?: BigDecimal;
  slippage?: BigDecimal;
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
  SetInput,
  SetMaxInput,
  SetModeType,
  SetToken,
}

export interface State {
  error?: string;
  valid: boolean;
  touched: boolean;
  initialized: boolean;
  tokens: Tokens;
  massetState?: MassetState;
  mode: SaveMode;
  exchange: ExchangeState;
}

export type Action =
  | {
      type: Actions.Data;
      payload: { massetState?: MassetState; tokens: Tokens };
    }
  | {
      type: Actions.SetInput;
      payload: {
        formValue?: string;
      };
    }
  | { type: Actions.SetMaxInput }
  | {
      type: Actions.SetToken;
      payload: {
        field: Fields;
        tokenAddress?: string;
      };
    }
  | { type: Actions.SetModeType; payload: SaveMode };

export interface Dispatch {
  setInput(formValue?: string): void;
  setMaxInput(): void;
  setModeType(modeType: SaveMode): void;
  setToken(field: Fields, tokenAddress?: string): void;
}
