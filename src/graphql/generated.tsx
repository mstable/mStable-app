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
  "__schema": {
    "types": []
  }
};
      export default result;
    
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Bytes: any,
  BigDecimal: any,
  BigInt: any,
};

export type Account = {
  id: Scalars['ID'],
  address: Scalars['Bytes'],
  balances: Array<AccountBalance>,
};


export type AccountBalancesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<AccountBalance_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<AccountBalance_Filter>
};

export type Account_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  address?: Maybe<Scalars['Bytes']>,
  address_not?: Maybe<Scalars['Bytes']>,
  address_in?: Maybe<Array<Scalars['Bytes']>>,
  address_not_in?: Maybe<Array<Scalars['Bytes']>>,
  address_contains?: Maybe<Scalars['Bytes']>,
  address_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum Account_OrderBy {
  Id = 'id',
  Address = 'address',
  Balances = 'balances'
}

export type AccountBalance = {
  id: Scalars['ID'],
  account: Account,
  amount: Scalars['BigDecimal'],
  token: Token,
};

export type AccountBalance_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  account?: Maybe<Scalars['String']>,
  account_not?: Maybe<Scalars['String']>,
  account_gt?: Maybe<Scalars['String']>,
  account_lt?: Maybe<Scalars['String']>,
  account_gte?: Maybe<Scalars['String']>,
  account_lte?: Maybe<Scalars['String']>,
  account_in?: Maybe<Array<Scalars['String']>>,
  account_not_in?: Maybe<Array<Scalars['String']>>,
  account_contains?: Maybe<Scalars['String']>,
  account_not_contains?: Maybe<Scalars['String']>,
  account_starts_with?: Maybe<Scalars['String']>,
  account_not_starts_with?: Maybe<Scalars['String']>,
  account_ends_with?: Maybe<Scalars['String']>,
  account_not_ends_with?: Maybe<Scalars['String']>,
  amount?: Maybe<Scalars['BigDecimal']>,
  amount_not?: Maybe<Scalars['BigDecimal']>,
  amount_gt?: Maybe<Scalars['BigDecimal']>,
  amount_lt?: Maybe<Scalars['BigDecimal']>,
  amount_gte?: Maybe<Scalars['BigDecimal']>,
  amount_lte?: Maybe<Scalars['BigDecimal']>,
  amount_in?: Maybe<Array<Scalars['BigDecimal']>>,
  amount_not_in?: Maybe<Array<Scalars['BigDecimal']>>,
  token?: Maybe<Scalars['String']>,
  token_not?: Maybe<Scalars['String']>,
  token_gt?: Maybe<Scalars['String']>,
  token_lt?: Maybe<Scalars['String']>,
  token_gte?: Maybe<Scalars['String']>,
  token_lte?: Maybe<Scalars['String']>,
  token_in?: Maybe<Array<Scalars['String']>>,
  token_not_in?: Maybe<Array<Scalars['String']>>,
  token_contains?: Maybe<Scalars['String']>,
  token_not_contains?: Maybe<Scalars['String']>,
  token_starts_with?: Maybe<Scalars['String']>,
  token_not_starts_with?: Maybe<Scalars['String']>,
  token_ends_with?: Maybe<Scalars['String']>,
  token_not_ends_with?: Maybe<Scalars['String']>,
};

export enum AccountBalance_OrderBy {
  Id = 'id',
  Account = 'account',
  Amount = 'amount',
  Token = 'token'
}

export type Basket = {
  id: Scalars['ID'],
  bassets: Array<Basset>,
  collateralisationRatio: Scalars['BigInt'],
  expiredBassets: Array<Scalars['Bytes']>,
  failed: Scalars['Boolean'],
  masset: Masset,
};


export type BasketBassetsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Basset_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Basset_Filter>
};

