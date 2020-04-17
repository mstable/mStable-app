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
  creditBalances: Array<CreditBalance>,
};


export type AccountBalancesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<AccountBalance_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<AccountBalance_Filter>
};


export type AccountCreditBalancesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<CreditBalance_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<CreditBalance_Filter>
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
  Balances = 'balances',
  CreditBalances = 'creditBalances'
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
  grace: Scalars['BigInt'],
  maxBassets: Scalars['Int'],
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
  grace?: Maybe<Scalars['BigInt']>,
  grace_not?: Maybe<Scalars['BigInt']>,
  grace_gt?: Maybe<Scalars['BigInt']>,
  grace_lt?: Maybe<Scalars['BigInt']>,
  grace_gte?: Maybe<Scalars['BigInt']>,
  grace_lte?: Maybe<Scalars['BigInt']>,
  grace_in?: Maybe<Array<Scalars['BigInt']>>,
  grace_not_in?: Maybe<Array<Scalars['BigInt']>>,
  maxBassets?: Maybe<Scalars['Int']>,
  maxBassets_not?: Maybe<Scalars['Int']>,
  maxBassets_gt?: Maybe<Scalars['Int']>,
  maxBassets_lt?: Maybe<Scalars['Int']>,
  maxBassets_gte?: Maybe<Scalars['Int']>,
  maxBassets_lte?: Maybe<Scalars['Int']>,
  maxBassets_in?: Maybe<Array<Scalars['Int']>>,
  maxBassets_not_in?: Maybe<Array<Scalars['Int']>>,
  failed?: Maybe<Scalars['Boolean']>,
  failed_not?: Maybe<Scalars['Boolean']>,
  failed_in?: Maybe<Array<Scalars['Boolean']>>,
  failed_not_in?: Maybe<Array<Scalars['Boolean']>>,
};

export enum Basket_OrderBy {
  Id = 'id',
  Bassets = 'bassets',
  CollateralisationRatio = 'collateralisationRatio',
  Grace = 'grace',
  MaxBassets = 'maxBassets',
  Failed = 'failed',
  Masset = 'masset'
}

export type Basset = {
  id: Scalars['ID'],
  basket: Basket,
  targetWeight: Scalars['BigInt'],
  ratio: Scalars['BigInt'],
  status: Scalars['String'],
  isTransferFeeCharged: Scalars['Boolean'],
  token: Token,
  vaultBalance: Scalars['BigDecimal'],
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
  targetWeight?: Maybe<Scalars['BigInt']>,
  targetWeight_not?: Maybe<Scalars['BigInt']>,
  targetWeight_gt?: Maybe<Scalars['BigInt']>,
  targetWeight_lt?: Maybe<Scalars['BigInt']>,
  targetWeight_gte?: Maybe<Scalars['BigInt']>,
  targetWeight_lte?: Maybe<Scalars['BigInt']>,
  targetWeight_in?: Maybe<Array<Scalars['BigInt']>>,
  targetWeight_not_in?: Maybe<Array<Scalars['BigInt']>>,
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
  vaultBalance?: Maybe<Scalars['BigDecimal']>,
  vaultBalance_not?: Maybe<Scalars['BigDecimal']>,
  vaultBalance_gt?: Maybe<Scalars['BigDecimal']>,
  vaultBalance_lt?: Maybe<Scalars['BigDecimal']>,
  vaultBalance_gte?: Maybe<Scalars['BigDecimal']>,
  vaultBalance_lte?: Maybe<Scalars['BigDecimal']>,
  vaultBalance_in?: Maybe<Array<Scalars['BigDecimal']>>,
  vaultBalance_not_in?: Maybe<Array<Scalars['BigDecimal']>>,
};

