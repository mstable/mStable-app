import { BigNumber } from 'ethers/utils';
import { Amount } from '../../../types';
import { MassetSubSubscriptionHookResult } from '../../../graphql/generated';

export type MassetData = Pick<MassetSubSubscriptionHookResult, 'data' | 'loading'>;

export type BassetData = NonNullable<
  NonNullable<MassetData['data']>['masset']
>['basket']['bassets'][0];

export enum Mode {
  RedeemProportional,
  // TODO later use these modes
  RedeemSingle,
  RedeemMulti,
}

export enum Actions {
  SetError,
  SetRedemptionAmount,
  UpdateMassetData,
  UpdateMassetBalance,
}

export type Action =
  | { type: Actions.SetRedemptionAmount; payload: string | null }
  | { type: Actions.SetError; payload: { error: string | null } }
  | { type: Actions.UpdateMassetBalance; payload: BigNumber | null }
  | {
      type: Actions.UpdateMassetData;
      payload: MassetData;
    };

export interface BassetOutput {
  address: string;
  amount: Amount;
}

export interface State {
  bassets: BassetOutput[];
  error: string | null;
  massetData: MassetData;
  massetBalance: BigNumber | null;
  mode: Mode;
  redemption: {
    amount: Amount;
    formValue: string | null;
  };
}

export interface Dispatch {
  setRedemptionAmount(amount: string | null): void;
}
