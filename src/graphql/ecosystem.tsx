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
        "name": "Transaction",
        "possibleTypes": [
          {
            "name": "StakingRewardsContractClaimRewardTransaction"
          },
          {
            "name": "StakingRewardsContractStakeTransaction"
          },
          {
            "name": "StakingRewardsContractWithdrawTransaction"
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



export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
};


export type Counter = {
  id: Scalars['ID'];
  /** Value of the counter; should be positive */
  value: Scalars['BigInt'];
};

export type Counter_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  value?: Maybe<Scalars['BigInt']>;
  value_not?: Maybe<Scalars['BigInt']>;
  value_gt?: Maybe<Scalars['BigInt']>;
  value_lt?: Maybe<Scalars['BigInt']>;
  value_gte?: Maybe<Scalars['BigInt']>;
  value_lte?: Maybe<Scalars['BigInt']>;
  value_in?: Maybe<Array<Scalars['BigInt']>>;
  value_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Counter_OrderBy {
  Id = 'id',
  Value = 'value'
}

export type MerkleDrop = {
  id: Scalars['ID'];
  token: Token;
  claims: Array<MerkleDropClaim>;
  tranches: Array<MerkleDropTranche>;
  funders: Array<Scalars['Bytes']>;
};


export type MerkleDropClaimsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerkleDropClaim_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerkleDropClaim_Filter>;
};


export type MerkleDropTranchesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerkleDropTranche_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerkleDropTranche_Filter>;
};

export type MerkleDrop_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
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
  funders?: Maybe<Array<Scalars['Bytes']>>;
  funders_not?: Maybe<Array<Scalars['Bytes']>>;
  funders_contains?: Maybe<Array<Scalars['Bytes']>>;
  funders_not_contains?: Maybe<Array<Scalars['Bytes']>>;
};

export enum MerkleDrop_OrderBy {
  Id = 'id',
  Token = 'token',
  Claims = 'claims',
  Tranches = 'tranches',
  Funders = 'funders'
}

export type MerkleDropClaim = {
  id: Scalars['ID'];
  account: Scalars['Bytes'];
  merkleDrop: MerkleDrop;
  tranche: MerkleDropTranche;
  balance: Scalars['BigInt'];
};

export type MerkleDropClaim_Filter = {
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
  merkleDrop?: Maybe<Scalars['String']>;
  merkleDrop_not?: Maybe<Scalars['String']>;
  merkleDrop_gt?: Maybe<Scalars['String']>;
  merkleDrop_lt?: Maybe<Scalars['String']>;
  merkleDrop_gte?: Maybe<Scalars['String']>;
  merkleDrop_lte?: Maybe<Scalars['String']>;
  merkleDrop_in?: Maybe<Array<Scalars['String']>>;
  merkleDrop_not_in?: Maybe<Array<Scalars['String']>>;
  merkleDrop_contains?: Maybe<Scalars['String']>;
  merkleDrop_not_contains?: Maybe<Scalars['String']>;
  merkleDrop_starts_with?: Maybe<Scalars['String']>;
  merkleDrop_not_starts_with?: Maybe<Scalars['String']>;
  merkleDrop_ends_with?: Maybe<Scalars['String']>;
  merkleDrop_not_ends_with?: Maybe<Scalars['String']>;
  tranche?: Maybe<Scalars['String']>;
  tranche_not?: Maybe<Scalars['String']>;
  tranche_gt?: Maybe<Scalars['String']>;
  tranche_lt?: Maybe<Scalars['String']>;
  tranche_gte?: Maybe<Scalars['String']>;
  tranche_lte?: Maybe<Scalars['String']>;
  tranche_in?: Maybe<Array<Scalars['String']>>;
  tranche_not_in?: Maybe<Array<Scalars['String']>>;
  tranche_contains?: Maybe<Scalars['String']>;
  tranche_not_contains?: Maybe<Scalars['String']>;
  tranche_starts_with?: Maybe<Scalars['String']>;
  tranche_not_starts_with?: Maybe<Scalars['String']>;
  tranche_ends_with?: Maybe<Scalars['String']>;
  tranche_not_ends_with?: Maybe<Scalars['String']>;
  balance?: Maybe<Scalars['BigInt']>;
  balance_not?: Maybe<Scalars['BigInt']>;
  balance_gt?: Maybe<Scalars['BigInt']>;
  balance_lt?: Maybe<Scalars['BigInt']>;
  balance_gte?: Maybe<Scalars['BigInt']>;
  balance_lte?: Maybe<Scalars['BigInt']>;
  balance_in?: Maybe<Array<Scalars['BigInt']>>;
  balance_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum MerkleDropClaim_OrderBy {
  Id = 'id',
  Account = 'account',
  MerkleDrop = 'merkleDrop',
  Tranche = 'tranche',
  Balance = 'balance'
}

export type MerkleDropTranche = {
  id: Scalars['ID'];
  merkleDrop: MerkleDrop;
  expired: Scalars['Boolean'];
  trancheNumber: Scalars['Int'];
  merkleRoot: Scalars['Bytes'];
  totalAmount: Scalars['BigInt'];
  claims: Array<MerkleDropClaim>;
};


export type MerkleDropTrancheClaimsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerkleDropClaim_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerkleDropClaim_Filter>;
};

