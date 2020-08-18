import { BigDecimal } from '../../../web3/BigDecimal';

export interface State {
  formAmount: number;
  amount: BigDecimal;
  minAmount: number;
  maxAmount: number;
  months: number;
  minMonths: number;
  maxMonths: number;
  days: number;
}

export enum Actions {
  AmountChanged,
  MonthsChanged,
}

export type Action =
  | {
      type: Actions.AmountChanged;
      payload: {
        value: number;
      };
    }
  | {
      type: Actions.MonthsChanged;
      payload: {
        value: number;
      };
    };

export interface Dispatch {
  amountChanged(value: number): void;
  monthsChanged(value: number): void;
}
