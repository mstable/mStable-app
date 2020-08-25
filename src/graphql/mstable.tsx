import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;

export interface IntrospectionResultData {
  __schema: {
    types: {
      kind: string;
      name: string;
      possibleTypes: {
        name: string;
      }[];
    }[];
  };
}
const result: IntrospectionResultData = {
  __schema: {
    types: [
      {
        kind: 'INTERFACE',
        name: 'TimeMetric',
        possibleTypes: [
          {
            name: 'VolumeMetric',
          },
          {
            name: 'AggregateMetric',
          },
        ],
      },
      {
        kind: 'INTERFACE',
        name: 'Transaction',
        possibleTypes: [
          {
            name: 'SwapTransaction',
          },
          {
            name: 'FeePaidTransaction',
          },
          {
            name: 'StakingRewardsContractTransaction',
          },
          {
            name: 'StakingRewardsContractClaimRewardTransaction',
          },
          {
            name: 'StakingRewardsContractStakeTransaction',
          },
          {
            name: 'StakingRewardsContractWithdrawTransaction',
          },
        ],
      },
    ],
  },
};
export default result;

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Bytes: string;
  BigDecimal: string;
  BigInt: string;
};

/** An Ethereum account with balances/credit balances */
export type Account = {
  id: Scalars['ID'];
  /** Address of the account */
  address: Scalars['Bytes'];
  /** AccountBalances of the account */
  balances: Array<AccountBalance>;
  /** CreditBalances of the account */
  creditBalances: Array<CreditBalance>;
};

/** An Ethereum account with balances/credit balances */
export type AccountBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AccountBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AccountBalance_Filter>;
};

/** An Ethereum account with balances/credit balances */
export type AccountCreditBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CreditBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<CreditBalance_Filter>;
};

export type Account_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  address?: Maybe<Scalars['Bytes']>;
  address_not?: Maybe<Scalars['Bytes']>;
  address_in?: Maybe<Array<Scalars['Bytes']>>;
  address_not_in?: Maybe<Array<Scalars['Bytes']>>;
  address_contains?: Maybe<Scalars['Bytes']>;
  address_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum Account_OrderBy {
  Id = 'id',
  Address = 'address',
  Balances = 'balances',
  CreditBalances = 'creditBalances',
}

/** An account balance for a given token */
export type AccountBalance = {
  id: Scalars['ID'];
  /** Account */
  account: Account;
  /** Amount as a decimal value */
  amount: Scalars['BigDecimal'];
  /** Token */
  token: Token;
};

export type AccountBalance_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  account?: Maybe<Scalars['String']>;
  account_not?: Maybe<Scalars['String']>;
  account_gt?: Maybe<Scalars['String']>;
  account_lt?: Maybe<Scalars['String']>;
  account_gte?: Maybe<Scalars['String']>;
  account_lte?: Maybe<Scalars['String']>;
  account_in?: Maybe<Array<Scalars['String']>>;
  account_not_in?: Maybe<Array<Scalars['String']>>;
  account_contains?: Maybe<Scalars['String']>;
  account_not_contains?: Maybe<Scalars['String']>;
  account_starts_with?: Maybe<Scalars['String']>;
  account_not_starts_with?: Maybe<Scalars['String']>;
  account_ends_with?: Maybe<Scalars['String']>;
  account_not_ends_with?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['BigDecimal']>;
  amount_not?: Maybe<Scalars['BigDecimal']>;
  amount_gt?: Maybe<Scalars['BigDecimal']>;
  amount_lt?: Maybe<Scalars['BigDecimal']>;
  amount_gte?: Maybe<Scalars['BigDecimal']>;
  amount_lte?: Maybe<Scalars['BigDecimal']>;
  amount_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
};

export enum AccountBalance_OrderBy {
  Id = 'id',
  Account = 'account',
  Amount = 'amount',
  Token = 'token',
}

export type AggregateMetric = TimeMetric & {
  id: Scalars['ID'];
  value: Scalars['BigDecimal'];
  timestamp: Scalars['Int'];
  period: TimeMetricPeriod;
  type: AggregateMetricType;
};

export type AggregateMetric_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  value?: Maybe<Scalars['BigDecimal']>;
  value_not?: Maybe<Scalars['BigDecimal']>;
  value_gt?: Maybe<Scalars['BigDecimal']>;
  value_lt?: Maybe<Scalars['BigDecimal']>;
  value_gte?: Maybe<Scalars['BigDecimal']>;
  value_lte?: Maybe<Scalars['BigDecimal']>;
  value_in?: Maybe<Array<Scalars['BigDecimal']>>;
  value_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  period?: Maybe<TimeMetricPeriod>;
  period_not?: Maybe<TimeMetricPeriod>;
  type?: Maybe<AggregateMetricType>;
  type_not?: Maybe<AggregateMetricType>;
};

export enum AggregateMetric_OrderBy {
  Id = 'id',
  Value = 'value',
  Timestamp = 'timestamp',
  Period = 'period',
  Type = 'type',
}

export enum AggregateMetricType {
  TotalSupply = 'TOTAL_SUPPLY',
  TotalSavings = 'TOTAL_SAVINGS',
}

/** A Basket of Bassets (e.g. for mUSD) */
export type Basket = {
  id: Scalars['ID'];
  /** The Bassets in the Basket */
  bassets: Array<Basset>;
  /** The collateralisation ratio of the Basket */
  collateralisationRatio: Scalars['BigInt'];
  /** Max number of Bassets that can be present in the Basket */
  maxBassets: Scalars['Int'];
  /** Flag for whether the Basket has failed */
  undergoingRecol: Scalars['Boolean'];
  /** Flag for whether the Basket has failed */
  failed: Scalars['Boolean'];
  /** Masset the Basket belongs to */
  masset: Masset;
};

/** A Basket of Bassets (e.g. for mUSD) */
export type BasketBassetsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Basset_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Basset_Filter>;
};

export type Basket_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  bassets?: Maybe<Array<Scalars['String']>>;
  bassets_not?: Maybe<Array<Scalars['String']>>;
  bassets_contains?: Maybe<Array<Scalars['String']>>;
  bassets_not_contains?: Maybe<Array<Scalars['String']>>;
  collateralisationRatio?: Maybe<Scalars['BigInt']>;
  collateralisationRatio_not?: Maybe<Scalars['BigInt']>;
  collateralisationRatio_gt?: Maybe<Scalars['BigInt']>;
  collateralisationRatio_lt?: Maybe<Scalars['BigInt']>;
  collateralisationRatio_gte?: Maybe<Scalars['BigInt']>;
  collateralisationRatio_lte?: Maybe<Scalars['BigInt']>;
  collateralisationRatio_in?: Maybe<Array<Scalars['BigInt']>>;
  collateralisationRatio_not_in?: Maybe<Array<Scalars['BigInt']>>;
  maxBassets?: Maybe<Scalars['Int']>;
  maxBassets_not?: Maybe<Scalars['Int']>;
  maxBassets_gt?: Maybe<Scalars['Int']>;
  maxBassets_lt?: Maybe<Scalars['Int']>;
  maxBassets_gte?: Maybe<Scalars['Int']>;
  maxBassets_lte?: Maybe<Scalars['Int']>;
  maxBassets_in?: Maybe<Array<Scalars['Int']>>;
  maxBassets_not_in?: Maybe<Array<Scalars['Int']>>;
  undergoingRecol?: Maybe<Scalars['Boolean']>;
  undergoingRecol_not?: Maybe<Scalars['Boolean']>;
  undergoingRecol_in?: Maybe<Array<Scalars['Boolean']>>;
  undergoingRecol_not_in?: Maybe<Array<Scalars['Boolean']>>;
  failed?: Maybe<Scalars['Boolean']>;
  failed_not?: Maybe<Scalars['Boolean']>;
  failed_in?: Maybe<Array<Scalars['Boolean']>>;
  failed_not_in?: Maybe<Array<Scalars['Boolean']>>;
};

export enum Basket_OrderBy {
  Id = 'id',
  Bassets = 'bassets',
  CollateralisationRatio = 'collateralisationRatio',
  MaxBassets = 'maxBassets',
  UndergoingRecol = 'undergoingRecol',
  Failed = 'failed',
  Masset = 'masset',
}

/** Basket Asset (e.g. DAI for the mUSD basket) */
export type Basset = {
  id: Scalars['ID'];
  /** Basket the Basset is contained in */
  basket: Basket;
  /** Target weight of the Basset */
  maxWeight: Scalars['BigInt'];
  /** Basset to Masset ratio for quantity conversion */
  ratio: Scalars['BigInt'];
  /** Status of the Basset, e.g. 'Normal' */
  status: Scalars['String'];
  /** An ERC20 can charge transfer fee, e.g. USDT or DGX tokens */
  isTransferFeeCharged: Scalars['Boolean'];
  /** The underlying Token for the Basset */
  token: Token;
  /** Amount of the Basset that is held in collateral */
  vaultBalance: Scalars['BigDecimal'];
};

export type Basset_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  maxWeight?: Maybe<Scalars['BigInt']>;
  maxWeight_not?: Maybe<Scalars['BigInt']>;
  maxWeight_gt?: Maybe<Scalars['BigInt']>;
  maxWeight_lt?: Maybe<Scalars['BigInt']>;
  maxWeight_gte?: Maybe<Scalars['BigInt']>;
  maxWeight_lte?: Maybe<Scalars['BigInt']>;
  maxWeight_in?: Maybe<Array<Scalars['BigInt']>>;
  maxWeight_not_in?: Maybe<Array<Scalars['BigInt']>>;
  ratio?: Maybe<Scalars['BigInt']>;
  ratio_not?: Maybe<Scalars['BigInt']>;
  ratio_gt?: Maybe<Scalars['BigInt']>;
  ratio_lt?: Maybe<Scalars['BigInt']>;
  ratio_gte?: Maybe<Scalars['BigInt']>;
  ratio_lte?: Maybe<Scalars['BigInt']>;
  ratio_in?: Maybe<Array<Scalars['BigInt']>>;
  ratio_not_in?: Maybe<Array<Scalars['BigInt']>>;
  status?: Maybe<Scalars['String']>;
  status_not?: Maybe<Scalars['String']>;
  status_gt?: Maybe<Scalars['String']>;
  status_lt?: Maybe<Scalars['String']>;
  status_gte?: Maybe<Scalars['String']>;
  status_lte?: Maybe<Scalars['String']>;
  status_in?: Maybe<Array<Scalars['String']>>;
  status_not_in?: Maybe<Array<Scalars['String']>>;
  status_contains?: Maybe<Scalars['String']>;
  status_not_contains?: Maybe<Scalars['String']>;
  status_starts_with?: Maybe<Scalars['String']>;
  status_not_starts_with?: Maybe<Scalars['String']>;
  status_ends_with?: Maybe<Scalars['String']>;
  status_not_ends_with?: Maybe<Scalars['String']>;
  isTransferFeeCharged?: Maybe<Scalars['Boolean']>;
  isTransferFeeCharged_not?: Maybe<Scalars['Boolean']>;
  isTransferFeeCharged_in?: Maybe<Array<Scalars['Boolean']>>;
  isTransferFeeCharged_not_in?: Maybe<Array<Scalars['Boolean']>>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  vaultBalance?: Maybe<Scalars['BigDecimal']>;
  vaultBalance_not?: Maybe<Scalars['BigDecimal']>;
  vaultBalance_gt?: Maybe<Scalars['BigDecimal']>;
  vaultBalance_lt?: Maybe<Scalars['BigDecimal']>;
  vaultBalance_gte?: Maybe<Scalars['BigDecimal']>;
  vaultBalance_lte?: Maybe<Scalars['BigDecimal']>;
  vaultBalance_in?: Maybe<Array<Scalars['BigDecimal']>>;
  vaultBalance_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum Basset_OrderBy {
  Id = 'id',
  Basket = 'basket',
  MaxWeight = 'maxWeight',
  Ratio = 'ratio',
  Status = 'status',
  IsTransferFeeCharged = 'isTransferFeeCharged',
  Token = 'token',
  VaultBalance = 'vaultBalance',
}

export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
};

/** A credit balance for a given savings contract */
export type CreditBalance = {
  id: Scalars['ID'];
  /** Account */
  account: Account;
  /** Amount as a decimal value */
  amount: Scalars['BigDecimal'];
  /** Savings contract */
  savingsContract: SavingsContract;
};

export type CreditBalance_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  account?: Maybe<Scalars['String']>;
  account_not?: Maybe<Scalars['String']>;
  account_gt?: Maybe<Scalars['String']>;
  account_lt?: Maybe<Scalars['String']>;
  account_gte?: Maybe<Scalars['String']>;
  account_lte?: Maybe<Scalars['String']>;
  account_in?: Maybe<Array<Scalars['String']>>;
  account_not_in?: Maybe<Array<Scalars['String']>>;
  account_contains?: Maybe<Scalars['String']>;
  account_not_contains?: Maybe<Scalars['String']>;
  account_starts_with?: Maybe<Scalars['String']>;
  account_not_starts_with?: Maybe<Scalars['String']>;
  account_ends_with?: Maybe<Scalars['String']>;
  account_not_ends_with?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['BigDecimal']>;
  amount_not?: Maybe<Scalars['BigDecimal']>;
  amount_gt?: Maybe<Scalars['BigDecimal']>;
  amount_lt?: Maybe<Scalars['BigDecimal']>;
  amount_gte?: Maybe<Scalars['BigDecimal']>;
  amount_lte?: Maybe<Scalars['BigDecimal']>;
  amount_in?: Maybe<Array<Scalars['BigDecimal']>>;
  amount_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  savingsContract?: Maybe<Scalars['String']>;
  savingsContract_not?: Maybe<Scalars['String']>;
  savingsContract_gt?: Maybe<Scalars['String']>;
  savingsContract_lt?: Maybe<Scalars['String']>;
  savingsContract_gte?: Maybe<Scalars['String']>;
  savingsContract_lte?: Maybe<Scalars['String']>;
  savingsContract_in?: Maybe<Array<Scalars['String']>>;
  savingsContract_not_in?: Maybe<Array<Scalars['String']>>;
  savingsContract_contains?: Maybe<Scalars['String']>;
  savingsContract_not_contains?: Maybe<Scalars['String']>;
  savingsContract_starts_with?: Maybe<Scalars['String']>;
  savingsContract_not_starts_with?: Maybe<Scalars['String']>;
  savingsContract_ends_with?: Maybe<Scalars['String']>;
  savingsContract_not_ends_with?: Maybe<Scalars['String']>;
};

