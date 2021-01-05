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



export type Block = {
  id: Scalars['ID'];
  number: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  parentHash?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
  difficulty?: Maybe<Scalars['BigInt']>;
  totalDifficulty?: Maybe<Scalars['BigInt']>;
  gasUsed?: Maybe<Scalars['BigInt']>;
  gasLimit?: Maybe<Scalars['BigInt']>;
  receiptsRoot?: Maybe<Scalars['String']>;
  transactionsRoot?: Maybe<Scalars['String']>;
  stateRoot?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['BigInt']>;
  unclesHash?: Maybe<Scalars['String']>;
};

export type Block_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  number?: Maybe<Scalars['BigInt']>;
  number_not?: Maybe<Scalars['BigInt']>;
  number_gt?: Maybe<Scalars['BigInt']>;
  number_lt?: Maybe<Scalars['BigInt']>;
  number_gte?: Maybe<Scalars['BigInt']>;
  number_lte?: Maybe<Scalars['BigInt']>;
  number_in?: Maybe<Array<Scalars['BigInt']>>;
  number_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  parentHash?: Maybe<Scalars['String']>;
  parentHash_not?: Maybe<Scalars['String']>;
  parentHash_gt?: Maybe<Scalars['String']>;
  parentHash_lt?: Maybe<Scalars['String']>;
  parentHash_gte?: Maybe<Scalars['String']>;
  parentHash_lte?: Maybe<Scalars['String']>;
  parentHash_in?: Maybe<Array<Scalars['String']>>;
  parentHash_not_in?: Maybe<Array<Scalars['String']>>;
  parentHash_contains?: Maybe<Scalars['String']>;
  parentHash_not_contains?: Maybe<Scalars['String']>;
  parentHash_starts_with?: Maybe<Scalars['String']>;
  parentHash_not_starts_with?: Maybe<Scalars['String']>;
  parentHash_ends_with?: Maybe<Scalars['String']>;
  parentHash_not_ends_with?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
  author_not?: Maybe<Scalars['String']>;
  author_gt?: Maybe<Scalars['String']>;
  author_lt?: Maybe<Scalars['String']>;
  author_gte?: Maybe<Scalars['String']>;
  author_lte?: Maybe<Scalars['String']>;
  author_in?: Maybe<Array<Scalars['String']>>;
  author_not_in?: Maybe<Array<Scalars['String']>>;
  author_contains?: Maybe<Scalars['String']>;
  author_not_contains?: Maybe<Scalars['String']>;
  author_starts_with?: Maybe<Scalars['String']>;
  author_not_starts_with?: Maybe<Scalars['String']>;
  author_ends_with?: Maybe<Scalars['String']>;
  author_not_ends_with?: Maybe<Scalars['String']>;
  difficulty?: Maybe<Scalars['BigInt']>;
  difficulty_not?: Maybe<Scalars['BigInt']>;
  difficulty_gt?: Maybe<Scalars['BigInt']>;
  difficulty_lt?: Maybe<Scalars['BigInt']>;
  difficulty_gte?: Maybe<Scalars['BigInt']>;
  difficulty_lte?: Maybe<Scalars['BigInt']>;
  difficulty_in?: Maybe<Array<Scalars['BigInt']>>;
  difficulty_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalDifficulty?: Maybe<Scalars['BigInt']>;
  totalDifficulty_not?: Maybe<Scalars['BigInt']>;
  totalDifficulty_gt?: Maybe<Scalars['BigInt']>;
  totalDifficulty_lt?: Maybe<Scalars['BigInt']>;
  totalDifficulty_gte?: Maybe<Scalars['BigInt']>;
  totalDifficulty_lte?: Maybe<Scalars['BigInt']>;
  totalDifficulty_in?: Maybe<Array<Scalars['BigInt']>>;
  totalDifficulty_not_in?: Maybe<Array<Scalars['BigInt']>>;
  gasUsed?: Maybe<Scalars['BigInt']>;
  gasUsed_not?: Maybe<Scalars['BigInt']>;
  gasUsed_gt?: Maybe<Scalars['BigInt']>;
  gasUsed_lt?: Maybe<Scalars['BigInt']>;
  gasUsed_gte?: Maybe<Scalars['BigInt']>;
  gasUsed_lte?: Maybe<Scalars['BigInt']>;
  gasUsed_in?: Maybe<Array<Scalars['BigInt']>>;
  gasUsed_not_in?: Maybe<Array<Scalars['BigInt']>>;
  gasLimit?: Maybe<Scalars['BigInt']>;
  gasLimit_not?: Maybe<Scalars['BigInt']>;
  gasLimit_gt?: Maybe<Scalars['BigInt']>;
  gasLimit_lt?: Maybe<Scalars['BigInt']>;
  gasLimit_gte?: Maybe<Scalars['BigInt']>;
  gasLimit_lte?: Maybe<Scalars['BigInt']>;
  gasLimit_in?: Maybe<Array<Scalars['BigInt']>>;
  gasLimit_not_in?: Maybe<Array<Scalars['BigInt']>>;
  receiptsRoot?: Maybe<Scalars['String']>;
  receiptsRoot_not?: Maybe<Scalars['String']>;
  receiptsRoot_gt?: Maybe<Scalars['String']>;
  receiptsRoot_lt?: Maybe<Scalars['String']>;
  receiptsRoot_gte?: Maybe<Scalars['String']>;
  receiptsRoot_lte?: Maybe<Scalars['String']>;
  receiptsRoot_in?: Maybe<Array<Scalars['String']>>;
  receiptsRoot_not_in?: Maybe<Array<Scalars['String']>>;
  receiptsRoot_contains?: Maybe<Scalars['String']>;
  receiptsRoot_not_contains?: Maybe<Scalars['String']>;
  receiptsRoot_starts_with?: Maybe<Scalars['String']>;
  receiptsRoot_not_starts_with?: Maybe<Scalars['String']>;
  receiptsRoot_ends_with?: Maybe<Scalars['String']>;
  receiptsRoot_not_ends_with?: Maybe<Scalars['String']>;
  transactionsRoot?: Maybe<Scalars['String']>;
  transactionsRoot_not?: Maybe<Scalars['String']>;
  transactionsRoot_gt?: Maybe<Scalars['String']>;
  transactionsRoot_lt?: Maybe<Scalars['String']>;
  transactionsRoot_gte?: Maybe<Scalars['String']>;
  transactionsRoot_lte?: Maybe<Scalars['String']>;
  transactionsRoot_in?: Maybe<Array<Scalars['String']>>;
  transactionsRoot_not_in?: Maybe<Array<Scalars['String']>>;
  transactionsRoot_contains?: Maybe<Scalars['String']>;
  transactionsRoot_not_contains?: Maybe<Scalars['String']>;
  transactionsRoot_starts_with?: Maybe<Scalars['String']>;
  transactionsRoot_not_starts_with?: Maybe<Scalars['String']>;
  transactionsRoot_ends_with?: Maybe<Scalars['String']>;
  transactionsRoot_not_ends_with?: Maybe<Scalars['String']>;
  stateRoot?: Maybe<Scalars['String']>;
  stateRoot_not?: Maybe<Scalars['String']>;
  stateRoot_gt?: Maybe<Scalars['String']>;
  stateRoot_lt?: Maybe<Scalars['String']>;
  stateRoot_gte?: Maybe<Scalars['String']>;
  stateRoot_lte?: Maybe<Scalars['String']>;
  stateRoot_in?: Maybe<Array<Scalars['String']>>;
  stateRoot_not_in?: Maybe<Array<Scalars['String']>>;
  stateRoot_contains?: Maybe<Scalars['String']>;
  stateRoot_not_contains?: Maybe<Scalars['String']>;
  stateRoot_starts_with?: Maybe<Scalars['String']>;
  stateRoot_not_starts_with?: Maybe<Scalars['String']>;
  stateRoot_ends_with?: Maybe<Scalars['String']>;
  stateRoot_not_ends_with?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['BigInt']>;
  size_not?: Maybe<Scalars['BigInt']>;
  size_gt?: Maybe<Scalars['BigInt']>;
  size_lt?: Maybe<Scalars['BigInt']>;
  size_gte?: Maybe<Scalars['BigInt']>;
  size_lte?: Maybe<Scalars['BigInt']>;
  size_in?: Maybe<Array<Scalars['BigInt']>>;
  size_not_in?: Maybe<Array<Scalars['BigInt']>>;
  unclesHash?: Maybe<Scalars['String']>;
  unclesHash_not?: Maybe<Scalars['String']>;
  unclesHash_gt?: Maybe<Scalars['String']>;
  unclesHash_lt?: Maybe<Scalars['String']>;
  unclesHash_gte?: Maybe<Scalars['String']>;
  unclesHash_lte?: Maybe<Scalars['String']>;
  unclesHash_in?: Maybe<Array<Scalars['String']>>;
  unclesHash_not_in?: Maybe<Array<Scalars['String']>>;
  unclesHash_contains?: Maybe<Scalars['String']>;
  unclesHash_not_contains?: Maybe<Scalars['String']>;
  unclesHash_starts_with?: Maybe<Scalars['String']>;
  unclesHash_not_starts_with?: Maybe<Scalars['String']>;
  unclesHash_ends_with?: Maybe<Scalars['String']>;
  unclesHash_not_ends_with?: Maybe<Scalars['String']>;
};