export type Basket_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  bassets?: Maybe<Array<Scalars['String']>>,
  bassets_not?: Maybe<Array<Scalars['String']>>,
  bassets_contains?: Maybe<Array<Scalars['String']>>,
  bassets_not_contains?: Maybe<Array<Scalars['String']>>,
  collateralisationRatio?: Maybe<Scalars['BigInt']>,
  collateralisationRatio_not?: Maybe<Scalars['BigInt']>,
  collateralisationRatio_gt?: Maybe<Scalars['BigInt']>,
  collateralisationRatio_lt?: Maybe<Scalars['BigInt']>,
  collateralisationRatio_gte?: Maybe<Scalars['BigInt']>,
  collateralisationRatio_lte?: Maybe<Scalars['BigInt']>,
  collateralisationRatio_in?: Maybe<Array<Scalars['BigInt']>>,
  collateralisationRatio_not_in?: Maybe<Array<Scalars['BigInt']>>,
  expiredBassets?: Maybe<Array<Scalars['Bytes']>>,
  expiredBassets_not?: Maybe<Array<Scalars['Bytes']>>,
  expiredBassets_contains?: Maybe<Array<Scalars['Bytes']>>,
  expiredBassets_not_contains?: Maybe<Array<Scalars['Bytes']>>,
  failed?: Maybe<Scalars['Boolean']>,
  failed_not?: Maybe<Scalars['Boolean']>,
  failed_in?: Maybe<Array<Scalars['Boolean']>>,
  failed_not_in?: Maybe<Array<Scalars['Boolean']>>,
};

export enum Basket_OrderBy {
  Id = 'id',
  Bassets = 'bassets',
  CollateralisationRatio = 'collateralisationRatio',
  ExpiredBassets = 'expiredBassets',
  Failed = 'failed',
  Masset = 'masset'
}

export type Basset = {
  id: Scalars['ID'],
  basket: Basket,
  maxWeight: Scalars['BigInt'],
  ratio: Scalars['BigInt'],
  status: Scalars['String'],
  isTransferFeeCharged: Scalars['Boolean'],
  token: Token,
  vaultBalance: Scalars['BigInt'],
};

export type Basset_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  maxWeight?: Maybe<Scalars['BigInt']>,
  maxWeight_not?: Maybe<Scalars['BigInt']>,
  maxWeight_gt?: Maybe<Scalars['BigInt']>,
  maxWeight_lt?: Maybe<Scalars['BigInt']>,
  maxWeight_gte?: Maybe<Scalars['BigInt']>,
  maxWeight_lte?: Maybe<Scalars['BigInt']>,
  maxWeight_in?: Maybe<Array<Scalars['BigInt']>>,
  maxWeight_not_in?: Maybe<Array<Scalars['BigInt']>>,
  ratio?: Maybe<Scalars['BigInt']>,
  ratio_not?: Maybe<Scalars['BigInt']>,
  ratio_gt?: Maybe<Scalars['BigInt']>,
  ratio_lt?: Maybe<Scalars['BigInt']>,
  ratio_gte?: Maybe<Scalars['BigInt']>,
  ratio_lte?: Maybe<Scalars['BigInt']>,
  ratio_in?: Maybe<Array<Scalars['BigInt']>>,
  ratio_not_in?: Maybe<Array<Scalars['BigInt']>>,
  status?: Maybe<Scalars['String']>,
  status_not?: Maybe<Scalars['String']>,
  status_gt?: Maybe<Scalars['String']>,
  status_lt?: Maybe<Scalars['String']>,
  status_gte?: Maybe<Scalars['String']>,
  status_lte?: Maybe<Scalars['String']>,
  status_in?: Maybe<Array<Scalars['String']>>,
  status_not_in?: Maybe<Array<Scalars['String']>>,
  status_contains?: Maybe<Scalars['String']>,
  status_not_contains?: Maybe<Scalars['String']>,
  status_starts_with?: Maybe<Scalars['String']>,
  status_not_starts_with?: Maybe<Scalars['String']>,
  status_ends_with?: Maybe<Scalars['String']>,
  status_not_ends_with?: Maybe<Scalars['String']>,
  isTransferFeeCharged?: Maybe<Scalars['Boolean']>,
  isTransferFeeCharged_not?: Maybe<Scalars['Boolean']>,
  isTransferFeeCharged_in?: Maybe<Array<Scalars['Boolean']>>,
  isTransferFeeCharged_not_in?: Maybe<Array<Scalars['Boolean']>>,
  token?: Maybe<Scalars['String']>,
  token_not?: Maybe<Scalars['String']>,
  token_gt?: Maybe<Scalars['String']>,
  token_lt?: Maybe<Scalars['String']>,
  token_gte?: Maybe<Scalars['String']>,
  token_lte?: Maybe<Scalars['String']>,
  token_in?: Maybe<Array<Scalars['String']>>,
  token_not_in?: Maybe<Array<Scalars['String']>>,
  token_contains?: Maybe<Scalars['String']>,
  token_not_contains?: Maybe<Scalars['String']>,
  token_starts_with?: Maybe<Scalars['String']>,
  token_not_starts_with?: Maybe<Scalars['String']>,
  token_ends_with?: Maybe<Scalars['String']>,
  token_not_ends_with?: Maybe<Scalars['String']>,
  vaultBalance?: Maybe<Scalars['BigInt']>,
  vaultBalance_not?: Maybe<Scalars['BigInt']>,
  vaultBalance_gt?: Maybe<Scalars['BigInt']>,
  vaultBalance_lt?: Maybe<Scalars['BigInt']>,
  vaultBalance_gte?: Maybe<Scalars['BigInt']>,
  vaultBalance_lte?: Maybe<Scalars['BigInt']>,
  vaultBalance_in?: Maybe<Array<Scalars['BigInt']>>,
  vaultBalance_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum Basset_OrderBy {
  Id = 'id',
  Basket = 'basket',
  MaxWeight = 'maxWeight',
  Ratio = 'ratio',
  Status = 'status',
  IsTransferFeeCharged = 'isTransferFeeCharged',
  Token = 'token',
  VaultBalance = 'vaultBalance'
}