export enum CreditBalance_OrderBy {
  Id = 'id',
  Account = 'account',
  Amount = 'amount',
  SavingsContract = 'savingsContract',
}

export type ExchangeRate = {
  id: Scalars['ID'];
  exchangeRate: Scalars['BigDecimal'];
  timestamp: Scalars['Int'];
  savingsContract: SavingsContract;
};

export type ExchangeRate_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  exchangeRate?: Maybe<Scalars['BigDecimal']>;
  exchangeRate_not?: Maybe<Scalars['BigDecimal']>;
  exchangeRate_gt?: Maybe<Scalars['BigDecimal']>;
  exchangeRate_lt?: Maybe<Scalars['BigDecimal']>;
  exchangeRate_gte?: Maybe<Scalars['BigDecimal']>;
  exchangeRate_lte?: Maybe<Scalars['BigDecimal']>;
  exchangeRate_in?: Maybe<Array<Scalars['BigDecimal']>>;
  exchangeRate_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  savingsContract?: Maybe<Scalars['String']>;
  savingsContract_not?: Maybe<Scalars['String']>;
  savingsContract_gt?: Maybe<Scalars['String']>;
  savingsContract_lt?: Maybe<Scalars['String']>;
  savingsContract_gte?: Maybe<Scalars['String']>;
  savingsContract_lte?: Maybe<Scalars['String']>;
  savingsContract_in?: Maybe<Array<Scalars['String']>>;
  savingsContract_not_in?: Maybe<Array<Scalars['String']>>;
  savingsContract_contains?: Maybe<Scalars['String']>;
  savingsContract_not_contains?: Maybe<Scalars['String']>;
  savingsContract_starts_with?: Maybe<Scalars['String']>;
  savingsContract_not_starts_with?: Maybe<Scalars['String']>;
  savingsContract_ends_with?: Maybe<Scalars['String']>;
  savingsContract_not_ends_with?: Maybe<Scalars['String']>;
};

export enum ExchangeRate_OrderBy {
  Id = 'id',
  ExchangeRate = 'exchangeRate',
  Timestamp = 'timestamp',
  SavingsContract = 'savingsContract',
}

/** Log of the Fee payment */
export type FeePaidTransaction = Transaction & {
  id: Scalars['ID'];
  tx: Scalars['Bytes'];
  type: TransactionType;
  timestamp: Scalars['Int'];
  sender: Scalars['Bytes'];
  /** Which mAsset is this tx in? */
  mAsset: Masset;
  mAssetUnits: Scalars['BigDecimal'];
  asset: Basset;
};

export type FeePaidTransaction_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  tx?: Maybe<Scalars['Bytes']>;
  tx_not?: Maybe<Scalars['Bytes']>;
  tx_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_not_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_contains?: Maybe<Scalars['Bytes']>;
  tx_not_contains?: Maybe<Scalars['Bytes']>;
  type?: Maybe<TransactionType>;
  type_not?: Maybe<TransactionType>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  mAsset?: Maybe<Scalars['String']>;
  mAsset_not?: Maybe<Scalars['String']>;
  mAsset_gt?: Maybe<Scalars['String']>;
  mAsset_lt?: Maybe<Scalars['String']>;
  mAsset_gte?: Maybe<Scalars['String']>;
  mAsset_lte?: Maybe<Scalars['String']>;
  mAsset_in?: Maybe<Array<Scalars['String']>>;
  mAsset_not_in?: Maybe<Array<Scalars['String']>>;
  mAsset_contains?: Maybe<Scalars['String']>;
  mAsset_not_contains?: Maybe<Scalars['String']>;
  mAsset_starts_with?: Maybe<Scalars['String']>;
  mAsset_not_starts_with?: Maybe<Scalars['String']>;
  mAsset_ends_with?: Maybe<Scalars['String']>;
  mAsset_not_ends_with?: Maybe<Scalars['String']>;
  mAssetUnits?: Maybe<Scalars['BigDecimal']>;
  mAssetUnits_not?: Maybe<Scalars['BigDecimal']>;
  mAssetUnits_gt?: Maybe<Scalars['BigDecimal']>;
  mAssetUnits_lt?: Maybe<Scalars['BigDecimal']>;
  mAssetUnits_gte?: Maybe<Scalars['BigDecimal']>;
  mAssetUnits_lte?: Maybe<Scalars['BigDecimal']>;
  mAssetUnits_in?: Maybe<Array<Scalars['BigDecimal']>>;
  mAssetUnits_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  asset?: Maybe<Scalars['String']>;
  asset_not?: Maybe<Scalars['String']>;
  asset_gt?: Maybe<Scalars['String']>;
  asset_lt?: Maybe<Scalars['String']>;
  asset_gte?: Maybe<Scalars['String']>;
  asset_lte?: Maybe<Scalars['String']>;
  asset_in?: Maybe<Array<Scalars['String']>>;
  asset_not_in?: Maybe<Array<Scalars['String']>>;
  asset_contains?: Maybe<Scalars['String']>;
  asset_not_contains?: Maybe<Scalars['String']>;
  asset_starts_with?: Maybe<Scalars['String']>;
  asset_not_starts_with?: Maybe<Scalars['String']>;
  asset_ends_with?: Maybe<Scalars['String']>;
  asset_not_ends_with?: Maybe<Scalars['String']>;
};

export enum FeePaidTransaction_OrderBy {
  Id = 'id',
  Tx = 'tx',
  Type = 'type',
  Timestamp = 'timestamp',
  Sender = 'sender',
  MAsset = 'mAsset',
  MAssetUnits = 'mAssetUnits',
  Asset = 'asset',
}

/** An mStable asset (e.g. mUSD) */
export type Masset = {
  id: Scalars['ID'];
  /** The Basket of Bassets for this Masset */
  basket: Basket;
  /** The swap fee rate */
  feeRate: Scalars['BigInt'];
  /** The redemption fee rate */
  redemptionFeeRate: Scalars['BigInt'];
  /** The underlying Token for this Masset */
  token: Token;
  /** The token symbol */
  tokenSymbol: Scalars['String'];
  savingsContracts: Array<SavingsContract>;
};

/** An mStable asset (e.g. mUSD) */
export type MassetSavingsContractsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SavingsContract_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SavingsContract_Filter>;
};

export type Masset_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  basket?: Maybe<Scalars['String']>;
  basket_not?: Maybe<Scalars['String']>;
  basket_gt?: Maybe<Scalars['String']>;
  basket_lt?: Maybe<Scalars['String']>;
  basket_gte?: Maybe<Scalars['String']>;
  basket_lte?: Maybe<Scalars['String']>;
  basket_in?: Maybe<Array<Scalars['String']>>;
  basket_not_in?: Maybe<Array<Scalars['String']>>;
  basket_contains?: Maybe<Scalars['String']>;
  basket_not_contains?: Maybe<Scalars['String']>;
  basket_starts_with?: Maybe<Scalars['String']>;
  basket_not_starts_with?: Maybe<Scalars['String']>;
  basket_ends_with?: Maybe<Scalars['String']>;
  basket_not_ends_with?: Maybe<Scalars['String']>;
  feeRate?: Maybe<Scalars['BigInt']>;
  feeRate_not?: Maybe<Scalars['BigInt']>;
  feeRate_gt?: Maybe<Scalars['BigInt']>;
  feeRate_lt?: Maybe<Scalars['BigInt']>;
  feeRate_gte?: Maybe<Scalars['BigInt']>;
  feeRate_lte?: Maybe<Scalars['BigInt']>;
  feeRate_in?: Maybe<Array<Scalars['BigInt']>>;
  feeRate_not_in?: Maybe<Array<Scalars['BigInt']>>;
  redemptionFeeRate?: Maybe<Scalars['BigInt']>;
  redemptionFeeRate_not?: Maybe<Scalars['BigInt']>;
  redemptionFeeRate_gt?: Maybe<Scalars['BigInt']>;
  redemptionFeeRate_lt?: Maybe<Scalars['BigInt']>;
  redemptionFeeRate_gte?: Maybe<Scalars['BigInt']>;
  redemptionFeeRate_lte?: Maybe<Scalars['BigInt']>;
  redemptionFeeRate_in?: Maybe<Array<Scalars['BigInt']>>;
  redemptionFeeRate_not_in?: Maybe<Array<Scalars['BigInt']>>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  tokenSymbol?: Maybe<Scalars['String']>;
  tokenSymbol_not?: Maybe<Scalars['String']>;
  tokenSymbol_gt?: Maybe<Scalars['String']>;
  tokenSymbol_lt?: Maybe<Scalars['String']>;
  tokenSymbol_gte?: Maybe<Scalars['String']>;
  tokenSymbol_lte?: Maybe<Scalars['String']>;
  tokenSymbol_in?: Maybe<Array<Scalars['String']>>;
  tokenSymbol_not_in?: Maybe<Array<Scalars['String']>>;
  tokenSymbol_contains?: Maybe<Scalars['String']>;
  tokenSymbol_not_contains?: Maybe<Scalars['String']>;
  tokenSymbol_starts_with?: Maybe<Scalars['String']>;
  tokenSymbol_not_starts_with?: Maybe<Scalars['String']>;
  tokenSymbol_ends_with?: Maybe<Scalars['String']>;
  tokenSymbol_not_ends_with?: Maybe<Scalars['String']>;
};

export enum Masset_OrderBy {
  Id = 'id',
  Basket = 'basket',
  FeeRate = 'feeRate',
  RedemptionFeeRate = 'redemptionFeeRate',
  Token = 'token',
  TokenSymbol = 'tokenSymbol',
  SavingsContracts = 'savingsContracts',
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export type Query = {
  token?: Maybe<Token>;
  tokens: Array<Token>;
  basset?: Maybe<Basset>;
  bassets: Array<Basset>;
  basket?: Maybe<Basket>;
  baskets: Array<Basket>;
  masset?: Maybe<Masset>;
  massets: Array<Masset>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  accountBalance?: Maybe<AccountBalance>;
  accountBalances: Array<AccountBalance>;
  creditBalance?: Maybe<CreditBalance>;
  creditBalances: Array<CreditBalance>;
  savingsContract?: Maybe<SavingsContract>;
  savingsContracts: Array<SavingsContract>;
  exchangeRate?: Maybe<ExchangeRate>;
  exchangeRates: Array<ExchangeRate>;
  volumeMetric?: Maybe<VolumeMetric>;
  volumeMetrics: Array<VolumeMetric>;
  aggregateMetric?: Maybe<AggregateMetric>;
  aggregateMetrics: Array<AggregateMetric>;
  swapTransaction?: Maybe<SwapTransaction>;
  swapTransactions: Array<SwapTransaction>;
  feePaidTransaction?: Maybe<FeePaidTransaction>;
  feePaidTransactions: Array<FeePaidTransaction>;
  stakingRewardsContractTransaction?: Maybe<StakingRewardsContractTransaction>;
  stakingRewardsContractTransactions: Array<StakingRewardsContractTransaction>;
  stakingRewardsContractClaimRewardTransaction?: Maybe<
    StakingRewardsContractClaimRewardTransaction
  >;
  stakingRewardsContractClaimRewardTransactions: Array<
    StakingRewardsContractClaimRewardTransaction
  >;
  stakingRewardsContractStakeTransaction?: Maybe<
    StakingRewardsContractStakeTransaction
  >;
  stakingRewardsContractStakeTransactions: Array<
    StakingRewardsContractStakeTransaction
  >;
  stakingRewardsContractWithdrawTransaction?: Maybe<
    StakingRewardsContractWithdrawTransaction
  >;
  stakingRewardsContractWithdrawTransactions: Array<
    StakingRewardsContractWithdrawTransaction
  >;
  rewardsDistributor?: Maybe<RewardsDistributor>;
  rewardsDistributors: Array<RewardsDistributor>;
  stakingReward?: Maybe<StakingReward>;
  stakingRewards: Array<StakingReward>;
  stakingRewardsContract?: Maybe<StakingRewardsContract>;
  stakingRewardsContracts: Array<StakingRewardsContract>;
  stakingBalance?: Maybe<StakingBalance>;
  stakingBalances: Array<StakingBalance>;
  timeMetric?: Maybe<TimeMetric>;
  timeMetrics: Array<TimeMetric>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
};

export type QueryTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Token_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryBassetArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryBassetsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Basset_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Basset_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryBasketArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryBasketsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Basket_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Basket_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryMassetArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryMassetsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Masset_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Masset_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Account_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Account_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryAccountBalanceArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryAccountBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AccountBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AccountBalance_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryCreditBalanceArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryCreditBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CreditBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<CreditBalance_Filter>;
  block?: Maybe<Block_Height>;
};

export type QuerySavingsContractArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QuerySavingsContractsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SavingsContract_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SavingsContract_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryExchangeRateArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryExchangeRatesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ExchangeRate_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<ExchangeRate_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryVolumeMetricArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryVolumeMetricsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<VolumeMetric_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<VolumeMetric_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryAggregateMetricArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryAggregateMetricsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AggregateMetric_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AggregateMetric_Filter>;
  block?: Maybe<Block_Height>;
};

export type QuerySwapTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QuerySwapTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SwapTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SwapTransaction_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryFeePaidTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryFeePaidTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FeePaidTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FeePaidTransaction_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryStakingRewardsContractTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryStakingRewardsContractTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewardsContractTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewardsContractTransaction_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryStakingRewardsContractClaimRewardTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryStakingRewardsContractClaimRewardTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewardsContractClaimRewardTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewardsContractClaimRewardTransaction_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryStakingRewardsContractStakeTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryStakingRewardsContractStakeTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewardsContractStakeTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewardsContractStakeTransaction_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryStakingRewardsContractWithdrawTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryStakingRewardsContractWithdrawTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewardsContractWithdrawTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewardsContractWithdrawTransaction_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryRewardsDistributorArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryRewardsDistributorsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<RewardsDistributor_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<RewardsDistributor_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryStakingRewardArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryStakingRewardsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingReward_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingReward_Filter>;
  block?: Maybe<Block_Height>;
};

<<<<<<< HEAD
=======

>>>>>>> f8ed0759f7daf0b4083c73e9815f6e965386a5c1
export type QueryStakingRewardsContractArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryStakingRewardsContractsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewardsContract_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewardsContract_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryStakingBalanceArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryStakingBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingBalance_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryTimeMetricArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryTimeMetricsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TimeMetric_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TimeMetric_Filter>;
  block?: Maybe<Block_Height>;
};