export type MerkleDropTranche_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  merkleDrop?: Maybe<Scalars['String']>;
  merkleDrop_not?: Maybe<Scalars['String']>;
  merkleDrop_gt?: Maybe<Scalars['String']>;
  merkleDrop_lt?: Maybe<Scalars['String']>;
  merkleDrop_gte?: Maybe<Scalars['String']>;
  merkleDrop_lte?: Maybe<Scalars['String']>;
  merkleDrop_in?: Maybe<Array<Scalars['String']>>;
  merkleDrop_not_in?: Maybe<Array<Scalars['String']>>;
  merkleDrop_contains?: Maybe<Scalars['String']>;
  merkleDrop_not_contains?: Maybe<Scalars['String']>;
  merkleDrop_starts_with?: Maybe<Scalars['String']>;
  merkleDrop_not_starts_with?: Maybe<Scalars['String']>;
  merkleDrop_ends_with?: Maybe<Scalars['String']>;
  merkleDrop_not_ends_with?: Maybe<Scalars['String']>;
  expired?: Maybe<Scalars['Boolean']>;
  expired_not?: Maybe<Scalars['Boolean']>;
  expired_in?: Maybe<Array<Scalars['Boolean']>>;
  expired_not_in?: Maybe<Array<Scalars['Boolean']>>;
  trancheNumber?: Maybe<Scalars['Int']>;
  trancheNumber_not?: Maybe<Scalars['Int']>;
  trancheNumber_gt?: Maybe<Scalars['Int']>;
  trancheNumber_lt?: Maybe<Scalars['Int']>;
  trancheNumber_gte?: Maybe<Scalars['Int']>;
  trancheNumber_lte?: Maybe<Scalars['Int']>;
  trancheNumber_in?: Maybe<Array<Scalars['Int']>>;
  trancheNumber_not_in?: Maybe<Array<Scalars['Int']>>;
  merkleRoot?: Maybe<Scalars['Bytes']>;
  merkleRoot_not?: Maybe<Scalars['Bytes']>;
  merkleRoot_in?: Maybe<Array<Scalars['Bytes']>>;
  merkleRoot_not_in?: Maybe<Array<Scalars['Bytes']>>;
  merkleRoot_contains?: Maybe<Scalars['Bytes']>;
  merkleRoot_not_contains?: Maybe<Scalars['Bytes']>;
  totalAmount?: Maybe<Scalars['BigInt']>;
  totalAmount_not?: Maybe<Scalars['BigInt']>;
  totalAmount_gt?: Maybe<Scalars['BigInt']>;
  totalAmount_lt?: Maybe<Scalars['BigInt']>;
  totalAmount_gte?: Maybe<Scalars['BigInt']>;
  totalAmount_lte?: Maybe<Scalars['BigInt']>;
  totalAmount_in?: Maybe<Array<Scalars['BigInt']>>;
  totalAmount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum MerkleDropTranche_OrderBy {
  Id = 'id',
  MerkleDrop = 'merkleDrop',
  Expired = 'expired',
  TrancheNumber = 'trancheNumber',
  MerkleRoot = 'merkleRoot',
  TotalAmount = 'totalAmount',
  Claims = 'claims'
}

export type Metric = {
  id: Scalars['ID'];
  /** Exact value of the metric, i.e. in base units as an integer */
  exact: Scalars['BigInt'];
  /** Decimals used for the exact value (default: 18) */
  decimals: Scalars['Int'];
  /** Simple value of the metric, i.e. the exact value represented as a decimal */
  simple: Scalars['BigDecimal'];
};

export type Metric_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  exact?: Maybe<Scalars['BigInt']>;
  exact_not?: Maybe<Scalars['BigInt']>;
  exact_gt?: Maybe<Scalars['BigInt']>;
  exact_lt?: Maybe<Scalars['BigInt']>;
  exact_gte?: Maybe<Scalars['BigInt']>;
  exact_lte?: Maybe<Scalars['BigInt']>;
  exact_in?: Maybe<Array<Scalars['BigInt']>>;
  exact_not_in?: Maybe<Array<Scalars['BigInt']>>;
  decimals?: Maybe<Scalars['Int']>;
  decimals_not?: Maybe<Scalars['Int']>;
  decimals_gt?: Maybe<Scalars['Int']>;
  decimals_lt?: Maybe<Scalars['Int']>;
  decimals_gte?: Maybe<Scalars['Int']>;
  decimals_lte?: Maybe<Scalars['Int']>;
  decimals_in?: Maybe<Array<Scalars['Int']>>;
  decimals_not_in?: Maybe<Array<Scalars['Int']>>;
  simple?: Maybe<Scalars['BigDecimal']>;
  simple_not?: Maybe<Scalars['BigDecimal']>;
  simple_gt?: Maybe<Scalars['BigDecimal']>;
  simple_lt?: Maybe<Scalars['BigDecimal']>;
  simple_gte?: Maybe<Scalars['BigDecimal']>;
  simple_lte?: Maybe<Scalars['BigDecimal']>;
  simple_in?: Maybe<Array<Scalars['BigDecimal']>>;
  simple_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
};

