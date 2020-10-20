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
    "types": [
      {
        "kind": "INTERFACE",
        "name": "PoolEvent",
        "possibleTypes": [
          {
            "name": "Exchange"
          },
          {
            "name": "FeeChangeChangelog"
          },
          {
            "name": "AdminFeeChangelog"
          },
          {
            "name": "AmplificationCoeffChangelog"
          },
          {
            "name": "AddLiquidityEvent"
          },
          {
            "name": "RemoveLiquidityEvent"
          },
          {
            "name": "TransferOwnershipEvent"
          }
        ]
      }
    ]
  }
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
  BigInt: string;
  BigDecimal: string;
};

export type AddLiquidityEvent = PoolEvent & {
  id: Scalars['ID'];
  pool: Pool;
  provider: Scalars['Bytes'];
  tokenAmounts: Array<Scalars['BigInt']>;
  fees: Array<Scalars['BigInt']>;
  invariant: Scalars['BigInt'];
  tokenSupply: Scalars['BigInt'];
  block: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  transaction: Scalars['Bytes'];
};

export type AddLiquidityEvent_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  pool?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  provider?: Maybe<Scalars['Bytes']>;
  provider_not?: Maybe<Scalars['Bytes']>;
  provider_in?: Maybe<Array<Scalars['Bytes']>>;
  provider_not_in?: Maybe<Array<Scalars['Bytes']>>;
  provider_contains?: Maybe<Scalars['Bytes']>;
  provider_not_contains?: Maybe<Scalars['Bytes']>;
  tokenAmounts?: Maybe<Array<Scalars['BigInt']>>;
  tokenAmounts_not?: Maybe<Array<Scalars['BigInt']>>;
  tokenAmounts_contains?: Maybe<Array<Scalars['BigInt']>>;
  tokenAmounts_not_contains?: Maybe<Array<Scalars['BigInt']>>;
  fees?: Maybe<Array<Scalars['BigInt']>>;
  fees_not?: Maybe<Array<Scalars['BigInt']>>;
  fees_contains?: Maybe<Array<Scalars['BigInt']>>;
  fees_not_contains?: Maybe<Array<Scalars['BigInt']>>;
  invariant?: Maybe<Scalars['BigInt']>;
  invariant_not?: Maybe<Scalars['BigInt']>;
  invariant_gt?: Maybe<Scalars['BigInt']>;
  invariant_lt?: Maybe<Scalars['BigInt']>;
  invariant_gte?: Maybe<Scalars['BigInt']>;
  invariant_lte?: Maybe<Scalars['BigInt']>;
  invariant_in?: Maybe<Array<Scalars['BigInt']>>;
  invariant_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenSupply?: Maybe<Scalars['BigInt']>;
  tokenSupply_not?: Maybe<Scalars['BigInt']>;
  tokenSupply_gt?: Maybe<Scalars['BigInt']>;
  tokenSupply_lt?: Maybe<Scalars['BigInt']>;
  tokenSupply_gte?: Maybe<Scalars['BigInt']>;
  tokenSupply_lte?: Maybe<Scalars['BigInt']>;
  tokenSupply_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenSupply_not_in?: Maybe<Array<Scalars['BigInt']>>;
  block?: Maybe<Scalars['BigInt']>;
  block_not?: Maybe<Scalars['BigInt']>;
  block_gt?: Maybe<Scalars['BigInt']>;
  block_lt?: Maybe<Scalars['BigInt']>;
  block_gte?: Maybe<Scalars['BigInt']>;
  block_lte?: Maybe<Scalars['BigInt']>;
  block_in?: Maybe<Array<Scalars['BigInt']>>;
  block_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['Bytes']>;
  transaction_not?: Maybe<Scalars['Bytes']>;
  transaction_in?: Maybe<Array<Scalars['Bytes']>>;
  transaction_not_in?: Maybe<Array<Scalars['Bytes']>>;
  transaction_contains?: Maybe<Scalars['Bytes']>;
  transaction_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum AddLiquidityEvent_OrderBy {
  Id = 'id',
  Pool = 'pool',
  Provider = 'provider',
  TokenAmounts = 'tokenAmounts',
  Fees = 'fees',
  Invariant = 'invariant',
  TokenSupply = 'tokenSupply',
  Block = 'block',
  Timestamp = 'timestamp',
  Transaction = 'transaction'
}

export type AdminFeeChangelog = PoolEvent & {
  id: Scalars['ID'];
  pool: Pool;
  value: Scalars['BigDecimal'];
  block: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  transaction: Scalars['Bytes'];
};

export type AdminFeeChangelog_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  pool?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['BigDecimal']>;
  value_not?: Maybe<Scalars['BigDecimal']>;
  value_gt?: Maybe<Scalars['BigDecimal']>;
  value_lt?: Maybe<Scalars['BigDecimal']>;
  value_gte?: Maybe<Scalars['BigDecimal']>;
  value_lte?: Maybe<Scalars['BigDecimal']>;
  value_in?: Maybe<Array<Scalars['BigDecimal']>>;
  value_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  block?: Maybe<Scalars['BigInt']>;
  block_not?: Maybe<Scalars['BigInt']>;
  block_gt?: Maybe<Scalars['BigInt']>;
  block_lt?: Maybe<Scalars['BigInt']>;
  block_gte?: Maybe<Scalars['BigInt']>;
  block_lte?: Maybe<Scalars['BigInt']>;
  block_in?: Maybe<Array<Scalars['BigInt']>>;
  block_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['Bytes']>;
  transaction_not?: Maybe<Scalars['Bytes']>;
  transaction_in?: Maybe<Array<Scalars['Bytes']>>;
  transaction_not_in?: Maybe<Array<Scalars['Bytes']>>;
  transaction_contains?: Maybe<Scalars['Bytes']>;
  transaction_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum AdminFeeChangelog_OrderBy {
  Id = 'id',
  Pool = 'pool',
  Value = 'value',
  Block = 'block',
  Timestamp = 'timestamp',
  Transaction = 'transaction'
}