export type QueryTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type QueryTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Transaction_Filter>;
  block?: Maybe<Block_Height>;
};

export type RewardsDistributor = {
  /** ID of the rewards distributor contract */
  id: Scalars['ID'];
  /** Whitelisted fund managers */
  fundManagers: Array<Scalars['Bytes']>;
};

export type RewardsDistributor_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  fundManagers?: Maybe<Array<Scalars['Bytes']>>;
  fundManagers_not?: Maybe<Array<Scalars['Bytes']>>;
  fundManagers_contains?: Maybe<Array<Scalars['Bytes']>>;
  fundManagers_not_contains?: Maybe<Array<Scalars['Bytes']>>;
};

export enum RewardsDistributor_OrderBy {
  Id = 'id',
  FundManagers = 'fundManagers',
}

export type SavingsContract = {
  id: Scalars['ID'];
  masset: Masset;
  totalSavings: Scalars['BigDecimal'];
  totalCredits: Scalars['BigDecimal'];
  exchangeRates: Array<ExchangeRate>;
  savingsRate: Scalars['BigDecimal'];
  creditBalances: Array<CreditBalance>;
  automationEnabled: Scalars['Boolean'];
};

export type SavingsContractExchangeRatesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ExchangeRate_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<ExchangeRate_Filter>;
};

export type SavingsContractCreditBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CreditBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<CreditBalance_Filter>;
};

export type SavingsContract_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  masset?: Maybe<Scalars['String']>;
  masset_not?: Maybe<Scalars['String']>;
  masset_gt?: Maybe<Scalars['String']>;
  masset_lt?: Maybe<Scalars['String']>;
  masset_gte?: Maybe<Scalars['String']>;
  masset_lte?: Maybe<Scalars['String']>;
  masset_in?: Maybe<Array<Scalars['String']>>;
  masset_not_in?: Maybe<Array<Scalars['String']>>;
  masset_contains?: Maybe<Scalars['String']>;
  masset_not_contains?: Maybe<Scalars['String']>;
  masset_starts_with?: Maybe<Scalars['String']>;
  masset_not_starts_with?: Maybe<Scalars['String']>;
  masset_ends_with?: Maybe<Scalars['String']>;
  masset_not_ends_with?: Maybe<Scalars['String']>;
  totalSavings?: Maybe<Scalars['BigDecimal']>;
  totalSavings_not?: Maybe<Scalars['BigDecimal']>;
  totalSavings_gt?: Maybe<Scalars['BigDecimal']>;
  totalSavings_lt?: Maybe<Scalars['BigDecimal']>;
  totalSavings_gte?: Maybe<Scalars['BigDecimal']>;
  totalSavings_lte?: Maybe<Scalars['BigDecimal']>;
  totalSavings_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSavings_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalCredits?: Maybe<Scalars['BigDecimal']>;
  totalCredits_not?: Maybe<Scalars['BigDecimal']>;
  totalCredits_gt?: Maybe<Scalars['BigDecimal']>;
  totalCredits_lt?: Maybe<Scalars['BigDecimal']>;
  totalCredits_gte?: Maybe<Scalars['BigDecimal']>;
  totalCredits_lte?: Maybe<Scalars['BigDecimal']>;
  totalCredits_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalCredits_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  savingsRate?: Maybe<Scalars['BigDecimal']>;
  savingsRate_not?: Maybe<Scalars['BigDecimal']>;
  savingsRate_gt?: Maybe<Scalars['BigDecimal']>;
  savingsRate_lt?: Maybe<Scalars['BigDecimal']>;
  savingsRate_gte?: Maybe<Scalars['BigDecimal']>;
  savingsRate_lte?: Maybe<Scalars['BigDecimal']>;
  savingsRate_in?: Maybe<Array<Scalars['BigDecimal']>>;
  savingsRate_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  automationEnabled?: Maybe<Scalars['Boolean']>;
  automationEnabled_not?: Maybe<Scalars['Boolean']>;
  automationEnabled_in?: Maybe<Array<Scalars['Boolean']>>;
  automationEnabled_not_in?: Maybe<Array<Scalars['Boolean']>>;
};

export enum SavingsContract_OrderBy {
  Id = 'id',
  Masset = 'masset',
  TotalSavings = 'totalSavings',
  TotalCredits = 'totalCredits',
  ExchangeRates = 'exchangeRates',
  SavingsRate = 'savingsRate',
  CreditBalances = 'creditBalances',
  AutomationEnabled = 'automationEnabled',
}

export type StakingBalance = {
  id: Scalars['ID'];
  /** Account this staking balance belongs to */
  account: Scalars['Bytes'];
  /** Staking rewards contract this staking balance is kept on */
  stakingRewardsContract: StakingRewardsContract;
  /** Staking balance amount */
  amount: Scalars['BigInt'];
};

export type StakingBalance_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  account?: Maybe<Scalars['Bytes']>;
  account_not?: Maybe<Scalars['Bytes']>;
  account_in?: Maybe<Array<Scalars['Bytes']>>;
  account_not_in?: Maybe<Array<Scalars['Bytes']>>;
  account_contains?: Maybe<Scalars['Bytes']>;
  account_not_contains?: Maybe<Scalars['Bytes']>;
  stakingRewardsContract?: Maybe<Scalars['String']>;
  stakingRewardsContract_not?: Maybe<Scalars['String']>;
  stakingRewardsContract_gt?: Maybe<Scalars['String']>;
  stakingRewardsContract_lt?: Maybe<Scalars['String']>;
  stakingRewardsContract_gte?: Maybe<Scalars['String']>;
  stakingRewardsContract_lte?: Maybe<Scalars['String']>;
  stakingRewardsContract_in?: Maybe<Array<Scalars['String']>>;
  stakingRewardsContract_not_in?: Maybe<Array<Scalars['String']>>;
  stakingRewardsContract_contains?: Maybe<Scalars['String']>;
  stakingRewardsContract_not_contains?: Maybe<Scalars['String']>;
  stakingRewardsContract_starts_with?: Maybe<Scalars['String']>;
  stakingRewardsContract_not_starts_with?: Maybe<Scalars['String']>;
  stakingRewardsContract_ends_with?: Maybe<Scalars['String']>;
  stakingRewardsContract_not_ends_with?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum StakingBalance_OrderBy {
  Id = 'id',
  Account = 'account',
  StakingRewardsContract = 'stakingRewardsContract',
  Amount = 'amount',
}

export type StakingReward = {
  id: Scalars['ID'];
  /** Reward amount */
  amount: Scalars['BigInt'];
  /** The reward amount per token paid */
  amountPerTokenPaid: Scalars['BigInt'];
  /** The staking rewards contract this reward is kept on */
  stakingRewardsContract: StakingRewardsContract;
  /** The account the reward belongs to */
  account: Scalars['Bytes'];
  /** The type of staking reward, e.g. "REWARD" or "PLATFORM_REWARD" */
  type: StakingRewardType;
};

export type StakingReward_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  amountPerTokenPaid?: Maybe<Scalars['BigInt']>;
  amountPerTokenPaid_not?: Maybe<Scalars['BigInt']>;
  amountPerTokenPaid_gt?: Maybe<Scalars['BigInt']>;
  amountPerTokenPaid_lt?: Maybe<Scalars['BigInt']>;
  amountPerTokenPaid_gte?: Maybe<Scalars['BigInt']>;
  amountPerTokenPaid_lte?: Maybe<Scalars['BigInt']>;
  amountPerTokenPaid_in?: Maybe<Array<Scalars['BigInt']>>;
  amountPerTokenPaid_not_in?: Maybe<Array<Scalars['BigInt']>>;
  stakingRewardsContract?: Maybe<Scalars['String']>;
  stakingRewardsContract_not?: Maybe<Scalars['String']>;
  stakingRewardsContract_gt?: Maybe<Scalars['String']>;
  stakingRewardsContract_lt?: Maybe<Scalars['String']>;
  stakingRewardsContract_gte?: Maybe<Scalars['String']>;
  stakingRewardsContract_lte?: Maybe<Scalars['String']>;
  stakingRewardsContract_in?: Maybe<Array<Scalars['String']>>;
  stakingRewardsContract_not_in?: Maybe<Array<Scalars['String']>>;
  stakingRewardsContract_contains?: Maybe<Scalars['String']>;
  stakingRewardsContract_not_contains?: Maybe<Scalars['String']>;
  stakingRewardsContract_starts_with?: Maybe<Scalars['String']>;
  stakingRewardsContract_not_starts_with?: Maybe<Scalars['String']>;
  stakingRewardsContract_ends_with?: Maybe<Scalars['String']>;
  stakingRewardsContract_not_ends_with?: Maybe<Scalars['String']>;
  account?: Maybe<Scalars['Bytes']>;
  account_not?: Maybe<Scalars['Bytes']>;
  account_in?: Maybe<Array<Scalars['Bytes']>>;
  account_not_in?: Maybe<Array<Scalars['Bytes']>>;
  account_contains?: Maybe<Scalars['Bytes']>;
  account_not_contains?: Maybe<Scalars['Bytes']>;
  type?: Maybe<StakingRewardType>;
  type_not?: Maybe<StakingRewardType>;
};

export enum StakingReward_OrderBy {
  Id = 'id',
  Amount = 'amount',
  AmountPerTokenPaid = 'amountPerTokenPaid',
  StakingRewardsContract = 'stakingRewardsContract',
  Account = 'account',
  Type = 'type',
}

export type StakingRewardsContract = {
  /** ID of the staking rewards contract */
  id: Scalars['ID'];
  /** The type of staking rewards contract, e.g. `STAKING_REWARDS` or `STAKING_REWARDS_WITH_PLATFORM_TOKEN` */
  type: StakingRewardsContractType;
  /** Duration */
  duration: Scalars['Int'];
  /** Period finish */
  periodFinish: Scalars['Int'];
  /** Last update time */
  lastUpdateTime: Scalars['Int'];
  /** Staking token */
  stakingToken: Token;
  /** Reward per token stored */
  rewardPerTokenStored: Scalars['BigInt'];
  /** Reward rate */
  rewardRate: Scalars['BigInt'];
  /** Rewards token */
  rewardsToken: Token;
  /** Rewards distributor */
  rewardsDistributor: RewardsDistributor;
  /** Total supply */
  totalSupply: Scalars['BigInt'];
  /** Total staking rewards */
  totalStakingRewards: Scalars['BigInt'];
  /** Accessor for staking balances kept on this contract */
  stakingBalances: Array<StakingBalance>;
  /** Accessor for staking rewards kept on this contract */
  stakingRewards: Array<StakingReward>;
  /** Accessor for claim reward transactions sent to this contract */
  claimRewardTransactions: Array<StakingRewardsContractClaimRewardTransaction>;
  /** Accessor for stake transactions sent to this contract */
  stakeTransactions: Array<StakingRewardsContractStakeTransaction>;
  /** Accessor for withdraw transactions sent to this contract */
  withdrawTransactions: Array<StakingRewardsContractWithdrawTransaction>;
  /** Platform token */
  platformToken?: Maybe<Token>;
  /** Platform reward rate */
  platformRewardRate?: Maybe<Scalars['BigInt']>;
  /** Platform reward per token stored */
  platformRewardPerTokenStored?: Maybe<Scalars['BigInt']>;
  /** Total platform rewards */
  totalPlatformRewards?: Maybe<Scalars['BigInt']>;
};

export type StakingRewardsContractStakingBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingBalance_Filter>;
};

export type StakingRewardsContractStakingRewardsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingReward_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingReward_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> f8ed0759f7daf0b4083c73e9815f6e965386a5c1
export type StakingRewardsContractClaimRewardTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewardsContractClaimRewardTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewardsContractClaimRewardTransaction_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> f8ed0759f7daf0b4083c73e9815f6e965386a5c1
export type StakingRewardsContractStakeTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewardsContractStakeTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewardsContractStakeTransaction_Filter>;
};

<<<<<<< HEAD
=======

>>>>>>> f8ed0759f7daf0b4083c73e9815f6e965386a5c1
export type StakingRewardsContractWithdrawTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewardsContractWithdrawTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewardsContractWithdrawTransaction_Filter>;
};