export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>,
  number?: Maybe<Scalars['Int']>,
};


export type Masset = {
  id: Scalars['ID'],
  basket: Basket,
  redemptionFee: Scalars['BigInt'],
  feePool: Scalars['Bytes'],
  token: Token,
  tranches: Array<Tranche>,
};


export type MassetTranchesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Tranche_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Tranche_Filter>
};

export type Masset_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  basket?: Maybe<Scalars['String']>,
  basket_not?: Maybe<Scalars['String']>,
  basket_gt?: Maybe<Scalars['String']>,
  basket_lt?: Maybe<Scalars['String']>,
  basket_gte?: Maybe<Scalars['String']>,
  basket_lte?: Maybe<Scalars['String']>,
  basket_in?: Maybe<Array<Scalars['String']>>,
  basket_not_in?: Maybe<Array<Scalars['String']>>,
  basket_contains?: Maybe<Scalars['String']>,
  basket_not_contains?: Maybe<Scalars['String']>,
  basket_starts_with?: Maybe<Scalars['String']>,
  basket_not_starts_with?: Maybe<Scalars['String']>,
  basket_ends_with?: Maybe<Scalars['String']>,
  basket_not_ends_with?: Maybe<Scalars['String']>,
  redemptionFee?: Maybe<Scalars['BigInt']>,
  redemptionFee_not?: Maybe<Scalars['BigInt']>,
  redemptionFee_gt?: Maybe<Scalars['BigInt']>,
  redemptionFee_lt?: Maybe<Scalars['BigInt']>,
  redemptionFee_gte?: Maybe<Scalars['BigInt']>,
  redemptionFee_lte?: Maybe<Scalars['BigInt']>,
  redemptionFee_in?: Maybe<Array<Scalars['BigInt']>>,
  redemptionFee_not_in?: Maybe<Array<Scalars['BigInt']>>,
  feePool?: Maybe<Scalars['Bytes']>,
  feePool_not?: Maybe<Scalars['Bytes']>,
  feePool_in?: Maybe<Array<Scalars['Bytes']>>,
  feePool_not_in?: Maybe<Array<Scalars['Bytes']>>,
  feePool_contains?: Maybe<Scalars['Bytes']>,
  feePool_not_contains?: Maybe<Scalars['Bytes']>,
  token?: Maybe<Scalars['String']>,
  token_not?: Maybe<Scalars['String']>,
  token_gt?: Maybe<Scalars['String']>,
  token_lt?: Maybe<Scalars['String']>,
  token_gte?: Maybe<Scalars['String']>,
  token_lte?: Maybe<Scalars['String']>,
  token_in?: Maybe<Array<Scalars['String']>>,
  token_not_in?: Maybe<Array<Scalars['String']>>,
  token_contains?: Maybe<Scalars['String']>,
  token_not_contains?: Maybe<Scalars['String']>,
  token_starts_with?: Maybe<Scalars['String']>,
  token_not_starts_with?: Maybe<Scalars['String']>,
  token_ends_with?: Maybe<Scalars['String']>,
  token_not_ends_with?: Maybe<Scalars['String']>,
  tranches?: Maybe<Array<Scalars['String']>>,
  tranches_not?: Maybe<Array<Scalars['String']>>,
  tranches_contains?: Maybe<Array<Scalars['String']>>,
  tranches_not_contains?: Maybe<Array<Scalars['String']>>,
};

