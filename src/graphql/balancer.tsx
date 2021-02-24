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
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Bytes: string;
  BigInt: string;
  BigDecimal: string;
};

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type Balancer = {
  id: Scalars['ID'];
  color: Scalars['String'];
  poolCount: Scalars['Int'];
  finalizedPoolCount: Scalars['Int'];
  crpCount: Scalars['Int'];
  pools?: Maybe<Array<Pool>>;
  txCount: Scalars['BigInt'];
  totalLiquidity: Scalars['BigDecimal'];
  totalSwapVolume: Scalars['BigDecimal'];
  totalSwapFee: Scalars['BigDecimal'];
};


export type BalancerPoolsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Pool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Pool_Filter>;
};

export type Balancer_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  color?: Maybe<Scalars['String']>;
  color_not?: Maybe<Scalars['String']>;
  color_gt?: Maybe<Scalars['String']>;
  color_lt?: Maybe<Scalars['String']>;
  color_gte?: Maybe<Scalars['String']>;
  color_lte?: Maybe<Scalars['String']>;
  color_in?: Maybe<Array<Scalars['String']>>;
  color_not_in?: Maybe<Array<Scalars['String']>>;
  color_contains?: Maybe<Scalars['String']>;
  color_not_contains?: Maybe<Scalars['String']>;
  color_starts_with?: Maybe<Scalars['String']>;
  color_not_starts_with?: Maybe<Scalars['String']>;
  color_ends_with?: Maybe<Scalars['String']>;
  color_not_ends_with?: Maybe<Scalars['String']>;
  poolCount?: Maybe<Scalars['Int']>;
  poolCount_not?: Maybe<Scalars['Int']>;
  poolCount_gt?: Maybe<Scalars['Int']>;
  poolCount_lt?: Maybe<Scalars['Int']>;
  poolCount_gte?: Maybe<Scalars['Int']>;
  poolCount_lte?: Maybe<Scalars['Int']>;
  poolCount_in?: Maybe<Array<Scalars['Int']>>;
  poolCount_not_in?: Maybe<Array<Scalars['Int']>>;
  finalizedPoolCount?: Maybe<Scalars['Int']>;
  finalizedPoolCount_not?: Maybe<Scalars['Int']>;
  finalizedPoolCount_gt?: Maybe<Scalars['Int']>;
  finalizedPoolCount_lt?: Maybe<Scalars['Int']>;
  finalizedPoolCount_gte?: Maybe<Scalars['Int']>;
  finalizedPoolCount_lte?: Maybe<Scalars['Int']>;
  finalizedPoolCount_in?: Maybe<Array<Scalars['Int']>>;
  finalizedPoolCount_not_in?: Maybe<Array<Scalars['Int']>>;
  crpCount?: Maybe<Scalars['Int']>;
  crpCount_not?: Maybe<Scalars['Int']>;
  crpCount_gt?: Maybe<Scalars['Int']>;
  crpCount_lt?: Maybe<Scalars['Int']>;
  crpCount_gte?: Maybe<Scalars['Int']>;
  crpCount_lte?: Maybe<Scalars['Int']>;
  crpCount_in?: Maybe<Array<Scalars['Int']>>;
  crpCount_not_in?: Maybe<Array<Scalars['Int']>>;
  txCount?: Maybe<Scalars['BigInt']>;
  txCount_not?: Maybe<Scalars['BigInt']>;
  txCount_gt?: Maybe<Scalars['BigInt']>;
  txCount_lt?: Maybe<Scalars['BigInt']>;
  txCount_gte?: Maybe<Scalars['BigInt']>;
  txCount_lte?: Maybe<Scalars['BigInt']>;
  txCount_in?: Maybe<Array<Scalars['BigInt']>>;
  txCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalLiquidity?: Maybe<Scalars['BigDecimal']>;
  totalLiquidity_not?: Maybe<Scalars['BigDecimal']>;
  totalLiquidity_gt?: Maybe<Scalars['BigDecimal']>;
  totalLiquidity_lt?: Maybe<Scalars['BigDecimal']>;
  totalLiquidity_gte?: Maybe<Scalars['BigDecimal']>;
  totalLiquidity_lte?: Maybe<Scalars['BigDecimal']>;
  totalLiquidity_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalLiquidity_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSwapVolume?: Maybe<Scalars['BigDecimal']>;
  totalSwapVolume_not?: Maybe<Scalars['BigDecimal']>;
  totalSwapVolume_gt?: Maybe<Scalars['BigDecimal']>;
  totalSwapVolume_lt?: Maybe<Scalars['BigDecimal']>;
  totalSwapVolume_gte?: Maybe<Scalars['BigDecimal']>;
  totalSwapVolume_lte?: Maybe<Scalars['BigDecimal']>;
  totalSwapVolume_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSwapVolume_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSwapFee?: Maybe<Scalars['BigDecimal']>;
  totalSwapFee_not?: Maybe<Scalars['BigDecimal']>;
  totalSwapFee_gt?: Maybe<Scalars['BigDecimal']>;
  totalSwapFee_lt?: Maybe<Scalars['BigDecimal']>;
  totalSwapFee_gte?: Maybe<Scalars['BigDecimal']>;
  totalSwapFee_lte?: Maybe<Scalars['BigDecimal']>;
  totalSwapFee_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSwapFee_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum Balancer_OrderBy {
  Id = 'id',
  Color = 'color',
  PoolCount = 'poolCount',
  FinalizedPoolCount = 'finalizedPoolCount',
  CrpCount = 'crpCount',
  Pools = 'pools',
  TxCount = 'txCount',
  TotalLiquidity = 'totalLiquidity',
  TotalSwapVolume = 'totalSwapVolume',
  TotalSwapFee = 'totalSwapFee'
}



export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
};


export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Pool = {
  id: Scalars['ID'];
  controller: Scalars['Bytes'];
  publicSwap: Scalars['Boolean'];
  finalized: Scalars['Boolean'];
  crp: Scalars['Boolean'];
  crpController?: Maybe<Scalars['Bytes']>;
  symbol?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  rights: Array<Scalars['String']>;
  cap?: Maybe<Scalars['BigInt']>;
  active: Scalars['Boolean'];
  swapFee: Scalars['BigDecimal'];
  totalWeight: Scalars['BigDecimal'];
  totalShares: Scalars['BigDecimal'];
  totalSwapVolume: Scalars['BigDecimal'];
  totalSwapFee: Scalars['BigDecimal'];
  liquidity: Scalars['BigDecimal'];
  tokensList: Array<Scalars['Bytes']>;
  tokens?: Maybe<Array<PoolToken>>;
  shares?: Maybe<Array<PoolShare>>;
  createTime: Scalars['Int'];
  tokensCount: Scalars['BigInt'];
  holdersCount: Scalars['BigInt'];
  joinsCount: Scalars['BigInt'];
  exitsCount: Scalars['BigInt'];
  swapsCount: Scalars['BigInt'];
  factoryID: Balancer;
  tx?: Maybe<Scalars['Bytes']>;
  swaps?: Maybe<Array<Swap>>;
};