export enum Basset_OrderBy {
  Id = 'id',
  Basket = 'basket',
  TargetWeight = 'targetWeight',
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


export type CreditBalance = {
  id: Scalars['ID'],
  account: Account,
  amount: Scalars['BigDecimal'],
  savingsContract: SavingsContract,
};

export type CreditBalance_Filter = {
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
  savingsContract?: Maybe<Scalars['String']>,
  savingsContract_not?: Maybe<Scalars['String']>,
  savingsContract_gt?: Maybe<Scalars['String']>,
  savingsContract_lt?: Maybe<Scalars['String']>,
  savingsContract_gte?: Maybe<Scalars['String']>,
  savingsContract_lte?: Maybe<Scalars['String']>,
  savingsContract_in?: Maybe<Array<Scalars['String']>>,
  savingsContract_not_in?: Maybe<Array<Scalars['String']>>,
  savingsContract_contains?: Maybe<Scalars['String']>,
  savingsContract_not_contains?: Maybe<Scalars['String']>,
  savingsContract_starts_with?: Maybe<Scalars['String']>,
  savingsContract_not_starts_with?: Maybe<Scalars['String']>,
  savingsContract_ends_with?: Maybe<Scalars['String']>,
  savingsContract_not_ends_with?: Maybe<Scalars['String']>,
};

export enum CreditBalance_OrderBy {
  Id = 'id',
  Account = 'account',
  Amount = 'amount',
  SavingsContract = 'savingsContract'
}

export type ExchangeRate = {
  id: Scalars['ID'],
  exchangeRate: Scalars['BigDecimal'],
  timestamp: Scalars['Int'],
  savingsContract: SavingsContract,
};

export type ExchangeRate_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  exchangeRate?: Maybe<Scalars['BigDecimal']>,
  exchangeRate_not?: Maybe<Scalars['BigDecimal']>,
  exchangeRate_gt?: Maybe<Scalars['BigDecimal']>,
  exchangeRate_lt?: Maybe<Scalars['BigDecimal']>,
  exchangeRate_gte?: Maybe<Scalars['BigDecimal']>,
  exchangeRate_lte?: Maybe<Scalars['BigDecimal']>,
  exchangeRate_in?: Maybe<Array<Scalars['BigDecimal']>>,
  exchangeRate_not_in?: Maybe<Array<Scalars['BigDecimal']>>,
  timestamp?: Maybe<Scalars['Int']>,
  timestamp_not?: Maybe<Scalars['Int']>,
  timestamp_gt?: Maybe<Scalars['Int']>,
  timestamp_lt?: Maybe<Scalars['Int']>,
  timestamp_gte?: Maybe<Scalars['Int']>,
  timestamp_lte?: Maybe<Scalars['Int']>,
  timestamp_in?: Maybe<Array<Scalars['Int']>>,
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>,
  savingsContract?: Maybe<Scalars['String']>,
  savingsContract_not?: Maybe<Scalars['String']>,
  savingsContract_gt?: Maybe<Scalars['String']>,
  savingsContract_lt?: Maybe<Scalars['String']>,
  savingsContract_gte?: Maybe<Scalars['String']>,
  savingsContract_lte?: Maybe<Scalars['String']>,
  savingsContract_in?: Maybe<Array<Scalars['String']>>,
  savingsContract_not_in?: Maybe<Array<Scalars['String']>>,
  savingsContract_contains?: Maybe<Scalars['String']>,
  savingsContract_not_contains?: Maybe<Scalars['String']>,
  savingsContract_starts_with?: Maybe<Scalars['String']>,
  savingsContract_not_starts_with?: Maybe<Scalars['String']>,
  savingsContract_ends_with?: Maybe<Scalars['String']>,
  savingsContract_not_ends_with?: Maybe<Scalars['String']>,
};

export enum ExchangeRate_OrderBy {
  Id = 'id',
  ExchangeRate = 'exchangeRate',
  Timestamp = 'timestamp',
  SavingsContract = 'savingsContract'
}

export type Masset = {
  id: Scalars['ID'],
  basket: Basket,
  feeRate: Scalars['BigInt'],
  feePool: Scalars['Bytes'],
  token: Token,
  tokenSymbol: Scalars['String'],
  savingsContracts: Array<SavingsContract>,
};


