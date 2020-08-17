import { DataState } from '../../../context/DataProvider/types';

export interface State {
  initialized: boolean;
  dataState?: DataState;
}

export enum Actions {
  Data,
  Calculate,
}

export type Action =
  | {
      type: Actions.Data;
      payload?: DataState;
    }
  | {
      type: Actions.Calculate;
      payload?: {};
    };

export interface Dispatch {
  calculate(): void;
}
