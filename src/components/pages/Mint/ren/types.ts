import { MassetState } from '../../../../context/DataProvider/types';
import { TransactionOption } from '../../../../types';

export type OnboardData = {
  inputAddress?: string;
  inputFormValue?: string;
  inputAddressOptions: TransactionOption[];
  outputAddress?: string;
  outputAddressOptions: TransactionOption[];
};

export enum Actions {
  Data,
  SetOnboardData,
  SetStep,
}

export type Action =
  | { type: Actions.Data; payload?: MassetState }
  | {
      type: Actions.SetOnboardData;
      payload?: OnboardData;
    }
  | {
      type: Actions.SetStep;
      payload: number;
    };

export interface State {
  initialized: boolean;
  step: number;
  onboardData?: {
    inputAddress?: string;
    inputFormValue?: string;
    inputAddressOptions: TransactionOption[];
    outputAddress?: string;
    outputAddressOptions: TransactionOption[];
  };
}

export interface Dispatch {
  setOnboardData(data?: OnboardData): void;
  setStep(step: number): void;
}