export type StakingRewardsContract_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  type?: Maybe<StakingRewardsContractType>;
  type_not?: Maybe<StakingRewardsContractType>;
  duration?: Maybe<Scalars['Int']>;
  duration_not?: Maybe<Scalars['Int']>;
  duration_gt?: Maybe<Scalars['Int']>;
  duration_lt?: Maybe<Scalars['Int']>;
  duration_gte?: Maybe<Scalars['Int']>;
  duration_lte?: Maybe<Scalars['Int']>;
  duration_in?: Maybe<Array<Scalars['Int']>>;
  duration_not_in?: Maybe<Array<Scalars['Int']>>;
  periodFinish?: Maybe<Scalars['Int']>;
  periodFinish_not?: Maybe<Scalars['Int']>;
  periodFinish_gt?: Maybe<Scalars['Int']>;
  periodFinish_lt?: Maybe<Scalars['Int']>;
  periodFinish_gte?: Maybe<Scalars['Int']>;
  periodFinish_lte?: Maybe<Scalars['Int']>;
  periodFinish_in?: Maybe<Array<Scalars['Int']>>;
  periodFinish_not_in?: Maybe<Array<Scalars['Int']>>;
  lastUpdateTime?: Maybe<Scalars['Int']>;
  lastUpdateTime_not?: Maybe<Scalars['Int']>;
  lastUpdateTime_gt?: Maybe<Scalars['Int']>;
  lastUpdateTime_lt?: Maybe<Scalars['Int']>;
  lastUpdateTime_gte?: Maybe<Scalars['Int']>;
  lastUpdateTime_lte?: Maybe<Scalars['Int']>;
  lastUpdateTime_in?: Maybe<Array<Scalars['Int']>>;
  lastUpdateTime_not_in?: Maybe<Array<Scalars['Int']>>;
  stakingToken?: Maybe<Scalars['String']>;
  stakingToken_not?: Maybe<Scalars['String']>;
  stakingToken_gt?: Maybe<Scalars['String']>;
  stakingToken_lt?: Maybe<Scalars['String']>;
  stakingToken_gte?: Maybe<Scalars['String']>;
  stakingToken_lte?: Maybe<Scalars['String']>;
  stakingToken_in?: Maybe<Array<Scalars['String']>>;
  stakingToken_not_in?: Maybe<Array<Scalars['String']>>;
  stakingToken_contains?: Maybe<Scalars['String']>;
  stakingToken_not_contains?: Maybe<Scalars['String']>;
  stakingToken_starts_with?: Maybe<Scalars['String']>;
  stakingToken_not_starts_with?: Maybe<Scalars['String']>;
  stakingToken_ends_with?: Maybe<Scalars['String']>;
  stakingToken_not_ends_with?: Maybe<Scalars['String']>;
  rewardPerTokenStored?: Maybe<Scalars['BigInt']>;
  rewardPerTokenStored_not?: Maybe<Scalars['BigInt']>;
  rewardPerTokenStored_gt?: Maybe<Scalars['BigInt']>;
  rewardPerTokenStored_lt?: Maybe<Scalars['BigInt']>;
  rewardPerTokenStored_gte?: Maybe<Scalars['BigInt']>;
  rewardPerTokenStored_lte?: Maybe<Scalars['BigInt']>;
  rewardPerTokenStored_in?: Maybe<Array<Scalars['BigInt']>>;
  rewardPerTokenStored_not_in?: Maybe<Array<Scalars['BigInt']>>;
  rewardRate?: Maybe<Scalars['BigInt']>;
  rewardRate_not?: Maybe<Scalars['BigInt']>;
  rewardRate_gt?: Maybe<Scalars['BigInt']>;
  rewardRate_lt?: Maybe<Scalars['BigInt']>;
  rewardRate_gte?: Maybe<Scalars['BigInt']>;
  rewardRate_lte?: Maybe<Scalars['BigInt']>;
  rewardRate_in?: Maybe<Array<Scalars['BigInt']>>;
  rewardRate_not_in?: Maybe<Array<Scalars['BigInt']>>;
  rewardsToken?: Maybe<Scalars['String']>;
  rewardsToken_not?: Maybe<Scalars['String']>;
  rewardsToken_gt?: Maybe<Scalars['String']>;
  rewardsToken_lt?: Maybe<Scalars['String']>;
  rewardsToken_gte?: Maybe<Scalars['String']>;
  rewardsToken_lte?: Maybe<Scalars['String']>;
  rewardsToken_in?: Maybe<Array<Scalars['String']>>;
  rewardsToken_not_in?: Maybe<Array<Scalars['String']>>;
  rewardsToken_contains?: Maybe<Scalars['String']>;
  rewardsToken_not_contains?: Maybe<Scalars['String']>;
  rewardsToken_starts_with?: Maybe<Scalars['String']>;
  rewardsToken_not_starts_with?: Maybe<Scalars['String']>;
  rewardsToken_ends_with?: Maybe<Scalars['String']>;
  rewardsToken_not_ends_with?: Maybe<Scalars['String']>;
  rewardsDistributor?: Maybe<Scalars['String']>;
  rewardsDistributor_not?: Maybe<Scalars['String']>;
  rewardsDistributor_gt?: Maybe<Scalars['String']>;
  rewardsDistributor_lt?: Maybe<Scalars['String']>;
  rewardsDistributor_gte?: Maybe<Scalars['String']>;
  rewardsDistributor_lte?: Maybe<Scalars['String']>;
  rewardsDistributor_in?: Maybe<Array<Scalars['String']>>;
  rewardsDistributor_not_in?: Maybe<Array<Scalars['String']>>;
  rewardsDistributor_contains?: Maybe<Scalars['String']>;
  rewardsDistributor_not_contains?: Maybe<Scalars['String']>;
  rewardsDistributor_starts_with?: Maybe<Scalars['String']>;
  rewardsDistributor_not_starts_with?: Maybe<Scalars['String']>;
  rewardsDistributor_ends_with?: Maybe<Scalars['String']>;
  rewardsDistributor_not_ends_with?: Maybe<Scalars['String']>;
  totalSupply?: Maybe<Scalars['BigInt']>;
  totalSupply_not?: Maybe<Scalars['BigInt']>;
  totalSupply_gt?: Maybe<Scalars['BigInt']>;
  totalSupply_lt?: Maybe<Scalars['BigInt']>;
  totalSupply_gte?: Maybe<Scalars['BigInt']>;
  totalSupply_lte?: Maybe<Scalars['BigInt']>;
  totalSupply_in?: Maybe<Array<Scalars['BigInt']>>;
  totalSupply_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalStakingRewards?: Maybe<Scalars['BigInt']>;
  totalStakingRewards_not?: Maybe<Scalars['BigInt']>;
  totalStakingRewards_gt?: Maybe<Scalars['BigInt']>;
  totalStakingRewards_lt?: Maybe<Scalars['BigInt']>;
  totalStakingRewards_gte?: Maybe<Scalars['BigInt']>;
  totalStakingRewards_lte?: Maybe<Scalars['BigInt']>;
  totalStakingRewards_in?: Maybe<Array<Scalars['BigInt']>>;
  totalStakingRewards_not_in?: Maybe<Array<Scalars['BigInt']>>;
  platformToken?: Maybe<Scalars['String']>;
  platformToken_not?: Maybe<Scalars['String']>;
  platformToken_gt?: Maybe<Scalars['String']>;
  platformToken_lt?: Maybe<Scalars['String']>;
  platformToken_gte?: Maybe<Scalars['String']>;
  platformToken_lte?: Maybe<Scalars['String']>;
  platformToken_in?: Maybe<Array<Scalars['String']>>;
  platformToken_not_in?: Maybe<Array<Scalars['String']>>;
  platformToken_contains?: Maybe<Scalars['String']>;
  platformToken_not_contains?: Maybe<Scalars['String']>;
  platformToken_starts_with?: Maybe<Scalars['String']>;
  platformToken_not_starts_with?: Maybe<Scalars['String']>;
  platformToken_ends_with?: Maybe<Scalars['String']>;
  platformToken_not_ends_with?: Maybe<Scalars['String']>;
  platformRewardRate?: Maybe<Scalars['BigInt']>;
  platformRewardRate_not?: Maybe<Scalars['BigInt']>;
  platformRewardRate_gt?: Maybe<Scalars['BigInt']>;
  platformRewardRate_lt?: Maybe<Scalars['BigInt']>;
  platformRewardRate_gte?: Maybe<Scalars['BigInt']>;
  platformRewardRate_lte?: Maybe<Scalars['BigInt']>;
  platformRewardRate_in?: Maybe<Array<Scalars['BigInt']>>;
  platformRewardRate_not_in?: Maybe<Array<Scalars['BigInt']>>;
  platformRewardPerTokenStored?: Maybe<Scalars['BigInt']>;
  platformRewardPerTokenStored_not?: Maybe<Scalars['BigInt']>;
  platformRewardPerTokenStored_gt?: Maybe<Scalars['BigInt']>;
  platformRewardPerTokenStored_lt?: Maybe<Scalars['BigInt']>;
  platformRewardPerTokenStored_gte?: Maybe<Scalars['BigInt']>;
  platformRewardPerTokenStored_lte?: Maybe<Scalars['BigInt']>;
  platformRewardPerTokenStored_in?: Maybe<Array<Scalars['BigInt']>>;
  platformRewardPerTokenStored_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalPlatformRewards?: Maybe<Scalars['BigInt']>;
  totalPlatformRewards_not?: Maybe<Scalars['BigInt']>;
  totalPlatformRewards_gt?: Maybe<Scalars['BigInt']>;
  totalPlatformRewards_lt?: Maybe<Scalars['BigInt']>;
  totalPlatformRewards_gte?: Maybe<Scalars['BigInt']>;
  totalPlatformRewards_lte?: Maybe<Scalars['BigInt']>;
  totalPlatformRewards_in?: Maybe<Array<Scalars['BigInt']>>;
  totalPlatformRewards_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum StakingRewardsContract_OrderBy {
  Id = 'id',
  Type = 'type',
  Duration = 'duration',
  PeriodFinish = 'periodFinish',
  LastUpdateTime = 'lastUpdateTime',
  StakingToken = 'stakingToken',
  RewardPerTokenStored = 'rewardPerTokenStored',
  RewardRate = 'rewardRate',
  RewardsToken = 'rewardsToken',
  RewardsDistributor = 'rewardsDistributor',
  TotalSupply = 'totalSupply',
  TotalStakingRewards = 'totalStakingRewards',
  StakingBalances = 'stakingBalances',
  StakingRewards = 'stakingRewards',
  ClaimRewardTransactions = 'claimRewardTransactions',
  StakeTransactions = 'stakeTransactions',
  WithdrawTransactions = 'withdrawTransactions',
  PlatformToken = 'platformToken',
  PlatformRewardRate = 'platformRewardRate',
  PlatformRewardPerTokenStored = 'platformRewardPerTokenStored',
  TotalPlatformRewards = 'totalPlatformRewards',
}

export type StakingRewardsContractClaimRewardTransaction = Transaction & {
  id: Scalars['ID'];
  tx: Scalars['Bytes'];
  type: TransactionType;
  sender: Scalars['Bytes'];
  timestamp: Scalars['Int'];
  stakingRewardsContract: StakingRewardsContract;
  amount: Scalars['BigInt'];
};

export type StakingRewardsContractClaimRewardTransaction_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  tx?: Maybe<Scalars['Bytes']>;
  tx_not?: Maybe<Scalars['Bytes']>;
  tx_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_not_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_contains?: Maybe<Scalars['Bytes']>;
  tx_not_contains?: Maybe<Scalars['Bytes']>;
  type?: Maybe<TransactionType>;
  type_not?: Maybe<TransactionType>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  stakingRewardsContract?: Maybe<Scalars['String']>;
  stakingRewardsContract_not?: Maybe<Scalars['String']>;
  stakingRewardsContract_gt?: Maybe<Scalars['String']>;
  stakingRewardsContract_lt?: Maybe<Scalars['String']>;
  stakingRewardsContract_gte?: Maybe<Scalars['String']>;
  stakingRewardsContract_lte?: Maybe<Scalars['String']>;
  stakingRewardsContract_in?: Maybe<Array<Scalars['String']>>;
  stakingRewardsContract_not_in?: Maybe<Array<Scalars['String']>>;
  stakingRewardsContract_contains?: Maybe<Scalars['String']>;
  stakingRewardsContract_not_contains?: Maybe<Scalars['String']>;
  stakingRewardsContract_starts_with?: Maybe<Scalars['String']>;
  stakingRewardsContract_not_starts_with?: Maybe<Scalars['String']>;
  stakingRewardsContract_ends_with?: Maybe<Scalars['String']>;
  stakingRewardsContract_not_ends_with?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum StakingRewardsContractClaimRewardTransaction_OrderBy {
  Id = 'id',
  Tx = 'tx',
  Type = 'type',
  Sender = 'sender',
  Timestamp = 'timestamp',
  StakingRewardsContract = 'stakingRewardsContract',
  Amount = 'amount',
}

export type StakingRewardsContractStakeTransaction = Transaction & {
  id: Scalars['ID'];
  tx: Scalars['Bytes'];
  type: TransactionType;
  sender: Scalars['Bytes'];
  timestamp: Scalars['Int'];
  stakingRewardsContract: StakingRewardsContract;
  amount: Scalars['BigInt'];
};

export type StakingRewardsContractStakeTransaction_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  tx?: Maybe<Scalars['Bytes']>;
  tx_not?: Maybe<Scalars['Bytes']>;
  tx_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_not_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_contains?: Maybe<Scalars['Bytes']>;
  tx_not_contains?: Maybe<Scalars['Bytes']>;
  type?: Maybe<TransactionType>;
  type_not?: Maybe<TransactionType>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  stakingRewardsContract?: Maybe<Scalars['String']>;
  stakingRewardsContract_not?: Maybe<Scalars['String']>;
  stakingRewardsContract_gt?: Maybe<Scalars['String']>;
  stakingRewardsContract_lt?: Maybe<Scalars['String']>;
  stakingRewardsContract_gte?: Maybe<Scalars['String']>;
  stakingRewardsContract_lte?: Maybe<Scalars['String']>;
  stakingRewardsContract_in?: Maybe<Array<Scalars['String']>>;
  stakingRewardsContract_not_in?: Maybe<Array<Scalars['String']>>;
  stakingRewardsContract_contains?: Maybe<Scalars['String']>;
  stakingRewardsContract_not_contains?: Maybe<Scalars['String']>;
  stakingRewardsContract_starts_with?: Maybe<Scalars['String']>;
  stakingRewardsContract_not_starts_with?: Maybe<Scalars['String']>;
  stakingRewardsContract_ends_with?: Maybe<Scalars['String']>;
  stakingRewardsContract_not_ends_with?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum StakingRewardsContractStakeTransaction_OrderBy {
  Id = 'id',
  Tx = 'tx',
  Type = 'type',
  Sender = 'sender',
  Timestamp = 'timestamp',
  StakingRewardsContract = 'stakingRewardsContract',
  Amount = 'amount',
}

export type StakingRewardsContractTransaction = Transaction & {
  id: Scalars['ID'];
  tx: Scalars['Bytes'];
  type: TransactionType;
  sender: Scalars['Bytes'];
  timestamp: Scalars['Int'];
  stakingRewardsContract: StakingRewardsContract;
};

export type StakingRewardsContractTransaction_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  tx?: Maybe<Scalars['Bytes']>;
  tx_not?: Maybe<Scalars['Bytes']>;
  tx_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_not_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_contains?: Maybe<Scalars['Bytes']>;
  tx_not_contains?: Maybe<Scalars['Bytes']>;
  type?: Maybe<TransactionType>;
  type_not?: Maybe<TransactionType>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  stakingRewardsContract?: Maybe<Scalars['String']>;
  stakingRewardsContract_not?: Maybe<Scalars['String']>;
  stakingRewardsContract_gt?: Maybe<Scalars['String']>;
  stakingRewardsContract_lt?: Maybe<Scalars['String']>;
  stakingRewardsContract_gte?: Maybe<Scalars['String']>;
  stakingRewardsContract_lte?: Maybe<Scalars['String']>;
  stakingRewardsContract_in?: Maybe<Array<Scalars['String']>>;
  stakingRewardsContract_not_in?: Maybe<Array<Scalars['String']>>;
  stakingRewardsContract_contains?: Maybe<Scalars['String']>;
  stakingRewardsContract_not_contains?: Maybe<Scalars['String']>;
  stakingRewardsContract_starts_with?: Maybe<Scalars['String']>;
  stakingRewardsContract_not_starts_with?: Maybe<Scalars['String']>;
  stakingRewardsContract_ends_with?: Maybe<Scalars['String']>;
  stakingRewardsContract_not_ends_with?: Maybe<Scalars['String']>;
};

