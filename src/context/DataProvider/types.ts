import { BigNumber } from 'ethers/utils';
import { Masset, Basset, MassetQuery, Basket } from '../../graphql/generated';
import {
  TokenDetailsWithBalance,
  State as TokensState,
} from './TokensProvider';
import { ContractNames } from '../../types';

export interface BassetData
  extends Partial<
    Pick<
      Basset,
      'isTransferFeeCharged' | 'maxWeight' | 'ratio' | 'status' | 'vaultBalance'
    >
  > {
  address: string;
  token: TokenDetailsWithBalance;
  overweight: boolean;
  basketShare: BigNumber;
}

export type BasketData = Partial<
  Pick<Basket, 'collateralisationRatio' | 'undergoingRecol' | 'failed'>
>;

export interface MassetData {
  bAssets: BassetData[];
  basket: BasketData;
  feeRate: Masset['feeRate'] | null;
  token: TokenDetailsWithBalance;
  loading: boolean;
}

export interface State {
  [ContractNames.mUSD]: MassetData;
  // Other mAssets go here
}

export enum Actions {
  UpdateMassetData,
  UpdateTokens,
}

export type Action =
  | {
      type: Actions.UpdateMassetData;
      payload: { data?: MassetQuery; loading: boolean };
    }
  | { type: Actions.UpdateTokens; payload: TokensState };
