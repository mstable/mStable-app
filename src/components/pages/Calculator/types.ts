import { BigDecimal } from '../../../web3/BigDecimal';
import { DataState } from '../../../context/DataProvider/types';

export interface State {
  dataState?: DataState;
  initialized: boolean;
  depositedAmount: BigDecimal | undefined;
  amount: string | null;
  startDate: string;
  startMinDate: string;
  startMaxDate: string;
  endDate: string;
  endMinDate: string;
  pastDays: number;
  futureDays: number;
  isInThePast: boolean;
  isInTheFuture: boolean;
}

export enum Actions {
  Data,
  AmountChanged,
  StartDateChanged,
  EndDateChanged,
}

export type Action =
  | {
      type: Actions.Data;
      payload?: DataState;
    }
  | {
      type: Actions.AmountChanged;
      payload: {
        value: string | null;
      };
    }
  | {
      type: Actions.StartDateChanged;
      payload: {
        value: string;
      };
    }
  | {
      type: Actions.EndDateChanged;
      payload: {
        value: string;
      };
    };

export interface Dispatch {
  amountChanged(value: string | null): void;
  startDateChanged(value: string): void;
  endDateChanged(value: string): void;
}