export type AmplificationCoeffChangelog = PoolEvent & {
  id: Scalars['ID'];
  pool: Pool;
  value: Scalars['BigInt'];
  block: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  transaction: Scalars['Bytes'];
};

export type AmplificationCoeffChangelog_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  pool?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['BigInt']>;
  value_not?: Maybe<Scalars['BigInt']>;
  value_gt?: Maybe<Scalars['BigInt']>;
  value_lt?: Maybe<Scalars['BigInt']>;
  value_gte?: Maybe<Scalars['BigInt']>;
  value_lte?: Maybe<Scalars['BigInt']>;
  value_in?: Maybe<Array<Scalars['BigInt']>>;
  value_not_in?: Maybe<Array<Scalars['BigInt']>>;
  block?: Maybe<Scalars['BigInt']>;
  block_not?: Maybe<Scalars['BigInt']>;
  block_gt?: Maybe<Scalars['BigInt']>;
  block_lt?: Maybe<Scalars['BigInt']>;
  block_gte?: Maybe<Scalars['BigInt']>;
  block_lte?: Maybe<Scalars['BigInt']>;
  block_in?: Maybe<Array<Scalars['BigInt']>>;
  block_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['Bytes']>;
  transaction_not?: Maybe<Scalars['Bytes']>;
  transaction_in?: Maybe<Array<Scalars['Bytes']>>;
  transaction_not_in?: Maybe<Array<Scalars['Bytes']>>;
  transaction_contains?: Maybe<Scalars['Bytes']>;
  transaction_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum AmplificationCoeffChangelog_OrderBy {
  Id = 'id',
  Pool = 'pool',
  Value = 'value',
  Block = 'block',
  Timestamp = 'timestamp',
  Transaction = 'transaction'
}



export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
};


export type Exchange = PoolEvent & {
  id: Scalars['ID'];
  pool: Pool;
  buyer: Scalars['Bytes'];
  soldId: Scalars['BigInt'];
  tokensSold: Scalars['BigInt'];
  boughtId: Scalars['BigInt'];
  tokensBought: Scalars['BigInt'];
  block: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  transaction: Scalars['Bytes'];
};

export type Exchange_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  pool?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  buyer?: Maybe<Scalars['Bytes']>;
  buyer_not?: Maybe<Scalars['Bytes']>;
  buyer_in?: Maybe<Array<Scalars['Bytes']>>;
  buyer_not_in?: Maybe<Array<Scalars['Bytes']>>;
  buyer_contains?: Maybe<Scalars['Bytes']>;
  buyer_not_contains?: Maybe<Scalars['Bytes']>;
  soldId?: Maybe<Scalars['BigInt']>;
  soldId_not?: Maybe<Scalars['BigInt']>;
  soldId_gt?: Maybe<Scalars['BigInt']>;
  soldId_lt?: Maybe<Scalars['BigInt']>;
  soldId_gte?: Maybe<Scalars['BigInt']>;
  soldId_lte?: Maybe<Scalars['BigInt']>;
  soldId_in?: Maybe<Array<Scalars['BigInt']>>;
  soldId_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tokensSold?: Maybe<Scalars['BigInt']>;
  tokensSold_not?: Maybe<Scalars['BigInt']>;
  tokensSold_gt?: Maybe<Scalars['BigInt']>;
  tokensSold_lt?: Maybe<Scalars['BigInt']>;
  tokensSold_gte?: Maybe<Scalars['BigInt']>;
  tokensSold_lte?: Maybe<Scalars['BigInt']>;
  tokensSold_in?: Maybe<Array<Scalars['BigInt']>>;
  tokensSold_not_in?: Maybe<Array<Scalars['BigInt']>>;
  boughtId?: Maybe<Scalars['BigInt']>;
  boughtId_not?: Maybe<Scalars['BigInt']>;
  boughtId_gt?: Maybe<Scalars['BigInt']>;
  boughtId_lt?: Maybe<Scalars['BigInt']>;
  boughtId_gte?: Maybe<Scalars['BigInt']>;
  boughtId_lte?: Maybe<Scalars['BigInt']>;
  boughtId_in?: Maybe<Array<Scalars['BigInt']>>;
  boughtId_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tokensBought?: Maybe<Scalars['BigInt']>;
  tokensBought_not?: Maybe<Scalars['BigInt']>;
  tokensBought_gt?: Maybe<Scalars['BigInt']>;
  tokensBought_lt?: Maybe<Scalars['BigInt']>;
  tokensBought_gte?: Maybe<Scalars['BigInt']>;
  tokensBought_lte?: Maybe<Scalars['BigInt']>;
  tokensBought_in?: Maybe<Array<Scalars['BigInt']>>;
  tokensBought_not_in?: Maybe<Array<Scalars['BigInt']>>;
  block?: Maybe<Scalars['BigInt']>;
  block_not?: Maybe<Scalars['BigInt']>;
  block_gt?: Maybe<Scalars['BigInt']>;
  block_lt?: Maybe<Scalars['BigInt']>;
  block_gte?: Maybe<Scalars['BigInt']>;
  block_lte?: Maybe<Scalars['BigInt']>;
  block_in?: Maybe<Array<Scalars['BigInt']>>;
  block_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['Bytes']>;
  transaction_not?: Maybe<Scalars['Bytes']>;
  transaction_in?: Maybe<Array<Scalars['Bytes']>>;
  transaction_not_in?: Maybe<Array<Scalars['Bytes']>>;
  transaction_contains?: Maybe<Scalars['Bytes']>;
  transaction_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum Exchange_OrderBy {
  Id = 'id',
  Pool = 'pool',
  Buyer = 'buyer',
  SoldId = 'soldId',
  TokensSold = 'tokensSold',
  BoughtId = 'boughtId',
  TokensBought = 'tokensBought',
  Block = 'block',
  Timestamp = 'timestamp',
  Transaction = 'transaction'
}