export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
};

export enum Block_OrderBy {
  Id = 'id',
  Number = 'number',
  Timestamp = 'timestamp',
  ParentHash = 'parentHash',
  Author = 'author',
  Difficulty = 'difficulty',
  TotalDifficulty = 'totalDifficulty',
  GasUsed = 'gasUsed',
  GasLimit = 'gasLimit',
  ReceiptsRoot = 'receiptsRoot',
  TransactionsRoot = 'transactionsRoot',
  StateRoot = 'stateRoot',
  Size = 'size',
  UnclesHash = 'unclesHash'
}


export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  block?: Maybe<Block>;
  blocks: Array<Block>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryBlockArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryBlocksArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Block_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Block_Filter>;
  block?: Maybe<Block_Height>;
};


export type Query_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type Subscription = {
  block?: Maybe<Block>;
  blocks: Array<Block>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionBlockArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionBlocksArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Block_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Block_Filter>;
  block?: Maybe<Block_Height>;
};


export type Subscription_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type BlockTimestampQueryVariables = {
  start: Scalars['BigInt'];
  end: Scalars['BigInt'];
};


export type BlockTimestampQuery = { blocks: Array<Pick<Block, 'number' | 'timestamp'>> };

export type BlockQueryVariables = {
  number: Scalars['BigInt'];
};