export enum StakingRewardsContractTransaction_OrderBy {
  Id = 'id',
  Tx = 'tx',
  Type = 'type',
  Sender = 'sender',
  Timestamp = 'timestamp',
  StakingRewardsContract = 'stakingRewardsContract',
}

export enum StakingRewardsContractType {
  StakingRewards = 'STAKING_REWARDS',
  StakingRewardsWithPlatformToken = 'STAKING_REWARDS_WITH_PLATFORM_TOKEN',
}

export type StakingRewardsContractWithdrawTransaction = Transaction & {
  id: Scalars['ID'];
  tx: Scalars['Bytes'];
  type: TransactionType;
  sender: Scalars['Bytes'];
  timestamp: Scalars['Int'];
  stakingRewardsContract: StakingRewardsContract;
  amount: Scalars['BigInt'];
};

export type StakingRewardsContractWithdrawTransaction_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  tx?: Maybe<Scalars['Bytes']>;
  tx_not?: Maybe<Scalars['Bytes']>;
  tx_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_not_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_contains?: Maybe<Scalars['Bytes']>;
  tx_not_contains?: Maybe<Scalars['Bytes']>;
  type?: Maybe<TransactionType>;
  type_not?: Maybe<TransactionType>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  stakingRewardsContract?: Maybe<Scalars['String']>;
  stakingRewardsContract_not?: Maybe<Scalars['String']>;
  stakingRewardsContract_gt?: Maybe<Scalars['String']>;
  stakingRewardsContract_lt?: Maybe<Scalars['String']>;
  stakingRewardsContract_gte?: Maybe<Scalars['String']>;
  stakingRewardsContract_lte?: Maybe<Scalars['String']>;
  stakingRewardsContract_in?: Maybe<Array<Scalars['String']>>;
  stakingRewardsContract_not_in?: Maybe<Array<Scalars['String']>>;
  stakingRewardsContract_contains?: Maybe<Scalars['String']>;
  stakingRewardsContract_not_contains?: Maybe<Scalars['String']>;
  stakingRewardsContract_starts_with?: Maybe<Scalars['String']>;
  stakingRewardsContract_not_starts_with?: Maybe<Scalars['String']>;
  stakingRewardsContract_ends_with?: Maybe<Scalars['String']>;
  stakingRewardsContract_not_ends_with?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum StakingRewardsContractWithdrawTransaction_OrderBy {
  Id = 'id',
  Tx = 'tx',
  Type = 'type',
  Sender = 'sender',
  Timestamp = 'timestamp',
  StakingRewardsContract = 'stakingRewardsContract',
  Amount = 'amount',
}

export enum StakingRewardType {
  Reward = 'REWARD',
  PlatformReward = 'PLATFORM_REWARD',
}

export type Subscription = {
  token?: Maybe<Token>;
  tokens: Array<Token>;
  basset?: Maybe<Basset>;
  bassets: Array<Basset>;
  basket?: Maybe<Basket>;
  baskets: Array<Basket>;
  masset?: Maybe<Masset>;
  massets: Array<Masset>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  accountBalance?: Maybe<AccountBalance>;
  accountBalances: Array<AccountBalance>;
  creditBalance?: Maybe<CreditBalance>;
  creditBalances: Array<CreditBalance>;
  savingsContract?: Maybe<SavingsContract>;
  savingsContracts: Array<SavingsContract>;
  exchangeRate?: Maybe<ExchangeRate>;
  exchangeRates: Array<ExchangeRate>;
  volumeMetric?: Maybe<VolumeMetric>;
  volumeMetrics: Array<VolumeMetric>;
  aggregateMetric?: Maybe<AggregateMetric>;
  aggregateMetrics: Array<AggregateMetric>;
  swapTransaction?: Maybe<SwapTransaction>;
  swapTransactions: Array<SwapTransaction>;
  feePaidTransaction?: Maybe<FeePaidTransaction>;
  feePaidTransactions: Array<FeePaidTransaction>;
  stakingRewardsContractTransaction?: Maybe<StakingRewardsContractTransaction>;
  stakingRewardsContractTransactions: Array<StakingRewardsContractTransaction>;
  stakingRewardsContractClaimRewardTransaction?: Maybe<
    StakingRewardsContractClaimRewardTransaction
  >;
  stakingRewardsContractClaimRewardTransactions: Array<
    StakingRewardsContractClaimRewardTransaction
  >;
  stakingRewardsContractStakeTransaction?: Maybe<
    StakingRewardsContractStakeTransaction
  >;
  stakingRewardsContractStakeTransactions: Array<
    StakingRewardsContractStakeTransaction
  >;
  stakingRewardsContractWithdrawTransaction?: Maybe<
    StakingRewardsContractWithdrawTransaction
  >;
  stakingRewardsContractWithdrawTransactions: Array<
    StakingRewardsContractWithdrawTransaction
  >;
  rewardsDistributor?: Maybe<RewardsDistributor>;
  rewardsDistributors: Array<RewardsDistributor>;
  stakingReward?: Maybe<StakingReward>;
  stakingRewards: Array<StakingReward>;
  stakingRewardsContract?: Maybe<StakingRewardsContract>;
  stakingRewardsContracts: Array<StakingRewardsContract>;
  stakingBalance?: Maybe<StakingBalance>;
  stakingBalances: Array<StakingBalance>;
  timeMetric?: Maybe<TimeMetric>;
  timeMetrics: Array<TimeMetric>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
};

export type SubscriptionTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Token_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionBassetArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionBassetsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Basset_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Basset_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionBasketArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionBasketsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Basket_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Basket_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionMassetArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionMassetsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Masset_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Masset_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Account_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Account_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionAccountBalanceArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionAccountBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AccountBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AccountBalance_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionCreditBalanceArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionCreditBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CreditBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<CreditBalance_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionSavingsContractArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionSavingsContractsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SavingsContract_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SavingsContract_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionExchangeRateArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionExchangeRatesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ExchangeRate_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<ExchangeRate_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionVolumeMetricArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionVolumeMetricsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<VolumeMetric_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<VolumeMetric_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionAggregateMetricArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionAggregateMetricsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AggregateMetric_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AggregateMetric_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionSwapTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionSwapTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SwapTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SwapTransaction_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionFeePaidTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionFeePaidTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FeePaidTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FeePaidTransaction_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionStakingRewardsContractTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionStakingRewardsContractTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewardsContractTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewardsContractTransaction_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionStakingRewardsContractClaimRewardTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionStakingRewardsContractClaimRewardTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewardsContractClaimRewardTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewardsContractClaimRewardTransaction_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionStakingRewardsContractStakeTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionStakingRewardsContractStakeTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewardsContractStakeTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewardsContractStakeTransaction_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionStakingRewardsContractWithdrawTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionStakingRewardsContractWithdrawTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewardsContractWithdrawTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewardsContractWithdrawTransaction_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionRewardsDistributorArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionRewardsDistributorsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<RewardsDistributor_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<RewardsDistributor_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionStakingRewardArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionStakingRewardsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingReward_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingReward_Filter>;
  block?: Maybe<Block_Height>;
};

<<<<<<< HEAD
=======

>>>>>>> f8ed0759f7daf0b4083c73e9815f6e965386a5c1
export type SubscriptionStakingRewardsContractArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionStakingRewardsContractsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewardsContract_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewardsContract_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionStakingBalanceArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionStakingBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingBalance_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionTimeMetricArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionTimeMetricsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TimeMetric_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TimeMetric_Filter>;
  block?: Maybe<Block_Height>;
};

export type SubscriptionTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};

export type SubscriptionTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Transaction_Filter>;
  block?: Maybe<Block_Height>;
};

/** A bAsset<>bAsset swap */
export type SwapTransaction = Transaction & {
  id: Scalars['ID'];
  tx: Scalars['Bytes'];
  type: TransactionType;
  sender: Scalars['Bytes'];
  timestamp: Scalars['Int'];
  /** Which mAsset is this tx in? */
  mAsset: Masset;
  mAssetUnits: Scalars['BigDecimal'];
  inputBasset: Basset;
  outputBasset: Basset;
  recipient: Scalars['Bytes'];
};

export type SwapTransaction_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  tx?: Maybe<Scalars['Bytes']>;
  tx_not?: Maybe<Scalars['Bytes']>;
  tx_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_not_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_contains?: Maybe<Scalars['Bytes']>;
  tx_not_contains?: Maybe<Scalars['Bytes']>;
  type?: Maybe<TransactionType>;
  type_not?: Maybe<TransactionType>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  mAsset?: Maybe<Scalars['String']>;
  mAsset_not?: Maybe<Scalars['String']>;
  mAsset_gt?: Maybe<Scalars['String']>;
  mAsset_lt?: Maybe<Scalars['String']>;
  mAsset_gte?: Maybe<Scalars['String']>;
  mAsset_lte?: Maybe<Scalars['String']>;
  mAsset_in?: Maybe<Array<Scalars['String']>>;
  mAsset_not_in?: Maybe<Array<Scalars['String']>>;
  mAsset_contains?: Maybe<Scalars['String']>;
  mAsset_not_contains?: Maybe<Scalars['String']>;
  mAsset_starts_with?: Maybe<Scalars['String']>;
  mAsset_not_starts_with?: Maybe<Scalars['String']>;
  mAsset_ends_with?: Maybe<Scalars['String']>;
  mAsset_not_ends_with?: Maybe<Scalars['String']>;
  mAssetUnits?: Maybe<Scalars['BigDecimal']>;
  mAssetUnits_not?: Maybe<Scalars['BigDecimal']>;
  mAssetUnits_gt?: Maybe<Scalars['BigDecimal']>;
  mAssetUnits_lt?: Maybe<Scalars['BigDecimal']>;
  mAssetUnits_gte?: Maybe<Scalars['BigDecimal']>;
  mAssetUnits_lte?: Maybe<Scalars['BigDecimal']>;
  mAssetUnits_in?: Maybe<Array<Scalars['BigDecimal']>>;
  mAssetUnits_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  inputBasset?: Maybe<Scalars['String']>;
  inputBasset_not?: Maybe<Scalars['String']>;
  inputBasset_gt?: Maybe<Scalars['String']>;
  inputBasset_lt?: Maybe<Scalars['String']>;
  inputBasset_gte?: Maybe<Scalars['String']>;
  inputBasset_lte?: Maybe<Scalars['String']>;
  inputBasset_in?: Maybe<Array<Scalars['String']>>;
  inputBasset_not_in?: Maybe<Array<Scalars['String']>>;
  inputBasset_contains?: Maybe<Scalars['String']>;
  inputBasset_not_contains?: Maybe<Scalars['String']>;
  inputBasset_starts_with?: Maybe<Scalars['String']>;
  inputBasset_not_starts_with?: Maybe<Scalars['String']>;
  inputBasset_ends_with?: Maybe<Scalars['String']>;
  inputBasset_not_ends_with?: Maybe<Scalars['String']>;
  outputBasset?: Maybe<Scalars['String']>;
  outputBasset_not?: Maybe<Scalars['String']>;
  outputBasset_gt?: Maybe<Scalars['String']>;
  outputBasset_lt?: Maybe<Scalars['String']>;
  outputBasset_gte?: Maybe<Scalars['String']>;
  outputBasset_lte?: Maybe<Scalars['String']>;
  outputBasset_in?: Maybe<Array<Scalars['String']>>;
  outputBasset_not_in?: Maybe<Array<Scalars['String']>>;
  outputBasset_contains?: Maybe<Scalars['String']>;
  outputBasset_not_contains?: Maybe<Scalars['String']>;
  outputBasset_starts_with?: Maybe<Scalars['String']>;
  outputBasset_not_starts_with?: Maybe<Scalars['String']>;
  outputBasset_ends_with?: Maybe<Scalars['String']>;
  outputBasset_not_ends_with?: Maybe<Scalars['String']>;
  recipient?: Maybe<Scalars['Bytes']>;
  recipient_not?: Maybe<Scalars['Bytes']>;
  recipient_in?: Maybe<Array<Scalars['Bytes']>>;
  recipient_not_in?: Maybe<Array<Scalars['Bytes']>>;
  recipient_contains?: Maybe<Scalars['Bytes']>;
  recipient_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum SwapTransaction_OrderBy {
  Id = 'id',
  Tx = 'tx',
  Type = 'type',
  Sender = 'sender',
  Timestamp = 'timestamp',
  MAsset = 'mAsset',
  MAssetUnits = 'mAssetUnits',
  InputBasset = 'inputBasset',
  OutputBasset = 'outputBasset',
  Recipient = 'recipient',
}

export type TimeMetric = {
  id: Scalars['ID'];
  value: Scalars['BigDecimal'];
  timestamp: Scalars['Int'];
  period: TimeMetricPeriod;
};

export type TimeMetric_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  value?: Maybe<Scalars['BigDecimal']>;
  value_not?: Maybe<Scalars['BigDecimal']>;
  value_gt?: Maybe<Scalars['BigDecimal']>;
  value_lt?: Maybe<Scalars['BigDecimal']>;
  value_gte?: Maybe<Scalars['BigDecimal']>;
  value_lte?: Maybe<Scalars['BigDecimal']>;
  value_in?: Maybe<Array<Scalars['BigDecimal']>>;
  value_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  period?: Maybe<TimeMetricPeriod>;
  period_not?: Maybe<TimeMetricPeriod>;
};

export enum TimeMetric_OrderBy {
  Id = 'id',
  Value = 'value',
  Timestamp = 'timestamp',
  Period = 'period',
}

export enum TimeMetricPeriod {
  Hour = 'HOUR',
  Day = 'DAY',
  Week = 'WEEK',
  Month = 'MONTH',
  Quarter = 'QUARTER',
  Year = 'YEAR',
}

/** An ERC20-compatible token */
export type Token = {
  id: Scalars['ID'];
  /** Token address */
  address: Scalars['Bytes'];
  /** Token decimals */
  decimals: Scalars['Int'];
  /** Token name */
  name: Scalars['String'];
  /** Token symbol */
  symbol: Scalars['String'];
  /** Total supply of the token */
  totalSupply: Scalars['BigDecimal'];
  /** Quantity of the token that has been minted */
  totalMinted: Scalars['BigDecimal'];
  /** Quantity of the token that has been transferred */
  totalTransferred: Scalars['BigDecimal'];
  /** Quantity of the token that has been burned */
  totalBurned: Scalars['BigDecimal'];
};

