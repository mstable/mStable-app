import { Amount } from '../../../types';
import { MassetData } from '../../../context/DataProvider/types';

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
}

export type Action =
  | { type: Actions.SetRedemptionAmount; payload: string | null }
  | { type: Actions.SetError; payload: { error: string | null } }
  | {
      type: Actions.UpdateMassetData;
      payload: MassetData;
    };

export interface BassetOutput {
  address: string;
  amount: Amount;
}

export interface State {
  bAssetOutputs: BassetOutput[];
  error: string | null;
  massetData: MassetData | null;
  mode: Mode;
  redemption: {
    amount: Amount;
    formValue: string | null;
  };
}

export interface Dispatch {
  setRedemptionAmount(amount: string | null): void;
}