export type PoolTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PoolToken_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PoolToken_Filter>;
};


export type PoolSharesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PoolShare_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PoolShare_Filter>;
};


export type PoolSwapsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Swap_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Swap_Filter>;
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
  controller?: Maybe<Scalars['Bytes']>;
  controller_not?: Maybe<Scalars['Bytes']>;
  controller_in?: Maybe<Array<Scalars['Bytes']>>;
  controller_not_in?: Maybe<Array<Scalars['Bytes']>>;
  controller_contains?: Maybe<Scalars['Bytes']>;
  controller_not_contains?: Maybe<Scalars['Bytes']>;
  publicSwap?: Maybe<Scalars['Boolean']>;
  publicSwap_not?: Maybe<Scalars['Boolean']>;
  publicSwap_in?: Maybe<Array<Scalars['Boolean']>>;
  publicSwap_not_in?: Maybe<Array<Scalars['Boolean']>>;
  finalized?: Maybe<Scalars['Boolean']>;
  finalized_not?: Maybe<Scalars['Boolean']>;
  finalized_in?: Maybe<Array<Scalars['Boolean']>>;
  finalized_not_in?: Maybe<Array<Scalars['Boolean']>>;
  crp?: Maybe<Scalars['Boolean']>;
  crp_not?: Maybe<Scalars['Boolean']>;
  crp_in?: Maybe<Array<Scalars['Boolean']>>;
  crp_not_in?: Maybe<Array<Scalars['Boolean']>>;
  crpController?: Maybe<Scalars['Bytes']>;
  crpController_not?: Maybe<Scalars['Bytes']>;
  crpController_in?: Maybe<Array<Scalars['Bytes']>>;
  crpController_not_in?: Maybe<Array<Scalars['Bytes']>>;
  crpController_contains?: Maybe<Scalars['Bytes']>;
  crpController_not_contains?: Maybe<Scalars['Bytes']>;
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
  rights?: Maybe<Array<Scalars['String']>>;
  rights_not?: Maybe<Array<Scalars['String']>>;
  rights_contains?: Maybe<Array<Scalars['String']>>;
  rights_not_contains?: Maybe<Array<Scalars['String']>>;
  cap?: Maybe<Scalars['BigInt']>;
  cap_not?: Maybe<Scalars['BigInt']>;
  cap_gt?: Maybe<Scalars['BigInt']>;
  cap_lt?: Maybe<Scalars['BigInt']>;
  cap_gte?: Maybe<Scalars['BigInt']>;
  cap_lte?: Maybe<Scalars['BigInt']>;
  cap_in?: Maybe<Array<Scalars['BigInt']>>;
  cap_not_in?: Maybe<Array<Scalars['BigInt']>>;
  active?: Maybe<Scalars['Boolean']>;
  active_not?: Maybe<Scalars['Boolean']>;
  active_in?: Maybe<Array<Scalars['Boolean']>>;
  active_not_in?: Maybe<Array<Scalars['Boolean']>>;
  swapFee?: Maybe<Scalars['BigDecimal']>;
  swapFee_not?: Maybe<Scalars['BigDecimal']>;
  swapFee_gt?: Maybe<Scalars['BigDecimal']>;
  swapFee_lt?: Maybe<Scalars['BigDecimal']>;
  swapFee_gte?: Maybe<Scalars['BigDecimal']>;
  swapFee_lte?: Maybe<Scalars['BigDecimal']>;
  swapFee_in?: Maybe<Array<Scalars['BigDecimal']>>;
  swapFee_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalWeight?: Maybe<Scalars['BigDecimal']>;
  totalWeight_not?: Maybe<Scalars['BigDecimal']>;
  totalWeight_gt?: Maybe<Scalars['BigDecimal']>;
  totalWeight_lt?: Maybe<Scalars['BigDecimal']>;
  totalWeight_gte?: Maybe<Scalars['BigDecimal']>;
  totalWeight_lte?: Maybe<Scalars['BigDecimal']>;
  totalWeight_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalWeight_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalShares?: Maybe<Scalars['BigDecimal']>;
  totalShares_not?: Maybe<Scalars['BigDecimal']>;
  totalShares_gt?: Maybe<Scalars['BigDecimal']>;
  totalShares_lt?: Maybe<Scalars['BigDecimal']>;
  totalShares_gte?: Maybe<Scalars['BigDecimal']>;
  totalShares_lte?: Maybe<Scalars['BigDecimal']>;
  totalShares_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalShares_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSwapVolume?: Maybe<Scalars['BigDecimal']>;
  totalSwapVolume_not?: Maybe<Scalars['BigDecimal']>;
  totalSwapVolume_gt?: Maybe<Scalars['BigDecimal']>;
  totalSwapVolume_lt?: Maybe<Scalars['BigDecimal']>;
  totalSwapVolume_gte?: Maybe<Scalars['BigDecimal']>;
  totalSwapVolume_lte?: Maybe<Scalars['BigDecimal']>;
  totalSwapVolume_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSwapVolume_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSwapFee?: Maybe<Scalars['BigDecimal']>;
  totalSwapFee_not?: Maybe<Scalars['BigDecimal']>;
  totalSwapFee_gt?: Maybe<Scalars['BigDecimal']>;
  totalSwapFee_lt?: Maybe<Scalars['BigDecimal']>;
  totalSwapFee_gte?: Maybe<Scalars['BigDecimal']>;
  totalSwapFee_lte?: Maybe<Scalars['BigDecimal']>;
  totalSwapFee_in?: Maybe<Array<Scalars['BigDecimal']>>;
  totalSwapFee_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  liquidity?: Maybe<Scalars['BigDecimal']>;
  liquidity_not?: Maybe<Scalars['BigDecimal']>;
  liquidity_gt?: Maybe<Scalars['BigDecimal']>;
  liquidity_lt?: Maybe<Scalars['BigDecimal']>;
  liquidity_gte?: Maybe<Scalars['BigDecimal']>;
  liquidity_lte?: Maybe<Scalars['BigDecimal']>;
  liquidity_in?: Maybe<Array<Scalars['BigDecimal']>>;
  liquidity_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  tokensList?: Maybe<Array<Scalars['Bytes']>>;
  tokensList_not?: Maybe<Array<Scalars['Bytes']>>;
  tokensList_contains?: Maybe<Array<Scalars['Bytes']>>;
  tokensList_not_contains?: Maybe<Array<Scalars['Bytes']>>;
  createTime?: Maybe<Scalars['Int']>;
  createTime_not?: Maybe<Scalars['Int']>;
  createTime_gt?: Maybe<Scalars['Int']>;
  createTime_lt?: Maybe<Scalars['Int']>;
  createTime_gte?: Maybe<Scalars['Int']>;
  createTime_lte?: Maybe<Scalars['Int']>;
  createTime_in?: Maybe<Array<Scalars['Int']>>;
  createTime_not_in?: Maybe<Array<Scalars['Int']>>;
  tokensCount?: Maybe<Scalars['BigInt']>;
  tokensCount_not?: Maybe<Scalars['BigInt']>;
  tokensCount_gt?: Maybe<Scalars['BigInt']>;
  tokensCount_lt?: Maybe<Scalars['BigInt']>;
  tokensCount_gte?: Maybe<Scalars['BigInt']>;
  tokensCount_lte?: Maybe<Scalars['BigInt']>;
  tokensCount_in?: Maybe<Array<Scalars['BigInt']>>;
  tokensCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  holdersCount?: Maybe<Scalars['BigInt']>;
  holdersCount_not?: Maybe<Scalars['BigInt']>;
  holdersCount_gt?: Maybe<Scalars['BigInt']>;
  holdersCount_lt?: Maybe<Scalars['BigInt']>;
  holdersCount_gte?: Maybe<Scalars['BigInt']>;
  holdersCount_lte?: Maybe<Scalars['BigInt']>;
  holdersCount_in?: Maybe<Array<Scalars['BigInt']>>;
  holdersCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  joinsCount?: Maybe<Scalars['BigInt']>;
  joinsCount_not?: Maybe<Scalars['BigInt']>;
  joinsCount_gt?: Maybe<Scalars['BigInt']>;
  joinsCount_lt?: Maybe<Scalars['BigInt']>;
  joinsCount_gte?: Maybe<Scalars['BigInt']>;
  joinsCount_lte?: Maybe<Scalars['BigInt']>;
  joinsCount_in?: Maybe<Array<Scalars['BigInt']>>;
  joinsCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  exitsCount?: Maybe<Scalars['BigInt']>;
  exitsCount_not?: Maybe<Scalars['BigInt']>;
  exitsCount_gt?: Maybe<Scalars['BigInt']>;
  exitsCount_lt?: Maybe<Scalars['BigInt']>;
  exitsCount_gte?: Maybe<Scalars['BigInt']>;
  exitsCount_lte?: Maybe<Scalars['BigInt']>;
  exitsCount_in?: Maybe<Array<Scalars['BigInt']>>;
  exitsCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  swapsCount?: Maybe<Scalars['BigInt']>;
  swapsCount_not?: Maybe<Scalars['BigInt']>;
  swapsCount_gt?: Maybe<Scalars['BigInt']>;
  swapsCount_lt?: Maybe<Scalars['BigInt']>;
  swapsCount_gte?: Maybe<Scalars['BigInt']>;
  swapsCount_lte?: Maybe<Scalars['BigInt']>;
  swapsCount_in?: Maybe<Array<Scalars['BigInt']>>;
  swapsCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  factoryID?: Maybe<Scalars['String']>;
  factoryID_not?: Maybe<Scalars['String']>;
  factoryID_gt?: Maybe<Scalars['String']>;
  factoryID_lt?: Maybe<Scalars['String']>;
  factoryID_gte?: Maybe<Scalars['String']>;
  factoryID_lte?: Maybe<Scalars['String']>;
  factoryID_in?: Maybe<Array<Scalars['String']>>;
  factoryID_not_in?: Maybe<Array<Scalars['String']>>;
  factoryID_contains?: Maybe<Scalars['String']>;
  factoryID_not_contains?: Maybe<Scalars['String']>;
  factoryID_starts_with?: Maybe<Scalars['String']>;
  factoryID_not_starts_with?: Maybe<Scalars['String']>;
  factoryID_ends_with?: Maybe<Scalars['String']>;
  factoryID_not_ends_with?: Maybe<Scalars['String']>;
  tx?: Maybe<Scalars['Bytes']>;
  tx_not?: Maybe<Scalars['Bytes']>;
  tx_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_not_in?: Maybe<Array<Scalars['Bytes']>>;
  tx_contains?: Maybe<Scalars['Bytes']>;
  tx_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum Pool_OrderBy {
  Id = 'id',
  Controller = 'controller',
  PublicSwap = 'publicSwap',
  Finalized = 'finalized',
  Crp = 'crp',
  CrpController = 'crpController',
  Symbol = 'symbol',
  Name = 'name',
  Rights = 'rights',
  Cap = 'cap',
  Active = 'active',
  SwapFee = 'swapFee',
  TotalWeight = 'totalWeight',
  TotalShares = 'totalShares',
  TotalSwapVolume = 'totalSwapVolume',
  TotalSwapFee = 'totalSwapFee',
  Liquidity = 'liquidity',
  TokensList = 'tokensList',
  Tokens = 'tokens',
  Shares = 'shares',
  CreateTime = 'createTime',
  TokensCount = 'tokensCount',
  HoldersCount = 'holdersCount',
  JoinsCount = 'joinsCount',
  ExitsCount = 'exitsCount',
  SwapsCount = 'swapsCount',
  FactoryId = 'factoryID',
  Tx = 'tx',
  Swaps = 'swaps'
}