export type Token_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  address?: Maybe<Scalars['Bytes']>;
  address_not?: Maybe<Scalars['Bytes']>;
  address_in?: Maybe<Array<Scalars['Bytes']>>;
  address_not_in?: Maybe<Array<Scalars['Bytes']>>;
  address_contains?: Maybe<Scalars['Bytes']>;
  address_not_contains?: Maybe<Scalars['Bytes']>;
  decimals?: Maybe<Scalars['Int']>;
  decimals_not?: Maybe<Scalars['Int']>;
  decimals_gt?: Maybe<Scalars['Int']>;
  decimals_lt?: Maybe<Scalars['Int']>;
  decimals_gte?: Maybe<Scalars['Int']>;
  decimals_lte?: Maybe<Scalars['Int']>;
  decimals_in?: Maybe<Array<Scalars['Int']>>;
  decimals_not_in?: Maybe<Array<Scalars['Int']>>;
  name?: Maybe<Scalars['String']>;
  name_not?: Maybe<Scalars['String']>;
  name_gt?: Maybe<Scalars['String']>;
  name_lt?: Maybe<Scalars['String']>;
  name_gte?: Maybe<Scalars['String']>;
  name_lte?: Maybe<Scalars['String']>;
  name_in?: Maybe<Array<Scalars['String']>>;
  name_not_in?: Maybe<Array<Scalars['String']>>;
  name_contains?: Maybe<Scalars['String']>;
  name_not_contains?: Maybe<Scalars['String']>;
  name_starts_with?: Maybe<Scalars['String']>;
  name_not_starts_with?: Maybe<Scalars['String']>;
  name_ends_with?: Maybe<Scalars['String']>;
  name_not_ends_with?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  symbol_not?: Maybe<Scalars['String']>;
  symbol_gt?: Maybe<Scalars['String']>;
  symbol_lt?: Maybe<Scalars['String']>;
  symbol_gte?: Maybe<Scalars['String']>;
  symbol_lte?: Maybe<Scalars['String']>;
  symbol_in?: Maybe<Array<Scalars['String']>>;
  symbol_not_in?: Maybe<Array<Scalars['String']>>;
  symbol_contains?: Maybe<Scalars['String']>;
  symbol_not_contains?: Maybe<Scalars['String']>;
  symbol_starts_with?: Maybe<Scalars['String']>;
  symbol_not_starts_with?: Maybe<Scalars['String']>;
  symbol_ends_with?: Maybe<Scalars['String']>;
  symbol_not_ends_with?: Maybe<Scalars['String']>;
  totalSupply?: Maybe<Scalars['BigDecimal']>;
  totalSupply_not?: Maybe<Scalars['BigDecimal']>;
  totalSupply_gt?: Maybe<Scalars['BigDecimal']>;
  totalSupply_lt?: Maybe<Scalars['BigDecimal']>;
  totalSupply_gte?: Maybe<Scalars['BigDecimal']>;
  totalSupply_lte?: Maybe<Scalars['BigDecimal']>;
  totalSupply_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSupply_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalMinted?: Maybe<Scalars['BigDecimal']>;
  totalMinted_not?: Maybe<Scalars['BigDecimal']>;
  totalMinted_gt?: Maybe<Scalars['BigDecimal']>;
  totalMinted_lt?: Maybe<Scalars['BigDecimal']>;
  totalMinted_gte?: Maybe<Scalars['BigDecimal']>;
  totalMinted_lte?: Maybe<Scalars['BigDecimal']>;
  totalMinted_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalMinted_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalTransferred?: Maybe<Scalars['BigDecimal']>;
  totalTransferred_not?: Maybe<Scalars['BigDecimal']>;
  totalTransferred_gt?: Maybe<Scalars['BigDecimal']>;
  totalTransferred_lt?: Maybe<Scalars['BigDecimal']>;
  totalTransferred_gte?: Maybe<Scalars['BigDecimal']>;
  totalTransferred_lte?: Maybe<Scalars['BigDecimal']>;
  totalTransferred_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalTransferred_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalBurned?: Maybe<Scalars['BigDecimal']>;
  totalBurned_not?: Maybe<Scalars['BigDecimal']>;
  totalBurned_gt?: Maybe<Scalars['BigDecimal']>;
  totalBurned_lt?: Maybe<Scalars['BigDecimal']>;
  totalBurned_gte?: Maybe<Scalars['BigDecimal']>;
  totalBurned_lte?: Maybe<Scalars['BigDecimal']>;
  totalBurned_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalBurned_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum Token_OrderBy {
  Id = 'id',
  Address = 'address',
  Decimals = 'decimals',
  Name = 'name',
  Symbol = 'symbol',
  TotalSupply = 'totalSupply',
  TotalMinted = 'totalMinted',
  TotalTransferred = 'totalTransferred',
  TotalBurned = 'totalBurned',
}

/** A common transaction type */
export type Transaction = {
  id: Scalars['ID'];
  tx: Scalars['Bytes'];
  type: TransactionType;
  timestamp: Scalars['Int'];
  sender: Scalars['Bytes'];
};

export type Transaction_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  tx?: Maybe<Scalars['Bytes']>;
  tx_not?: Maybe<Scalars['Bytes']>;
  tx_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_not_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_contains?: Maybe<Scalars['Bytes']>;
  tx_not_contains?: Maybe<Scalars['Bytes']>;
  type?: Maybe<TransactionType>;
  type_not?: Maybe<TransactionType>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum Transaction_OrderBy {
  Id = 'id',
  Tx = 'tx',
  Type = 'type',
  Timestamp = 'timestamp',
  Sender = 'sender',
}

export enum TransactionType {
  MassetMint = 'MASSET_MINT',
  MassetSwap = 'MASSET_SWAP',
  MassetRedeem = 'MASSET_REDEEM',
  MassetRedeemMasset = 'MASSET_REDEEM_MASSET',
  MassetPaidFee = 'MASSET_PAID_FEE',
  SavingsContractDeposit = 'SAVINGS_CONTRACT_DEPOSIT',
  SavingsContractWithdraw = 'SAVINGS_CONTRACT_WITHDRAW',
  StakingRewardsContractClaimReward = 'STAKING_REWARDS_CONTRACT_CLAIM_REWARD',
  StakingRewardsContractExit = 'STAKING_REWARDS_CONTRACT_EXIT',
  StakingRewardsContractStake = 'STAKING_REWARDS_CONTRACT_STAKE',
  StakingRewardsContractWithdraw = 'STAKING_REWARDS_CONTRACT_WITHDRAW',
}

export type VolumeMetric = TimeMetric & {
  id: Scalars['ID'];
  value: Scalars['BigDecimal'];
  timestamp: Scalars['Int'];
  period: TimeMetricPeriod;
  type: TransactionType;
};

export type VolumeMetric_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  value?: Maybe<Scalars['BigDecimal']>;
  value_not?: Maybe<Scalars['BigDecimal']>;
  value_gt?: Maybe<Scalars['BigDecimal']>;
  value_lt?: Maybe<Scalars['BigDecimal']>;
  value_gte?: Maybe<Scalars['BigDecimal']>;
  value_lte?: Maybe<Scalars['BigDecimal']>;
  value_in?: Maybe<Array<Scalars['BigDecimal']>>;
  value_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  period?: Maybe<TimeMetricPeriod>;
  period_not?: Maybe<TimeMetricPeriod>;
  type?: Maybe<TransactionType>;
  type_not?: Maybe<TransactionType>;
};

export enum VolumeMetric_OrderBy {
  Id = 'id',
  Value = 'value',
  Timestamp = 'timestamp',
  Period = 'period',
  Type = 'type',
}

export type TokenDetailsFragment = Pick<
  Token,
  'id' | 'address' | 'decimals' | 'symbol' | 'totalSupply'
>;

export type MassetAllFragment = Pick<
  Masset,
  'id' | 'feeRate' | 'redemptionFeeRate'
> & {
  token: TokenDetailsFragment;
  basket: Pick<
    Basket,
    'failed' | 'collateralisationRatio' | 'undergoingRecol'
  > & {
    bassets: Array<
      Pick<
        Basset,
        | 'id'
        | 'vaultBalance'
        | 'isTransferFeeCharged'
        | 'ratio'
        | 'status'
        | 'maxWeight'
      > & { token: TokenDetailsFragment }
    >;
  };
};

type TransactionDetails_SwapTransaction_Fragment = Pick<
  SwapTransaction,
  'id' | 'tx' | 'type' | 'timestamp'
>;

type TransactionDetails_FeePaidTransaction_Fragment = Pick<
  FeePaidTransaction,
  'id' | 'tx' | 'type' | 'timestamp'
>;

type TransactionDetails_StakingRewardsContractTransaction_Fragment = Pick<
  StakingRewardsContractTransaction,
  'id' | 'tx' | 'type' | 'timestamp'
>;

type TransactionDetails_StakingRewardsContractClaimRewardTransaction_Fragment = Pick<
  StakingRewardsContractClaimRewardTransaction,
  'id' | 'tx' | 'type' | 'timestamp'
>;

type TransactionDetails_StakingRewardsContractStakeTransaction_Fragment = Pick<
  StakingRewardsContractStakeTransaction,
  'id' | 'tx' | 'type' | 'timestamp'
>;

type TransactionDetails_StakingRewardsContractWithdrawTransaction_Fragment = Pick<
  StakingRewardsContractWithdrawTransaction,
  'id' | 'tx' | 'type' | 'timestamp'
>;

export type TransactionDetailsFragment =
  | TransactionDetails_SwapTransaction_Fragment
  | TransactionDetails_FeePaidTransaction_Fragment
  | TransactionDetails_StakingRewardsContractTransaction_Fragment
  | TransactionDetails_StakingRewardsContractClaimRewardTransaction_Fragment
  | TransactionDetails_StakingRewardsContractStakeTransaction_Fragment
  | TransactionDetails_StakingRewardsContractWithdrawTransaction_Fragment;

export type CoreTokensQueryVariables = {};

export type CoreTokensQuery = {
  mUSD: Array<TokenDetailsFragment>;
  mUSDSavings: Array<Pick<SavingsContract, 'id'>>;
};

export type MassetQueryVariables = {
  id: Scalars['ID'];
};

export type MassetQuery = { masset?: Maybe<MassetAllFragment> };

export type Erc20TokensQueryVariables = {
  addresses: Array<Scalars['Bytes']>;
};

export type Erc20TokensQuery = { tokens: Array<TokenDetailsFragment> };

export type AllErc20TokensQueryVariables = {};

export type AllErc20TokensQuery = {
  savingsContracts: Array<
    Pick<SavingsContract, 'id'> & { address: SavingsContract['id'] }
  >;
  tokens: Array<TokenDetailsFragment>;
};

export type TokenByAddressQueryVariables = {
  id: Scalars['ID'];
};

export type TokenByAddressQuery = {
  token?: Maybe<
    Pick<
      Token,
      | 'id'
      | 'address'
      | 'decimals'
      | 'name'
      | 'symbol'
      | 'totalBurned'
      | 'totalSupply'
      | 'totalTransferred'
    >
  >;
};

export type ErFragment = Pick<ExchangeRate, 'exchangeRate' | 'timestamp'>;

export type LastExchangeRateBeforeTimestampQueryVariables = {
  timestamp: Scalars['Int'];
};

export type LastExchangeRateBeforeTimestampQuery = {
  exchangeRates: Array<ErFragment>;
};

export type WeeklyExchangeRatesQueryVariables = {
  day0: Scalars['Int'];
  day1: Scalars['Int'];
  day2: Scalars['Int'];
  day3: Scalars['Int'];
  day4: Scalars['Int'];
  day5: Scalars['Int'];
  day6: Scalars['Int'];
};

export type WeeklyExchangeRatesQuery = {
  day0: Array<ErFragment>;
  day1: Array<ErFragment>;
  day2: Array<ErFragment>;
  day3: Array<ErFragment>;
  day4: Array<ErFragment>;
  day5: Array<ErFragment>;
  day6: Array<ErFragment>;
};

export type SavingsContractQueryVariables = {
  id: Scalars['ID'];
};

export type SavingsContractQuery = {
  savingsContracts: Array<
    Pick<
      SavingsContract,
      | 'id'
      | 'totalSavings'
      | 'totalCredits'
      | 'savingsRate'
      | 'automationEnabled'
    > & { exchangeRates: Array<Pick<ExchangeRate, 'id'>> }
  >;
};

export type TokenQueryVariables = {
  id: Scalars['ID'];
};

export type TokenQuery = { token?: Maybe<TokenDetailsFragment> };

export type CreditBalancesQueryVariables = {
  account: Scalars['ID'];
};

export type CreditBalancesQuery = {
  account?: Maybe<{ creditBalances: Array<Pick<CreditBalance, 'amount'>> }>;
};

export type LatestExchangeRateQueryVariables = {};

export type LatestExchangeRateQuery = {
  exchangeRates: Array<Pick<ExchangeRate, 'exchangeRate' | 'timestamp'>>;
};

export type VolumeMetricsOfTypeQueryVariables = {
  period: TimeMetricPeriod;
  type: TransactionType;
  from: Scalars['Int'];
  to: Scalars['Int'];
};

export type VolumeMetricsOfTypeQuery = {
  volumeMetrics: Array<Pick<VolumeMetric, 'timestamp' | 'value'>>;
};

export type VolumeMetricsQueryVariables = {
  period: TimeMetricPeriod;
  from: Scalars['Int'];
  to: Scalars['Int'];
};

export type VolumeMetricsQuery = {
  volumeMetrics: Array<Pick<VolumeMetric, 'type' | 'timestamp' | 'value'>>;
};

export type AggregateMetricsOfTypeQueryVariables = {
  period: TimeMetricPeriod;
  type: AggregateMetricType;
  from: Scalars['Int'];
  to: Scalars['Int'];
};

export type AggregateMetricsOfTypeQuery = {
  aggregateMetrics: Array<Pick<AggregateMetric, 'timestamp' | 'value'>>;
};

export type AggregateMetricsQueryVariables = {
  period: TimeMetricPeriod;
  from: Scalars['Int'];
  to: Scalars['Int'];
};

export type AggregateMetricsQuery = {
  aggregateMetrics: Array<
    Pick<AggregateMetric, 'type' | 'timestamp' | 'value'>
  >;
};

export type StakingRewardsContractsQueryVariables = {
  account?: Maybe<Scalars['Bytes']>;
  includeHistoric: Scalars['Boolean'];
  block?: Maybe<Block_Height>;
};