export type MassetSavingsContractsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<SavingsContract_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<SavingsContract_Filter>
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
  feeRate?: Maybe<Scalars['BigInt']>,
  feeRate_not?: Maybe<Scalars['BigInt']>,
  feeRate_gt?: Maybe<Scalars['BigInt']>,
  feeRate_lt?: Maybe<Scalars['BigInt']>,
  feeRate_gte?: Maybe<Scalars['BigInt']>,
  feeRate_lte?: Maybe<Scalars['BigInt']>,
  feeRate_in?: Maybe<Array<Scalars['BigInt']>>,
  feeRate_not_in?: Maybe<Array<Scalars['BigInt']>>,
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
  tokenSymbol?: Maybe<Scalars['String']>,
  tokenSymbol_not?: Maybe<Scalars['String']>,
  tokenSymbol_gt?: Maybe<Scalars['String']>,
  tokenSymbol_lt?: Maybe<Scalars['String']>,
  tokenSymbol_gte?: Maybe<Scalars['String']>,
  tokenSymbol_lte?: Maybe<Scalars['String']>,
  tokenSymbol_in?: Maybe<Array<Scalars['String']>>,
  tokenSymbol_not_in?: Maybe<Array<Scalars['String']>>,
  tokenSymbol_contains?: Maybe<Scalars['String']>,
  tokenSymbol_not_contains?: Maybe<Scalars['String']>,
  tokenSymbol_starts_with?: Maybe<Scalars['String']>,
  tokenSymbol_not_starts_with?: Maybe<Scalars['String']>,
  tokenSymbol_ends_with?: Maybe<Scalars['String']>,
  tokenSymbol_not_ends_with?: Maybe<Scalars['String']>,
};

export enum Masset_OrderBy {
  Id = 'id',
  Basket = 'basket',
  FeeRate = 'feeRate',
  FeePool = 'feePool',
  Token = 'token',
  TokenSymbol = 'tokenSymbol',
  SavingsContracts = 'savingsContracts'
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
  masset?: Maybe<Masset>,
  massets: Array<Masset>,
  account?: Maybe<Account>,
  accounts: Array<Account>,
  accountBalance?: Maybe<AccountBalance>,
  accountBalances: Array<AccountBalance>,
  creditBalance?: Maybe<CreditBalance>,
  creditBalances: Array<CreditBalance>,
  savingsContract?: Maybe<SavingsContract>,
  savingsContracts: Array<SavingsContract>,
  exchangeRate?: Maybe<ExchangeRate>,
  exchangeRates: Array<ExchangeRate>,
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


export type QueryCreditBalanceArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type QueryCreditBalancesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<CreditBalance_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<CreditBalance_Filter>,
  block?: Maybe<Block_Height>
};


export type QuerySavingsContractArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type QuerySavingsContractsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<SavingsContract_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<SavingsContract_Filter>,
  block?: Maybe<Block_Height>
};


export type QueryExchangeRateArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type QueryExchangeRatesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ExchangeRate_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ExchangeRate_Filter>,
  block?: Maybe<Block_Height>
};

export type SavingsContract = {
  id: Scalars['ID'],
  masset: Masset,
  totalSavings: Scalars['BigDecimal'],
  totalCredits: Scalars['BigDecimal'],
  exchangeRates: Array<ExchangeRate>,
  savingsRate: Scalars['BigDecimal'],
  creditBalances: Array<CreditBalance>,
  automationEnabled: Scalars['Boolean'],
};


export type SavingsContractExchangeRatesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ExchangeRate_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ExchangeRate_Filter>
};


export type SavingsContractCreditBalancesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<CreditBalance_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<CreditBalance_Filter>
};