export type FeeChangeChangelog = PoolEvent & {
  id: Scalars['ID'];
  pool: Pool;
  value: Scalars['BigDecimal'];
  block: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  transaction: Scalars['Bytes'];
};

export type FeeChangeChangelog_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  pool?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['BigDecimal']>;
  value_not?: Maybe<Scalars['BigDecimal']>;
  value_gt?: Maybe<Scalars['BigDecimal']>;
  value_lt?: Maybe<Scalars['BigDecimal']>;
  value_gte?: Maybe<Scalars['BigDecimal']>;
  value_lte?: Maybe<Scalars['BigDecimal']>;
  value_in?: Maybe<Array<Scalars['BigDecimal']>>;
  value_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  block?: Maybe<Scalars['BigInt']>;
  block_not?: Maybe<Scalars['BigInt']>;
  block_gt?: Maybe<Scalars['BigInt']>;
  block_lt?: Maybe<Scalars['BigInt']>;
  block_gte?: Maybe<Scalars['BigInt']>;
  block_lte?: Maybe<Scalars['BigInt']>;
  block_in?: Maybe<Array<Scalars['BigInt']>>;
  block_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['Bytes']>;
  transaction_not?: Maybe<Scalars['Bytes']>;
  transaction_in?: Maybe<Array<Scalars['Bytes']>>;
  transaction_not_in?: Maybe<Array<Scalars['Bytes']>>;
  transaction_contains?: Maybe<Scalars['Bytes']>;
  transaction_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum FeeChangeChangelog_OrderBy {
  Id = 'id',
  Pool = 'pool',
  Value = 'value',
  Block = 'block',
  Timestamp = 'timestamp',
  Transaction = 'transaction'
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Pool = {
  id: Scalars['ID'];
  /**  Swap contract address  */
  address: Scalars['Bytes'];
  /**  Number of coins composing the pool  */
  coinCount: Scalars['Int'];
  /**  Wrapped coins involved in the pool  */
  coins: Array<Token>;
  /**  Plain coins (ERC20)  */
  underlyingCoins: Array<Token>;
  balances: Array<Scalars['BigInt']>;
  /**  Address of the token representing LP share  */
  poolToken?: Maybe<Token>;
  /**  Amplification coefficient multiplied by n * (n - 1)  */
  A: Scalars['BigInt'];
  /**  Fee to charge for exchanges  */
  fee: Scalars['BigDecimal'];
  adminFee: Scalars['BigDecimal'];
  /**  Average dollar value of pool token  */
  virtualPrice: Scalars['BigDecimal'];
  rateMethodId?: Maybe<Scalars['Bytes']>;
  /**  Admins address  */
  owner: Scalars['Bytes'];
  addedAt: Scalars['BigInt'];
  addedAtBlock: Scalars['BigInt'];
  addedAtTransaction: Scalars['Bytes'];
  removedAt?: Maybe<Scalars['BigInt']>;
  removedAtBlock?: Maybe<Scalars['BigInt']>;
  removedAtTransaction?: Maybe<Scalars['Bytes']>;
  events?: Maybe<Array<PoolEvent>>;
  exchanges?: Maybe<Array<Exchange>>;
};


export type PoolCoinsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Token_Filter>;
};


export type PoolUnderlyingCoinsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Token_Filter>;
};


export type PoolEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PoolEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PoolEvent_Filter>;
};


export type PoolExchangesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Exchange_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Exchange_Filter>;
};