export type PoolShare = {
  id: Scalars['ID'];
  userAddress: User;
  poolId: Pool;
  balance: Scalars['BigDecimal'];
};

export type PoolShare_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  userAddress?: Maybe<Scalars['String']>;
  userAddress_not?: Maybe<Scalars['String']>;
  userAddress_gt?: Maybe<Scalars['String']>;
  userAddress_lt?: Maybe<Scalars['String']>;
  userAddress_gte?: Maybe<Scalars['String']>;
  userAddress_lte?: Maybe<Scalars['String']>;
  userAddress_in?: Maybe<Array<Scalars['String']>>;
  userAddress_not_in?: Maybe<Array<Scalars['String']>>;
  userAddress_contains?: Maybe<Scalars['String']>;
  userAddress_not_contains?: Maybe<Scalars['String']>;
  userAddress_starts_with?: Maybe<Scalars['String']>;
  userAddress_not_starts_with?: Maybe<Scalars['String']>;
  userAddress_ends_with?: Maybe<Scalars['String']>;
  userAddress_not_ends_with?: Maybe<Scalars['String']>;
  poolId?: Maybe<Scalars['String']>;
  poolId_not?: Maybe<Scalars['String']>;
  poolId_gt?: Maybe<Scalars['String']>;
  poolId_lt?: Maybe<Scalars['String']>;
  poolId_gte?: Maybe<Scalars['String']>;
  poolId_lte?: Maybe<Scalars['String']>;
  poolId_in?: Maybe<Array<Scalars['String']>>;
  poolId_not_in?: Maybe<Array<Scalars['String']>>;
  poolId_contains?: Maybe<Scalars['String']>;
  poolId_not_contains?: Maybe<Scalars['String']>;
  poolId_starts_with?: Maybe<Scalars['String']>;
  poolId_not_starts_with?: Maybe<Scalars['String']>;
  poolId_ends_with?: Maybe<Scalars['String']>;
  poolId_not_ends_with?: Maybe<Scalars['String']>;
  balance?: Maybe<Scalars['BigDecimal']>;
  balance_not?: Maybe<Scalars['BigDecimal']>;
  balance_gt?: Maybe<Scalars['BigDecimal']>;
  balance_lt?: Maybe<Scalars['BigDecimal']>;
  balance_gte?: Maybe<Scalars['BigDecimal']>;
  balance_lte?: Maybe<Scalars['BigDecimal']>;
  balance_in?: Maybe<Array<Scalars['BigDecimal']>>;
  balance_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum PoolShare_OrderBy {
  Id = 'id',
  UserAddress = 'userAddress',
  PoolId = 'poolId',
  Balance = 'balance'
}

