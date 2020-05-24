import { BigNumber } from 'ethers/utils';
import { Amount } from '../../../types';
import { MassetData } from '../../../context/DataProvider/types';

export enum Mode {
  RedeemProportional,
  // TODO later use these modes
  RedeemSingle,
  RedeemMulti,
}

export enum Actions {
  SetRedemptionAmount,
  SetExactRedemptionAmount,
  UpdateMassetData,
}

export type Action =
  | {
      type: Actions.SetRedemptionAmount;
      payload: string | null;
    }
  | {
      type: Actions.SetExactRedemptionAmount;
      payload: BigNumber;
    }
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
  error?: string;
  valid: boolean;
  touched: boolean;
  mAssetData: MassetData | null;
  mode: Mode;
  redemption: {
    amount: Amount;
    formValue: string | null;
  };
}

export interface Dispatch {
  setRedemptionAmount(amount: string | null): void;
  setExactRedemptionAmount(amount: BigNumber): void;
}