export enum Metric_OrderBy {
  Id = 'id',
  Exact = 'exact',
  Decimals = 'decimals',
  Simple = 'simple'
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  token?: Maybe<Token>;
  tokens: Array<Token>;
  metric?: Maybe<Metric>;
  metrics: Array<Metric>;
  counter?: Maybe<Counter>;
  counters: Array<Counter>;
  rewardsDistributor?: Maybe<RewardsDistributor>;
  rewardsDistributors: Array<RewardsDistributor>;
  stakingReward?: Maybe<StakingReward>;
  stakingRewards: Array<StakingReward>;
  stakingRewardsContract?: Maybe<StakingRewardsContract>;
  stakingRewardsContracts: Array<StakingRewardsContract>;
  stakingBalance?: Maybe<StakingBalance>;
  stakingBalances: Array<StakingBalance>;
  merkleDropClaim?: Maybe<MerkleDropClaim>;
  merkleDropClaims: Array<MerkleDropClaim>;
  merkleDropTranche?: Maybe<MerkleDropTranche>;
  merkleDropTranches: Array<MerkleDropTranche>;
  merkleDrop?: Maybe<MerkleDrop>;
  merkleDrops: Array<MerkleDrop>;
  stakingRewardsContractClaimRewardTransaction?: Maybe<StakingRewardsContractClaimRewardTransaction>;
  stakingRewardsContractClaimRewardTransactions: Array<StakingRewardsContractClaimRewardTransaction>;
  stakingRewardsContractStakeTransaction?: Maybe<StakingRewardsContractStakeTransaction>;
  stakingRewardsContractStakeTransactions: Array<StakingRewardsContractStakeTransaction>;
  stakingRewardsContractWithdrawTransaction?: Maybe<StakingRewardsContractWithdrawTransaction>;
  stakingRewardsContractWithdrawTransactions: Array<StakingRewardsContractWithdrawTransaction>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
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


export type QueryMetricArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryMetricsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Metric_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Metric_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryCounterArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryCountersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Counter_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Counter_Filter>;
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


export type QueryMerkleDropClaimArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryMerkleDropClaimsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerkleDropClaim_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerkleDropClaim_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryMerkleDropTrancheArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryMerkleDropTranchesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerkleDropTranche_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerkleDropTranche_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryMerkleDropArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryMerkleDropsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerkleDrop_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerkleDrop_Filter>;
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


export type Query_MetaArgs = {
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
  FundManagers = 'fundManagers'
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
  Amount = 'amount'
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
  Type = 'type'
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


export type StakingRewardsContractClaimRewardTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewardsContractClaimRewardTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewardsContractClaimRewardTransaction_Filter>;
};


export type StakingRewardsContractStakeTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewardsContractStakeTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewardsContractStakeTransaction_Filter>;
};


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
  TotalPlatformRewards = 'totalPlatformRewards'
}

export type StakingRewardsContractClaimRewardTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  sender: Scalars['Bytes'];
  block: Scalars['Int'];
  timestamp: Scalars['BigInt'];
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
  hash?: Maybe<Scalars['Bytes']>;
  hash_not?: Maybe<Scalars['Bytes']>;
  hash_in?: Maybe<Array<Scalars['Bytes']>>;
  hash_not_in?: Maybe<Array<Scalars['Bytes']>>;
  hash_contains?: Maybe<Scalars['Bytes']>;
  hash_not_contains?: Maybe<Scalars['Bytes']>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  block?: Maybe<Scalars['Int']>;
  block_not?: Maybe<Scalars['Int']>;
  block_gt?: Maybe<Scalars['Int']>;
  block_lt?: Maybe<Scalars['Int']>;
  block_gte?: Maybe<Scalars['Int']>;
  block_lte?: Maybe<Scalars['Int']>;
  block_in?: Maybe<Array<Scalars['Int']>>;
  block_not_in?: Maybe<Array<Scalars['Int']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
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
  Hash = 'hash',
  Sender = 'sender',
  Block = 'block',
  Timestamp = 'timestamp',
  StakingRewardsContract = 'stakingRewardsContract',
  Amount = 'amount'
}

export type StakingRewardsContractStakeTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  sender: Scalars['Bytes'];
  block: Scalars['Int'];
  timestamp: Scalars['BigInt'];
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
  hash?: Maybe<Scalars['Bytes']>;
  hash_not?: Maybe<Scalars['Bytes']>;
  hash_in?: Maybe<Array<Scalars['Bytes']>>;
  hash_not_in?: Maybe<Array<Scalars['Bytes']>>;
  hash_contains?: Maybe<Scalars['Bytes']>;
  hash_not_contains?: Maybe<Scalars['Bytes']>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  block?: Maybe<Scalars['Int']>;
  block_not?: Maybe<Scalars['Int']>;
  block_gt?: Maybe<Scalars['Int']>;
  block_lt?: Maybe<Scalars['Int']>;
  block_gte?: Maybe<Scalars['Int']>;
  block_lte?: Maybe<Scalars['Int']>;
  block_in?: Maybe<Array<Scalars['Int']>>;
  block_not_in?: Maybe<Array<Scalars['Int']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
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
  Hash = 'hash',
  Sender = 'sender',
  Block = 'block',
  Timestamp = 'timestamp',
  StakingRewardsContract = 'stakingRewardsContract',
  Amount = 'amount'
}

export enum StakingRewardsContractType {
  StakingRewards = 'STAKING_REWARDS',
  StakingRewardsWithPlatformToken = 'STAKING_REWARDS_WITH_PLATFORM_TOKEN'
}

export type StakingRewardsContractWithdrawTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  sender: Scalars['Bytes'];
  block: Scalars['Int'];
  timestamp: Scalars['BigInt'];
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
  hash?: Maybe<Scalars['Bytes']>;
  hash_not?: Maybe<Scalars['Bytes']>;
  hash_in?: Maybe<Array<Scalars['Bytes']>>;
  hash_not_in?: Maybe<Array<Scalars['Bytes']>>;
  hash_contains?: Maybe<Scalars['Bytes']>;
  hash_not_contains?: Maybe<Scalars['Bytes']>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  block?: Maybe<Scalars['Int']>;
  block_not?: Maybe<Scalars['Int']>;
  block_gt?: Maybe<Scalars['Int']>;
  block_lt?: Maybe<Scalars['Int']>;
  block_gte?: Maybe<Scalars['Int']>;
  block_lte?: Maybe<Scalars['Int']>;
  block_in?: Maybe<Array<Scalars['Int']>>;
  block_not_in?: Maybe<Array<Scalars['Int']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
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
  Hash = 'hash',
  Sender = 'sender',
  Block = 'block',
  Timestamp = 'timestamp',
  StakingRewardsContract = 'stakingRewardsContract',
  Amount = 'amount'
}

export enum StakingRewardType {
  Reward = 'REWARD',
  PlatformReward = 'PLATFORM_REWARD'
}