export type PoolToken = {
  id: Scalars['ID'];
  poolId: Pool;
  symbol?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  decimals: Scalars['Int'];
  address: Scalars['String'];
  balance: Scalars['BigDecimal'];
  denormWeight: Scalars['BigDecimal'];
};

export type PoolToken_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  poolId?: Maybe<Scalars['String']>;
  poolId_not?: Maybe<Scalars['String']>;
  poolId_gt?: Maybe<Scalars['String']>;
  poolId_lt?: Maybe<Scalars['String']>;
  poolId_gte?: Maybe<Scalars['String']>;
  poolId_lte?: Maybe<Scalars['String']>;
  poolId_in?: Maybe<Array<Scalars['String']>>;
  poolId_not_in?: Maybe<Array<Scalars['String']>>;
  poolId_contains?: Maybe<Scalars['String']>;
  poolId_not_contains?: Maybe<Scalars['String']>;
  poolId_starts_with?: Maybe<Scalars['String']>;
  poolId_not_starts_with?: Maybe<Scalars['String']>;
  poolId_ends_with?: Maybe<Scalars['String']>;
  poolId_not_ends_with?: Maybe<Scalars['String']>;
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
  decimals?: Maybe<Scalars['Int']>;
  decimals_not?: Maybe<Scalars['Int']>;
  decimals_gt?: Maybe<Scalars['Int']>;
  decimals_lt?: Maybe<Scalars['Int']>;
  decimals_gte?: Maybe<Scalars['Int']>;
  decimals_lte?: Maybe<Scalars['Int']>;
  decimals_in?: Maybe<Array<Scalars['Int']>>;
  decimals_not_in?: Maybe<Array<Scalars['Int']>>;
  address?: Maybe<Scalars['String']>;
  address_not?: Maybe<Scalars['String']>;
  address_gt?: Maybe<Scalars['String']>;
  address_lt?: Maybe<Scalars['String']>;
  address_gte?: Maybe<Scalars['String']>;
  address_lte?: Maybe<Scalars['String']>;
  address_in?: Maybe<Array<Scalars['String']>>;
  address_not_in?: Maybe<Array<Scalars['String']>>;
  address_contains?: Maybe<Scalars['String']>;
  address_not_contains?: Maybe<Scalars['String']>;
  address_starts_with?: Maybe<Scalars['String']>;
  address_not_starts_with?: Maybe<Scalars['String']>;
  address_ends_with?: Maybe<Scalars['String']>;
  address_not_ends_with?: Maybe<Scalars['String']>;
  balance?: Maybe<Scalars['BigDecimal']>;
  balance_not?: Maybe<Scalars['BigDecimal']>;
  balance_gt?: Maybe<Scalars['BigDecimal']>;
  balance_lt?: Maybe<Scalars['BigDecimal']>;
  balance_gte?: Maybe<Scalars['BigDecimal']>;
  balance_lte?: Maybe<Scalars['BigDecimal']>;
  balance_in?: Maybe<Array<Scalars['BigDecimal']>>;
  balance_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  denormWeight?: Maybe<Scalars['BigDecimal']>;
  denormWeight_not?: Maybe<Scalars['BigDecimal']>;
  denormWeight_gt?: Maybe<Scalars['BigDecimal']>;
  denormWeight_lt?: Maybe<Scalars['BigDecimal']>;
  denormWeight_gte?: Maybe<Scalars['BigDecimal']>;
  denormWeight_lte?: Maybe<Scalars['BigDecimal']>;
  denormWeight_in?: Maybe<Array<Scalars['BigDecimal']>>;
  denormWeight_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum PoolToken_OrderBy {
  Id = 'id',
  PoolId = 'poolId',
  Symbol = 'symbol',
  Name = 'name',
  Decimals = 'decimals',
  Address = 'address',
  Balance = 'balance',
  DenormWeight = 'denormWeight'
}

export type Query = {
  balancer?: Maybe<Balancer>;
  balancers: Array<Balancer>;
  pool?: Maybe<Pool>;
  pools: Array<Pool>;
  poolToken?: Maybe<PoolToken>;
  poolTokens: Array<PoolToken>;
  poolShare?: Maybe<PoolShare>;
  poolShares: Array<PoolShare>;
  user?: Maybe<User>;
  users: Array<User>;
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  tokenPrice?: Maybe<TokenPrice>;
  tokenPrices: Array<TokenPrice>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryBalancerArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryBalancersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Balancer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Balancer_Filter>;
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


export type QueryPoolTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryPoolTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PoolToken_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PoolToken_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryPoolShareArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryPoolSharesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PoolShare_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PoolShare_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryUserArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryUsersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<User_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<User_Filter>;
  block?: Maybe<Block_Height>;
};


export type QuerySwapArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QuerySwapsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Swap_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Swap_Filter>;
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