export type Pool_Filter = {
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
  coinCount?: Maybe<Scalars['Int']>;
  coinCount_not?: Maybe<Scalars['Int']>;
  coinCount_gt?: Maybe<Scalars['Int']>;
  coinCount_lt?: Maybe<Scalars['Int']>;
  coinCount_gte?: Maybe<Scalars['Int']>;
  coinCount_lte?: Maybe<Scalars['Int']>;
  coinCount_in?: Maybe<Array<Scalars['Int']>>;
  coinCount_not_in?: Maybe<Array<Scalars['Int']>>;
  coins?: Maybe<Array<Scalars['String']>>;
  coins_not?: Maybe<Array<Scalars['String']>>;
  coins_contains?: Maybe<Array<Scalars['String']>>;
  coins_not_contains?: Maybe<Array<Scalars['String']>>;
  underlyingCoins?: Maybe<Array<Scalars['String']>>;
  underlyingCoins_not?: Maybe<Array<Scalars['String']>>;
  underlyingCoins_contains?: Maybe<Array<Scalars['String']>>;
  underlyingCoins_not_contains?: Maybe<Array<Scalars['String']>>;
  balances?: Maybe<Array<Scalars['BigInt']>>;
  balances_not?: Maybe<Array<Scalars['BigInt']>>;
  balances_contains?: Maybe<Array<Scalars['BigInt']>>;
  balances_not_contains?: Maybe<Array<Scalars['BigInt']>>;
  poolToken?: Maybe<Scalars['String']>;
  poolToken_not?: Maybe<Scalars['String']>;
  poolToken_gt?: Maybe<Scalars['String']>;
  poolToken_lt?: Maybe<Scalars['String']>;
  poolToken_gte?: Maybe<Scalars['String']>;
  poolToken_lte?: Maybe<Scalars['String']>;
  poolToken_in?: Maybe<Array<Scalars['String']>>;
  poolToken_not_in?: Maybe<Array<Scalars['String']>>;
  poolToken_contains?: Maybe<Scalars['String']>;
  poolToken_not_contains?: Maybe<Scalars['String']>;
  poolToken_starts_with?: Maybe<Scalars['String']>;
  poolToken_not_starts_with?: Maybe<Scalars['String']>;
  poolToken_ends_with?: Maybe<Scalars['String']>;
  poolToken_not_ends_with?: Maybe<Scalars['String']>;
  A?: Maybe<Scalars['BigInt']>;
  A_not?: Maybe<Scalars['BigInt']>;
  A_gt?: Maybe<Scalars['BigInt']>;
  A_lt?: Maybe<Scalars['BigInt']>;
  A_gte?: Maybe<Scalars['BigInt']>;
  A_lte?: Maybe<Scalars['BigInt']>;
  A_in?: Maybe<Array<Scalars['BigInt']>>;
  A_not_in?: Maybe<Array<Scalars['BigInt']>>;
  fee?: Maybe<Scalars['BigDecimal']>;
  fee_not?: Maybe<Scalars['BigDecimal']>;
  fee_gt?: Maybe<Scalars['BigDecimal']>;
  fee_lt?: Maybe<Scalars['BigDecimal']>;
  fee_gte?: Maybe<Scalars['BigDecimal']>;
  fee_lte?: Maybe<Scalars['BigDecimal']>;
  fee_in?: Maybe<Array<Scalars['BigDecimal']>>;
  fee_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  adminFee?: Maybe<Scalars['BigDecimal']>;
  adminFee_not?: Maybe<Scalars['BigDecimal']>;
  adminFee_gt?: Maybe<Scalars['BigDecimal']>;
  adminFee_lt?: Maybe<Scalars['BigDecimal']>;
  adminFee_gte?: Maybe<Scalars['BigDecimal']>;
  adminFee_lte?: Maybe<Scalars['BigDecimal']>;
  adminFee_in?: Maybe<Array<Scalars['BigDecimal']>>;
  adminFee_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  virtualPrice?: Maybe<Scalars['BigDecimal']>;
  virtualPrice_not?: Maybe<Scalars['BigDecimal']>;
  virtualPrice_gt?: Maybe<Scalars['BigDecimal']>;
  virtualPrice_lt?: Maybe<Scalars['BigDecimal']>;
  virtualPrice_gte?: Maybe<Scalars['BigDecimal']>;
  virtualPrice_lte?: Maybe<Scalars['BigDecimal']>;
  virtualPrice_in?: Maybe<Array<Scalars['BigDecimal']>>;
  virtualPrice_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  rateMethodId?: Maybe<Scalars['Bytes']>;
  rateMethodId_not?: Maybe<Scalars['Bytes']>;
  rateMethodId_in?: Maybe<Array<Scalars['Bytes']>>;
  rateMethodId_not_in?: Maybe<Array<Scalars['Bytes']>>;
  rateMethodId_contains?: Maybe<Scalars['Bytes']>;
  rateMethodId_not_contains?: Maybe<Scalars['Bytes']>;
  owner?: Maybe<Scalars['Bytes']>;
  owner_not?: Maybe<Scalars['Bytes']>;
  owner_in?: Maybe<Array<Scalars['Bytes']>>;
  owner_not_in?: Maybe<Array<Scalars['Bytes']>>;
  owner_contains?: Maybe<Scalars['Bytes']>;
  owner_not_contains?: Maybe<Scalars['Bytes']>;
  addedAt?: Maybe<Scalars['BigInt']>;
  addedAt_not?: Maybe<Scalars['BigInt']>;
  addedAt_gt?: Maybe<Scalars['BigInt']>;
  addedAt_lt?: Maybe<Scalars['BigInt']>;
  addedAt_gte?: Maybe<Scalars['BigInt']>;
  addedAt_lte?: Maybe<Scalars['BigInt']>;
  addedAt_in?: Maybe<Array<Scalars['BigInt']>>;
  addedAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  addedAtBlock?: Maybe<Scalars['BigInt']>;
  addedAtBlock_not?: Maybe<Scalars['BigInt']>;
  addedAtBlock_gt?: Maybe<Scalars['BigInt']>;
  addedAtBlock_lt?: Maybe<Scalars['BigInt']>;
  addedAtBlock_gte?: Maybe<Scalars['BigInt']>;
  addedAtBlock_lte?: Maybe<Scalars['BigInt']>;
  addedAtBlock_in?: Maybe<Array<Scalars['BigInt']>>;
  addedAtBlock_not_in?: Maybe<Array<Scalars['BigInt']>>;
  addedAtTransaction?: Maybe<Scalars['Bytes']>;
  addedAtTransaction_not?: Maybe<Scalars['Bytes']>;
  addedAtTransaction_in?: Maybe<Array<Scalars['Bytes']>>;
  addedAtTransaction_not_in?: Maybe<Array<Scalars['Bytes']>>;
  addedAtTransaction_contains?: Maybe<Scalars['Bytes']>;
  addedAtTransaction_not_contains?: Maybe<Scalars['Bytes']>;
  removedAt?: Maybe<Scalars['BigInt']>;
  removedAt_not?: Maybe<Scalars['BigInt']>;
  removedAt_gt?: Maybe<Scalars['BigInt']>;
  removedAt_lt?: Maybe<Scalars['BigInt']>;
  removedAt_gte?: Maybe<Scalars['BigInt']>;
  removedAt_lte?: Maybe<Scalars['BigInt']>;
  removedAt_in?: Maybe<Array<Scalars['BigInt']>>;
  removedAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  removedAtBlock?: Maybe<Scalars['BigInt']>;
  removedAtBlock_not?: Maybe<Scalars['BigInt']>;
  removedAtBlock_gt?: Maybe<Scalars['BigInt']>;
  removedAtBlock_lt?: Maybe<Scalars['BigInt']>;
  removedAtBlock_gte?: Maybe<Scalars['BigInt']>;
  removedAtBlock_lte?: Maybe<Scalars['BigInt']>;
  removedAtBlock_in?: Maybe<Array<Scalars['BigInt']>>;
  removedAtBlock_not_in?: Maybe<Array<Scalars['BigInt']>>;
  removedAtTransaction?: Maybe<Scalars['Bytes']>;
  removedAtTransaction_not?: Maybe<Scalars['Bytes']>;
  removedAtTransaction_in?: Maybe<Array<Scalars['Bytes']>>;
  removedAtTransaction_not_in?: Maybe<Array<Scalars['Bytes']>>;
  removedAtTransaction_contains?: Maybe<Scalars['Bytes']>;
  removedAtTransaction_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum Pool_OrderBy {
  Id = 'id',
  Address = 'address',
  CoinCount = 'coinCount',
  Coins = 'coins',
  UnderlyingCoins = 'underlyingCoins',
  Balances = 'balances',
  PoolToken = 'poolToken',
  A = 'A',
  Fee = 'fee',
  AdminFee = 'adminFee',
  VirtualPrice = 'virtualPrice',
  RateMethodId = 'rateMethodId',
  Owner = 'owner',
  AddedAt = 'addedAt',
  AddedAtBlock = 'addedAtBlock',
  AddedAtTransaction = 'addedAtTransaction',
  RemovedAt = 'removedAt',
  RemovedAtBlock = 'removedAtBlock',
  RemovedAtTransaction = 'removedAtTransaction',
  Events = 'events',
  Exchanges = 'exchanges'
}

export type PoolEvent = {
  pool: Pool;
  block: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  transaction: Scalars['Bytes'];
};

export type PoolEvent_Filter = {
  pool?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  block?: Maybe<Scalars['BigInt']>;
  block_not?: Maybe<Scalars['BigInt']>;
  block_gt?: Maybe<Scalars['BigInt']>;
  block_lt?: Maybe<Scalars['BigInt']>;
  block_gte?: Maybe<Scalars['BigInt']>;
  block_lte?: Maybe<Scalars['BigInt']>;
  block_in?: Maybe<Array<Scalars['BigInt']>>;
  block_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['Bytes']>;
  transaction_not?: Maybe<Scalars['Bytes']>;
  transaction_in?: Maybe<Array<Scalars['Bytes']>>;
  transaction_not_in?: Maybe<Array<Scalars['Bytes']>>;
  transaction_contains?: Maybe<Scalars['Bytes']>;
  transaction_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum PoolEvent_OrderBy {
  Pool = 'pool',
  Block = 'block',
  Timestamp = 'timestamp',
  Transaction = 'transaction'
}

export type Query = {
  systemInfo?: Maybe<SystemInfo>;
  systemInfos: Array<SystemInfo>;
  pool?: Maybe<Pool>;
  pools: Array<Pool>;
  feeChangeChangelog?: Maybe<FeeChangeChangelog>;
  feeChangeChangelogs: Array<FeeChangeChangelog>;
  adminFeeChangelog?: Maybe<AdminFeeChangelog>;
  adminFeeChangelogs: Array<AdminFeeChangelog>;
  amplificationCoeffChangelog?: Maybe<AmplificationCoeffChangelog>;
  amplificationCoeffChangelogs: Array<AmplificationCoeffChangelog>;
  addLiquidityEvent?: Maybe<AddLiquidityEvent>;
  addLiquidityEvents: Array<AddLiquidityEvent>;
  removeLiquidityEvent?: Maybe<RemoveLiquidityEvent>;
  removeLiquidityEvents: Array<RemoveLiquidityEvent>;
  exchange?: Maybe<Exchange>;
  exchanges: Array<Exchange>;
  transferOwnershipEvent?: Maybe<TransferOwnershipEvent>;
  transferOwnershipEvents: Array<TransferOwnershipEvent>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  poolEvent?: Maybe<PoolEvent>;
  poolEvents: Array<PoolEvent>;
};


export type QuerySystemInfoArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QuerySystemInfosArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SystemInfo_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SystemInfo_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryPoolArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryPoolsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Pool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Pool_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryFeeChangeChangelogArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryFeeChangeChangelogsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FeeChangeChangelog_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FeeChangeChangelog_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryAdminFeeChangelogArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryAdminFeeChangelogsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AdminFeeChangelog_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AdminFeeChangelog_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryAmplificationCoeffChangelogArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryAmplificationCoeffChangelogsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AmplificationCoeffChangelog_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AmplificationCoeffChangelog_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryAddLiquidityEventArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryAddLiquidityEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AddLiquidityEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AddLiquidityEvent_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryRemoveLiquidityEventArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryRemoveLiquidityEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<RemoveLiquidityEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<RemoveLiquidityEvent_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryExchangeArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryExchangesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Exchange_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Exchange_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryTransferOwnershipEventArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryTransferOwnershipEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TransferOwnershipEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TransferOwnershipEvent_Filter>;
  block?: Maybe<Block_Height>;
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


export type QueryPoolEventArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryPoolEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PoolEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PoolEvent_Filter>;
  block?: Maybe<Block_Height>;
};

export type RemoveLiquidityEvent = PoolEvent & {
  id: Scalars['ID'];
  pool: Pool;
  provider: Scalars['Bytes'];
  tokenAmounts: Array<Scalars['BigInt']>;
  fees: Array<Scalars['BigInt']>;
  invariant?: Maybe<Scalars['BigInt']>;
  tokenSupply: Scalars['BigInt'];
  block: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  transaction: Scalars['Bytes'];
};

export type RemoveLiquidityEvent_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  pool?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  provider?: Maybe<Scalars['Bytes']>;
  provider_not?: Maybe<Scalars['Bytes']>;
  provider_in?: Maybe<Array<Scalars['Bytes']>>;
  provider_not_in?: Maybe<Array<Scalars['Bytes']>>;
  provider_contains?: Maybe<Scalars['Bytes']>;
  provider_not_contains?: Maybe<Scalars['Bytes']>;
  tokenAmounts?: Maybe<Array<Scalars['BigInt']>>;
  tokenAmounts_not?: Maybe<Array<Scalars['BigInt']>>;
  tokenAmounts_contains?: Maybe<Array<Scalars['BigInt']>>;
  tokenAmounts_not_contains?: Maybe<Array<Scalars['BigInt']>>;
  fees?: Maybe<Array<Scalars['BigInt']>>;
  fees_not?: Maybe<Array<Scalars['BigInt']>>;
  fees_contains?: Maybe<Array<Scalars['BigInt']>>;
  fees_not_contains?: Maybe<Array<Scalars['BigInt']>>;
  invariant?: Maybe<Scalars['BigInt']>;
  invariant_not?: Maybe<Scalars['BigInt']>;
  invariant_gt?: Maybe<Scalars['BigInt']>;
  invariant_lt?: Maybe<Scalars['BigInt']>;
  invariant_gte?: Maybe<Scalars['BigInt']>;
  invariant_lte?: Maybe<Scalars['BigInt']>;
  invariant_in?: Maybe<Array<Scalars['BigInt']>>;
  invariant_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenSupply?: Maybe<Scalars['BigInt']>;
  tokenSupply_not?: Maybe<Scalars['BigInt']>;
  tokenSupply_gt?: Maybe<Scalars['BigInt']>;
  tokenSupply_lt?: Maybe<Scalars['BigInt']>;
  tokenSupply_gte?: Maybe<Scalars['BigInt']>;
  tokenSupply_lte?: Maybe<Scalars['BigInt']>;
  tokenSupply_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenSupply_not_in?: Maybe<Array<Scalars['BigInt']>>;
  block?: Maybe<Scalars['BigInt']>;
  block_not?: Maybe<Scalars['BigInt']>;
  block_gt?: Maybe<Scalars['BigInt']>;
  block_lt?: Maybe<Scalars['BigInt']>;
  block_gte?: Maybe<Scalars['BigInt']>;
  block_lte?: Maybe<Scalars['BigInt']>;
  block_in?: Maybe<Array<Scalars['BigInt']>>;
  block_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['Bytes']>;
  transaction_not?: Maybe<Scalars['Bytes']>;
  transaction_in?: Maybe<Array<Scalars['Bytes']>>;
  transaction_not_in?: Maybe<Array<Scalars['Bytes']>>;
  transaction_contains?: Maybe<Scalars['Bytes']>;
  transaction_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum RemoveLiquidityEvent_OrderBy {
  Id = 'id',
  Pool = 'pool',
  Provider = 'provider',
  TokenAmounts = 'tokenAmounts',
  Fees = 'fees',
  Invariant = 'invariant',
  TokenSupply = 'tokenSupply',
  Block = 'block',
  Timestamp = 'timestamp',
  Transaction = 'transaction'
}

export type Subscription = {
  systemInfo?: Maybe<SystemInfo>;
  systemInfos: Array<SystemInfo>;
  pool?: Maybe<Pool>;
  pools: Array<Pool>;
  feeChangeChangelog?: Maybe<FeeChangeChangelog>;
  feeChangeChangelogs: Array<FeeChangeChangelog>;
  adminFeeChangelog?: Maybe<AdminFeeChangelog>;
  adminFeeChangelogs: Array<AdminFeeChangelog>;
  amplificationCoeffChangelog?: Maybe<AmplificationCoeffChangelog>;
  amplificationCoeffChangelogs: Array<AmplificationCoeffChangelog>;
  addLiquidityEvent?: Maybe<AddLiquidityEvent>;
  addLiquidityEvents: Array<AddLiquidityEvent>;
  removeLiquidityEvent?: Maybe<RemoveLiquidityEvent>;
  removeLiquidityEvents: Array<RemoveLiquidityEvent>;
  exchange?: Maybe<Exchange>;
  exchanges: Array<Exchange>;
  transferOwnershipEvent?: Maybe<TransferOwnershipEvent>;
  transferOwnershipEvents: Array<TransferOwnershipEvent>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  poolEvent?: Maybe<PoolEvent>;
  poolEvents: Array<PoolEvent>;
};


export type SubscriptionSystemInfoArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionSystemInfosArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SystemInfo_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SystemInfo_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionPoolArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionPoolsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Pool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Pool_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionFeeChangeChangelogArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionFeeChangeChangelogsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FeeChangeChangelog_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FeeChangeChangelog_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionAdminFeeChangelogArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionAdminFeeChangelogsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AdminFeeChangelog_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AdminFeeChangelog_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionAmplificationCoeffChangelogArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionAmplificationCoeffChangelogsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AmplificationCoeffChangelog_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AmplificationCoeffChangelog_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionAddLiquidityEventArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionAddLiquidityEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AddLiquidityEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AddLiquidityEvent_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionRemoveLiquidityEventArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionRemoveLiquidityEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<RemoveLiquidityEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<RemoveLiquidityEvent_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionExchangeArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionExchangesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Exchange_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Exchange_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionTransferOwnershipEventArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionTransferOwnershipEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TransferOwnershipEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TransferOwnershipEvent_Filter>;
  block?: Maybe<Block_Height>;
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


export type SubscriptionPoolEventArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionPoolEventsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PoolEvent_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PoolEvent_Filter>;
  block?: Maybe<Block_Height>;
};

