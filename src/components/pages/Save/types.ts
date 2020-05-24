import { BigNumber } from 'ethers/utils';
import { SavingsBalance, SavingsQuantity, TokenDetails } from '../../../types';
import { LatestExchangeRateSubscriptionResult } from '../../../graphql/generated';
import { TokenDetailsWithBalance } from '../../../context/DataProvider/TokensProvider';

export enum TransactionType {
  Deposit,
  Withdraw,
}

export enum Reasons {
  AmountMustBeGreaterThanZero = 'Amount must be greater than zero',
  AmountMustBeSet = 'Amount must be set',
  DepositAmountMustNotExceedTokenBalance = 'Deposit amount must not exceed token balance',
  FetchingData = 'Fetching data',
  MUSDMustBeUnlocked = 'mUSD must be unlocked',
  TokenMustBeSelected = 'Token must be selected',
  WithdrawAmountMustNotExceedSavingsBalance = 'Withdraw amount must not exceed savings balance',
}

export enum Actions {
  SetData,
  SetQuantity,
  SetToken,
  SetTransactionType,
}

export interface State {
  data: {
    exchangeRate?: NonNullable<
      LatestExchangeRateSubscriptionResult['data']
    >['exchangeRates'][0];
    mUsdToken?: TokenDetailsWithBalance;
    allowance?: BigNumber;
    savingsBalance?: SavingsBalance;
    savingsContractAddress?: string;
  };
  error?: string;
  values: {
    transactionType: TransactionType;
    input: SavingsQuantity;
  };
  touched: boolean;
  valid: boolean;
}

export type Action =
  | {
      type: Actions.SetData;
      payload: State['data'];
    }
  | {
      type: Actions.SetQuantity;
      payload: {
        formValue: string | null;
        isCreditAmount: boolean;
      };
    }
  | {
      type: Actions.SetToken;
      payload: TokenDetails;
    }
  | {
      type: Actions.SetTransactionType;
      payload: { transactionType: TransactionType };
    };

export interface Dispatch {
  setQuantity(formValue: string | null, isCreditAmount?: boolean): void;
  setToken(token: TokenDetails): void;
  setTransactionType(transactionType: TransactionType): void;
}
