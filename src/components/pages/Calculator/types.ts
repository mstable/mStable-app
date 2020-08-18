import { BigNumber } from 'ethers/utils';
import { BigDecimal } from '../../../web3/BigDecimal';
import { DataState } from '../../../context/DataProvider/types';

export interface State {
  dataState?: DataState;
  initialized: boolean;
  processing: boolean;
  depositedAmount: BigDecimal;
  amount: string | null;
  startDate: string;
  endDate: string;
  totalDays: number;
  isInThePast: boolean;
  isInTheFuture: boolean;
  totalEarnings: BigDecimal;
  avgApy: BigNumber;
  avgApyPast: BigNumber;
  avgApyFuture: BigNumber;
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