export type QueryTokenPriceArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryTokenPricesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenPrice_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenPrice_Filter>;
  block?: Maybe<Block_Height>;
};


export type Query_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type Subscription = {
  balancer?: Maybe<Balancer>;
  balancers: Array<Balancer>;
  pool?: Maybe<Pool>;
  pools: Array<Pool>;
  poolToken?: Maybe<PoolToken>;
  poolTokens: Array<PoolToken>;
  poolShare?: Maybe<PoolShare>;
  poolShares: Array<PoolShare>;
  user?: Maybe<User>;
  users: Array<User>;
  swap?: Maybe<Swap>;
  swaps: Array<Swap>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  tokenPrice?: Maybe<TokenPrice>;
  tokenPrices: Array<TokenPrice>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionBalancerArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionBalancersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Balancer_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Balancer_Filter>;
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


export type SubscriptionPoolTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionPoolTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PoolToken_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PoolToken_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionPoolShareArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionPoolSharesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PoolShare_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PoolShare_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionUserArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionUsersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<User_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<User_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionSwapArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionSwapsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Swap_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Swap_Filter>;
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


export type SubscriptionTokenPriceArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionTokenPricesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<TokenPrice_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<TokenPrice_Filter>;
  block?: Maybe<Block_Height>;
};


export type Subscription_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type Swap = {
  id: Scalars['ID'];
  caller: Scalars['Bytes'];
  tokenIn: Scalars['Bytes'];
  tokenInSym: Scalars['String'];
  tokenOut: Scalars['Bytes'];
  tokenOutSym: Scalars['String'];
  tokenAmountIn: Scalars['BigDecimal'];
  tokenAmountOut: Scalars['BigDecimal'];
  poolAddress?: Maybe<Pool>;
  userAddress?: Maybe<User>;
  value: Scalars['BigDecimal'];
  feeValue: Scalars['BigDecimal'];
  poolTotalSwapVolume: Scalars['BigDecimal'];
  poolTotalSwapFee: Scalars['BigDecimal'];
  poolLiquidity: Scalars['BigDecimal'];
  timestamp: Scalars['Int'];
};