export type Subscription = {
  token?: Maybe<Token>;
  tokens: Array<Token>;
  metric?: Maybe<Metric>;
  metrics: Array<Metric>;
  counter?: Maybe<Counter>;
  counters: Array<Counter>;
  rewardsDistributor?: Maybe<RewardsDistributor>;
  rewardsDistributors: Array<RewardsDistributor>;
  stakingReward?: Maybe<StakingReward>;
  stakingRewards: Array<StakingReward>;
  stakingRewardsContract?: Maybe<StakingRewardsContract>;
  stakingRewardsContracts: Array<StakingRewardsContract>;
  stakingBalance?: Maybe<StakingBalance>;
  stakingBalances: Array<StakingBalance>;
  merkleDropClaim?: Maybe<MerkleDropClaim>;
  merkleDropClaims: Array<MerkleDropClaim>;
  merkleDropTranche?: Maybe<MerkleDropTranche>;
  merkleDropTranches: Array<MerkleDropTranche>;
  merkleDrop?: Maybe<MerkleDrop>;
  merkleDrops: Array<MerkleDrop>;
  stakingRewardsContractClaimRewardTransaction?: Maybe<StakingRewardsContractClaimRewardTransaction>;
  stakingRewardsContractClaimRewardTransactions: Array<StakingRewardsContractClaimRewardTransaction>;
  stakingRewardsContractStakeTransaction?: Maybe<StakingRewardsContractStakeTransaction>;
  stakingRewardsContractStakeTransactions: Array<StakingRewardsContractStakeTransaction>;
  stakingRewardsContractWithdrawTransaction?: Maybe<StakingRewardsContractWithdrawTransaction>;
  stakingRewardsContractWithdrawTransactions: Array<StakingRewardsContractWithdrawTransaction>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
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


export type SubscriptionMetricArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionMetricsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Metric_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Metric_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionCounterArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionCountersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Counter_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Counter_Filter>;
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


export type SubscriptionMerkleDropClaimArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionMerkleDropClaimsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerkleDropClaim_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerkleDropClaim_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionMerkleDropTrancheArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionMerkleDropTranchesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerkleDropTranche_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerkleDropTranche_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionMerkleDropArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionMerkleDropsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerkleDrop_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerkleDrop_Filter>;
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


export type Subscription_MetaArgs = {
  block?: Maybe<Block_Height>;
};

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
  totalSupply: Metric;
  /** Total quantity of tokens burned */
  totalBurned: Metric;
  /** Total quantity of tokens minted */
  totalMinted: Metric;
  /** Count of transfer transactions */
  totalTransfers: Counter;
  /** Count of transfer transactions that minted the token */
  totalMints: Counter;
  /** Count of transfer transactions that burned the token */
  totalBurns: Counter;
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
  totalSupply?: Maybe<Scalars['String']>;
  totalSupply_not?: Maybe<Scalars['String']>;
  totalSupply_gt?: Maybe<Scalars['String']>;
  totalSupply_lt?: Maybe<Scalars['String']>;
  totalSupply_gte?: Maybe<Scalars['String']>;
  totalSupply_lte?: Maybe<Scalars['String']>;
  totalSupply_in?: Maybe<Array<Scalars['String']>>;
  totalSupply_not_in?: Maybe<Array<Scalars['String']>>;
  totalSupply_contains?: Maybe<Scalars['String']>;
  totalSupply_not_contains?: Maybe<Scalars['String']>;
  totalSupply_starts_with?: Maybe<Scalars['String']>;
  totalSupply_not_starts_with?: Maybe<Scalars['String']>;
  totalSupply_ends_with?: Maybe<Scalars['String']>;
  totalSupply_not_ends_with?: Maybe<Scalars['String']>;
  totalBurned?: Maybe<Scalars['String']>;
  totalBurned_not?: Maybe<Scalars['String']>;
  totalBurned_gt?: Maybe<Scalars['String']>;
  totalBurned_lt?: Maybe<Scalars['String']>;
  totalBurned_gte?: Maybe<Scalars['String']>;
  totalBurned_lte?: Maybe<Scalars['String']>;
  totalBurned_in?: Maybe<Array<Scalars['String']>>;
  totalBurned_not_in?: Maybe<Array<Scalars['String']>>;
  totalBurned_contains?: Maybe<Scalars['String']>;
  totalBurned_not_contains?: Maybe<Scalars['String']>;
  totalBurned_starts_with?: Maybe<Scalars['String']>;
  totalBurned_not_starts_with?: Maybe<Scalars['String']>;
  totalBurned_ends_with?: Maybe<Scalars['String']>;
  totalBurned_not_ends_with?: Maybe<Scalars['String']>;
  totalMinted?: Maybe<Scalars['String']>;
  totalMinted_not?: Maybe<Scalars['String']>;
  totalMinted_gt?: Maybe<Scalars['String']>;
  totalMinted_lt?: Maybe<Scalars['String']>;
  totalMinted_gte?: Maybe<Scalars['String']>;
  totalMinted_lte?: Maybe<Scalars['String']>;
  totalMinted_in?: Maybe<Array<Scalars['String']>>;
  totalMinted_not_in?: Maybe<Array<Scalars['String']>>;
  totalMinted_contains?: Maybe<Scalars['String']>;
  totalMinted_not_contains?: Maybe<Scalars['String']>;
  totalMinted_starts_with?: Maybe<Scalars['String']>;
  totalMinted_not_starts_with?: Maybe<Scalars['String']>;
  totalMinted_ends_with?: Maybe<Scalars['String']>;
  totalMinted_not_ends_with?: Maybe<Scalars['String']>;
  totalTransfers?: Maybe<Scalars['String']>;
  totalTransfers_not?: Maybe<Scalars['String']>;
  totalTransfers_gt?: Maybe<Scalars['String']>;
  totalTransfers_lt?: Maybe<Scalars['String']>;
  totalTransfers_gte?: Maybe<Scalars['String']>;
  totalTransfers_lte?: Maybe<Scalars['String']>;
  totalTransfers_in?: Maybe<Array<Scalars['String']>>;
  totalTransfers_not_in?: Maybe<Array<Scalars['String']>>;
  totalTransfers_contains?: Maybe<Scalars['String']>;
  totalTransfers_not_contains?: Maybe<Scalars['String']>;
  totalTransfers_starts_with?: Maybe<Scalars['String']>;
  totalTransfers_not_starts_with?: Maybe<Scalars['String']>;
  totalTransfers_ends_with?: Maybe<Scalars['String']>;
  totalTransfers_not_ends_with?: Maybe<Scalars['String']>;
  totalMints?: Maybe<Scalars['String']>;
  totalMints_not?: Maybe<Scalars['String']>;
  totalMints_gt?: Maybe<Scalars['String']>;
  totalMints_lt?: Maybe<Scalars['String']>;
  totalMints_gte?: Maybe<Scalars['String']>;
  totalMints_lte?: Maybe<Scalars['String']>;
  totalMints_in?: Maybe<Array<Scalars['String']>>;
  totalMints_not_in?: Maybe<Array<Scalars['String']>>;
  totalMints_contains?: Maybe<Scalars['String']>;
  totalMints_not_contains?: Maybe<Scalars['String']>;
  totalMints_starts_with?: Maybe<Scalars['String']>;
  totalMints_not_starts_with?: Maybe<Scalars['String']>;
  totalMints_ends_with?: Maybe<Scalars['String']>;
  totalMints_not_ends_with?: Maybe<Scalars['String']>;
  totalBurns?: Maybe<Scalars['String']>;
  totalBurns_not?: Maybe<Scalars['String']>;
  totalBurns_gt?: Maybe<Scalars['String']>;
  totalBurns_lt?: Maybe<Scalars['String']>;
  totalBurns_gte?: Maybe<Scalars['String']>;
  totalBurns_lte?: Maybe<Scalars['String']>;
  totalBurns_in?: Maybe<Array<Scalars['String']>>;
  totalBurns_not_in?: Maybe<Array<Scalars['String']>>;
  totalBurns_contains?: Maybe<Scalars['String']>;
  totalBurns_not_contains?: Maybe<Scalars['String']>;
  totalBurns_starts_with?: Maybe<Scalars['String']>;
  totalBurns_not_starts_with?: Maybe<Scalars['String']>;
  totalBurns_ends_with?: Maybe<Scalars['String']>;
  totalBurns_not_ends_with?: Maybe<Scalars['String']>;
};