export type StakingRewardsContractsQuery = {
  current: Array<
    Pick<
      StakingRewardsContract,
      | 'id'
      | 'type'
      | 'duration'
      | 'lastUpdateTime'
      | 'periodFinish'
      | 'rewardRate'
      | 'rewardPerTokenStored'
      | 'platformRewardPerTokenStored'
      | 'platformRewardRate'
      | 'totalSupply'
      | 'totalStakingRewards'
      | 'totalPlatformRewards'
    > & { address: StakingRewardsContract['id'] } & {
      stakingToken: Pick<Token, 'totalSupply'> & TokenDetailsFragment;
      rewardsToken: TokenDetailsFragment;
      platformToken?: Maybe<TokenDetailsFragment>;
      stakingBalances: Array<Pick<StakingBalance, 'amount'>>;
      stakingRewards: Array<
        Pick<StakingReward, 'amount' | 'amountPerTokenPaid'>
      >;
      platformRewards: Array<
        Pick<StakingReward, 'amount' | 'amountPerTokenPaid'>
      >;
    }
  >;
  historic: Array<
    Pick<
      StakingRewardsContract,
      | 'id'
      | 'lastUpdateTime'
      | 'rewardPerTokenStored'
      | 'platformRewardPerTokenStored'
    > & { address: StakingRewardsContract['id'] }
  >;
};

export type RewardsDistributorQueryVariables = {};

    id
    address
    symbol
    totalSupply
  }
`;
export const MassetAllFragmentDoc = gql`
  fragment MassetAll on Masset {
    id
    token {
      ...TokenDetails
    }
    feeRate
    redemptionFeeRate
    basket {
      failed
      collateralisationRatio
      undergoingRecol
      bassets {
        id
        vaultBalance
        isTransferFeeCharged
        ratio
        status
        maxWeight
        token {
          ...TokenDetails
        }
      }
    }
  }
  ${TokenDetailsFragmentDoc}
`;
export const TransactionDetailsFragmentDoc = gql`
  fragment TransactionDetails on Transaction {
    id
    tx
    type
    timestamp
  }
`;
export const ErFragmentDoc = gql`
    fragment ER on ExchangeRate {
  exchangeRate
  timestamp
}
    `;
export const CoreTokensDocument = gql`
    query CoreTokens @api(name: mstable) {
  mUSD: tokens(where: {symbol: "mUSD"}) {
    ...TokenDetails
  }
`;
export const CoreTokensDocument = gql`
  query CoreTokens @api(name: mstable) {
    mUSD: tokens(where: { symbol: "mUSD" }) {
      ...TokenDetails
    }
    mUSDSavings: savingsContracts(first: 1) {
      id
    }
  }
  ${TokenDetailsFragmentDoc}
`;

/**
 * __useCoreTokensQuery__
 *
 * To run a query within a React component, call `useCoreTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useCoreTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCoreTokensQuery({
 *   variables: {
 *   },
 * });
 */
export function useCoreTokensQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    CoreTokensQuery,
    CoreTokensQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<CoreTokensQuery, CoreTokensQueryVariables>(
    CoreTokensDocument,
    baseOptions,
  );
}
export function useCoreTokensLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    CoreTokensQuery,
    CoreTokensQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    CoreTokensQuery,
    CoreTokensQueryVariables
  >(CoreTokensDocument, baseOptions);
}
export type CoreTokensQueryHookResult = ReturnType<typeof useCoreTokensQuery>;
export type CoreTokensLazyQueryHookResult = ReturnType<
  typeof useCoreTokensLazyQuery
>;
export type CoreTokensQueryResult = ApolloReactCommon.QueryResult<
  CoreTokensQuery,
  CoreTokensQueryVariables
>;
export const MassetDocument = gql`
  query Masset($id: ID!) @api(name: mstable) {
    masset(id: $id) {
      ...MassetAll
    }
  }
  ${MassetAllFragmentDoc}
`;

/**
 * __useMassetQuery__
 *
 * To run a query within a React component, call `useMassetQuery` and pass it any options that fit your needs.
 * When your component renders, `useMassetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMassetQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useMassetQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    MassetQuery,
    MassetQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<MassetQuery, MassetQueryVariables>(
    MassetDocument,
    baseOptions,
  );
}
export function useMassetLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    MassetQuery,
    MassetQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<MassetQuery, MassetQueryVariables>(
    MassetDocument,
    baseOptions,
  );
}
export type MassetQueryHookResult = ReturnType<typeof useMassetQuery>;
export type MassetLazyQueryHookResult = ReturnType<typeof useMassetLazyQuery>;
export type MassetQueryResult = ApolloReactCommon.QueryResult<
  MassetQuery,
  MassetQueryVariables
>;
export const Erc20TokensDocument = gql`
  query Erc20Tokens($addresses: [Bytes!]!) @api(name: mstable) {
    tokens(where: { address_in: $addresses }) {
      ...TokenDetails
    }
  }
  ${TokenDetailsFragmentDoc}
`;

/**
 * __useErc20TokensQuery__
 *
 * To run a query within a React component, call `useErc20TokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useErc20TokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useErc20TokensQuery({
 *   variables: {
 *      addresses: // value for 'addresses'
 *   },
 * });
 */
export function useErc20TokensQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    Erc20TokensQuery,
    Erc20TokensQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<Erc20TokensQuery, Erc20TokensQueryVariables>(
    Erc20TokensDocument,
    baseOptions,
  );
}
export function useErc20TokensLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    Erc20TokensQuery,
    Erc20TokensQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    Erc20TokensQuery,
    Erc20TokensQueryVariables
  >(Erc20TokensDocument, baseOptions);
}
export type Erc20TokensQueryHookResult = ReturnType<typeof useErc20TokensQuery>;
export type Erc20TokensLazyQueryHookResult = ReturnType<
  typeof useErc20TokensLazyQuery
>;
export type Erc20TokensQueryResult = ApolloReactCommon.QueryResult<
  Erc20TokensQuery,
  Erc20TokensQueryVariables
>;
export const AllErc20TokensDocument = gql`
  query AllErc20Tokens @api(name: mstable) {
    savingsContracts {
      address: id
      id
    }
    tokens {
      ...TokenDetails
    }
  }
  ${TokenDetailsFragmentDoc}
`;

/**
 * __useAllErc20TokensQuery__
 *
 * To run a query within a React component, call `useAllErc20TokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllErc20TokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllErc20TokensQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllErc20TokensQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    AllErc20TokensQuery,
    AllErc20TokensQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    AllErc20TokensQuery,
    AllErc20TokensQueryVariables
  >(AllErc20TokensDocument, baseOptions);
}
export function useAllErc20TokensLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    AllErc20TokensQuery,
    AllErc20TokensQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    AllErc20TokensQuery,
    AllErc20TokensQueryVariables
  >(AllErc20TokensDocument, baseOptions);
}
export type AllErc20TokensQueryHookResult = ReturnType<
  typeof useAllErc20TokensQuery
>;
export type AllErc20TokensLazyQueryHookResult = ReturnType<
  typeof useAllErc20TokensLazyQuery
>;
export type AllErc20TokensQueryResult = ApolloReactCommon.QueryResult<
  AllErc20TokensQuery,
  AllErc20TokensQueryVariables
>;
export const TokenByAddressDocument = gql`
  query TokenByAddress($id: ID!) @api(name: mstable) {
    token(id: $id) {
      id
      address
      decimals
      name
      symbol
      totalBurned
      totalBurned
      totalSupply
      totalTransferred
    }
  }
`;

/**
 * __useTokenByAddressQuery__
 *
 * To run a query within a React component, call `useTokenByAddressQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenByAddressQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenByAddressQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTokenByAddressQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    TokenByAddressQuery,
    TokenByAddressQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    TokenByAddressQuery,
    TokenByAddressQueryVariables
  >(TokenByAddressDocument, baseOptions);
}
export function useTokenByAddressLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    TokenByAddressQuery,
    TokenByAddressQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    TokenByAddressQuery,
    TokenByAddressQueryVariables
  >(TokenByAddressDocument, baseOptions);
}
export type TokenByAddressQueryHookResult = ReturnType<
  typeof useTokenByAddressQuery
>;
export type TokenByAddressLazyQueryHookResult = ReturnType<
  typeof useTokenByAddressLazyQuery
>;
export type TokenByAddressQueryResult = ApolloReactCommon.QueryResult<
  TokenByAddressQuery,
  TokenByAddressQueryVariables
>;
export const LastExchangeRateBeforeTimestampDocument = gql`
  query LastExchangeRateBeforeTimestamp($timestamp: Int!) @api(name: mstable) {
    exchangeRates(
      where: { timestamp_lt: $timestamp }
      orderDirection: desc
      orderBy: timestamp
      first: 1
    ) {
      ...ER
    }
  }
  ${ErFragmentDoc}
`;

/**
 * __useLastExchangeRateBeforeTimestampQuery__
 *
 * To run a query within a React component, call `useLastExchangeRateBeforeTimestampQuery` and pass it any options that fit your needs.
 * When your component renders, `useLastExchangeRateBeforeTimestampQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLastExchangeRateBeforeTimestampQuery({
 *   variables: {
 *      timestamp: // value for 'timestamp'
 *   },
 * });
 */
export function useLastExchangeRateBeforeTimestampQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    LastExchangeRateBeforeTimestampQuery,
    LastExchangeRateBeforeTimestampQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    LastExchangeRateBeforeTimestampQuery,
    LastExchangeRateBeforeTimestampQueryVariables
  >(LastExchangeRateBeforeTimestampDocument, baseOptions);
}
export function useLastExchangeRateBeforeTimestampLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    LastExchangeRateBeforeTimestampQuery,
    LastExchangeRateBeforeTimestampQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    LastExchangeRateBeforeTimestampQuery,
    LastExchangeRateBeforeTimestampQueryVariables
  >(LastExchangeRateBeforeTimestampDocument, baseOptions);
}
export type LastExchangeRateBeforeTimestampQueryHookResult = ReturnType<
  typeof useLastExchangeRateBeforeTimestampQuery
>;
export type LastExchangeRateBeforeTimestampLazyQueryHookResult = ReturnType<
  typeof useLastExchangeRateBeforeTimestampLazyQuery
>;
export type LastExchangeRateBeforeTimestampQueryResult = ApolloReactCommon.QueryResult<
  LastExchangeRateBeforeTimestampQuery,
  LastExchangeRateBeforeTimestampQueryVariables
>;
export const WeeklyExchangeRatesDocument = gql`
  query WeeklyExchangeRates(
    $day0: Int!
    $day1: Int!
    $day2: Int!
    $day3: Int!
    $day4: Int!
    $day5: Int!
    $day6: Int!
  ) @api(name: mstable) {
    day0: exchangeRates(
      where: { timestamp_lt: $day0 }
      orderDirection: desc
      orderBy: timestamp
      first: 1
    ) {
      ...ER
    }
    day1: exchangeRates(
      where: { timestamp_lt: $day1 }
      orderDirection: desc
      orderBy: timestamp
      first: 1
    ) {
      ...ER
    }
    day2: exchangeRates(
      where: { timestamp_lt: $day2 }
      orderDirection: desc
      orderBy: timestamp
      first: 1
    ) {
      ...ER
    }
    day3: exchangeRates(
      where: { timestamp_lt: $day3 }
      orderDirection: desc
      orderBy: timestamp
      first: 1
    ) {
      ...ER
    }
    day4: exchangeRates(
      where: { timestamp_lt: $day4 }
      orderDirection: desc
      orderBy: timestamp
      first: 1
    ) {
      ...ER
    }
    day5: exchangeRates(
      where: { timestamp_lt: $day5 }
      orderDirection: desc
      orderBy: timestamp
      first: 1
    ) {
      ...ER
    }
    day6: exchangeRates(
      where: { timestamp_lt: $day6 }
      orderDirection: desc
      orderBy: timestamp
      first: 1
    ) {
      ...ER
    }
  }
  ${ErFragmentDoc}
`;

/**
 * __useWeeklyExchangeRatesQuery__
 *
 * To run a query within a React component, call `useWeeklyExchangeRatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useWeeklyExchangeRatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWeeklyExchangeRatesQuery({
 *   variables: {
 *      day0: // value for 'day0'
 *      day1: // value for 'day1'
 *      day2: // value for 'day2'
 *      day3: // value for 'day3'
 *      day4: // value for 'day4'
 *      day5: // value for 'day5'
 *      day6: // value for 'day6'
 *   },
 * });
 */
export function useWeeklyExchangeRatesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    WeeklyExchangeRatesQuery,
    WeeklyExchangeRatesQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    WeeklyExchangeRatesQuery,
    WeeklyExchangeRatesQueryVariables
  >(WeeklyExchangeRatesDocument, baseOptions);
}
export function useWeeklyExchangeRatesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    WeeklyExchangeRatesQuery,
    WeeklyExchangeRatesQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    WeeklyExchangeRatesQuery,
    WeeklyExchangeRatesQueryVariables
  >(WeeklyExchangeRatesDocument, baseOptions);
}
export type WeeklyExchangeRatesQueryHookResult = ReturnType<
  typeof useWeeklyExchangeRatesQuery
>;
export type WeeklyExchangeRatesLazyQueryHookResult = ReturnType<
  typeof useWeeklyExchangeRatesLazyQuery
>;
export type WeeklyExchangeRatesQueryResult = ApolloReactCommon.QueryResult<
  WeeklyExchangeRatesQuery,
  WeeklyExchangeRatesQueryVariables
>;
export const SavingsContractDocument = gql`
  query SavingsContract($id: ID!) @api(name: mstable) {
    savingsContracts(where: { id: $id }) {
      id
      totalSavings
      totalCredits
      exchangeRates {
        id
      }
      savingsRate
      automationEnabled
    }
  }
`;