export type Swap_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  caller?: Maybe<Scalars['Bytes']>;
  caller_not?: Maybe<Scalars['Bytes']>;
  caller_in?: Maybe<Array<Scalars['Bytes']>>;
  caller_not_in?: Maybe<Array<Scalars['Bytes']>>;
  caller_contains?: Maybe<Scalars['Bytes']>;
  caller_not_contains?: Maybe<Scalars['Bytes']>;
  tokenIn?: Maybe<Scalars['Bytes']>;
  tokenIn_not?: Maybe<Scalars['Bytes']>;
  tokenIn_in?: Maybe<Array<Scalars['Bytes']>>;
  tokenIn_not_in?: Maybe<Array<Scalars['Bytes']>>;
  tokenIn_contains?: Maybe<Scalars['Bytes']>;
  tokenIn_not_contains?: Maybe<Scalars['Bytes']>;
  tokenInSym?: Maybe<Scalars['String']>;
  tokenInSym_not?: Maybe<Scalars['String']>;
  tokenInSym_gt?: Maybe<Scalars['String']>;
  tokenInSym_lt?: Maybe<Scalars['String']>;
  tokenInSym_gte?: Maybe<Scalars['String']>;
  tokenInSym_lte?: Maybe<Scalars['String']>;
  tokenInSym_in?: Maybe<Array<Scalars['String']>>;
  tokenInSym_not_in?: Maybe<Array<Scalars['String']>>;
  tokenInSym_contains?: Maybe<Scalars['String']>;
  tokenInSym_not_contains?: Maybe<Scalars['String']>;
  tokenInSym_starts_with?: Maybe<Scalars['String']>;
  tokenInSym_not_starts_with?: Maybe<Scalars['String']>;
  tokenInSym_ends_with?: Maybe<Scalars['String']>;
  tokenInSym_not_ends_with?: Maybe<Scalars['String']>;
  tokenOut?: Maybe<Scalars['Bytes']>;
  tokenOut_not?: Maybe<Scalars['Bytes']>;
  tokenOut_in?: Maybe<Array<Scalars['Bytes']>>;
  tokenOut_not_in?: Maybe<Array<Scalars['Bytes']>>;
  tokenOut_contains?: Maybe<Scalars['Bytes']>;
  tokenOut_not_contains?: Maybe<Scalars['Bytes']>;
  tokenOutSym?: Maybe<Scalars['String']>;
  tokenOutSym_not?: Maybe<Scalars['String']>;
  tokenOutSym_gt?: Maybe<Scalars['String']>;
  tokenOutSym_lt?: Maybe<Scalars['String']>;
  tokenOutSym_gte?: Maybe<Scalars['String']>;
  tokenOutSym_lte?: Maybe<Scalars['String']>;
  tokenOutSym_in?: Maybe<Array<Scalars['String']>>;
  tokenOutSym_not_in?: Maybe<Array<Scalars['String']>>;
  tokenOutSym_contains?: Maybe<Scalars['String']>;
  tokenOutSym_not_contains?: Maybe<Scalars['String']>;
  tokenOutSym_starts_with?: Maybe<Scalars['String']>;
  tokenOutSym_not_starts_with?: Maybe<Scalars['String']>;
  tokenOutSym_ends_with?: Maybe<Scalars['String']>;
  tokenOutSym_not_ends_with?: Maybe<Scalars['String']>;
  tokenAmountIn?: Maybe<Scalars['BigDecimal']>;
  tokenAmountIn_not?: Maybe<Scalars['BigDecimal']>;
  tokenAmountIn_gt?: Maybe<Scalars['BigDecimal']>;
  tokenAmountIn_lt?: Maybe<Scalars['BigDecimal']>;
  tokenAmountIn_gte?: Maybe<Scalars['BigDecimal']>;
  tokenAmountIn_lte?: Maybe<Scalars['BigDecimal']>;
  tokenAmountIn_in?: Maybe<Array<Scalars['BigDecimal']>>;
  tokenAmountIn_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  tokenAmountOut?: Maybe<Scalars['BigDecimal']>;
  tokenAmountOut_not?: Maybe<Scalars['BigDecimal']>;
  tokenAmountOut_gt?: Maybe<Scalars['BigDecimal']>;
  tokenAmountOut_lt?: Maybe<Scalars['BigDecimal']>;
  tokenAmountOut_gte?: Maybe<Scalars['BigDecimal']>;
  tokenAmountOut_lte?: Maybe<Scalars['BigDecimal']>;
  tokenAmountOut_in?: Maybe<Array<Scalars['BigDecimal']>>;
  tokenAmountOut_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  poolAddress?: Maybe<Scalars['String']>;
  poolAddress_not?: Maybe<Scalars['String']>;
  poolAddress_gt?: Maybe<Scalars['String']>;
  poolAddress_lt?: Maybe<Scalars['String']>;
  poolAddress_gte?: Maybe<Scalars['String']>;
  poolAddress_lte?: Maybe<Scalars['String']>;
  poolAddress_in?: Maybe<Array<Scalars['String']>>;
  poolAddress_not_in?: Maybe<Array<Scalars['String']>>;
  poolAddress_contains?: Maybe<Scalars['String']>;
  poolAddress_not_contains?: Maybe<Scalars['String']>;
  poolAddress_starts_with?: Maybe<Scalars['String']>;
  poolAddress_not_starts_with?: Maybe<Scalars['String']>;
  poolAddress_ends_with?: Maybe<Scalars['String']>;
  poolAddress_not_ends_with?: Maybe<Scalars['String']>;
  userAddress?: Maybe<Scalars['String']>;
  userAddress_not?: Maybe<Scalars['String']>;
  userAddress_gt?: Maybe<Scalars['String']>;
  userAddress_lt?: Maybe<Scalars['String']>;
  userAddress_gte?: Maybe<Scalars['String']>;
  userAddress_lte?: Maybe<Scalars['String']>;
  userAddress_in?: Maybe<Array<Scalars['String']>>;
  userAddress_not_in?: Maybe<Array<Scalars['String']>>;
  userAddress_contains?: Maybe<Scalars['String']>;
  userAddress_not_contains?: Maybe<Scalars['String']>;
  userAddress_starts_with?: Maybe<Scalars['String']>;
  userAddress_not_starts_with?: Maybe<Scalars['String']>;
  userAddress_ends_with?: Maybe<Scalars['String']>;
  userAddress_not_ends_with?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['BigDecimal']>;
  value_not?: Maybe<Scalars['BigDecimal']>;
  value_gt?: Maybe<Scalars['BigDecimal']>;
  value_lt?: Maybe<Scalars['BigDecimal']>;
  value_gte?: Maybe<Scalars['BigDecimal']>;
  value_lte?: Maybe<Scalars['BigDecimal']>;
  value_in?: Maybe<Array<Scalars['BigDecimal']>>;
  value_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feeValue?: Maybe<Scalars['BigDecimal']>;
  feeValue_not?: Maybe<Scalars['BigDecimal']>;
  feeValue_gt?: Maybe<Scalars['BigDecimal']>;
  feeValue_lt?: Maybe<Scalars['BigDecimal']>;
  feeValue_gte?: Maybe<Scalars['BigDecimal']>;
  feeValue_lte?: Maybe<Scalars['BigDecimal']>;
  feeValue_in?: Maybe<Array<Scalars['BigDecimal']>>;
  feeValue_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  poolTotalSwapVolume?: Maybe<Scalars['BigDecimal']>;
  poolTotalSwapVolume_not?: Maybe<Scalars['BigDecimal']>;
  poolTotalSwapVolume_gt?: Maybe<Scalars['BigDecimal']>;
  poolTotalSwapVolume_lt?: Maybe<Scalars['BigDecimal']>;
  poolTotalSwapVolume_gte?: Maybe<Scalars['BigDecimal']>;
  poolTotalSwapVolume_lte?: Maybe<Scalars['BigDecimal']>;
  poolTotalSwapVolume_in?: Maybe<Array<Scalars['BigDecimal']>>;
  poolTotalSwapVolume_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  poolTotalSwapFee?: Maybe<Scalars['BigDecimal']>;
  poolTotalSwapFee_not?: Maybe<Scalars['BigDecimal']>;
  poolTotalSwapFee_gt?: Maybe<Scalars['BigDecimal']>;
  poolTotalSwapFee_lt?: Maybe<Scalars['BigDecimal']>;
  poolTotalSwapFee_gte?: Maybe<Scalars['BigDecimal']>;
  poolTotalSwapFee_lte?: Maybe<Scalars['BigDecimal']>;
  poolTotalSwapFee_in?: Maybe<Array<Scalars['BigDecimal']>>;
  poolTotalSwapFee_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  poolLiquidity?: Maybe<Scalars['BigDecimal']>;
  poolLiquidity_not?: Maybe<Scalars['BigDecimal']>;
  poolLiquidity_gt?: Maybe<Scalars['BigDecimal']>;
  poolLiquidity_lt?: Maybe<Scalars['BigDecimal']>;
  poolLiquidity_gte?: Maybe<Scalars['BigDecimal']>;
  poolLiquidity_lte?: Maybe<Scalars['BigDecimal']>;
  poolLiquidity_in?: Maybe<Array<Scalars['BigDecimal']>>;
  poolLiquidity_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
};

export enum Swap_OrderBy {
  Id = 'id',
  Caller = 'caller',
  TokenIn = 'tokenIn',
  TokenInSym = 'tokenInSym',
  TokenOut = 'tokenOut',
  TokenOutSym = 'tokenOutSym',
  TokenAmountIn = 'tokenAmountIn',
  TokenAmountOut = 'tokenAmountOut',
  PoolAddress = 'poolAddress',
  UserAddress = 'userAddress',
  Value = 'value',
  FeeValue = 'feeValue',
  PoolTotalSwapVolume = 'poolTotalSwapVolume',
  PoolTotalSwapFee = 'poolTotalSwapFee',
  PoolLiquidity = 'poolLiquidity',
  Timestamp = 'timestamp'
}

export enum SwapType {
  SwapExactAmountIn = 'swapExactAmountIn',
  SwapExactAmountOut = 'swapExactAmountOut',
  JoinswapExternAmountIn = 'joinswapExternAmountIn',
  JoinswapPoolAmountOut = 'joinswapPoolAmountOut',
  ExitswapPoolAmountIn = 'exitswapPoolAmountIn',
  ExitswapExternAmountOut = 'exitswapExternAmountOut'
}

export type TokenPrice = {
  id: Scalars['ID'];
  symbol?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  decimals: Scalars['Int'];
  price: Scalars['BigDecimal'];
  poolLiquidity: Scalars['BigDecimal'];
  poolTokenId?: Maybe<Scalars['String']>;
};