export enum Masset_OrderBy {
  Id = 'id',
  Basket = 'basket',
  RedemptionFee = 'redemptionFee',
  FeePool = 'feePool',
  Token = 'token',
  Tranches = 'tranches'
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  token?: Maybe<Token>,
  tokens: Array<Token>,
  basset?: Maybe<Basset>,
  bassets: Array<Basset>,
  basket?: Maybe<Basket>,
  baskets: Array<Basket>,
  trancheReward?: Maybe<TrancheReward>,
  trancheRewards: Array<TrancheReward>,
  tranche?: Maybe<Tranche>,
  tranches: Array<Tranche>,
  masset?: Maybe<Masset>,
  massets: Array<Masset>,
  account?: Maybe<Account>,
  accounts: Array<Account>,
  accountBalance?: Maybe<AccountBalance>,
  accountBalances: Array<AccountBalance>,
};


export type QueryTokenArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type QueryTokensArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Token_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Token_Filter>,
  block?: Maybe<Block_Height>
};


export type QueryBassetArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type QueryBassetsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Basset_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Basset_Filter>,
  block?: Maybe<Block_Height>
};


export type QueryBasketArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type QueryBasketsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Basket_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Basket_Filter>,
  block?: Maybe<Block_Height>
};


export type QueryTrancheRewardArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type QueryTrancheRewardsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<TrancheReward_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<TrancheReward_Filter>,
  block?: Maybe<Block_Height>
};


export type QueryTrancheArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type QueryTranchesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Tranche_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Tranche_Filter>,
  block?: Maybe<Block_Height>
};


export type QueryMassetArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type QueryMassetsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Masset_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Masset_Filter>,
  block?: Maybe<Block_Height>
};


export type QueryAccountArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type QueryAccountsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Account_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Account_Filter>,
  block?: Maybe<Block_Height>
};


export type QueryAccountBalanceArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type QueryAccountBalancesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<AccountBalance_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<AccountBalance_Filter>,
  block?: Maybe<Block_Height>
};

export type Subscription = {
  token?: Maybe<Token>,
  tokens: Array<Token>,
  basset?: Maybe<Basset>,
  bassets: Array<Basset>,
  basket?: Maybe<Basket>,
  baskets: Array<Basket>,
  trancheReward?: Maybe<TrancheReward>,
  trancheRewards: Array<TrancheReward>,
  tranche?: Maybe<Tranche>,
  tranches: Array<Tranche>,
  masset?: Maybe<Masset>,
  massets: Array<Masset>,
  account?: Maybe<Account>,
  accounts: Array<Account>,
  accountBalance?: Maybe<AccountBalance>,
  accountBalances: Array<AccountBalance>,
};


export type SubscriptionTokenArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type SubscriptionTokensArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Token_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Token_Filter>,
  block?: Maybe<Block_Height>
};


export type SubscriptionBassetArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type SubscriptionBassetsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Basset_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Basset_Filter>,
  block?: Maybe<Block_Height>
};


export type SubscriptionBasketArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type SubscriptionBasketsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Basket_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Basket_Filter>,
  block?: Maybe<Block_Height>
};


export type SubscriptionTrancheRewardArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type SubscriptionTrancheRewardsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<TrancheReward_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<TrancheReward_Filter>,
  block?: Maybe<Block_Height>
};


export type SubscriptionTrancheArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type SubscriptionTranchesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Tranche_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Tranche_Filter>,
  block?: Maybe<Block_Height>
};


export type SubscriptionMassetArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type SubscriptionMassetsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Masset_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Masset_Filter>,
  block?: Maybe<Block_Height>
};


export type SubscriptionAccountArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type SubscriptionAccountsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<Account_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<Account_Filter>,
  block?: Maybe<Block_Height>
};


export type SubscriptionAccountBalanceArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type SubscriptionAccountBalancesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<AccountBalance_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<AccountBalance_Filter>,
  block?: Maybe<Block_Height>
};