export enum Token_OrderBy {
  Id = 'id',
  Address = 'address',
  Decimals = 'decimals',
  Name = 'name',
  Symbol = 'symbol',
  TotalSupply = 'totalSupply',
  TotalBurned = 'totalBurned',
  TotalMinted = 'totalMinted',
  TotalTransfers = 'totalTransfers',
  TotalMints = 'totalMints',
  TotalBurns = 'totalBurns'
}

export type Transaction = {
  /** Transaction hash + log index */
  id: Scalars['ID'];
  /** Transaction hash */
  hash: Scalars['Bytes'];
  /** Block number the transaction is in */
  block: Scalars['Int'];
  /** Timestamp of the block the transaction is in */
  timestamp: Scalars['BigInt'];
  /** Address of the sender of the transaction */
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
  hash?: Maybe<Scalars['Bytes']>;
  hash_not?: Maybe<Scalars['Bytes']>;
  hash_in?: Maybe<Array<Scalars['Bytes']>>;
  hash_not_in?: Maybe<Array<Scalars['Bytes']>>;
  hash_contains?: Maybe<Scalars['Bytes']>;
  hash_not_contains?: Maybe<Scalars['Bytes']>;
  block?: Maybe<Scalars['Int']>;
  block_not?: Maybe<Scalars['Int']>;
  block_gt?: Maybe<Scalars['Int']>;
  block_lt?: Maybe<Scalars['Int']>;
  block_gte?: Maybe<Scalars['Int']>;
  block_lte?: Maybe<Scalars['Int']>;
  block_in?: Maybe<Array<Scalars['Int']>>;
  block_not_in?: Maybe<Array<Scalars['Int']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum Transaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Timestamp = 'timestamp',
  Sender = 'sender'
}

export type TokenDetailsFragment = (
  Pick<Token, 'id' | 'address' | 'decimals' | 'symbol'>
  & { totalSupply: Pick<Metric, 'exact' | 'simple' | 'decimals'> }
);

export type StakingRewardsContractDetailsFragment = (
  Pick<StakingRewardsContract, 'id' | 'type' | 'duration' | 'lastUpdateTime' | 'periodFinish' | 'rewardRate' | 'rewardPerTokenStored' | 'platformRewardPerTokenStored' | 'platformRewardRate' | 'totalSupply' | 'totalStakingRewards' | 'totalPlatformRewards'>
  & { address: StakingRewardsContract['id'] }
  & { stakingToken: (
    { totalSupply: Pick<Metric, 'exact' | 'decimals' | 'simple'> }
    & TokenDetailsFragment
  ), rewardsToken: TokenDetailsFragment, platformToken?: Maybe<TokenDetailsFragment> }
);

export type AllErc20TokensQueryVariables = {};


export type AllErc20TokensQuery = { tokens: Array<TokenDetailsFragment> };

export type StakingRewardsContractQueryVariables = {
  id: Scalars['ID'];
  account?: Maybe<Scalars['Bytes']>;
};


export type StakingRewardsContractQuery = { stakingRewardsContract?: Maybe<(
    { stakingBalances: Array<Pick<StakingBalance, 'amount'>>, stakingRewards: Array<Pick<StakingReward, 'amount' | 'amountPerTokenPaid'>> }
    & StakingRewardsContractDetailsFragment
  )> };

export type StakingRewardsContractsQueryVariables = {
  account?: Maybe<Scalars['Bytes']>;
};