export type BlockQuery = { blocks: Array<Pick<Block, 'number' | 'timestamp'>> };


export const BlockTimestampDocument = gql`
    query BlockTimestamp($start: BigInt!, $end: BigInt!) @api(name: blocks) {
  blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: {timestamp_gt: $start, timestamp_lt: $end}) {
    number
    timestamp
  }
}
    `;

/**
 * __useBlockTimestampQuery__
 *
 * To run a query within a React component, call `useBlockTimestampQuery` and pass it any options that fit your needs.
 * When your component renders, `useBlockTimestampQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBlockTimestampQuery({
 *   variables: {
 *      start: // value for 'start'
 *      end: // value for 'end'
 *   },
 * });
 */
export function useBlockTimestampQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<BlockTimestampQuery, BlockTimestampQueryVariables>) {
        return ApolloReactHooks.useQuery<BlockTimestampQuery, BlockTimestampQueryVariables>(BlockTimestampDocument, baseOptions);
      }
export function useBlockTimestampLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<BlockTimestampQuery, BlockTimestampQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<BlockTimestampQuery, BlockTimestampQueryVariables>(BlockTimestampDocument, baseOptions);
        }
export type BlockTimestampQueryHookResult = ReturnType<typeof useBlockTimestampQuery>;
export type BlockTimestampLazyQueryHookResult = ReturnType<typeof useBlockTimestampLazyQuery>;
export type BlockTimestampQueryResult = ApolloReactCommon.QueryResult<BlockTimestampQuery, BlockTimestampQueryVariables>;
export const BlockDocument = gql`
    query Block($number: BigInt!) @api(name: blocks) {
  blocks(where: {number: $number}) {
    number
    timestamp
  }
}
    `;

/**
 * __useBlockQuery__
 *
 * To run a query within a React component, call `useBlockQuery` and pass it any options that fit your needs.
 * When your component renders, `useBlockQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBlockQuery({
 *   variables: {
 *      number: // value for 'number'
 *   },
 * });
 */
export function useBlockQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<BlockQuery, BlockQueryVariables>) {
        return ApolloReactHooks.useQuery<BlockQuery, BlockQueryVariables>(BlockDocument, baseOptions);
      }
export function useBlockLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<BlockQuery, BlockQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<BlockQuery, BlockQueryVariables>(BlockDocument, baseOptions);
        }
export type BlockQueryHookResult = ReturnType<typeof useBlockQuery>;
export type BlockLazyQueryHookResult = ReturnType<typeof useBlockLazyQuery>;
export type BlockQueryResult = ApolloReactCommon.QueryResult<BlockQuery, BlockQueryVariables>;