export type Token = {
  id: Scalars['ID'],
  address: Scalars['Bytes'],
  decimals: Scalars['Int'],
  name: Scalars['String'],
  symbol: Scalars['String'],
  totalSupply: Scalars['BigDecimal'],
  totalMinted: Scalars['BigDecimal'],
  totalTransferred: Scalars['BigDecimal'],
  totalBurned: Scalars['BigDecimal'],
};

export type Token_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  address?: Maybe<Scalars['Bytes']>,
  address_not?: Maybe<Scalars['Bytes']>,
  address_in?: Maybe<Array<Scalars['Bytes']>>,
  address_not_in?: Maybe<Array<Scalars['Bytes']>>,
  address_contains?: Maybe<Scalars['Bytes']>,
  address_not_contains?: Maybe<Scalars['Bytes']>,
  decimals?: Maybe<Scalars['Int']>,
  decimals_not?: Maybe<Scalars['Int']>,
  decimals_gt?: Maybe<Scalars['Int']>,
  decimals_lt?: Maybe<Scalars['Int']>,
  decimals_gte?: Maybe<Scalars['Int']>,
  decimals_lte?: Maybe<Scalars['Int']>,
  decimals_in?: Maybe<Array<Scalars['Int']>>,
  decimals_not_in?: Maybe<Array<Scalars['Int']>>,
  name?: Maybe<Scalars['String']>,
  name_not?: Maybe<Scalars['String']>,
  name_gt?: Maybe<Scalars['String']>,
  name_lt?: Maybe<Scalars['String']>,
  name_gte?: Maybe<Scalars['String']>,
  name_lte?: Maybe<Scalars['String']>,
  name_in?: Maybe<Array<Scalars['String']>>,
  name_not_in?: Maybe<Array<Scalars['String']>>,
  name_contains?: Maybe<Scalars['String']>,
  name_not_contains?: Maybe<Scalars['String']>,
  name_starts_with?: Maybe<Scalars['String']>,
  name_not_starts_with?: Maybe<Scalars['String']>,
  name_ends_with?: Maybe<Scalars['String']>,
  name_not_ends_with?: Maybe<Scalars['String']>,
  symbol?: Maybe<Scalars['String']>,
  symbol_not?: Maybe<Scalars['String']>,
  symbol_gt?: Maybe<Scalars['String']>,
  symbol_lt?: Maybe<Scalars['String']>,
  symbol_gte?: Maybe<Scalars['String']>,
  symbol_lte?: Maybe<Scalars['String']>,
  symbol_in?: Maybe<Array<Scalars['String']>>,
  symbol_not_in?: Maybe<Array<Scalars['String']>>,
  symbol_contains?: Maybe<Scalars['String']>,
  symbol_not_contains?: Maybe<Scalars['String']>,
  symbol_starts_with?: Maybe<Scalars['String']>,
  symbol_not_starts_with?: Maybe<Scalars['String']>,
  symbol_ends_with?: Maybe<Scalars['String']>,
  symbol_not_ends_with?: Maybe<Scalars['String']>,
  totalSupply?: Maybe<Scalars['BigDecimal']>,
  totalSupply_not?: Maybe<Scalars['BigDecimal']>,
  totalSupply_gt?: Maybe<Scalars['BigDecimal']>,
  totalSupply_lt?: Maybe<Scalars['BigDecimal']>,
  totalSupply_gte?: Maybe<Scalars['BigDecimal']>,
  totalSupply_lte?: Maybe<Scalars['BigDecimal']>,
  totalSupply_in?: Maybe<Array<Scalars['BigDecimal']>>,
  totalSupply_not_in?: Maybe<Array<Scalars['BigDecimal']>>,
  totalMinted?: Maybe<Scalars['BigDecimal']>,
  totalMinted_not?: Maybe<Scalars['BigDecimal']>,
  totalMinted_gt?: Maybe<Scalars['BigDecimal']>,
  totalMinted_lt?: Maybe<Scalars['BigDecimal']>,
  totalMinted_gte?: Maybe<Scalars['BigDecimal']>,
  totalMinted_lte?: Maybe<Scalars['BigDecimal']>,
  totalMinted_in?: Maybe<Array<Scalars['BigDecimal']>>,
  totalMinted_not_in?: Maybe<Array<Scalars['BigDecimal']>>,
  totalTransferred?: Maybe<Scalars['BigDecimal']>,
  totalTransferred_not?: Maybe<Scalars['BigDecimal']>,
  totalTransferred_gt?: Maybe<Scalars['BigDecimal']>,
  totalTransferred_lt?: Maybe<Scalars['BigDecimal']>,
  totalTransferred_gte?: Maybe<Scalars['BigDecimal']>,
  totalTransferred_lte?: Maybe<Scalars['BigDecimal']>,
  totalTransferred_in?: Maybe<Array<Scalars['BigDecimal']>>,
  totalTransferred_not_in?: Maybe<Array<Scalars['BigDecimal']>>,
  totalBurned?: Maybe<Scalars['BigDecimal']>,
  totalBurned_not?: Maybe<Scalars['BigDecimal']>,
  totalBurned_gt?: Maybe<Scalars['BigDecimal']>,
  totalBurned_lt?: Maybe<Scalars['BigDecimal']>,
  totalBurned_gte?: Maybe<Scalars['BigDecimal']>,
  totalBurned_lte?: Maybe<Scalars['BigDecimal']>,
  totalBurned_in?: Maybe<Array<Scalars['BigDecimal']>>,
  totalBurned_not_in?: Maybe<Array<Scalars['BigDecimal']>>,
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
  TotalBurned = 'totalBurned'
}

