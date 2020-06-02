import { BigNumber } from 'ethers/utils';
import {
  Basket,
  Basset,
  CreditBalance,
  ExchangeRate,
  Masset,
  MassetQueryResult,
  SavingsContractQueryResult,
} from '../../graphql/generated';
import {
  TokenDetailsWithBalance,
  State as TokensState,
} from './TokensProvider';
import { Amount } from '../../types';

export interface BassetData
  extends Pick<
    Basset,
    'isTransferFeeCharged' | 'maxWeight' | 'ratio' | 'status' | 'vaultBalance'
  > {
  address: string;
  token: TokenDetailsWithBalance;
  overweight: boolean;
  basketShare: BigNumber;
}

export type BasketData = Pick<
  Basket,
  'collateralisationRatio' | 'undergoingRecol' | 'failed'
>;

export interface MassetData {
  bAssets: BassetData[];
  basket: BasketData;
  feeRate: Masset['feeRate'] | null;
  token: TokenDetailsWithBalance;
  loading: boolean;
}

export interface State {
  mUSD: MassetData;
  mUSDSavings?: NonNullable<
    SavingsContractQueryResult['data']
  >['savingsContracts'][0];
  latestExchangeRate?: Pick<ExchangeRate, 'exchangeRate' | 'timestamp'>;
  creditBalances: Pick<CreditBalance, 'amount'>[];
  savingsBalance: Amount & { creditsExact: BigNumber | null };
}

export enum Actions {
  UpdateCreditBalances,
  UpdateLatestExchangeRate,
  UpdateMassetData,
  UpdateMusdSavingsData,
  UpdateTokens,
}

export type Action =
  | {
      type: Actions.UpdateMassetData;
      payload: NonNullable<MassetQueryResult['data']>['masset'];
    }
  | {
      type: Actions.UpdateMusdSavingsData;
      payload: State['mUSDSavings'];
    }
  | {
      type: Actions.UpdateLatestExchangeRate;
      payload: State['latestExchangeRate'];
    }
  | {
      type: Actions.UpdateCreditBalances;
      payload: State['creditBalances'];
    }
  | { type: Actions.UpdateTokens; payload: TokensState };