export type TokenPrice_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
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
  decimals?: Maybe<Scalars['Int']>;
  decimals_not?: Maybe<Scalars['Int']>;
  decimals_gt?: Maybe<Scalars['Int']>;
  decimals_lt?: Maybe<Scalars['Int']>;
  decimals_gte?: Maybe<Scalars['Int']>;
  decimals_lte?: Maybe<Scalars['Int']>;
  decimals_in?: Maybe<Array<Scalars['Int']>>;
  decimals_not_in?: Maybe<Array<Scalars['Int']>>;
  price?: Maybe<Scalars['BigDecimal']>;
  price_not?: Maybe<Scalars['BigDecimal']>;
  price_gt?: Maybe<Scalars['BigDecimal']>;
  price_lt?: Maybe<Scalars['BigDecimal']>;
  price_gte?: Maybe<Scalars['BigDecimal']>;
  price_lte?: Maybe<Scalars['BigDecimal']>;
  price_in?: Maybe<Array<Scalars['BigDecimal']>>;
  price_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  poolLiquidity?: Maybe<Scalars['BigDecimal']>;
  poolLiquidity_not?: Maybe<Scalars['BigDecimal']>;
  poolLiquidity_gt?: Maybe<Scalars['BigDecimal']>;
  poolLiquidity_lt?: Maybe<Scalars['BigDecimal']>;
  poolLiquidity_gte?: Maybe<Scalars['BigDecimal']>;
  poolLiquidity_lte?: Maybe<Scalars['BigDecimal']>;
  poolLiquidity_in?: Maybe<Array<Scalars['BigDecimal']>>;
  poolLiquidity_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  poolTokenId?: Maybe<Scalars['String']>;
  poolTokenId_not?: Maybe<Scalars['String']>;
  poolTokenId_gt?: Maybe<Scalars['String']>;
  poolTokenId_lt?: Maybe<Scalars['String']>;
  poolTokenId_gte?: Maybe<Scalars['String']>;
  poolTokenId_lte?: Maybe<Scalars['String']>;
  poolTokenId_in?: Maybe<Array<Scalars['String']>>;
  poolTokenId_not_in?: Maybe<Array<Scalars['String']>>;
  poolTokenId_contains?: Maybe<Scalars['String']>;
  poolTokenId_not_contains?: Maybe<Scalars['String']>;
  poolTokenId_starts_with?: Maybe<Scalars['String']>;
  poolTokenId_not_starts_with?: Maybe<Scalars['String']>;
  poolTokenId_ends_with?: Maybe<Scalars['String']>;
  poolTokenId_not_ends_with?: Maybe<Scalars['String']>;
};

export enum TokenPrice_OrderBy {
  Id = 'id',
  Symbol = 'symbol',
  Name = 'name',
  Decimals = 'decimals',
  Price = 'price',
  PoolLiquidity = 'poolLiquidity',
  PoolTokenId = 'poolTokenId'
}

export type Transaction = {
  id: Scalars['ID'];
  tx: Scalars['Bytes'];
  event?: Maybe<Scalars['String']>;
  block: Scalars['Int'];
  timestamp: Scalars['Int'];
  gasUsed: Scalars['BigDecimal'];
  gasPrice: Scalars['BigDecimal'];
  poolAddress?: Maybe<Pool>;
  userAddress?: Maybe<User>;
  action?: Maybe<SwapType>;
  sender?: Maybe<Scalars['Bytes']>;
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
  event?: Maybe<Scalars['String']>;
  event_not?: Maybe<Scalars['String']>;
  event_gt?: Maybe<Scalars['String']>;
  event_lt?: Maybe<Scalars['String']>;
  event_gte?: Maybe<Scalars['String']>;
  event_lte?: Maybe<Scalars['String']>;
  event_in?: Maybe<Array<Scalars['String']>>;
  event_not_in?: Maybe<Array<Scalars['String']>>;
  event_contains?: Maybe<Scalars['String']>;
  event_not_contains?: Maybe<Scalars['String']>;
  event_starts_with?: Maybe<Scalars['String']>;
  event_not_starts_with?: Maybe<Scalars['String']>;
  event_ends_with?: Maybe<Scalars['String']>;
  event_not_ends_with?: Maybe<Scalars['String']>;
  block?: Maybe<Scalars['Int']>;
  block_not?: Maybe<Scalars['Int']>;
  block_gt?: Maybe<Scalars['Int']>;
  block_lt?: Maybe<Scalars['Int']>;
  block_gte?: Maybe<Scalars['Int']>;
  block_lte?: Maybe<Scalars['Int']>;
  block_in?: Maybe<Array<Scalars['Int']>>;
  block_not_in?: Maybe<Array<Scalars['Int']>>;
  timestamp?: Maybe<Scalars['Int']>;
  timestamp_not?: Maybe<Scalars['Int']>;
  timestamp_gt?: Maybe<Scalars['Int']>;
  timestamp_lt?: Maybe<Scalars['Int']>;
  timestamp_gte?: Maybe<Scalars['Int']>;
  timestamp_lte?: Maybe<Scalars['Int']>;
  timestamp_in?: Maybe<Array<Scalars['Int']>>;
  timestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  gasUsed?: Maybe<Scalars['BigDecimal']>;
  gasUsed_not?: Maybe<Scalars['BigDecimal']>;
  gasUsed_gt?: Maybe<Scalars['BigDecimal']>;
  gasUsed_lt?: Maybe<Scalars['BigDecimal']>;
  gasUsed_gte?: Maybe<Scalars['BigDecimal']>;
  gasUsed_lte?: Maybe<Scalars['BigDecimal']>;
  gasUsed_in?: Maybe<Array<Scalars['BigDecimal']>>;
  gasUsed_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  gasPrice?: Maybe<Scalars['BigDecimal']>;
  gasPrice_not?: Maybe<Scalars['BigDecimal']>;
  gasPrice_gt?: Maybe<Scalars['BigDecimal']>;
  gasPrice_lt?: Maybe<Scalars['BigDecimal']>;
  gasPrice_gte?: Maybe<Scalars['BigDecimal']>;
  gasPrice_lte?: Maybe<Scalars['BigDecimal']>;
  gasPrice_in?: Maybe<Array<Scalars['BigDecimal']>>;
  gasPrice_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  poolAddress?: Maybe<Scalars['String']>;
  poolAddress_not?: Maybe<Scalars['String']>;
  poolAddress_gt?: Maybe<Scalars['String']>;
  poolAddress_lt?: Maybe<Scalars['String']>;
  poolAddress_gte?: Maybe<Scalars['String']>;
  poolAddress_lte?: Maybe<Scalars['String']>;
  poolAddress_in?: Maybe<Array<Scalars['String']>>;
  poolAddress_not_in?: Maybe<Array<Scalars['String']>>;
  poolAddress_contains?: Maybe<Scalars['String']>;
  poolAddress_not_contains?: Maybe<Scalars['String']>;
  poolAddress_starts_with?: Maybe<Scalars['String']>;
  poolAddress_not_starts_with?: Maybe<Scalars['String']>;
  poolAddress_ends_with?: Maybe<Scalars['String']>;
  poolAddress_not_ends_with?: Maybe<Scalars['String']>;
  userAddress?: Maybe<Scalars['String']>;
  userAddress_not?: Maybe<Scalars['String']>;
  userAddress_gt?: Maybe<Scalars['String']>;
  userAddress_lt?: Maybe<Scalars['String']>;
  userAddress_gte?: Maybe<Scalars['String']>;
  userAddress_lte?: Maybe<Scalars['String']>;
  userAddress_in?: Maybe<Array<Scalars['String']>>;
  userAddress_not_in?: Maybe<Array<Scalars['String']>>;
  userAddress_contains?: Maybe<Scalars['String']>;
  userAddress_not_contains?: Maybe<Scalars['String']>;
  userAddress_starts_with?: Maybe<Scalars['String']>;
  userAddress_not_starts_with?: Maybe<Scalars['String']>;
  userAddress_ends_with?: Maybe<Scalars['String']>;
  userAddress_not_ends_with?: Maybe<Scalars['String']>;
  action?: Maybe<SwapType>;
  action_not?: Maybe<SwapType>;
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
  Event = 'event',
  Block = 'block',
  Timestamp = 'timestamp',
  GasUsed = 'gasUsed',
  GasPrice = 'gasPrice',
  PoolAddress = 'poolAddress',
  UserAddress = 'userAddress',
  Action = 'action',
  Sender = 'sender'
}