export type Tranche = {
  id: Scalars['ID'],
  claimEndTime: Scalars['BigInt'],
  endTime: Scalars['BigInt'],
  masset: Masset,
  rewardees: Array<Scalars['Bytes']>,
  rewards: Array<TrancheReward>,
  startTime: Scalars['BigInt'],
  totalMintVolume: Scalars['BigInt'],
  totalRewardUnits: Scalars['BigInt'],
  trancheNumber: Scalars['BigInt'],
  unclaimedRewardUnits: Scalars['BigInt'],
  unlockTime: Scalars['BigInt'],
};


export type TrancheRewardsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<TrancheReward_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<TrancheReward_Filter>
};

export type Tranche_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  claimEndTime?: Maybe<Scalars['BigInt']>,
  claimEndTime_not?: Maybe<Scalars['BigInt']>,
  claimEndTime_gt?: Maybe<Scalars['BigInt']>,
  claimEndTime_lt?: Maybe<Scalars['BigInt']>,
  claimEndTime_gte?: Maybe<Scalars['BigInt']>,
  claimEndTime_lte?: Maybe<Scalars['BigInt']>,
  claimEndTime_in?: Maybe<Array<Scalars['BigInt']>>,
  claimEndTime_not_in?: Maybe<Array<Scalars['BigInt']>>,
  endTime?: Maybe<Scalars['BigInt']>,
  endTime_not?: Maybe<Scalars['BigInt']>,
  endTime_gt?: Maybe<Scalars['BigInt']>,
  endTime_lt?: Maybe<Scalars['BigInt']>,
  endTime_gte?: Maybe<Scalars['BigInt']>,
  endTime_lte?: Maybe<Scalars['BigInt']>,
  endTime_in?: Maybe<Array<Scalars['BigInt']>>,
  endTime_not_in?: Maybe<Array<Scalars['BigInt']>>,
  rewardees?: Maybe<Array<Scalars['Bytes']>>,
  rewardees_not?: Maybe<Array<Scalars['Bytes']>>,
  rewardees_contains?: Maybe<Array<Scalars['Bytes']>>,
  rewardees_not_contains?: Maybe<Array<Scalars['Bytes']>>,
  rewards?: Maybe<Array<Scalars['String']>>,
  rewards_not?: Maybe<Array<Scalars['String']>>,
  rewards_contains?: Maybe<Array<Scalars['String']>>,
  rewards_not_contains?: Maybe<Array<Scalars['String']>>,
  startTime?: Maybe<Scalars['BigInt']>,
  startTime_not?: Maybe<Scalars['BigInt']>,
  startTime_gt?: Maybe<Scalars['BigInt']>,
  startTime_lt?: Maybe<Scalars['BigInt']>,
  startTime_gte?: Maybe<Scalars['BigInt']>,
  startTime_lte?: Maybe<Scalars['BigInt']>,
  startTime_in?: Maybe<Array<Scalars['BigInt']>>,
  startTime_not_in?: Maybe<Array<Scalars['BigInt']>>,
  totalMintVolume?: Maybe<Scalars['BigInt']>,
  totalMintVolume_not?: Maybe<Scalars['BigInt']>,
  totalMintVolume_gt?: Maybe<Scalars['BigInt']>,
  totalMintVolume_lt?: Maybe<Scalars['BigInt']>,
  totalMintVolume_gte?: Maybe<Scalars['BigInt']>,
  totalMintVolume_lte?: Maybe<Scalars['BigInt']>,
  totalMintVolume_in?: Maybe<Array<Scalars['BigInt']>>,
  totalMintVolume_not_in?: Maybe<Array<Scalars['BigInt']>>,
  totalRewardUnits?: Maybe<Scalars['BigInt']>,
  totalRewardUnits_not?: Maybe<Scalars['BigInt']>,
  totalRewardUnits_gt?: Maybe<Scalars['BigInt']>,
  totalRewardUnits_lt?: Maybe<Scalars['BigInt']>,
  totalRewardUnits_gte?: Maybe<Scalars['BigInt']>,
  totalRewardUnits_lte?: Maybe<Scalars['BigInt']>,
  totalRewardUnits_in?: Maybe<Array<Scalars['BigInt']>>,
  totalRewardUnits_not_in?: Maybe<Array<Scalars['BigInt']>>,
  trancheNumber?: Maybe<Scalars['BigInt']>,
  trancheNumber_not?: Maybe<Scalars['BigInt']>,
  trancheNumber_gt?: Maybe<Scalars['BigInt']>,
  trancheNumber_lt?: Maybe<Scalars['BigInt']>,
  trancheNumber_gte?: Maybe<Scalars['BigInt']>,
  trancheNumber_lte?: Maybe<Scalars['BigInt']>,
  trancheNumber_in?: Maybe<Array<Scalars['BigInt']>>,
  trancheNumber_not_in?: Maybe<Array<Scalars['BigInt']>>,
  unclaimedRewardUnits?: Maybe<Scalars['BigInt']>,
  unclaimedRewardUnits_not?: Maybe<Scalars['BigInt']>,
  unclaimedRewardUnits_gt?: Maybe<Scalars['BigInt']>,
  unclaimedRewardUnits_lt?: Maybe<Scalars['BigInt']>,
  unclaimedRewardUnits_gte?: Maybe<Scalars['BigInt']>,
  unclaimedRewardUnits_lte?: Maybe<Scalars['BigInt']>,
  unclaimedRewardUnits_in?: Maybe<Array<Scalars['BigInt']>>,
  unclaimedRewardUnits_not_in?: Maybe<Array<Scalars['BigInt']>>,
  unlockTime?: Maybe<Scalars['BigInt']>,
  unlockTime_not?: Maybe<Scalars['BigInt']>,
  unlockTime_gt?: Maybe<Scalars['BigInt']>,
  unlockTime_lt?: Maybe<Scalars['BigInt']>,
  unlockTime_gte?: Maybe<Scalars['BigInt']>,
  unlockTime_lte?: Maybe<Scalars['BigInt']>,
  unlockTime_in?: Maybe<Array<Scalars['BigInt']>>,
  unlockTime_not_in?: Maybe<Array<Scalars['BigInt']>>,
};

