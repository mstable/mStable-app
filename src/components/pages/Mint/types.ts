import { BigNumber } from 'ethers/utils';
import { Amount, TokenDetails, TokenQuantity } from '../../../types';
import { MassetQuery } from '../../../graphql/generated';

export enum Mode {
  Single,
  Multi,
}

export enum Actions {
  Initialize,
  SetMassetAmount,
  // SetBassetAmount,
  SetBassetBalance,
  ToggleBassetEnabled,
  ToggleMode,
  SetError,
}

export type Action =
  | {
      type: Actions.Initialize;
      payload: {
        masset: TokenDetails;
        basket: NonNullable<MassetQuery['masset']>['basket'];
      };
    }
  | { type: Actions.SetMassetAmount; payload: string | null }
  | {
      type: Actions.SetBassetBalance;
      payload: { basset: string; balance: BigNumber };
    }
  // | {
  //     type: Actions.SetBassetAmount;
  //     payload: { amount: string; basset: string };
  //   }
  | { type: Actions.ToggleMode }
  | {
      type: Actions.ToggleBassetEnabled;
      payload: string;
    }
  | {
      type: Actions.SetError;
      payload: { reason: null | string; basset?: string };
    };

export enum BassetStatus {
  Default = 'Default',
  Normal = 'Normal',
  BrokenBelowPeg = 'BrokenBelowPeg',
  BrokenAbovePeg = 'BrokenAbovePeg',
  Blacklisted = 'Blacklisted',
  Liquidating = 'Liquidating',
  Liquidated = 'Liquidated',
  Failed = 'Failed',
}

export interface Basset {
  amount: Amount;
  balance: BigNumber | null;
  address: string;
  enabled: boolean;
  error: null | string;
  formValue: string | null;
  maxWeight: BigNumber;
  overweight: boolean;
  status: BassetStatus;
}

export interface State {
  bassets: Basset[];
  basket: NonNullable<MassetQuery['masset']>['basket'] | null;
  error: null | string;
  initialized: boolean;
  masset: TokenQuantity;
  mode: Mode;
}

export interface Dispatch {
  initialize(
    masset: TokenDetails,
    basket: NonNullable<MassetQuery['masset']>['basket'],
  ): void;
  setBassetBalance(basset: string, balance: BigNumber): void;
  setError(reason: string | null, basset?: string): void;
  setMassetAmount(amount: string | null): void;
  // setBassetAmount(basset: string, amount: string): void;
  toggleMode(): void;
  toggleBassetEnabled(basset: string): void;
}