export type StakingRewardsContractsQuery = { stakingRewardsContracts: Array<(
    { stakingBalances: Array<Pick<StakingBalance, 'amount'>>, stakingRewards: Array<Pick<StakingReward, 'amount' | 'amountPerTokenPaid'>>, platformRewards: Array<Pick<StakingReward, 'amount' | 'amountPerTokenPaid'>> }
    & StakingRewardsContractDetailsFragment
  )> };

export type RewardsDistributorQueryVariables = {};


export type RewardsDistributorQuery = { rewardsDistributors: Array<Pick<RewardsDistributor, 'id' | 'fundManagers'>> };

export type ScriptRewardsQueryVariables = {
  id: Scalars['ID'];
  end: Scalars['BigInt'];
  block?: Maybe<Block_Height>;
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type ScriptRewardsQuery = { stakingRewardsContracts: Array<(
    Pick<StakingRewardsContract, 'lastUpdateTime' | 'periodFinish' | 'rewardPerTokenStored' | 'rewardRate' | 'totalSupply'>
    & { address: StakingRewardsContract['id'] }
    & { stakingRewards: Array<Pick<StakingReward, 'amount' | 'account' | 'amountPerTokenPaid'>>, stakingBalances: Array<Pick<StakingBalance, 'amount' | 'account'>>, claimRewardTransactions: Array<Pick<StakingRewardsContractClaimRewardTransaction, 'amount' | 'sender'>> }
  )> };

export type MerkleDropClaimsQueryVariables = {
  account: Scalars['Bytes'];
};


export type MerkleDropClaimsQuery = { merkleDrops: Array<(
    Pick<MerkleDrop, 'id'>
    & { token: Pick<Token, 'id' | 'address' | 'decimals' | 'symbol'>, tranches: Array<(
      Pick<MerkleDropTranche, 'trancheNumber' | 'totalAmount'>
      & { claims: Array<Pick<MerkleDropClaim, 'balance'>> }
    )> }
  )> };

export const TokenDetailsFragmentDoc = gql`
    fragment TokenDetails on Token {
  id
  address
  decimals
  symbol
  totalSupply {
    exact
    simple
    decimals
  }
}
    `;
export const StakingRewardsContractDetailsFragmentDoc = gql`
    fragment StakingRewardsContractDetails on StakingRewardsContract {
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
    totalSupply {
      exact
      decimals
      simple
    }
    ...TokenDetails
  }
  rewardsToken {
    ...TokenDetails
  }
  platformToken {
    ...TokenDetails
  }
}
    ${TokenDetailsFragmentDoc}`;
export const AllErc20TokensDocument = gql`
    query AllErc20Tokens @api(name: ecosystem) {
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
export const StakingRewardsContractDocument = gql`
    query StakingRewardsContract($id: ID!, $account: Bytes) @api(name: ecosystem) {
  stakingRewardsContract(id: $id) {
    ...StakingRewardsContractDetails
    stakingBalances(where: {account: $account}) {
      amount
    }
    stakingRewards: stakingRewards(where: {account: $account, type: REWARD}) {
      amount
      amountPerTokenPaid
    }
  }
}
    ${StakingRewardsContractDetailsFragmentDoc}`;

/**
 * __useStakingRewardsContractQuery__
 *
 * To run a query within a React component, call `useStakingRewardsContractQuery` and pass it any options that fit your needs.
 * When your component renders, `useStakingRewardsContractQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStakingRewardsContractQuery({
 *   variables: {
 *      id: // value for 'id'
 *      account: // value for 'account'
 *   },
 * });
 */
export function useStakingRewardsContractQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<StakingRewardsContractQuery, StakingRewardsContractQueryVariables>) {
        return ApolloReactHooks.useQuery<StakingRewardsContractQuery, StakingRewardsContractQueryVariables>(StakingRewardsContractDocument, baseOptions);
      }
export function useStakingRewardsContractLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<StakingRewardsContractQuery, StakingRewardsContractQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<StakingRewardsContractQuery, StakingRewardsContractQueryVariables>(StakingRewardsContractDocument, baseOptions);
        }
export type StakingRewardsContractQueryHookResult = ReturnType<typeof useStakingRewardsContractQuery>;
export type StakingRewardsContractLazyQueryHookResult = ReturnType<typeof useStakingRewardsContractLazyQuery>;
export type StakingRewardsContractQueryResult = ApolloReactCommon.QueryResult<StakingRewardsContractQuery, StakingRewardsContractQueryVariables>;
export const StakingRewardsContractsDocument = gql`
    query StakingRewardsContracts($account: Bytes) @api(name: ecosystem) {
  stakingRewardsContracts {
    ...StakingRewardsContractDetails
    stakingBalances(where: {account: $account}) {
      amount
    }
    stakingRewards: stakingRewards(where: {account: $account, type: REWARD}) {
      amount
      amountPerTokenPaid
    }
    platformRewards: stakingRewards(where: {account: $account, type: PLATFORM_REWARD}) {
      amount
      amountPerTokenPaid
    }
  }
}
    ${StakingRewardsContractDetailsFragmentDoc}`;

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
 *   },
 * });
 */