export enum Tranche_OrderBy {
  Id = 'id',
  ClaimEndTime = 'claimEndTime',
  EndTime = 'endTime',
  Masset = 'masset',
  Rewardees = 'rewardees',
  Rewards = 'rewards',
  StartTime = 'startTime',
  TotalMintVolume = 'totalMintVolume',
  TotalRewardUnits = 'totalRewardUnits',
  TrancheNumber = 'trancheNumber',
  UnclaimedRewardUnits = 'unclaimedRewardUnits',
  UnlockTime = 'unlockTime'
}

export type TrancheReward = {
  id: Scalars['ID'],
  allocation: Scalars['BigInt'],
  claimed: Scalars['Boolean'],
  mintVolume: Scalars['BigInt'],
  redeemed: Scalars['Boolean'],
  rewardee: Scalars['Bytes'],
  tranche: Tranche,
};

export type TrancheReward_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  allocation?: Maybe<Scalars['BigInt']>,
  allocation_not?: Maybe<Scalars['BigInt']>,
  allocation_gt?: Maybe<Scalars['BigInt']>,
  allocation_lt?: Maybe<Scalars['BigInt']>,
  allocation_gte?: Maybe<Scalars['BigInt']>,
  allocation_lte?: Maybe<Scalars['BigInt']>,
  allocation_in?: Maybe<Array<Scalars['BigInt']>>,
  allocation_not_in?: Maybe<Array<Scalars['BigInt']>>,
  claimed?: Maybe<Scalars['Boolean']>,
  claimed_not?: Maybe<Scalars['Boolean']>,
  claimed_in?: Maybe<Array<Scalars['Boolean']>>,
  claimed_not_in?: Maybe<Array<Scalars['Boolean']>>,
  mintVolume?: Maybe<Scalars['BigInt']>,
  mintVolume_not?: Maybe<Scalars['BigInt']>,
  mintVolume_gt?: Maybe<Scalars['BigInt']>,
  mintVolume_lt?: Maybe<Scalars['BigInt']>,
  mintVolume_gte?: Maybe<Scalars['BigInt']>,
  mintVolume_lte?: Maybe<Scalars['BigInt']>,
  mintVolume_in?: Maybe<Array<Scalars['BigInt']>>,
  mintVolume_not_in?: Maybe<Array<Scalars['BigInt']>>,
  redeemed?: Maybe<Scalars['Boolean']>,
  redeemed_not?: Maybe<Scalars['Boolean']>,
  redeemed_in?: Maybe<Array<Scalars['Boolean']>>,
  redeemed_not_in?: Maybe<Array<Scalars['Boolean']>>,
  rewardee?: Maybe<Scalars['Bytes']>,
  rewardee_not?: Maybe<Scalars['Bytes']>,
  rewardee_in?: Maybe<Array<Scalars['Bytes']>>,
  rewardee_not_in?: Maybe<Array<Scalars['Bytes']>>,
  rewardee_contains?: Maybe<Scalars['Bytes']>,
  rewardee_not_contains?: Maybe<Scalars['Bytes']>,
};