export type SystemInfo = {
  id: Scalars['ID'];
  registryOwner?: Maybe<Scalars['Bytes']>;
  exchangeCount: Scalars['BigInt'];
  poolCount: Scalars['BigInt'];
  tokenCount: Scalars['BigInt'];
  updated: Scalars['BigInt'];
  updatedAtBlock: Scalars['BigInt'];
  updatedAtTransaction: Scalars['Bytes'];
};

export type SystemInfo_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  registryOwner?: Maybe<Scalars['Bytes']>;
  registryOwner_not?: Maybe<Scalars['Bytes']>;
  registryOwner_in?: Maybe<Array<Scalars['Bytes']>>;
  registryOwner_not_in?: Maybe<Array<Scalars['Bytes']>>;
  registryOwner_contains?: Maybe<Scalars['Bytes']>;
  registryOwner_not_contains?: Maybe<Scalars['Bytes']>;
  exchangeCount?: Maybe<Scalars['BigInt']>;
  exchangeCount_not?: Maybe<Scalars['BigInt']>;
  exchangeCount_gt?: Maybe<Scalars['BigInt']>;
  exchangeCount_lt?: Maybe<Scalars['BigInt']>;
  exchangeCount_gte?: Maybe<Scalars['BigInt']>;
  exchangeCount_lte?: Maybe<Scalars['BigInt']>;
  exchangeCount_in?: Maybe<Array<Scalars['BigInt']>>;
  exchangeCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  poolCount?: Maybe<Scalars['BigInt']>;
  poolCount_not?: Maybe<Scalars['BigInt']>;
  poolCount_gt?: Maybe<Scalars['BigInt']>;
  poolCount_lt?: Maybe<Scalars['BigInt']>;
  poolCount_gte?: Maybe<Scalars['BigInt']>;
  poolCount_lte?: Maybe<Scalars['BigInt']>;
  poolCount_in?: Maybe<Array<Scalars['BigInt']>>;
  poolCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenCount?: Maybe<Scalars['BigInt']>;
  tokenCount_not?: Maybe<Scalars['BigInt']>;
  tokenCount_gt?: Maybe<Scalars['BigInt']>;
  tokenCount_lt?: Maybe<Scalars['BigInt']>;
  tokenCount_gte?: Maybe<Scalars['BigInt']>;
  tokenCount_lte?: Maybe<Scalars['BigInt']>;
  tokenCount_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  updated?: Maybe<Scalars['BigInt']>;
  updated_not?: Maybe<Scalars['BigInt']>;
  updated_gt?: Maybe<Scalars['BigInt']>;
  updated_lt?: Maybe<Scalars['BigInt']>;
  updated_gte?: Maybe<Scalars['BigInt']>;
  updated_lte?: Maybe<Scalars['BigInt']>;
  updated_in?: Maybe<Array<Scalars['BigInt']>>;
  updated_not_in?: Maybe<Array<Scalars['BigInt']>>;
  updatedAtBlock?: Maybe<Scalars['BigInt']>;
  updatedAtBlock_not?: Maybe<Scalars['BigInt']>;
  updatedAtBlock_gt?: Maybe<Scalars['BigInt']>;
  updatedAtBlock_lt?: Maybe<Scalars['BigInt']>;
  updatedAtBlock_gte?: Maybe<Scalars['BigInt']>;
  updatedAtBlock_lte?: Maybe<Scalars['BigInt']>;
  updatedAtBlock_in?: Maybe<Array<Scalars['BigInt']>>;
  updatedAtBlock_not_in?: Maybe<Array<Scalars['BigInt']>>;
  updatedAtTransaction?: Maybe<Scalars['Bytes']>;
  updatedAtTransaction_not?: Maybe<Scalars['Bytes']>;
  updatedAtTransaction_in?: Maybe<Array<Scalars['Bytes']>>;
  updatedAtTransaction_not_in?: Maybe<Array<Scalars['Bytes']>>;
  updatedAtTransaction_contains?: Maybe<Scalars['Bytes']>;
  updatedAtTransaction_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum SystemInfo_OrderBy {
  Id = 'id',
  RegistryOwner = 'registryOwner',
  ExchangeCount = 'exchangeCount',
  PoolCount = 'poolCount',
  TokenCount = 'tokenCount',
  Updated = 'updated',
  UpdatedAtBlock = 'updatedAtBlock',
  UpdatedAtTransaction = 'updatedAtTransaction'
}