/**
 * __useSavingsContractQuery__
 *
 * To run a query within a React component, call `useSavingsContractQuery` and pass it any options that fit your needs.
 * When your component renders, `useSavingsContractQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSavingsContractQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSavingsContractQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    SavingsContractQuery,
    SavingsContractQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    SavingsContractQuery,
    SavingsContractQueryVariables
  >(SavingsContractDocument, baseOptions);
}
export function useSavingsContractLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    SavingsContractQuery,
    SavingsContractQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    SavingsContractQuery,
    SavingsContractQueryVariables
  >(SavingsContractDocument, baseOptions);
}
export type SavingsContractQueryHookResult = ReturnType<
  typeof useSavingsContractQuery
>;
export type SavingsContractLazyQueryHookResult = ReturnType<
  typeof useSavingsContractLazyQuery
>;
export type SavingsContractQueryResult = ApolloReactCommon.QueryResult<
  SavingsContractQuery,
  SavingsContractQueryVariables
>;
export const TokenDocument = gql`
  query Token($id: ID!) @api(name: mstable) {
    token(id: $id) {
      ...TokenDetails
    }
  }
  ${TokenDetailsFragmentDoc}
`;

/**
 * __useTokenQuery__
 *
 * To run a query within a React component, call `useTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTokenQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    TokenQuery,
    TokenQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<TokenQuery, TokenQueryVariables>(
    TokenDocument,
    baseOptions,
  );
}
export function useTokenLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    TokenQuery,
    TokenQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<TokenQuery, TokenQueryVariables>(
    TokenDocument,
    baseOptions,
  );
}
export type TokenQueryHookResult = ReturnType<typeof useTokenQuery>;
export type TokenLazyQueryHookResult = ReturnType<typeof useTokenLazyQuery>;
export type TokenQueryResult = ApolloReactCommon.QueryResult<
  TokenQuery,
  TokenQueryVariables
>;
export const CreditBalancesDocument = gql`
  query CreditBalances($account: ID!) @api(name: mstable) {
    account(id: $account) {
      creditBalances {
        amount
      }
    }
  }
`;

/**
 * __useCreditBalancesQuery__
 *
 * To run a query within a React component, call `useCreditBalancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCreditBalancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCreditBalancesQuery({
 *   variables: {
 *      account: // value for 'account'
 *   },
 * });
 */
export function useCreditBalancesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    CreditBalancesQuery,
    CreditBalancesQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    CreditBalancesQuery,
    CreditBalancesQueryVariables
  >(CreditBalancesDocument, baseOptions);
}
export function useCreditBalancesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    CreditBalancesQuery,
    CreditBalancesQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    CreditBalancesQuery,
    CreditBalancesQueryVariables
  >(CreditBalancesDocument, baseOptions);
}
export type CreditBalancesQueryHookResult = ReturnType<
  typeof useCreditBalancesQuery
>;
export type CreditBalancesLazyQueryHookResult = ReturnType<
  typeof useCreditBalancesLazyQuery
>;
export type CreditBalancesQueryResult = ApolloReactCommon.QueryResult<
  CreditBalancesQuery,
  CreditBalancesQueryVariables
>;
export const LatestExchangeRateDocument = gql`
  query LatestExchangeRate @api(name: mstable) {
    exchangeRates(first: 1, orderDirection: desc, orderBy: timestamp) {
      exchangeRate
      timestamp
    }
  }
`;

/**
 * __useLatestExchangeRateQuery__
 *
 * To run a query within a React component, call `useLatestExchangeRateQuery` and pass it any options that fit your needs.
 * When your component renders, `useLatestExchangeRateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLatestExchangeRateQuery({
 *   variables: {
 *   },
 * });
 */
export function useLatestExchangeRateQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    LatestExchangeRateQuery,
    LatestExchangeRateQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    LatestExchangeRateQuery,
    LatestExchangeRateQueryVariables
  >(LatestExchangeRateDocument, baseOptions);
}
export function useLatestExchangeRateLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    LatestExchangeRateQuery,
    LatestExchangeRateQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    LatestExchangeRateQuery,
    LatestExchangeRateQueryVariables
  >(LatestExchangeRateDocument, baseOptions);
}
export type LatestExchangeRateQueryHookResult = ReturnType<
  typeof useLatestExchangeRateQuery
>;
export type LatestExchangeRateLazyQueryHookResult = ReturnType<
  typeof useLatestExchangeRateLazyQuery
>;
export type LatestExchangeRateQueryResult = ApolloReactCommon.QueryResult<
  LatestExchangeRateQuery,
  LatestExchangeRateQueryVariables
>;
export const VolumeMetricsOfTypeDocument = gql`
  query VolumeMetricsOfType(
    $period: TimeMetricPeriod!
    $type: TransactionType!
    $from: Int!
    $to: Int!
  ) @api(name: mstable) {
    volumeMetrics(
      orderBy: timestamp
      orderDirection: asc
      where: {
        period: $period
        type: $type
        timestamp_gte: $from
        timestamp_lte: $to
      }
    ) {
      timestamp
      value
    }
  }
`;

/**
 * __useVolumeMetricsOfTypeQuery__
 *
 * To run a query within a React component, call `useVolumeMetricsOfTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useVolumeMetricsOfTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVolumeMetricsOfTypeQuery({
 *   variables: {
 *      period: // value for 'period'
 *      type: // value for 'type'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useVolumeMetricsOfTypeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    VolumeMetricsOfTypeQuery,
    VolumeMetricsOfTypeQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    VolumeMetricsOfTypeQuery,
    VolumeMetricsOfTypeQueryVariables
  >(VolumeMetricsOfTypeDocument, baseOptions);
}
export function useVolumeMetricsOfTypeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    VolumeMetricsOfTypeQuery,
    VolumeMetricsOfTypeQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    VolumeMetricsOfTypeQuery,
    VolumeMetricsOfTypeQueryVariables
  >(VolumeMetricsOfTypeDocument, baseOptions);
}
export type VolumeMetricsOfTypeQueryHookResult = ReturnType<
  typeof useVolumeMetricsOfTypeQuery
>;
export type VolumeMetricsOfTypeLazyQueryHookResult = ReturnType<
  typeof useVolumeMetricsOfTypeLazyQuery
>;
export type VolumeMetricsOfTypeQueryResult = ApolloReactCommon.QueryResult<
  VolumeMetricsOfTypeQuery,
  VolumeMetricsOfTypeQueryVariables
>;
export const VolumeMetricsDocument = gql`
  query VolumeMetrics($period: TimeMetricPeriod!, $from: Int!, $to: Int!)
    @api(name: mstable) {
    volumeMetrics(
      orderBy: timestamp
      orderDirection: asc
      where: { period: $period, timestamp_gte: $from, timestamp_lte: $to }
    ) {
      type
      timestamp
      value
    }
  }
`;

/**
 * __useVolumeMetricsQuery__
 *
 * To run a query within a React component, call `useVolumeMetricsQuery` and pass it any options that fit your needs.
 * When your component renders, `useVolumeMetricsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVolumeMetricsQuery({
 *   variables: {
 *      period: // value for 'period'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useVolumeMetricsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    VolumeMetricsQuery,
    VolumeMetricsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    VolumeMetricsQuery,
    VolumeMetricsQueryVariables
  >(VolumeMetricsDocument, baseOptions);
}
export function useVolumeMetricsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    VolumeMetricsQuery,
    VolumeMetricsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    VolumeMetricsQuery,
    VolumeMetricsQueryVariables
  >(VolumeMetricsDocument, baseOptions);
}
export type VolumeMetricsQueryHookResult = ReturnType<
  typeof useVolumeMetricsQuery
>;
export type VolumeMetricsLazyQueryHookResult = ReturnType<
  typeof useVolumeMetricsLazyQuery
>;
export type VolumeMetricsQueryResult = ApolloReactCommon.QueryResult<
  VolumeMetricsQuery,
  VolumeMetricsQueryVariables
>;
export const AggregateMetricsOfTypeDocument = gql`
  query AggregateMetricsOfType(
    $period: TimeMetricPeriod!
    $type: AggregateMetricType!
    $from: Int!
    $to: Int!
  ) @api(name: mstable) {
    aggregateMetrics(
      orderBy: timestamp
      orderDirection: asc
      where: {
        period: $period
        type: $type
        timestamp_gte: $from
        timestamp_lte: $to
      }
    ) {
      timestamp
      value
    }
  }
`;

/**
 * __useAggregateMetricsOfTypeQuery__
 *
 * To run a query within a React component, call `useAggregateMetricsOfTypeQuery` and pass it any options that fit your needs.
 * When your component renders, `useAggregateMetricsOfTypeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAggregateMetricsOfTypeQuery({
 *   variables: {
 *      period: // value for 'period'
 *      type: // value for 'type'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useAggregateMetricsOfTypeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    AggregateMetricsOfTypeQuery,
    AggregateMetricsOfTypeQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    AggregateMetricsOfTypeQuery,
    AggregateMetricsOfTypeQueryVariables
  >(AggregateMetricsOfTypeDocument, baseOptions);
}
export function useAggregateMetricsOfTypeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    AggregateMetricsOfTypeQuery,
    AggregateMetricsOfTypeQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    AggregateMetricsOfTypeQuery,
    AggregateMetricsOfTypeQueryVariables
  >(AggregateMetricsOfTypeDocument, baseOptions);
}
export type AggregateMetricsOfTypeQueryHookResult = ReturnType<
  typeof useAggregateMetricsOfTypeQuery
>;
export type AggregateMetricsOfTypeLazyQueryHookResult = ReturnType<
  typeof useAggregateMetricsOfTypeLazyQuery
>;
export type AggregateMetricsOfTypeQueryResult = ApolloReactCommon.QueryResult<
  AggregateMetricsOfTypeQuery,
  AggregateMetricsOfTypeQueryVariables
>;
export const AggregateMetricsDocument = gql`
  query AggregateMetrics($period: TimeMetricPeriod!, $from: Int!, $to: Int!)
    @api(name: mstable) {
    aggregateMetrics(
      orderBy: timestamp
      orderDirection: asc
      where: { period: $period, timestamp_gte: $from, timestamp_lte: $to }
    ) {
      type
      timestamp
      value
    }
  }
`;

/**
 * __useAggregateMetricsQuery__
 *
 * To run a query within a React component, call `useAggregateMetricsQuery` and pass it any options that fit your needs.
 * When your component renders, `useAggregateMetricsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAggregateMetricsQuery({
 *   variables: {
 *      period: // value for 'period'
 *      from: // value for 'from'
 *      to: // value for 'to'
 *   },
 * });
 */
export function useAggregateMetricsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    AggregateMetricsQuery,
    AggregateMetricsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    AggregateMetricsQuery,
    AggregateMetricsQueryVariables
  >(AggregateMetricsDocument, baseOptions);
}
export function useAggregateMetricsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    AggregateMetricsQuery,
    AggregateMetricsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    AggregateMetricsQuery,
    AggregateMetricsQueryVariables
  >(AggregateMetricsDocument, baseOptions);
}
export type AggregateMetricsQueryHookResult = ReturnType<
  typeof useAggregateMetricsQuery
>;
export type AggregateMetricsLazyQueryHookResult = ReturnType<
  typeof useAggregateMetricsLazyQuery
>;
export type AggregateMetricsQueryResult = ApolloReactCommon.QueryResult<
  AggregateMetricsQuery,
  AggregateMetricsQueryVariables
>;
export const StakingRewardsContractsDocument = gql`
  query StakingRewardsContracts(
    $account: Bytes
    $includeHistoric: Boolean!
    $block: Block_height
  ) @api(name: mstable) {
    current: stakingRewardsContracts {
      address: id
      id
      type
      duration
      lastUpdateTime
      periodFinish
      rewardRate
      rewardPerTokenStored
      platformRewardPerTokenStored
      platformRewardRate
      totalSupply
      totalStakingRewards
      totalPlatformRewards
      stakingToken {
        totalSupply
        ...TokenDetails
      }
      rewardsToken {
        ...TokenDetails
      }
      platformToken {
        ...TokenDetails
      }
      stakingBalances(where: { account: $account }) {
        amount
      }
      stakingRewards: stakingRewards(
        where: { account: $account, type: REWARD }
      ) {
        amount
        amountPerTokenPaid
      }
      platformRewards: stakingRewards(
        where: { account: $account, type: PLATFORM_REWARD }
      ) {
        amount
        amountPerTokenPaid
      }
    }
    historic: stakingRewardsContracts(block: $block)
      @include(if: $includeHistoric) {
      address: id
      id
      lastUpdateTime
      rewardPerTokenStored
      platformRewardPerTokenStored
    }
  }
  ${TokenDetailsFragmentDoc}
`;

/**
 * __useStakingRewardsContractsQuery__
 *
 * To run a query within a React component, call `useStakingRewardsContractsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStakingRewardsContractsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStakingRewardsContractsQuery({
 *   variables: {
 *      account: // value for 'account'
 *      includeHistoric: // value for 'includeHistoric'
 *      block: // value for 'block'
 *   },
 * });
 */
export function useStakingRewardsContractsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    StakingRewardsContractsQuery,
    StakingRewardsContractsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    StakingRewardsContractsQuery,
    StakingRewardsContractsQueryVariables
  >(StakingRewardsContractsDocument, baseOptions);
}
export function useStakingRewardsContractsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    StakingRewardsContractsQuery,
    StakingRewardsContractsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    StakingRewardsContractsQuery,
    StakingRewardsContractsQueryVariables
  >(StakingRewardsContractsDocument, baseOptions);
}
export type StakingRewardsContractsQueryHookResult = ReturnType<
  typeof useStakingRewardsContractsQuery
>;
export type StakingRewardsContractsLazyQueryHookResult = ReturnType<
  typeof useStakingRewardsContractsLazyQuery
>;
export type StakingRewardsContractsQueryResult = ApolloReactCommon.QueryResult<
  StakingRewardsContractsQuery,
  StakingRewardsContractsQueryVariables
>;
export const RewardsDistributorDocument = gql`
  query RewardsDistributor @api(name: mstable) {
    rewardsDistributors(first: 1) {
      id
      fundManagers
    }
  }
`;

/**
 * __useRewardsDistributorQuery__
 *
 * To run a query within a React component, call `useRewardsDistributorQuery` and pass it any options that fit your needs.
 * When your component renders, `useRewardsDistributorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRewardsDistributorQuery({
 *   variables: {
 *   },
 * });
 */
export function useRewardsDistributorQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<RewardsDistributorQuery, RewardsDistributorQueryVariables>) {
        return ApolloReactHooks.useQuery<RewardsDistributorQuery, RewardsDistributorQueryVariables>(RewardsDistributorDocument, baseOptions);
      }
export function useRewardsDistributorLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<RewardsDistributorQuery, RewardsDistributorQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<RewardsDistributorQuery, RewardsDistributorQueryVariables>(RewardsDistributorDocument, baseOptions);
        }
export type RewardsDistributorQueryHookResult = ReturnType<typeof useRewardsDistributorQuery>;
export type RewardsDistributorLazyQueryHookResult = ReturnType<typeof useRewardsDistributorLazyQuery>;
export type RewardsDistributorQueryResult = ApolloReactCommon.QueryResult<RewardsDistributorQuery, RewardsDistributorQueryVariables>;