export type SavingsContract_Filter = {
  id?: Maybe<Scalars['ID']>,
  id_not?: Maybe<Scalars['ID']>,
  id_gt?: Maybe<Scalars['ID']>,
  id_lt?: Maybe<Scalars['ID']>,
  id_gte?: Maybe<Scalars['ID']>,
  id_lte?: Maybe<Scalars['ID']>,
  id_in?: Maybe<Array<Scalars['ID']>>,
  id_not_in?: Maybe<Array<Scalars['ID']>>,
  masset?: Maybe<Scalars['String']>,
  masset_not?: Maybe<Scalars['String']>,
  masset_gt?: Maybe<Scalars['String']>,
  masset_lt?: Maybe<Scalars['String']>,
  masset_gte?: Maybe<Scalars['String']>,
  masset_lte?: Maybe<Scalars['String']>,
  masset_in?: Maybe<Array<Scalars['String']>>,
  masset_not_in?: Maybe<Array<Scalars['String']>>,
  masset_contains?: Maybe<Scalars['String']>,
  masset_not_contains?: Maybe<Scalars['String']>,
  masset_starts_with?: Maybe<Scalars['String']>,
  masset_not_starts_with?: Maybe<Scalars['String']>,
  masset_ends_with?: Maybe<Scalars['String']>,
  masset_not_ends_with?: Maybe<Scalars['String']>,
  totalSavings?: Maybe<Scalars['BigDecimal']>,
  totalSavings_not?: Maybe<Scalars['BigDecimal']>,
  totalSavings_gt?: Maybe<Scalars['BigDecimal']>,
  totalSavings_lt?: Maybe<Scalars['BigDecimal']>,
  totalSavings_gte?: Maybe<Scalars['BigDecimal']>,
  totalSavings_lte?: Maybe<Scalars['BigDecimal']>,
  totalSavings_in?: Maybe<Array<Scalars['BigDecimal']>>,
  totalSavings_not_in?: Maybe<Array<Scalars['BigDecimal']>>,
  totalCredits?: Maybe<Scalars['BigDecimal']>,
  totalCredits_not?: Maybe<Scalars['BigDecimal']>,
  totalCredits_gt?: Maybe<Scalars['BigDecimal']>,
  totalCredits_lt?: Maybe<Scalars['BigDecimal']>,
  totalCredits_gte?: Maybe<Scalars['BigDecimal']>,
  totalCredits_lte?: Maybe<Scalars['BigDecimal']>,
  totalCredits_in?: Maybe<Array<Scalars['BigDecimal']>>,
  totalCredits_not_in?: Maybe<Array<Scalars['BigDecimal']>>,
  savingsRate?: Maybe<Scalars['BigDecimal']>,
  savingsRate_not?: Maybe<Scalars['BigDecimal']>,
  savingsRate_gt?: Maybe<Scalars['BigDecimal']>,
  savingsRate_lt?: Maybe<Scalars['BigDecimal']>,
  savingsRate_gte?: Maybe<Scalars['BigDecimal']>,
  savingsRate_lte?: Maybe<Scalars['BigDecimal']>,
  savingsRate_in?: Maybe<Array<Scalars['BigDecimal']>>,
  savingsRate_not_in?: Maybe<Array<Scalars['BigDecimal']>>,
  automationEnabled?: Maybe<Scalars['Boolean']>,
  automationEnabled_not?: Maybe<Scalars['Boolean']>,
  automationEnabled_in?: Maybe<Array<Scalars['Boolean']>>,
  automationEnabled_not_in?: Maybe<Array<Scalars['Boolean']>>,
};

export enum SavingsContract_OrderBy {
  Id = 'id',
  Masset = 'masset',
  TotalSavings = 'totalSavings',
  TotalCredits = 'totalCredits',
  ExchangeRates = 'exchangeRates',
  SavingsRate = 'savingsRate',
  CreditBalances = 'creditBalances',
  AutomationEnabled = 'automationEnabled'
}

export type Subscription = {
  token?: Maybe<Token>,
  tokens: Array<Token>,
  basset?: Maybe<Basset>,
  bassets: Array<Basset>,
  basket?: Maybe<Basket>,
  baskets: Array<Basket>,
  masset?: Maybe<Masset>,
  massets: Array<Masset>,
  account?: Maybe<Account>,
  accounts: Array<Account>,
  accountBalance?: Maybe<AccountBalance>,
  accountBalances: Array<AccountBalance>,
  creditBalance?: Maybe<CreditBalance>,
  creditBalances: Array<CreditBalance>,
  savingsContract?: Maybe<SavingsContract>,
  savingsContracts: Array<SavingsContract>,
  exchangeRate?: Maybe<ExchangeRate>,
  exchangeRates: Array<ExchangeRate>,
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


export type SubscriptionCreditBalanceArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type SubscriptionCreditBalancesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<CreditBalance_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<CreditBalance_Filter>,
  block?: Maybe<Block_Height>
};


export type SubscriptionSavingsContractArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type SubscriptionSavingsContractsArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<SavingsContract_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<SavingsContract_Filter>,
  block?: Maybe<Block_Height>
};


export type SubscriptionExchangeRateArgs = {
  id: Scalars['ID'],
  block?: Maybe<Block_Height>
};