export type Token = {
  id: Scalars['ID'];
  address: Scalars['Bytes'];
  decimals: Scalars['BigInt'];
  name?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
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
  decimals?: Maybe<Scalars['BigInt']>;
  decimals_not?: Maybe<Scalars['BigInt']>;
  decimals_gt?: Maybe<Scalars['BigInt']>;
  decimals_lt?: Maybe<Scalars['BigInt']>;
  decimals_gte?: Maybe<Scalars['BigInt']>;
  decimals_lte?: Maybe<Scalars['BigInt']>;
  decimals_in?: Maybe<Array<Scalars['BigInt']>>;
  decimals_not_in?: Maybe<Array<Scalars['BigInt']>>;
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
};

export enum Token_OrderBy {
  Id = 'id',
  Address = 'address',
  Decimals = 'decimals',
  Name = 'name',
  Symbol = 'symbol'
}

export type TransferOwnershipEvent = PoolEvent & {
  id: Scalars['ID'];
  pool: Pool;
  newAdmin: Scalars['Bytes'];
  block: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  transaction: Scalars['Bytes'];
};

export type TransferOwnershipEvent_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  pool?: Maybe<Scalars['String']>;
  pool_not?: Maybe<Scalars['String']>;
  pool_gt?: Maybe<Scalars['String']>;
  pool_lt?: Maybe<Scalars['String']>;
  pool_gte?: Maybe<Scalars['String']>;
  pool_lte?: Maybe<Scalars['String']>;
  pool_in?: Maybe<Array<Scalars['String']>>;
  pool_not_in?: Maybe<Array<Scalars['String']>>;
  pool_contains?: Maybe<Scalars['String']>;
  pool_not_contains?: Maybe<Scalars['String']>;
  pool_starts_with?: Maybe<Scalars['String']>;
  pool_not_starts_with?: Maybe<Scalars['String']>;
  pool_ends_with?: Maybe<Scalars['String']>;
  pool_not_ends_with?: Maybe<Scalars['String']>;
  newAdmin?: Maybe<Scalars['Bytes']>;
  newAdmin_not?: Maybe<Scalars['Bytes']>;
  newAdmin_in?: Maybe<Array<Scalars['Bytes']>>;
  newAdmin_not_in?: Maybe<Array<Scalars['Bytes']>>;
  newAdmin_contains?: Maybe<Scalars['Bytes']>;
  newAdmin_not_contains?: Maybe<Scalars['Bytes']>;
  block?: Maybe<Scalars['BigInt']>;
  block_not?: Maybe<Scalars['BigInt']>;
  block_gt?: Maybe<Scalars['BigInt']>;
  block_lt?: Maybe<Scalars['BigInt']>;
  block_gte?: Maybe<Scalars['BigInt']>;
  block_lte?: Maybe<Scalars['BigInt']>;
  block_in?: Maybe<Array<Scalars['BigInt']>>;
  block_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transaction?: Maybe<Scalars['Bytes']>;
  transaction_not?: Maybe<Scalars['Bytes']>;
  transaction_in?: Maybe<Array<Scalars['Bytes']>>;
  transaction_not_in?: Maybe<Array<Scalars['Bytes']>>;
  transaction_contains?: Maybe<Scalars['Bytes']>;
  transaction_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum TransferOwnershipEvent_OrderBy {
  Id = 'id',
  Pool = 'pool',
  NewAdmin = 'newAdmin',
  Block = 'block',
  Timestamp = 'timestamp',
  Transaction = 'transaction'
}