export enum TrancheReward_OrderBy {
  Id = 'id',
  Allocation = 'allocation',
  Claimed = 'claimed',
  MintVolume = 'mintVolume',
  Redeemed = 'redeemed',
  Rewardee = 'rewardee',
  Tranche = 'tranche'
}

export type AddressFragment = Pick<Token, 'address'>;

export type TokenQueryVariables = {
  id: Scalars['ID']
};


export type TokenQuery = { token: Maybe<Pick<Token, 'id' | 'symbol' | 'address'>> };

export type TokenSubSubscriptionVariables = {
  id: Scalars['ID']
};


export type TokenSubSubscription = { token: Maybe<Pick<Token, 'id' | 'symbol' | 'address'>> };

export const AddressFragmentDoc = gql`
    fragment Address on Token {
  address
}
    `;
export const TokenDocument = gql`
    query Token($id: ID!) {
  token(id: $id) {
    id
    symbol
    address
  }
}
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
export function useTokenQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<TokenQuery, TokenQueryVariables>) {
        return ApolloReactHooks.useQuery<TokenQuery, TokenQueryVariables>(TokenDocument, baseOptions);
      }
export function useTokenLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TokenQuery, TokenQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<TokenQuery, TokenQueryVariables>(TokenDocument, baseOptions);
        }
export type TokenQueryHookResult = ReturnType<typeof useTokenQuery>;
export type TokenLazyQueryHookResult = ReturnType<typeof useTokenLazyQuery>;
export type TokenQueryResult = ApolloReactCommon.QueryResult<TokenQuery, TokenQueryVariables>;
export const TokenSubDocument = gql`
    subscription TokenSub($id: ID!) {
  token(id: $id) {
    id
    symbol
    address
  }
}
    `;

/**
 * __useTokenSubSubscription__
 *
 * To run a query within a React component, call `useTokenSubSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTokenSubSubscription` returns an object from Apollo Client that contains loading, error, and data properties 
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenSubSubscription({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTokenSubSubscription(baseOptions?: ApolloReactHooks.SubscriptionHookOptions<TokenSubSubscription, TokenSubSubscriptionVariables>) {
        return ApolloReactHooks.useSubscription<TokenSubSubscription, TokenSubSubscriptionVariables>(TokenSubDocument, baseOptions);
      }
export type TokenSubSubscriptionHookResult = ReturnType<typeof useTokenSubSubscription>;
export type TokenSubSubscriptionResult = ApolloReactCommon.SubscriptionResult<TokenSubSubscription>;