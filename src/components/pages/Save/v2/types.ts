import { MassetState } from '../../../../context/DataProvider/types';
import { Fields, SubscribedToken, TokenQuantityV2 } from '../../../../types';
import { BigDecimal } from '../../../../web3/BigDecimal';

export enum SaveMode {
  Deposit,
  Withdraw,
}

export type TokenPayload = {
  field: Fields;
  token?: SubscribedToken;
};

export type ExchangeState = {
  input: TokenQuantityV2;
  output: TokenQuantityV2;
  feeAmountSimple: string | null;
  rate?: BigDecimal;
  slippage?: BigDecimal;
};

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
  simulated?: MassetState;
  massetState?: MassetState;
  mode: SaveMode;
  exchange: ExchangeState;
}

export type Action =
  | {
      type: Actions.Data;
      payload?: MassetState;
    }
  | {
      type: Actions.SetInput;
      payload: {
        formValue: string | null;
      };
    }
  | { type: Actions.SetMaxInput }
  | {
      type: Actions.SetToken;
      payload: {
        field: Fields;
        token?: SubscribedToken;
      };
    }
  | { type: Actions.SetModeType; payload: SaveMode };

export interface Dispatch {
  setInput(formValue: string | null): void;
  setMaxInput(): void;
  setModeType(modeType: SaveMode): void;
  setToken(field: Fields, token?: SubscribedToken): void;
}