export function useStakingRewardsContractsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<StakingRewardsContractsQuery, StakingRewardsContractsQueryVariables>) {
        return ApolloReactHooks.useQuery<StakingRewardsContractsQuery, StakingRewardsContractsQueryVariables>(StakingRewardsContractsDocument, baseOptions);
      }
export function useStakingRewardsContractsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<StakingRewardsContractsQuery, StakingRewardsContractsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<StakingRewardsContractsQuery, StakingRewardsContractsQueryVariables>(StakingRewardsContractsDocument, baseOptions);
        }
export type StakingRewardsContractsQueryHookResult = ReturnType<typeof useStakingRewardsContractsQuery>;
export type StakingRewardsContractsLazyQueryHookResult = ReturnType<typeof useStakingRewardsContractsLazyQuery>;
export type StakingRewardsContractsQueryResult = ApolloReactCommon.QueryResult<StakingRewardsContractsQuery, StakingRewardsContractsQueryVariables>;
export const RewardsDistributorDocument = gql`
    query RewardsDistributor @api(name: ecosystem) {
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
export const ScriptRewardsDocument = gql`
    query ScriptRewards($id: ID!, $end: BigInt!, $block: Block_height, $limit: Int!, $offset: Int!) @api(name: ecosystem) {
  stakingRewardsContracts(where: {id: $id}, block: $block) {
    address: id
    lastUpdateTime
    periodFinish
    rewardPerTokenStored
    rewardRate
    totalSupply
    stakingRewards(where: {type: REWARD}, first: $limit, skip: $offset) {
      amount
      account
      amountPerTokenPaid
    }
    stakingBalances(first: $limit, skip: $offset) {
      amount
      account
    }
    claimRewardTransactions(first: $limit, skip: $offset, orderBy: timestamp, orderDirection: asc, where: {timestamp_lt: $end}) {
      amount
      sender
    }
  }
}
    `;

/**
 * __useScriptRewardsQuery__
 *
 * To run a query within a React component, call `useScriptRewardsQuery` and pass it any options that fit your needs.
 * When your component renders, `useScriptRewardsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScriptRewardsQuery({
 *   variables: {
 *      id: // value for 'id'
 *      end: // value for 'end'
 *      block: // value for 'block'
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *   },
 * });
 */
export function useScriptRewardsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<ScriptRewardsQuery, ScriptRewardsQueryVariables>) {
        return ApolloReactHooks.useQuery<ScriptRewardsQuery, ScriptRewardsQueryVariables>(ScriptRewardsDocument, baseOptions);
      }
export function useScriptRewardsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<ScriptRewardsQuery, ScriptRewardsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<ScriptRewardsQuery, ScriptRewardsQueryVariables>(ScriptRewardsDocument, baseOptions);
        }
export type ScriptRewardsQueryHookResult = ReturnType<typeof useScriptRewardsQuery>;
export type ScriptRewardsLazyQueryHookResult = ReturnType<typeof useScriptRewardsLazyQuery>;
export type ScriptRewardsQueryResult = ApolloReactCommon.QueryResult<ScriptRewardsQuery, ScriptRewardsQueryVariables>;
export const MerkleDropClaimsDocument = gql`
    query MerkleDropClaims($account: Bytes!) @api(name: ecosystem) {
  merkleDrops {
    id
    token {
      id
      address
      decimals
      symbol
    }
    tranches(orderDirection: asc, orderBy: trancheNumber, where: {expired: false}) {
      trancheNumber
      totalAmount
      claims(where: {account: $account}) {
        balance
      }
    }
  }
}
    `;

/**
 * __useMerkleDropClaimsQuery__
 *
 * To run a query within a React component, call `useMerkleDropClaimsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMerkleDropClaimsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMerkleDropClaimsQuery({
 *   variables: {
 *      account: // value for 'account'
 *   },
 * });
 */
export function useMerkleDropClaimsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MerkleDropClaimsQuery, MerkleDropClaimsQueryVariables>) {
        return ApolloReactHooks.useQuery<MerkleDropClaimsQuery, MerkleDropClaimsQueryVariables>(MerkleDropClaimsDocument, baseOptions);
      }
export function useMerkleDropClaimsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MerkleDropClaimsQuery, MerkleDropClaimsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<MerkleDropClaimsQuery, MerkleDropClaimsQueryVariables>(MerkleDropClaimsDocument, baseOptions);
        }
export type MerkleDropClaimsQueryHookResult = ReturnType<typeof useMerkleDropClaimsQuery>;
export type MerkleDropClaimsLazyQueryHookResult = ReturnType<typeof useMerkleDropClaimsLazyQuery>;
export type MerkleDropClaimsQueryResult = ApolloReactCommon.QueryResult<MerkleDropClaimsQuery, MerkleDropClaimsQueryVariables>;