export type SubscriptionExchangeRatesArgs = {
  skip?: Maybe<Scalars['Int']>,
  first?: Maybe<Scalars['Int']>,
  orderBy?: Maybe<ExchangeRate_OrderBy>,
  orderDirection?: Maybe<OrderDirection>,
  where?: Maybe<ExchangeRate_Filter>,
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

export type TokenDetailsFragment = Pick<Token, 'id' | 'address' | 'decimals' | 'symbol' | 'totalSupply'>;

export type CoreTokensQueryVariables = {};


export type CoreTokensQuery = { mUSD: Array<TokenDetailsFragment>, mUSDSavings: Array<Pick<SavingsContract, 'id'>> };

export type MassetQueryVariables = {
  id: Scalars['ID']
};


export type MassetQuery = { masset: Maybe<(
    Pick<Masset, 'id' | 'feeRate'>
    & { token: TokenDetailsFragment, basket: (
      Pick<Basket, 'failed' | 'collateralisationRatio'>
      & { bassets: Array<(
        Pick<Basset, 'id' | 'vaultBalance' | 'isTransferFeeCharged' | 'ratio' | 'status' | 'targetWeight'>
        & { token: TokenDetailsFragment }
      )> }
    ) }
  )> };

export type Erc20TokensQueryVariables = {
  addresses: Array<Scalars['Bytes']>
};


export type Erc20TokensQuery = { tokens: Array<TokenDetailsFragment> };

export type AllErc20TokensQueryVariables = {};


export type AllErc20TokensQuery = { tokens: Array<TokenDetailsFragment> };

export type TokenByAddressQueryVariables = {
  id: Scalars['ID']
};


export type TokenByAddressQuery = { token: Maybe<Pick<Token, 'id' | 'address' | 'decimals' | 'name' | 'symbol' | 'totalBurned' | 'totalSupply' | 'totalTransferred'>> };

export type SavingsContractQueryVariables = {
  id: Scalars['ID']
};


export type SavingsContractQuery = { savingsContracts: Array<Pick<SavingsContract, 'id'>> };

export type TokenSubSubscriptionVariables = {
  id: Scalars['ID']
};


export type TokenSubSubscription = { token: Maybe<Pick<Token, 'id' | 'symbol' | 'address'>> };

export const TokenDetailsFragmentDoc = gql`
    fragment TokenDetails on Token {
  id
  address
  decimals
  symbol
  totalSupply
}
    `;
export const CoreTokensDocument = gql`
    query CoreTokens {
  mUSD: tokens(where: {symbol: "mUSD"}) {
    ...TokenDetails
  }
  mUSDSavings: savingsContracts(first: 1) {
    id
  }
}
    ${TokenDetailsFragmentDoc}`;

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
export function useCoreTokensQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<CoreTokensQuery, CoreTokensQueryVariables>) {
        return ApolloReactHooks.useQuery<CoreTokensQuery, CoreTokensQueryVariables>(CoreTokensDocument, baseOptions);
      }
export function useCoreTokensLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<CoreTokensQuery, CoreTokensQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<CoreTokensQuery, CoreTokensQueryVariables>(CoreTokensDocument, baseOptions);
        }
export type CoreTokensQueryHookResult = ReturnType<typeof useCoreTokensQuery>;
export type CoreTokensLazyQueryHookResult = ReturnType<typeof useCoreTokensLazyQuery>;
export type CoreTokensQueryResult = ApolloReactCommon.QueryResult<CoreTokensQuery, CoreTokensQueryVariables>;
export const MassetDocument = gql`
    query Masset($id: ID!) {
  masset(id: $id) {
    id
    token {
      ...TokenDetails
    }
    feeRate
    basket {
      failed
      collateralisationRatio
      bassets {
        id
        vaultBalance
        isTransferFeeCharged
        ratio
        status
        targetWeight
        token {
          ...TokenDetails
        }
      }
    }
  }
}
    ${TokenDetailsFragmentDoc}`;

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
export function useMassetQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MassetQuery, MassetQueryVariables>) {
        return ApolloReactHooks.useQuery<MassetQuery, MassetQueryVariables>(MassetDocument, baseOptions);
      }
export function useMassetLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MassetQuery, MassetQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<MassetQuery, MassetQueryVariables>(MassetDocument, baseOptions);
        }