export type TokenDetailsFragment = Pick<Token, 'address' | 'decimals' | 'symbol'>;

export type PoolDetailsFragment = (
  Pick<Pool, 'id' | 'address' | 'adminFee' | 'fee' | 'balances' | 'coinCount' | 'A' | 'virtualPrice'>
  & { coins: Array<TokenDetailsFragment>, tokens: Array<TokenDetailsFragment>, poolToken?: Maybe<TokenDetailsFragment> }
);

export type PoolsQueryVariables = {
  musdPool: Scalars['ID'];
  basePool: Scalars['ID'];
};


export type PoolsQuery = { musdPool?: Maybe<PoolDetailsFragment>, basePool?: Maybe<PoolDetailsFragment> };

export const TokenDetailsFragmentDoc = gql`
    fragment TokenDetails on Token {
  address
  decimals
  symbol
}
    `;
export const PoolDetailsFragmentDoc = gql`
    fragment PoolDetails on Pool {
  id
  address
  adminFee
  fee
  balances
  coinCount
  coins {
    ...TokenDetails
  }
  tokens: underlyingCoins {
    ...TokenDetails
  }
  poolToken {
    ...TokenDetails
  }
  A
  virtualPrice
}
    ${TokenDetailsFragmentDoc}`;
export const PoolsDocument = gql`
    query Pools($musdPool: ID!, $basePool: ID!) @api(name: curve) {
  musdPool: pool(id: $musdPool) {
    ...PoolDetails
  }
  basePool: pool(id: $basePool) {
    ...PoolDetails
  }
}
    ${PoolDetailsFragmentDoc}`;

/**
 * __usePoolsQuery__
 *
 * To run a query within a React component, call `usePoolsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePoolsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePoolsQuery({
 *   variables: {
 *      musdPool: // value for 'musdPool'
 *      basePool: // value for 'basePool'
 *   },
 * });
 */
export function usePoolsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<PoolsQuery, PoolsQueryVariables>) {
        return ApolloReactHooks.useQuery<PoolsQuery, PoolsQueryVariables>(PoolsDocument, baseOptions);
      }
export function usePoolsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<PoolsQuery, PoolsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<PoolsQuery, PoolsQueryVariables>(PoolsDocument, baseOptions);
        }
export type PoolsQueryHookResult = ReturnType<typeof usePoolsQuery>;
export type PoolsLazyQueryHookResult = ReturnType<typeof usePoolsLazyQuery>;
export type PoolsQueryResult = ApolloReactCommon.QueryResult<PoolsQuery, PoolsQueryVariables>;