export type User = {
  id: Scalars['ID'];
  sharesOwned?: Maybe<Array<PoolShare>>;
  txs?: Maybe<Array<Transaction>>;
  swaps?: Maybe<Array<Swap>>;
};


export type UserSharesOwnedArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PoolShare_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PoolShare_Filter>;
};


export type UserTxsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Transaction_Filter>;
};


export type UserSwapsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Swap_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Swap_Filter>;
};

export type User_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
};

export enum User_OrderBy {
  Id = 'id',
  SharesOwned = 'sharesOwned',
  Txs = 'txs',
  Swaps = 'swaps'
}

export type PoolDetailsFragment = (
  Pick<Pool, 'totalShares' | 'totalSwapVolume' | 'totalWeight' | 'swapFee'>
  & { address: Pool['id'] }
  & { tokens?: Maybe<Array<Pick<PoolToken, 'address' | 'balance' | 'decimals' | 'symbol' | 'denormWeight'>>> }
);

export type TokenPriceDetailsFragment = (
  Pick<TokenPrice, 'price' | 'decimals'>
  & { address: TokenPrice['id'] }
);

export type PoolsQueryVariables = {
  ids: Array<Scalars['ID']>;
};


export type PoolsQuery = { pools: Array<PoolDetailsFragment> };

export type TokenPricesQueryVariables = {
  tokens: Array<Scalars['ID']>;
};


export type TokenPricesQuery = { tokenPrices: Array<TokenPriceDetailsFragment> };

export type TokenPriceQueryVariables = {
  token: Scalars['ID'];
};


export type TokenPriceQuery = { tokenPrice?: Maybe<TokenPriceDetailsFragment> };

export const PoolDetailsFragmentDoc = gql`
    fragment PoolDetails on Pool {
  address: id
  totalShares
  totalSwapVolume
  totalWeight
  swapFee
  tokens {
    address
    balance
    decimals
    symbol
    denormWeight
  }
}
    `;
export const TokenPriceDetailsFragmentDoc = gql`
    fragment TokenPriceDetails on TokenPrice {
  address: id
  price
  decimals
}
    `;
export const PoolsDocument = gql`
    query Pools($ids: [ID!]!) @api(name: balancer) {
  pools(where: {id_in: $ids}) {
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
 *      ids: // value for 'ids'
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
export const TokenPricesDocument = gql`
    query TokenPrices($tokens: [ID!]!) @api(name: balancer) {
  tokenPrices(where: {id_in: $tokens}) {
    ...TokenPriceDetails
  }
}
    ${TokenPriceDetailsFragmentDoc}`;

/**
 * __useTokenPricesQuery__
 *
 * To run a query within a React component, call `useTokenPricesQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenPricesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenPricesQuery({
 *   variables: {
 *      tokens: // value for 'tokens'
 *   },
 * });
 */
export function useTokenPricesQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<TokenPricesQuery, TokenPricesQueryVariables>) {
        return ApolloReactHooks.useQuery<TokenPricesQuery, TokenPricesQueryVariables>(TokenPricesDocument, baseOptions);
      }
export function useTokenPricesLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TokenPricesQuery, TokenPricesQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<TokenPricesQuery, TokenPricesQueryVariables>(TokenPricesDocument, baseOptions);
        }
export type TokenPricesQueryHookResult = ReturnType<typeof useTokenPricesQuery>;
export type TokenPricesLazyQueryHookResult = ReturnType<typeof useTokenPricesLazyQuery>;
export type TokenPricesQueryResult = ApolloReactCommon.QueryResult<TokenPricesQuery, TokenPricesQueryVariables>;
export const TokenPriceDocument = gql`
    query TokenPrice($token: ID!) @api(name: balancer) {
  tokenPrice(id: $token) {
    ...TokenPriceDetails
  }
}
    ${TokenPriceDetailsFragmentDoc}`;

/**
 * __useTokenPriceQuery__
 *
 * To run a query within a React component, call `useTokenPriceQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokenPriceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokenPriceQuery({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useTokenPriceQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<TokenPriceQuery, TokenPriceQueryVariables>) {
        return ApolloReactHooks.useQuery<TokenPriceQuery, TokenPriceQueryVariables>(TokenPriceDocument, baseOptions);
      }
export function useTokenPriceLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<TokenPriceQuery, TokenPriceQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<TokenPriceQuery, TokenPriceQueryVariables>(TokenPriceDocument, baseOptions);
        }
export type TokenPriceQueryHookResult = ReturnType<typeof useTokenPriceQuery>;
export type TokenPriceLazyQueryHookResult = ReturnType<typeof useTokenPriceLazyQuery>;
export type TokenPriceQueryResult = ApolloReactCommon.QueryResult<TokenPriceQuery, TokenPriceQueryVariables>;