export type MassetQueryHookResult = ReturnType<typeof useMassetQuery>;
export type MassetLazyQueryHookResult = ReturnType<typeof useMassetLazyQuery>;
export type MassetQueryResult = ApolloReactCommon.QueryResult<MassetQuery, MassetQueryVariables>;
export const Erc20TokensDocument = gql`
    query Erc20Tokens($addresses: [Bytes!]!) {
  tokens(where: {address_in: $addresses}) {
    ...TokenDetails
  }
}
    ${TokenDetailsFragmentDoc}`;

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
export function useErc20TokensQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<Erc20TokensQuery, Erc20TokensQueryVariables>) {
        return ApolloReactHooks.useQuery<Erc20TokensQuery, Erc20TokensQueryVariables>(Erc20TokensDocument, baseOptions);
      }
export function useErc20TokensLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<Erc20TokensQuery, Erc20TokensQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<Erc20TokensQuery, Erc20TokensQueryVariables>(Erc20TokensDocument, baseOptions);
        }
export type Erc20TokensQueryHookResult = ReturnType<typeof useErc20TokensQuery>;
export type Erc20TokensLazyQueryHookResult = ReturnType<typeof useErc20TokensLazyQuery>;
export type Erc20TokensQueryResult = ApolloReactCommon.QueryResult<Erc20TokensQuery, Erc20TokensQueryVariables>;
export const AllErc20TokensDocument = gql`
    query AllErc20Tokens {
  tokens {
    ...TokenDetails
  }
}
    ${TokenDetailsFragmentDoc}`;

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
export function useAllErc20TokensQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AllErc20TokensQuery, AllErc20TokensQueryVariables>) {
        return ApolloReactHooks.useQuery<AllErc20TokensQuery, AllErc20TokensQueryVariables>(AllErc20TokensDocument, baseOptions);
      }
export function useAllErc20TokensLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AllErc20TokensQuery, AllErc20TokensQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<AllErc20TokensQuery, AllErc20TokensQueryVariables>(AllErc20TokensDocument, baseOptions);
        }
export type AllErc20TokensQueryHookResult = ReturnType<typeof useAllErc20TokensQuery>;
export type AllErc20TokensLazyQueryHookResult = ReturnType<typeof useAllErc20TokensLazyQuery>;
export type AllErc20TokensQueryResult = ApolloReactCommon.QueryResult<AllErc20TokensQuery, AllErc20TokensQueryVariables>;
export const TokenByAddressDocument = gql`
    query TokenByAddress($id: ID!) {
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
export function useTokenByAddressQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<TokenByAddressQuery, TokenByAddressQueryVariables>) {
        return ApolloReactHooks.useQuery<TokenByAddressQuery, TokenByAddressQueryVariables>(TokenByAddressDocument, baseOptions);
      }
export function useTokenByAddressLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TokenByAddressQuery, TokenByAddressQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<TokenByAddressQuery, TokenByAddressQueryVariables>(TokenByAddressDocument, baseOptions);
        }
export type TokenByAddressQueryHookResult = ReturnType<typeof useTokenByAddressQuery>;
export type TokenByAddressLazyQueryHookResult = ReturnType<typeof useTokenByAddressLazyQuery>;
export type TokenByAddressQueryResult = ApolloReactCommon.QueryResult<TokenByAddressQuery, TokenByAddressQueryVariables>;
export const SavingsContractDocument = gql`
    query SavingsContract($id: ID!) {
  savingsContracts(where: {id: $id}) {
    id
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
export function useSavingsContractQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<SavingsContractQuery, SavingsContractQueryVariables>) {
        return ApolloReactHooks.useQuery<SavingsContractQuery, SavingsContractQueryVariables>(SavingsContractDocument, baseOptions);
      }
export function useSavingsContractLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<SavingsContractQuery, SavingsContractQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<SavingsContractQuery, SavingsContractQueryVariables>(SavingsContractDocument, baseOptions);
        }
export type SavingsContractQueryHookResult = ReturnType<typeof useSavingsContractQuery>;
export type SavingsContractLazyQueryHookResult = ReturnType<typeof useSavingsContractLazyQuery>;
export type SavingsContractQueryResult = ApolloReactCommon.QueryResult<SavingsContractQuery, SavingsContractQueryVariables>;
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