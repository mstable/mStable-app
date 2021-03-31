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
            "name": "FPMintMultiTransaction"
          },
          {
            "name": "FPMintSingleTransaction"
          },
          {
            "name": "FPRedeemTransaction"
          },
          {
            "name": "FPSwapTransaction"
          },
          {
            "name": "BoostedSavingsVaultStakeTransaction"
          },
          {
            "name": "BoostedSavingsVaultRewardPaidTransaction"
          },
          {
            "name": "BoostedSavingsVaultWithdrawTransaction"
          },
          {
            "name": "BoostedSavingsVaultRewardAddedTransaction"
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

export type Account = {
  id: Scalars['ID'];
  boostedSavingsVaultAccounts: Array<BoostedSavingsVaultAccount>;
  feederPoolAccounts: Array<FeederPoolAccount>;
  boostDirection: Array<BoostedSavingsVault>;
};


export type AccountBoostedSavingsVaultAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultAccount_Filter>;
};


export type AccountFeederPoolAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FeederPoolAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FeederPoolAccount_Filter>;
};


export type AccountBoostDirectionArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVault_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVault_Filter>;
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
  boostDirection?: Maybe<Array<Scalars['String']>>;
  boostDirection_not?: Maybe<Array<Scalars['String']>>;
  boostDirection_contains?: Maybe<Array<Scalars['String']>>;
  boostDirection_not_contains?: Maybe<Array<Scalars['String']>>;
};

export enum Account_OrderBy {
  Id = 'id',
  BoostedSavingsVaultAccounts = 'boostedSavingsVaultAccounts',
  FeederPoolAccounts = 'feederPoolAccounts',
  BoostDirection = 'boostDirection'
}

/**
 * Amplification value; amplifies the rate of change of the curve.
 * Lower A = higher rate of change = higher slippage.
 */
export type AmpData = {
  id: Scalars['ID'];
  currentA: Scalars['BigInt'];
  targetA: Scalars['BigInt'];
  startTime: Scalars['BigInt'];
  rampEndTime: Scalars['BigInt'];
};

export type AmpData_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  currentA?: Maybe<Scalars['BigInt']>;
  currentA_not?: Maybe<Scalars['BigInt']>;
  currentA_gt?: Maybe<Scalars['BigInt']>;
  currentA_lt?: Maybe<Scalars['BigInt']>;
  currentA_gte?: Maybe<Scalars['BigInt']>;
  currentA_lte?: Maybe<Scalars['BigInt']>;
  currentA_in?: Maybe<Array<Scalars['BigInt']>>;
  currentA_not_in?: Maybe<Array<Scalars['BigInt']>>;
  targetA?: Maybe<Scalars['BigInt']>;
  targetA_not?: Maybe<Scalars['BigInt']>;
  targetA_gt?: Maybe<Scalars['BigInt']>;
  targetA_lt?: Maybe<Scalars['BigInt']>;
  targetA_gte?: Maybe<Scalars['BigInt']>;
  targetA_lte?: Maybe<Scalars['BigInt']>;
  targetA_in?: Maybe<Array<Scalars['BigInt']>>;
  targetA_not_in?: Maybe<Array<Scalars['BigInt']>>;
  startTime?: Maybe<Scalars['BigInt']>;
  startTime_not?: Maybe<Scalars['BigInt']>;
  startTime_gt?: Maybe<Scalars['BigInt']>;
  startTime_lt?: Maybe<Scalars['BigInt']>;
  startTime_gte?: Maybe<Scalars['BigInt']>;
  startTime_lte?: Maybe<Scalars['BigInt']>;
  startTime_in?: Maybe<Array<Scalars['BigInt']>>;
  startTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  rampEndTime?: Maybe<Scalars['BigInt']>;
  rampEndTime_not?: Maybe<Scalars['BigInt']>;
  rampEndTime_gt?: Maybe<Scalars['BigInt']>;
  rampEndTime_lt?: Maybe<Scalars['BigInt']>;
  rampEndTime_gte?: Maybe<Scalars['BigInt']>;
  rampEndTime_lte?: Maybe<Scalars['BigInt']>;
  rampEndTime_in?: Maybe<Array<Scalars['BigInt']>>;
  rampEndTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum AmpData_OrderBy {
  Id = 'id',
  CurrentA = 'currentA',
  TargetA = 'targetA',
  StartTime = 'startTime',
  RampEndTime = 'rampEndTime'
}

/** A Basket of Bassets */
export type Basket = {
  id: Scalars['ID'];
  /** The Bassets in the Basket */
  bassets: Array<Basset>;
  /** The collateralisation ratio of the Basket (mUSD only) */
  collateralisationRatio?: Maybe<Scalars['BigInt']>;
  /** Max number of Bassets that can be present in the Basket */
  maxBassets: Scalars['Int'];
  /** Flag for whether the Basket has failed */
  undergoingRecol: Scalars['Boolean'];
  /** Flag for whether the Basket has failed */
  failed: Scalars['Boolean'];
  /** FeederPool the Basket belongs to */
  feederPool?: Maybe<FeederPool>;
};


/** A Basket of Bassets */
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
  FeederPool = 'feederPool'
}

/** Basket Asset (e.g. DAI for the mUSD basket) */
export type Basset = {
  /** Address of the Basset token contract */
  id: Scalars['ID'];
  /** If a main pool asset, the Masset the Basset is associated with (optional) */
  masset?: Maybe<Token>;
  /** Target weight of the Basset (mUSD only) */
  maxWeight?: Maybe<Scalars['BigInt']>;
  /** Basset to Masset ratio for quantity conversion */
  ratio: Scalars['BigInt'];
  /** Flag that is set when the bAsset is removed from the basket (and unset when added) */
  removed: Scalars['Boolean'];
  /** Status of the Basset, e.g. 'Normal' */
  status: Scalars['String'];
  /** An ERC20 can charge transfer fee, e.g. USDT or DGX tokens */
  isTransferFeeCharged: Scalars['Boolean'];
  /** The underlying Token for the Basset */
  token: Token;
  /** Amount of the Basset that is held in collateral */
  vaultBalance: Metric;
  /** Total number of mint transactions in which the Basset was an input */
  totalMints: Counter;
  /** Total number of swap transactions in which the Basset was an input */
  totalSwapsAsInput: Counter;
  /** Total number of swap transactions in which the Basset was an output */
  totalSwapsAsOutput: Counter;
  /** Total number of redemption transactions in which the Basset was an output */
  totalRedemptions: Counter;
  /** Total supply of the Basset token */
  totalSupply: Metric;
  /** Cumulative amount of the Basset that was used in mint transactions as input */
  cumulativeMinted: Metric;
  /** Cumulative amount of the Basset that was used in swap transactions as output */
  cumulativeSwappedAsOutput: Metric;
  /** Cumulative amount of the Basset that was used in redemption transactions as output (excluding proportional redemption) */
  cumulativeRedeemed: Metric;
  /** Cumulative amount of fees paid (e.g. for swaps and redemptions) using this Basset */
  cumulativeFeesPaid: Metric;
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
  removed?: Maybe<Scalars['Boolean']>;
  removed_not?: Maybe<Scalars['Boolean']>;
  removed_in?: Maybe<Array<Scalars['Boolean']>>;
  removed_not_in?: Maybe<Array<Scalars['Boolean']>>;
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
  vaultBalance?: Maybe<Scalars['String']>;
  vaultBalance_not?: Maybe<Scalars['String']>;
  vaultBalance_gt?: Maybe<Scalars['String']>;
  vaultBalance_lt?: Maybe<Scalars['String']>;
  vaultBalance_gte?: Maybe<Scalars['String']>;
  vaultBalance_lte?: Maybe<Scalars['String']>;
  vaultBalance_in?: Maybe<Array<Scalars['String']>>;
  vaultBalance_not_in?: Maybe<Array<Scalars['String']>>;
  vaultBalance_contains?: Maybe<Scalars['String']>;
  vaultBalance_not_contains?: Maybe<Scalars['String']>;
  vaultBalance_starts_with?: Maybe<Scalars['String']>;
  vaultBalance_not_starts_with?: Maybe<Scalars['String']>;
  vaultBalance_ends_with?: Maybe<Scalars['String']>;
  vaultBalance_not_ends_with?: Maybe<Scalars['String']>;
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
  totalSwapsAsInput?: Maybe<Scalars['String']>;
  totalSwapsAsInput_not?: Maybe<Scalars['String']>;
  totalSwapsAsInput_gt?: Maybe<Scalars['String']>;
  totalSwapsAsInput_lt?: Maybe<Scalars['String']>;
  totalSwapsAsInput_gte?: Maybe<Scalars['String']>;
  totalSwapsAsInput_lte?: Maybe<Scalars['String']>;
  totalSwapsAsInput_in?: Maybe<Array<Scalars['String']>>;
  totalSwapsAsInput_not_in?: Maybe<Array<Scalars['String']>>;
  totalSwapsAsInput_contains?: Maybe<Scalars['String']>;
  totalSwapsAsInput_not_contains?: Maybe<Scalars['String']>;
  totalSwapsAsInput_starts_with?: Maybe<Scalars['String']>;
  totalSwapsAsInput_not_starts_with?: Maybe<Scalars['String']>;
  totalSwapsAsInput_ends_with?: Maybe<Scalars['String']>;
  totalSwapsAsInput_not_ends_with?: Maybe<Scalars['String']>;
  totalSwapsAsOutput?: Maybe<Scalars['String']>;
  totalSwapsAsOutput_not?: Maybe<Scalars['String']>;
  totalSwapsAsOutput_gt?: Maybe<Scalars['String']>;
  totalSwapsAsOutput_lt?: Maybe<Scalars['String']>;
  totalSwapsAsOutput_gte?: Maybe<Scalars['String']>;
  totalSwapsAsOutput_lte?: Maybe<Scalars['String']>;
  totalSwapsAsOutput_in?: Maybe<Array<Scalars['String']>>;
  totalSwapsAsOutput_not_in?: Maybe<Array<Scalars['String']>>;
  totalSwapsAsOutput_contains?: Maybe<Scalars['String']>;
  totalSwapsAsOutput_not_contains?: Maybe<Scalars['String']>;
  totalSwapsAsOutput_starts_with?: Maybe<Scalars['String']>;
  totalSwapsAsOutput_not_starts_with?: Maybe<Scalars['String']>;
  totalSwapsAsOutput_ends_with?: Maybe<Scalars['String']>;
  totalSwapsAsOutput_not_ends_with?: Maybe<Scalars['String']>;
  totalRedemptions?: Maybe<Scalars['String']>;
  totalRedemptions_not?: Maybe<Scalars['String']>;
  totalRedemptions_gt?: Maybe<Scalars['String']>;
  totalRedemptions_lt?: Maybe<Scalars['String']>;
  totalRedemptions_gte?: Maybe<Scalars['String']>;
  totalRedemptions_lte?: Maybe<Scalars['String']>;
  totalRedemptions_in?: Maybe<Array<Scalars['String']>>;
  totalRedemptions_not_in?: Maybe<Array<Scalars['String']>>;
  totalRedemptions_contains?: Maybe<Scalars['String']>;
  totalRedemptions_not_contains?: Maybe<Scalars['String']>;
  totalRedemptions_starts_with?: Maybe<Scalars['String']>;
  totalRedemptions_not_starts_with?: Maybe<Scalars['String']>;
  totalRedemptions_ends_with?: Maybe<Scalars['String']>;
  totalRedemptions_not_ends_with?: Maybe<Scalars['String']>;
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
  cumulativeMinted?: Maybe<Scalars['String']>;
  cumulativeMinted_not?: Maybe<Scalars['String']>;
  cumulativeMinted_gt?: Maybe<Scalars['String']>;
  cumulativeMinted_lt?: Maybe<Scalars['String']>;
  cumulativeMinted_gte?: Maybe<Scalars['String']>;
  cumulativeMinted_lte?: Maybe<Scalars['String']>;
  cumulativeMinted_in?: Maybe<Array<Scalars['String']>>;
  cumulativeMinted_not_in?: Maybe<Array<Scalars['String']>>;
  cumulativeMinted_contains?: Maybe<Scalars['String']>;
  cumulativeMinted_not_contains?: Maybe<Scalars['String']>;
  cumulativeMinted_starts_with?: Maybe<Scalars['String']>;
  cumulativeMinted_not_starts_with?: Maybe<Scalars['String']>;
  cumulativeMinted_ends_with?: Maybe<Scalars['String']>;
  cumulativeMinted_not_ends_with?: Maybe<Scalars['String']>;
  cumulativeSwappedAsOutput?: Maybe<Scalars['String']>;
  cumulativeSwappedAsOutput_not?: Maybe<Scalars['String']>;
  cumulativeSwappedAsOutput_gt?: Maybe<Scalars['String']>;
  cumulativeSwappedAsOutput_lt?: Maybe<Scalars['String']>;
  cumulativeSwappedAsOutput_gte?: Maybe<Scalars['String']>;
  cumulativeSwappedAsOutput_lte?: Maybe<Scalars['String']>;
  cumulativeSwappedAsOutput_in?: Maybe<Array<Scalars['String']>>;
  cumulativeSwappedAsOutput_not_in?: Maybe<Array<Scalars['String']>>;
  cumulativeSwappedAsOutput_contains?: Maybe<Scalars['String']>;
  cumulativeSwappedAsOutput_not_contains?: Maybe<Scalars['String']>;
  cumulativeSwappedAsOutput_starts_with?: Maybe<Scalars['String']>;
  cumulativeSwappedAsOutput_not_starts_with?: Maybe<Scalars['String']>;
  cumulativeSwappedAsOutput_ends_with?: Maybe<Scalars['String']>;
  cumulativeSwappedAsOutput_not_ends_with?: Maybe<Scalars['String']>;
  cumulativeRedeemed?: Maybe<Scalars['String']>;
  cumulativeRedeemed_not?: Maybe<Scalars['String']>;
  cumulativeRedeemed_gt?: Maybe<Scalars['String']>;
  cumulativeRedeemed_lt?: Maybe<Scalars['String']>;
  cumulativeRedeemed_gte?: Maybe<Scalars['String']>;
  cumulativeRedeemed_lte?: Maybe<Scalars['String']>;
  cumulativeRedeemed_in?: Maybe<Array<Scalars['String']>>;
  cumulativeRedeemed_not_in?: Maybe<Array<Scalars['String']>>;
  cumulativeRedeemed_contains?: Maybe<Scalars['String']>;
  cumulativeRedeemed_not_contains?: Maybe<Scalars['String']>;
  cumulativeRedeemed_starts_with?: Maybe<Scalars['String']>;
  cumulativeRedeemed_not_starts_with?: Maybe<Scalars['String']>;
  cumulativeRedeemed_ends_with?: Maybe<Scalars['String']>;
  cumulativeRedeemed_not_ends_with?: Maybe<Scalars['String']>;
  cumulativeFeesPaid?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_not?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_gt?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_lt?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_gte?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_lte?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_in?: Maybe<Array<Scalars['String']>>;
  cumulativeFeesPaid_not_in?: Maybe<Array<Scalars['String']>>;
  cumulativeFeesPaid_contains?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_not_contains?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_starts_with?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_not_starts_with?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_ends_with?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_not_ends_with?: Maybe<Scalars['String']>;
};

export enum Basset_OrderBy {
  Id = 'id',
  Masset = 'masset',
  MaxWeight = 'maxWeight',
  Ratio = 'ratio',
  Removed = 'removed',
  Status = 'status',
  IsTransferFeeCharged = 'isTransferFeeCharged',
  Token = 'token',
  VaultBalance = 'vaultBalance',
  TotalMints = 'totalMints',
  TotalSwapsAsInput = 'totalSwapsAsInput',
  TotalSwapsAsOutput = 'totalSwapsAsOutput',
  TotalRedemptions = 'totalRedemptions',
  TotalSupply = 'totalSupply',
  CumulativeMinted = 'cumulativeMinted',
  CumulativeSwappedAsOutput = 'cumulativeSwappedAsOutput',
  CumulativeRedeemed = 'cumulativeRedeemed',
  CumulativeFeesPaid = 'cumulativeFeesPaid'
}



export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
};

export type BoostDirector = {
  id: Scalars['ID'];
  stakingContract: Token;
  whitelisted: Array<BoostedSavingsVault>;
};


export type BoostDirectorWhitelistedArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVault_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVault_Filter>;
};

export type BoostDirector_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  stakingContract?: Maybe<Scalars['String']>;
  stakingContract_not?: Maybe<Scalars['String']>;
  stakingContract_gt?: Maybe<Scalars['String']>;
  stakingContract_lt?: Maybe<Scalars['String']>;
  stakingContract_gte?: Maybe<Scalars['String']>;
  stakingContract_lte?: Maybe<Scalars['String']>;
  stakingContract_in?: Maybe<Array<Scalars['String']>>;
  stakingContract_not_in?: Maybe<Array<Scalars['String']>>;
  stakingContract_contains?: Maybe<Scalars['String']>;
  stakingContract_not_contains?: Maybe<Scalars['String']>;
  stakingContract_starts_with?: Maybe<Scalars['String']>;
  stakingContract_not_starts_with?: Maybe<Scalars['String']>;
  stakingContract_ends_with?: Maybe<Scalars['String']>;
  stakingContract_not_ends_with?: Maybe<Scalars['String']>;
  whitelisted?: Maybe<Array<Scalars['String']>>;
  whitelisted_not?: Maybe<Array<Scalars['String']>>;
  whitelisted_contains?: Maybe<Array<Scalars['String']>>;
  whitelisted_not_contains?: Maybe<Array<Scalars['String']>>;
};

export enum BoostDirector_OrderBy {
  Id = 'id',
  StakingContract = 'stakingContract',
  Whitelisted = 'whitelisted'
}

export type BoostedSavingsVault = {
  id: Scalars['ID'];
  /** ID of the vault on the BoostDirector contract */
  directorVaultId?: Maybe<Scalars['Int']>;
  /** The boost coefficient */
  boostCoeff?: Maybe<Scalars['BigInt']>;
  /** The price coefficient */
  priceCoeff?: Maybe<Scalars['BigInt']>;
  /** The Feeder Pool associated with this vault (optional) */
  feederPool?: Maybe<FeederPool>;
  accounts: Array<BoostedSavingsVaultAccount>;
  rewardEntries: Array<BoostedSavingsVaultRewardEntry>;
  /** Length of token lockup (in seconds), after rewards are earned */
  lockupDuration: Scalars['Int'];
  /** Percentage of earned tokens that are unlocked immediately upon claiming */
  unlockPercentage: Scalars['BigInt'];
  /** Rewards period duration (in seconds) */
  periodDuration: Scalars['Int'];
  /** Timestamp for current rewards period finish */
  periodFinish: Scalars['Int'];
  /** Last time any user took action */
  lastUpdateTime: Scalars['Int'];
  /** The staking token, e.g. imUSD */
  stakingToken: Token;
  /** The reward per token stored */
  rewardPerTokenStored: Scalars['BigInt'];
  /** The reward rate for the rest of the rewards period */
  rewardRate: Scalars['BigInt'];
  /** The rewards token, e.g. MTA */
  rewardsToken: Token;
  /** Rewards distributor contract address */
  rewardsDistributor: Scalars['Bytes'];
  /** Staking rewards contract address */
  stakingContract: Scalars['Bytes'];
  /** Total boosted amount */
  totalSupply: Scalars['BigInt'];
  /** Total staking rewards (rewardRate * periodDuration) */
  totalStakingRewards: Scalars['BigInt'];
  stakeTransactions: Array<BoostedSavingsVaultStakeTransaction>;
  rewardAddedTransactions: Array<BoostedSavingsVaultRewardAddedTransaction>;
  rewardPaidTransactions: Array<BoostedSavingsVaultRewardPaidTransaction>;
  withdrawTransactions: Array<BoostedSavingsVaultWithdrawTransaction>;
};


export type BoostedSavingsVaultAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultAccount_Filter>;
};


export type BoostedSavingsVaultRewardEntriesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultRewardEntry_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultRewardEntry_Filter>;
};


export type BoostedSavingsVaultStakeTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultStakeTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultStakeTransaction_Filter>;
};


export type BoostedSavingsVaultRewardAddedTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultRewardAddedTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultRewardAddedTransaction_Filter>;
};


export type BoostedSavingsVaultRewardPaidTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultRewardPaidTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultRewardPaidTransaction_Filter>;
};


export type BoostedSavingsVaultWithdrawTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultWithdrawTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultWithdrawTransaction_Filter>;
};

export type BoostedSavingsVault_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  directorVaultId?: Maybe<Scalars['Int']>;
  directorVaultId_not?: Maybe<Scalars['Int']>;
  directorVaultId_gt?: Maybe<Scalars['Int']>;
  directorVaultId_lt?: Maybe<Scalars['Int']>;
  directorVaultId_gte?: Maybe<Scalars['Int']>;
  directorVaultId_lte?: Maybe<Scalars['Int']>;
  directorVaultId_in?: Maybe<Array<Scalars['Int']>>;
  directorVaultId_not_in?: Maybe<Array<Scalars['Int']>>;
  boostCoeff?: Maybe<Scalars['BigInt']>;
  boostCoeff_not?: Maybe<Scalars['BigInt']>;
  boostCoeff_gt?: Maybe<Scalars['BigInt']>;
  boostCoeff_lt?: Maybe<Scalars['BigInt']>;
  boostCoeff_gte?: Maybe<Scalars['BigInt']>;
  boostCoeff_lte?: Maybe<Scalars['BigInt']>;
  boostCoeff_in?: Maybe<Array<Scalars['BigInt']>>;
  boostCoeff_not_in?: Maybe<Array<Scalars['BigInt']>>;
  priceCoeff?: Maybe<Scalars['BigInt']>;
  priceCoeff_not?: Maybe<Scalars['BigInt']>;
  priceCoeff_gt?: Maybe<Scalars['BigInt']>;
  priceCoeff_lt?: Maybe<Scalars['BigInt']>;
  priceCoeff_gte?: Maybe<Scalars['BigInt']>;
  priceCoeff_lte?: Maybe<Scalars['BigInt']>;
  priceCoeff_in?: Maybe<Array<Scalars['BigInt']>>;
  priceCoeff_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feederPool?: Maybe<Scalars['String']>;
  feederPool_not?: Maybe<Scalars['String']>;
  feederPool_gt?: Maybe<Scalars['String']>;
  feederPool_lt?: Maybe<Scalars['String']>;
  feederPool_gte?: Maybe<Scalars['String']>;
  feederPool_lte?: Maybe<Scalars['String']>;
  feederPool_in?: Maybe<Array<Scalars['String']>>;
  feederPool_not_in?: Maybe<Array<Scalars['String']>>;
  feederPool_contains?: Maybe<Scalars['String']>;
  feederPool_not_contains?: Maybe<Scalars['String']>;
  feederPool_starts_with?: Maybe<Scalars['String']>;
  feederPool_not_starts_with?: Maybe<Scalars['String']>;
  feederPool_ends_with?: Maybe<Scalars['String']>;
  feederPool_not_ends_with?: Maybe<Scalars['String']>;
  lockupDuration?: Maybe<Scalars['Int']>;
  lockupDuration_not?: Maybe<Scalars['Int']>;
  lockupDuration_gt?: Maybe<Scalars['Int']>;
  lockupDuration_lt?: Maybe<Scalars['Int']>;
  lockupDuration_gte?: Maybe<Scalars['Int']>;
  lockupDuration_lte?: Maybe<Scalars['Int']>;
  lockupDuration_in?: Maybe<Array<Scalars['Int']>>;
  lockupDuration_not_in?: Maybe<Array<Scalars['Int']>>;
  unlockPercentage?: Maybe<Scalars['BigInt']>;
  unlockPercentage_not?: Maybe<Scalars['BigInt']>;
  unlockPercentage_gt?: Maybe<Scalars['BigInt']>;
  unlockPercentage_lt?: Maybe<Scalars['BigInt']>;
  unlockPercentage_gte?: Maybe<Scalars['BigInt']>;
  unlockPercentage_lte?: Maybe<Scalars['BigInt']>;
  unlockPercentage_in?: Maybe<Array<Scalars['BigInt']>>;
  unlockPercentage_not_in?: Maybe<Array<Scalars['BigInt']>>;
  periodDuration?: Maybe<Scalars['Int']>;
  periodDuration_not?: Maybe<Scalars['Int']>;
  periodDuration_gt?: Maybe<Scalars['Int']>;
  periodDuration_lt?: Maybe<Scalars['Int']>;
  periodDuration_gte?: Maybe<Scalars['Int']>;
  periodDuration_lte?: Maybe<Scalars['Int']>;
  periodDuration_in?: Maybe<Array<Scalars['Int']>>;
  periodDuration_not_in?: Maybe<Array<Scalars['Int']>>;
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
  rewardsDistributor?: Maybe<Scalars['Bytes']>;
  rewardsDistributor_not?: Maybe<Scalars['Bytes']>;
  rewardsDistributor_in?: Maybe<Array<Scalars['Bytes']>>;
  rewardsDistributor_not_in?: Maybe<Array<Scalars['Bytes']>>;
  rewardsDistributor_contains?: Maybe<Scalars['Bytes']>;
  rewardsDistributor_not_contains?: Maybe<Scalars['Bytes']>;
  stakingContract?: Maybe<Scalars['Bytes']>;
  stakingContract_not?: Maybe<Scalars['Bytes']>;
  stakingContract_in?: Maybe<Array<Scalars['Bytes']>>;
  stakingContract_not_in?: Maybe<Array<Scalars['Bytes']>>;
  stakingContract_contains?: Maybe<Scalars['Bytes']>;
  stakingContract_not_contains?: Maybe<Scalars['Bytes']>;
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
};

export enum BoostedSavingsVault_OrderBy {
  Id = 'id',
  DirectorVaultId = 'directorVaultId',
  BoostCoeff = 'boostCoeff',
  PriceCoeff = 'priceCoeff',
  FeederPool = 'feederPool',
  Accounts = 'accounts',
  RewardEntries = 'rewardEntries',
  LockupDuration = 'lockupDuration',
  UnlockPercentage = 'unlockPercentage',
  PeriodDuration = 'periodDuration',
  PeriodFinish = 'periodFinish',
  LastUpdateTime = 'lastUpdateTime',
  StakingToken = 'stakingToken',
  RewardPerTokenStored = 'rewardPerTokenStored',
  RewardRate = 'rewardRate',
  RewardsToken = 'rewardsToken',
  RewardsDistributor = 'rewardsDistributor',
  StakingContract = 'stakingContract',
  TotalSupply = 'totalSupply',
  TotalStakingRewards = 'totalStakingRewards',
  StakeTransactions = 'stakeTransactions',
  RewardAddedTransactions = 'rewardAddedTransactions',
  RewardPaidTransactions = 'rewardPaidTransactions',
  WithdrawTransactions = 'withdrawTransactions'
}

export type BoostedSavingsVaultAccount = {
  id: Scalars['ID'];
  boostedSavingsVault: BoostedSavingsVault;
  account: Account;
  rawBalance: Scalars['BigInt'];
  boostedBalance: Scalars['BigInt'];
  rewardPerTokenPaid: Scalars['BigInt'];
  rewards: Scalars['BigInt'];
  lastAction: Scalars['Int'];
  lastClaim: Scalars['Int'];
  rewardCount: Scalars['Int'];
  cumulativeClaimed: Metric;
  rewardEntries: Array<BoostedSavingsVaultRewardEntry>;
  stakeTransactions: Array<BoostedSavingsVaultStakeTransaction>;
  rewardPaidTransactions: Array<BoostedSavingsVaultRewardPaidTransaction>;
  withdrawTransactions: Array<BoostedSavingsVaultWithdrawTransaction>;
};


export type BoostedSavingsVaultAccountRewardEntriesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultRewardEntry_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultRewardEntry_Filter>;
};


export type BoostedSavingsVaultAccountStakeTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultStakeTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultStakeTransaction_Filter>;
};


export type BoostedSavingsVaultAccountRewardPaidTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultRewardPaidTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultRewardPaidTransaction_Filter>;
};


export type BoostedSavingsVaultAccountWithdrawTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultWithdrawTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultWithdrawTransaction_Filter>;
};

export type BoostedSavingsVaultAccount_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  boostedSavingsVault?: Maybe<Scalars['String']>;
  boostedSavingsVault_not?: Maybe<Scalars['String']>;
  boostedSavingsVault_gt?: Maybe<Scalars['String']>;
  boostedSavingsVault_lt?: Maybe<Scalars['String']>;
  boostedSavingsVault_gte?: Maybe<Scalars['String']>;
  boostedSavingsVault_lte?: Maybe<Scalars['String']>;
  boostedSavingsVault_in?: Maybe<Array<Scalars['String']>>;
  boostedSavingsVault_not_in?: Maybe<Array<Scalars['String']>>;
  boostedSavingsVault_contains?: Maybe<Scalars['String']>;
  boostedSavingsVault_not_contains?: Maybe<Scalars['String']>;
  boostedSavingsVault_starts_with?: Maybe<Scalars['String']>;
  boostedSavingsVault_not_starts_with?: Maybe<Scalars['String']>;
  boostedSavingsVault_ends_with?: Maybe<Scalars['String']>;
  boostedSavingsVault_not_ends_with?: Maybe<Scalars['String']>;
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
  rawBalance?: Maybe<Scalars['BigInt']>;
  rawBalance_not?: Maybe<Scalars['BigInt']>;
  rawBalance_gt?: Maybe<Scalars['BigInt']>;
  rawBalance_lt?: Maybe<Scalars['BigInt']>;
  rawBalance_gte?: Maybe<Scalars['BigInt']>;
  rawBalance_lte?: Maybe<Scalars['BigInt']>;
  rawBalance_in?: Maybe<Array<Scalars['BigInt']>>;
  rawBalance_not_in?: Maybe<Array<Scalars['BigInt']>>;
  boostedBalance?: Maybe<Scalars['BigInt']>;
  boostedBalance_not?: Maybe<Scalars['BigInt']>;
  boostedBalance_gt?: Maybe<Scalars['BigInt']>;
  boostedBalance_lt?: Maybe<Scalars['BigInt']>;
  boostedBalance_gte?: Maybe<Scalars['BigInt']>;
  boostedBalance_lte?: Maybe<Scalars['BigInt']>;
  boostedBalance_in?: Maybe<Array<Scalars['BigInt']>>;
  boostedBalance_not_in?: Maybe<Array<Scalars['BigInt']>>;
  rewardPerTokenPaid?: Maybe<Scalars['BigInt']>;
  rewardPerTokenPaid_not?: Maybe<Scalars['BigInt']>;
  rewardPerTokenPaid_gt?: Maybe<Scalars['BigInt']>;
  rewardPerTokenPaid_lt?: Maybe<Scalars['BigInt']>;
  rewardPerTokenPaid_gte?: Maybe<Scalars['BigInt']>;
  rewardPerTokenPaid_lte?: Maybe<Scalars['BigInt']>;
  rewardPerTokenPaid_in?: Maybe<Array<Scalars['BigInt']>>;
  rewardPerTokenPaid_not_in?: Maybe<Array<Scalars['BigInt']>>;
  rewards?: Maybe<Scalars['BigInt']>;
  rewards_not?: Maybe<Scalars['BigInt']>;
  rewards_gt?: Maybe<Scalars['BigInt']>;
  rewards_lt?: Maybe<Scalars['BigInt']>;
  rewards_gte?: Maybe<Scalars['BigInt']>;
  rewards_lte?: Maybe<Scalars['BigInt']>;
  rewards_in?: Maybe<Array<Scalars['BigInt']>>;
  rewards_not_in?: Maybe<Array<Scalars['BigInt']>>;
  lastAction?: Maybe<Scalars['Int']>;
  lastAction_not?: Maybe<Scalars['Int']>;
  lastAction_gt?: Maybe<Scalars['Int']>;
  lastAction_lt?: Maybe<Scalars['Int']>;
  lastAction_gte?: Maybe<Scalars['Int']>;
  lastAction_lte?: Maybe<Scalars['Int']>;
  lastAction_in?: Maybe<Array<Scalars['Int']>>;
  lastAction_not_in?: Maybe<Array<Scalars['Int']>>;
  lastClaim?: Maybe<Scalars['Int']>;
  lastClaim_not?: Maybe<Scalars['Int']>;
  lastClaim_gt?: Maybe<Scalars['Int']>;
  lastClaim_lt?: Maybe<Scalars['Int']>;
  lastClaim_gte?: Maybe<Scalars['Int']>;
  lastClaim_lte?: Maybe<Scalars['Int']>;
  lastClaim_in?: Maybe<Array<Scalars['Int']>>;
  lastClaim_not_in?: Maybe<Array<Scalars['Int']>>;
  rewardCount?: Maybe<Scalars['Int']>;
  rewardCount_not?: Maybe<Scalars['Int']>;
  rewardCount_gt?: Maybe<Scalars['Int']>;
  rewardCount_lt?: Maybe<Scalars['Int']>;
  rewardCount_gte?: Maybe<Scalars['Int']>;
  rewardCount_lte?: Maybe<Scalars['Int']>;
  rewardCount_in?: Maybe<Array<Scalars['Int']>>;
  rewardCount_not_in?: Maybe<Array<Scalars['Int']>>;
  cumulativeClaimed?: Maybe<Scalars['String']>;
  cumulativeClaimed_not?: Maybe<Scalars['String']>;
  cumulativeClaimed_gt?: Maybe<Scalars['String']>;
  cumulativeClaimed_lt?: Maybe<Scalars['String']>;
  cumulativeClaimed_gte?: Maybe<Scalars['String']>;
  cumulativeClaimed_lte?: Maybe<Scalars['String']>;
  cumulativeClaimed_in?: Maybe<Array<Scalars['String']>>;
  cumulativeClaimed_not_in?: Maybe<Array<Scalars['String']>>;
  cumulativeClaimed_contains?: Maybe<Scalars['String']>;
  cumulativeClaimed_not_contains?: Maybe<Scalars['String']>;
  cumulativeClaimed_starts_with?: Maybe<Scalars['String']>;
  cumulativeClaimed_not_starts_with?: Maybe<Scalars['String']>;
  cumulativeClaimed_ends_with?: Maybe<Scalars['String']>;
  cumulativeClaimed_not_ends_with?: Maybe<Scalars['String']>;
};

export enum BoostedSavingsVaultAccount_OrderBy {
  Id = 'id',
  BoostedSavingsVault = 'boostedSavingsVault',
  Account = 'account',
  RawBalance = 'rawBalance',
  BoostedBalance = 'boostedBalance',
  RewardPerTokenPaid = 'rewardPerTokenPaid',
  Rewards = 'rewards',
  LastAction = 'lastAction',
  LastClaim = 'lastClaim',
  RewardCount = 'rewardCount',
  CumulativeClaimed = 'cumulativeClaimed',
  RewardEntries = 'rewardEntries',
  StakeTransactions = 'stakeTransactions',
  RewardPaidTransactions = 'rewardPaidTransactions',
  WithdrawTransactions = 'withdrawTransactions'
}

export type BoostedSavingsVaultRewardAddedTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  block: Scalars['Int'];
  sender: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  /** The BoostedSavingsVault the transaction relates to. */
  boostedSavingsVault: BoostedSavingsVault;
  /** The amount of rewards added. */
  amount: Scalars['BigInt'];
};

export type BoostedSavingsVaultRewardAddedTransaction_Filter = {
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
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  boostedSavingsVault?: Maybe<Scalars['String']>;
  boostedSavingsVault_not?: Maybe<Scalars['String']>;
  boostedSavingsVault_gt?: Maybe<Scalars['String']>;
  boostedSavingsVault_lt?: Maybe<Scalars['String']>;
  boostedSavingsVault_gte?: Maybe<Scalars['String']>;
  boostedSavingsVault_lte?: Maybe<Scalars['String']>;
  boostedSavingsVault_in?: Maybe<Array<Scalars['String']>>;
  boostedSavingsVault_not_in?: Maybe<Array<Scalars['String']>>;
  boostedSavingsVault_contains?: Maybe<Scalars['String']>;
  boostedSavingsVault_not_contains?: Maybe<Scalars['String']>;
  boostedSavingsVault_starts_with?: Maybe<Scalars['String']>;
  boostedSavingsVault_not_starts_with?: Maybe<Scalars['String']>;
  boostedSavingsVault_ends_with?: Maybe<Scalars['String']>;
  boostedSavingsVault_not_ends_with?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum BoostedSavingsVaultRewardAddedTransaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Sender = 'sender',
  Timestamp = 'timestamp',
  BoostedSavingsVault = 'boostedSavingsVault',
  Amount = 'amount'
}

export type BoostedSavingsVaultRewardEntry = {
  id: Scalars['ID'];
  account: BoostedSavingsVaultAccount;
  boostedSavingsVault: BoostedSavingsVault;
  index: Scalars['Int'];
  start: Scalars['Int'];
  finish: Scalars['Int'];
  rate: Scalars['BigInt'];
};

export type BoostedSavingsVaultRewardEntry_Filter = {
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
  boostedSavingsVault?: Maybe<Scalars['String']>;
  boostedSavingsVault_not?: Maybe<Scalars['String']>;
  boostedSavingsVault_gt?: Maybe<Scalars['String']>;
  boostedSavingsVault_lt?: Maybe<Scalars['String']>;
  boostedSavingsVault_gte?: Maybe<Scalars['String']>;
  boostedSavingsVault_lte?: Maybe<Scalars['String']>;
  boostedSavingsVault_in?: Maybe<Array<Scalars['String']>>;
  boostedSavingsVault_not_in?: Maybe<Array<Scalars['String']>>;
  boostedSavingsVault_contains?: Maybe<Scalars['String']>;
  boostedSavingsVault_not_contains?: Maybe<Scalars['String']>;
  boostedSavingsVault_starts_with?: Maybe<Scalars['String']>;
  boostedSavingsVault_not_starts_with?: Maybe<Scalars['String']>;
  boostedSavingsVault_ends_with?: Maybe<Scalars['String']>;
  boostedSavingsVault_not_ends_with?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Int']>;
  index_not?: Maybe<Scalars['Int']>;
  index_gt?: Maybe<Scalars['Int']>;
  index_lt?: Maybe<Scalars['Int']>;
  index_gte?: Maybe<Scalars['Int']>;
  index_lte?: Maybe<Scalars['Int']>;
  index_in?: Maybe<Array<Scalars['Int']>>;
  index_not_in?: Maybe<Array<Scalars['Int']>>;
  start?: Maybe<Scalars['Int']>;
  start_not?: Maybe<Scalars['Int']>;
  start_gt?: Maybe<Scalars['Int']>;
  start_lt?: Maybe<Scalars['Int']>;
  start_gte?: Maybe<Scalars['Int']>;
  start_lte?: Maybe<Scalars['Int']>;
  start_in?: Maybe<Array<Scalars['Int']>>;
  start_not_in?: Maybe<Array<Scalars['Int']>>;
  finish?: Maybe<Scalars['Int']>;
  finish_not?: Maybe<Scalars['Int']>;
  finish_gt?: Maybe<Scalars['Int']>;
  finish_lt?: Maybe<Scalars['Int']>;
  finish_gte?: Maybe<Scalars['Int']>;
  finish_lte?: Maybe<Scalars['Int']>;
  finish_in?: Maybe<Array<Scalars['Int']>>;
  finish_not_in?: Maybe<Array<Scalars['Int']>>;
  rate?: Maybe<Scalars['BigInt']>;
  rate_not?: Maybe<Scalars['BigInt']>;
  rate_gt?: Maybe<Scalars['BigInt']>;
  rate_lt?: Maybe<Scalars['BigInt']>;
  rate_gte?: Maybe<Scalars['BigInt']>;
  rate_lte?: Maybe<Scalars['BigInt']>;
  rate_in?: Maybe<Array<Scalars['BigInt']>>;
  rate_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum BoostedSavingsVaultRewardEntry_OrderBy {
  Id = 'id',
  Account = 'account',
  BoostedSavingsVault = 'boostedSavingsVault',
  Index = 'index',
  Start = 'start',
  Finish = 'finish',
  Rate = 'rate'
}

export type BoostedSavingsVaultRewardPaidTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  block: Scalars['Int'];
  sender: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  /** The BoostedSavingsVault the transaction relates to. */
  boostedSavingsVault: BoostedSavingsVault;
  /** The amount of the reward paid. */
  amount: Scalars['BigInt'];
  /** The account receiving the rewarded amount. */
  account: BoostedSavingsVaultAccount;
};

export type BoostedSavingsVaultRewardPaidTransaction_Filter = {
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
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  boostedSavingsVault?: Maybe<Scalars['String']>;
  boostedSavingsVault_not?: Maybe<Scalars['String']>;
  boostedSavingsVault_gt?: Maybe<Scalars['String']>;
  boostedSavingsVault_lt?: Maybe<Scalars['String']>;
  boostedSavingsVault_gte?: Maybe<Scalars['String']>;
  boostedSavingsVault_lte?: Maybe<Scalars['String']>;
  boostedSavingsVault_in?: Maybe<Array<Scalars['String']>>;
  boostedSavingsVault_not_in?: Maybe<Array<Scalars['String']>>;
  boostedSavingsVault_contains?: Maybe<Scalars['String']>;
  boostedSavingsVault_not_contains?: Maybe<Scalars['String']>;
  boostedSavingsVault_starts_with?: Maybe<Scalars['String']>;
  boostedSavingsVault_not_starts_with?: Maybe<Scalars['String']>;
  boostedSavingsVault_ends_with?: Maybe<Scalars['String']>;
  boostedSavingsVault_not_ends_with?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
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
};

export enum BoostedSavingsVaultRewardPaidTransaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Sender = 'sender',
  Timestamp = 'timestamp',
  BoostedSavingsVault = 'boostedSavingsVault',
  Amount = 'amount',
  Account = 'account'
}

export type BoostedSavingsVaultStakeTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  block: Scalars['Int'];
  sender: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  /** The BoostedSavingsVault the transaction relates to. */
  boostedSavingsVault: BoostedSavingsVault;
  /** The amount staked. */
  amount: Scalars['BigInt'];
  /** The account the staked amount is being added for. */
  account: BoostedSavingsVaultAccount;
};

export type BoostedSavingsVaultStakeTransaction_Filter = {
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
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  boostedSavingsVault?: Maybe<Scalars['String']>;
  boostedSavingsVault_not?: Maybe<Scalars['String']>;
  boostedSavingsVault_gt?: Maybe<Scalars['String']>;
  boostedSavingsVault_lt?: Maybe<Scalars['String']>;
  boostedSavingsVault_gte?: Maybe<Scalars['String']>;
  boostedSavingsVault_lte?: Maybe<Scalars['String']>;
  boostedSavingsVault_in?: Maybe<Array<Scalars['String']>>;
  boostedSavingsVault_not_in?: Maybe<Array<Scalars['String']>>;
  boostedSavingsVault_contains?: Maybe<Scalars['String']>;
  boostedSavingsVault_not_contains?: Maybe<Scalars['String']>;
  boostedSavingsVault_starts_with?: Maybe<Scalars['String']>;
  boostedSavingsVault_not_starts_with?: Maybe<Scalars['String']>;
  boostedSavingsVault_ends_with?: Maybe<Scalars['String']>;
  boostedSavingsVault_not_ends_with?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
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
};

export enum BoostedSavingsVaultStakeTransaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Sender = 'sender',
  Timestamp = 'timestamp',
  BoostedSavingsVault = 'boostedSavingsVault',
  Amount = 'amount',
  Account = 'account'
}

export type BoostedSavingsVaultWithdrawTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  block: Scalars['Int'];
  sender: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  /** The BoostedSavingsVault the transaction relates to. */
  boostedSavingsVault: BoostedSavingsVault;
  /** The amount of the stake withdrawn. */
  amount: Scalars['BigInt'];
  /** The account the stake is withdrawn for. */
  account: BoostedSavingsVaultAccount;
};

export type BoostedSavingsVaultWithdrawTransaction_Filter = {
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
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  boostedSavingsVault?: Maybe<Scalars['String']>;
  boostedSavingsVault_not?: Maybe<Scalars['String']>;
  boostedSavingsVault_gt?: Maybe<Scalars['String']>;
  boostedSavingsVault_lt?: Maybe<Scalars['String']>;
  boostedSavingsVault_gte?: Maybe<Scalars['String']>;
  boostedSavingsVault_lte?: Maybe<Scalars['String']>;
  boostedSavingsVault_in?: Maybe<Array<Scalars['String']>>;
  boostedSavingsVault_not_in?: Maybe<Array<Scalars['String']>>;
  boostedSavingsVault_contains?: Maybe<Scalars['String']>;
  boostedSavingsVault_not_contains?: Maybe<Scalars['String']>;
  boostedSavingsVault_starts_with?: Maybe<Scalars['String']>;
  boostedSavingsVault_not_starts_with?: Maybe<Scalars['String']>;
  boostedSavingsVault_ends_with?: Maybe<Scalars['String']>;
  boostedSavingsVault_not_ends_with?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
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
};

export enum BoostedSavingsVaultWithdrawTransaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Sender = 'sender',
  Timestamp = 'timestamp',
  BoostedSavingsVault = 'boostedSavingsVault',
  Amount = 'amount',
  Account = 'account'
}


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

export type FeederPool = {
  id: Scalars['ID'];
  ampData: AmpData;
  basket: Basket;
  cacheSize: Scalars['BigInt'];
  cumulativeFeesPaid: Metric;
  cumulativeInterestCollected: Metric;
  cumulativeInterestDistributed: Metric;
  cumulativeLiquidatorDeposited: Metric;
  cumulativeMinted: Metric;
  cumulativeRedeemed: Metric;
  cumulativeSwapped: Metric;
  dailyAPY: Scalars['BigDecimal'];
  invariantK: Scalars['BigInt'];
  fasset: Token;
  governanceFeeRate: Scalars['BigInt'];
  hardMax: Scalars['BigInt'];
  hardMin: Scalars['BigInt'];
  masset: Token;
  pendingFees: Scalars['BigInt'];
  price: Scalars['BigInt'];
  swapFeeRate: Scalars['BigInt'];
  redemptionFeeRate: Scalars['BigInt'];
  token: Token;
  totalMints: Counter;
  totalRedeemMassets: Counter;
  totalRedemptions: Counter;
  totalSupply: Metric;
  totalSwaps: Counter;
  mintMultiTransactions: Array<FpMintMultiTransaction>;
  mintSingleTransactions: Array<FpMintSingleTransaction>;
  redeemTransactions: Array<FpRedeemTransaction>;
  swapTransactions: Array<FpSwapTransaction>;
  vault: BoostedSavingsVault;
  accounts: Array<FeederPoolAccount>;
};


export type FeederPoolMintMultiTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FpMintMultiTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FpMintMultiTransaction_Filter>;
};


export type FeederPoolMintSingleTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FpMintSingleTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FpMintSingleTransaction_Filter>;
};


export type FeederPoolRedeemTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FpRedeemTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FpRedeemTransaction_Filter>;
};


export type FeederPoolSwapTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FpSwapTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FpSwapTransaction_Filter>;
};


export type FeederPoolAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FeederPoolAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FeederPoolAccount_Filter>;
};

export type FeederPool_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  ampData?: Maybe<Scalars['String']>;
  ampData_not?: Maybe<Scalars['String']>;
  ampData_gt?: Maybe<Scalars['String']>;
  ampData_lt?: Maybe<Scalars['String']>;
  ampData_gte?: Maybe<Scalars['String']>;
  ampData_lte?: Maybe<Scalars['String']>;
  ampData_in?: Maybe<Array<Scalars['String']>>;
  ampData_not_in?: Maybe<Array<Scalars['String']>>;
  ampData_contains?: Maybe<Scalars['String']>;
  ampData_not_contains?: Maybe<Scalars['String']>;
  ampData_starts_with?: Maybe<Scalars['String']>;
  ampData_not_starts_with?: Maybe<Scalars['String']>;
  ampData_ends_with?: Maybe<Scalars['String']>;
  ampData_not_ends_with?: Maybe<Scalars['String']>;
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
  cacheSize?: Maybe<Scalars['BigInt']>;
  cacheSize_not?: Maybe<Scalars['BigInt']>;
  cacheSize_gt?: Maybe<Scalars['BigInt']>;
  cacheSize_lt?: Maybe<Scalars['BigInt']>;
  cacheSize_gte?: Maybe<Scalars['BigInt']>;
  cacheSize_lte?: Maybe<Scalars['BigInt']>;
  cacheSize_in?: Maybe<Array<Scalars['BigInt']>>;
  cacheSize_not_in?: Maybe<Array<Scalars['BigInt']>>;
  cumulativeFeesPaid?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_not?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_gt?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_lt?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_gte?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_lte?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_in?: Maybe<Array<Scalars['String']>>;
  cumulativeFeesPaid_not_in?: Maybe<Array<Scalars['String']>>;
  cumulativeFeesPaid_contains?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_not_contains?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_starts_with?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_not_starts_with?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_ends_with?: Maybe<Scalars['String']>;
  cumulativeFeesPaid_not_ends_with?: Maybe<Scalars['String']>;
  cumulativeInterestCollected?: Maybe<Scalars['String']>;
  cumulativeInterestCollected_not?: Maybe<Scalars['String']>;
  cumulativeInterestCollected_gt?: Maybe<Scalars['String']>;
  cumulativeInterestCollected_lt?: Maybe<Scalars['String']>;
  cumulativeInterestCollected_gte?: Maybe<Scalars['String']>;
  cumulativeInterestCollected_lte?: Maybe<Scalars['String']>;
  cumulativeInterestCollected_in?: Maybe<Array<Scalars['String']>>;
  cumulativeInterestCollected_not_in?: Maybe<Array<Scalars['String']>>;
  cumulativeInterestCollected_contains?: Maybe<Scalars['String']>;
  cumulativeInterestCollected_not_contains?: Maybe<Scalars['String']>;
  cumulativeInterestCollected_starts_with?: Maybe<Scalars['String']>;
  cumulativeInterestCollected_not_starts_with?: Maybe<Scalars['String']>;
  cumulativeInterestCollected_ends_with?: Maybe<Scalars['String']>;
  cumulativeInterestCollected_not_ends_with?: Maybe<Scalars['String']>;
  cumulativeInterestDistributed?: Maybe<Scalars['String']>;
  cumulativeInterestDistributed_not?: Maybe<Scalars['String']>;
  cumulativeInterestDistributed_gt?: Maybe<Scalars['String']>;
  cumulativeInterestDistributed_lt?: Maybe<Scalars['String']>;
  cumulativeInterestDistributed_gte?: Maybe<Scalars['String']>;
  cumulativeInterestDistributed_lte?: Maybe<Scalars['String']>;
  cumulativeInterestDistributed_in?: Maybe<Array<Scalars['String']>>;
  cumulativeInterestDistributed_not_in?: Maybe<Array<Scalars['String']>>;
  cumulativeInterestDistributed_contains?: Maybe<Scalars['String']>;
  cumulativeInterestDistributed_not_contains?: Maybe<Scalars['String']>;
  cumulativeInterestDistributed_starts_with?: Maybe<Scalars['String']>;
  cumulativeInterestDistributed_not_starts_with?: Maybe<Scalars['String']>;
  cumulativeInterestDistributed_ends_with?: Maybe<Scalars['String']>;
  cumulativeInterestDistributed_not_ends_with?: Maybe<Scalars['String']>;
  cumulativeLiquidatorDeposited?: Maybe<Scalars['String']>;
  cumulativeLiquidatorDeposited_not?: Maybe<Scalars['String']>;
  cumulativeLiquidatorDeposited_gt?: Maybe<Scalars['String']>;
  cumulativeLiquidatorDeposited_lt?: Maybe<Scalars['String']>;
  cumulativeLiquidatorDeposited_gte?: Maybe<Scalars['String']>;
  cumulativeLiquidatorDeposited_lte?: Maybe<Scalars['String']>;
  cumulativeLiquidatorDeposited_in?: Maybe<Array<Scalars['String']>>;
  cumulativeLiquidatorDeposited_not_in?: Maybe<Array<Scalars['String']>>;
  cumulativeLiquidatorDeposited_contains?: Maybe<Scalars['String']>;
  cumulativeLiquidatorDeposited_not_contains?: Maybe<Scalars['String']>;
  cumulativeLiquidatorDeposited_starts_with?: Maybe<Scalars['String']>;
  cumulativeLiquidatorDeposited_not_starts_with?: Maybe<Scalars['String']>;
  cumulativeLiquidatorDeposited_ends_with?: Maybe<Scalars['String']>;
  cumulativeLiquidatorDeposited_not_ends_with?: Maybe<Scalars['String']>;
  cumulativeMinted?: Maybe<Scalars['String']>;
  cumulativeMinted_not?: Maybe<Scalars['String']>;
  cumulativeMinted_gt?: Maybe<Scalars['String']>;
  cumulativeMinted_lt?: Maybe<Scalars['String']>;
  cumulativeMinted_gte?: Maybe<Scalars['String']>;
  cumulativeMinted_lte?: Maybe<Scalars['String']>;
  cumulativeMinted_in?: Maybe<Array<Scalars['String']>>;
  cumulativeMinted_not_in?: Maybe<Array<Scalars['String']>>;
  cumulativeMinted_contains?: Maybe<Scalars['String']>;
  cumulativeMinted_not_contains?: Maybe<Scalars['String']>;
  cumulativeMinted_starts_with?: Maybe<Scalars['String']>;
  cumulativeMinted_not_starts_with?: Maybe<Scalars['String']>;
  cumulativeMinted_ends_with?: Maybe<Scalars['String']>;
  cumulativeMinted_not_ends_with?: Maybe<Scalars['String']>;
  cumulativeRedeemed?: Maybe<Scalars['String']>;
  cumulativeRedeemed_not?: Maybe<Scalars['String']>;
  cumulativeRedeemed_gt?: Maybe<Scalars['String']>;
  cumulativeRedeemed_lt?: Maybe<Scalars['String']>;
  cumulativeRedeemed_gte?: Maybe<Scalars['String']>;
  cumulativeRedeemed_lte?: Maybe<Scalars['String']>;
  cumulativeRedeemed_in?: Maybe<Array<Scalars['String']>>;
  cumulativeRedeemed_not_in?: Maybe<Array<Scalars['String']>>;
  cumulativeRedeemed_contains?: Maybe<Scalars['String']>;
  cumulativeRedeemed_not_contains?: Maybe<Scalars['String']>;
  cumulativeRedeemed_starts_with?: Maybe<Scalars['String']>;
  cumulativeRedeemed_not_starts_with?: Maybe<Scalars['String']>;
  cumulativeRedeemed_ends_with?: Maybe<Scalars['String']>;
  cumulativeRedeemed_not_ends_with?: Maybe<Scalars['String']>;
  cumulativeSwapped?: Maybe<Scalars['String']>;
  cumulativeSwapped_not?: Maybe<Scalars['String']>;
  cumulativeSwapped_gt?: Maybe<Scalars['String']>;
  cumulativeSwapped_lt?: Maybe<Scalars['String']>;
  cumulativeSwapped_gte?: Maybe<Scalars['String']>;
  cumulativeSwapped_lte?: Maybe<Scalars['String']>;
  cumulativeSwapped_in?: Maybe<Array<Scalars['String']>>;
  cumulativeSwapped_not_in?: Maybe<Array<Scalars['String']>>;
  cumulativeSwapped_contains?: Maybe<Scalars['String']>;
  cumulativeSwapped_not_contains?: Maybe<Scalars['String']>;
  cumulativeSwapped_starts_with?: Maybe<Scalars['String']>;
  cumulativeSwapped_not_starts_with?: Maybe<Scalars['String']>;
  cumulativeSwapped_ends_with?: Maybe<Scalars['String']>;
  cumulativeSwapped_not_ends_with?: Maybe<Scalars['String']>;
  dailyAPY?: Maybe<Scalars['BigDecimal']>;
  dailyAPY_not?: Maybe<Scalars['BigDecimal']>;
  dailyAPY_gt?: Maybe<Scalars['BigDecimal']>;
  dailyAPY_lt?: Maybe<Scalars['BigDecimal']>;
  dailyAPY_gte?: Maybe<Scalars['BigDecimal']>;
  dailyAPY_lte?: Maybe<Scalars['BigDecimal']>;
  dailyAPY_in?: Maybe<Array<Scalars['BigDecimal']>>;
  dailyAPY_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  invariantK?: Maybe<Scalars['BigInt']>;
  invariantK_not?: Maybe<Scalars['BigInt']>;
  invariantK_gt?: Maybe<Scalars['BigInt']>;
  invariantK_lt?: Maybe<Scalars['BigInt']>;
  invariantK_gte?: Maybe<Scalars['BigInt']>;
  invariantK_lte?: Maybe<Scalars['BigInt']>;
  invariantK_in?: Maybe<Array<Scalars['BigInt']>>;
  invariantK_not_in?: Maybe<Array<Scalars['BigInt']>>;
  fasset?: Maybe<Scalars['String']>;
  fasset_not?: Maybe<Scalars['String']>;
  fasset_gt?: Maybe<Scalars['String']>;
  fasset_lt?: Maybe<Scalars['String']>;
  fasset_gte?: Maybe<Scalars['String']>;
  fasset_lte?: Maybe<Scalars['String']>;
  fasset_in?: Maybe<Array<Scalars['String']>>;
  fasset_not_in?: Maybe<Array<Scalars['String']>>;
  fasset_contains?: Maybe<Scalars['String']>;
  fasset_not_contains?: Maybe<Scalars['String']>;
  fasset_starts_with?: Maybe<Scalars['String']>;
  fasset_not_starts_with?: Maybe<Scalars['String']>;
  fasset_ends_with?: Maybe<Scalars['String']>;
  fasset_not_ends_with?: Maybe<Scalars['String']>;
  governanceFeeRate?: Maybe<Scalars['BigInt']>;
  governanceFeeRate_not?: Maybe<Scalars['BigInt']>;
  governanceFeeRate_gt?: Maybe<Scalars['BigInt']>;
  governanceFeeRate_lt?: Maybe<Scalars['BigInt']>;
  governanceFeeRate_gte?: Maybe<Scalars['BigInt']>;
  governanceFeeRate_lte?: Maybe<Scalars['BigInt']>;
  governanceFeeRate_in?: Maybe<Array<Scalars['BigInt']>>;
  governanceFeeRate_not_in?: Maybe<Array<Scalars['BigInt']>>;
  hardMax?: Maybe<Scalars['BigInt']>;
  hardMax_not?: Maybe<Scalars['BigInt']>;
  hardMax_gt?: Maybe<Scalars['BigInt']>;
  hardMax_lt?: Maybe<Scalars['BigInt']>;
  hardMax_gte?: Maybe<Scalars['BigInt']>;
  hardMax_lte?: Maybe<Scalars['BigInt']>;
  hardMax_in?: Maybe<Array<Scalars['BigInt']>>;
  hardMax_not_in?: Maybe<Array<Scalars['BigInt']>>;
  hardMin?: Maybe<Scalars['BigInt']>;
  hardMin_not?: Maybe<Scalars['BigInt']>;
  hardMin_gt?: Maybe<Scalars['BigInt']>;
  hardMin_lt?: Maybe<Scalars['BigInt']>;
  hardMin_gte?: Maybe<Scalars['BigInt']>;
  hardMin_lte?: Maybe<Scalars['BigInt']>;
  hardMin_in?: Maybe<Array<Scalars['BigInt']>>;
  hardMin_not_in?: Maybe<Array<Scalars['BigInt']>>;
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
  pendingFees?: Maybe<Scalars['BigInt']>;
  pendingFees_not?: Maybe<Scalars['BigInt']>;
  pendingFees_gt?: Maybe<Scalars['BigInt']>;
  pendingFees_lt?: Maybe<Scalars['BigInt']>;
  pendingFees_gte?: Maybe<Scalars['BigInt']>;
  pendingFees_lte?: Maybe<Scalars['BigInt']>;
  pendingFees_in?: Maybe<Array<Scalars['BigInt']>>;
  pendingFees_not_in?: Maybe<Array<Scalars['BigInt']>>;
  price?: Maybe<Scalars['BigInt']>;
  price_not?: Maybe<Scalars['BigInt']>;
  price_gt?: Maybe<Scalars['BigInt']>;
  price_lt?: Maybe<Scalars['BigInt']>;
  price_gte?: Maybe<Scalars['BigInt']>;
  price_lte?: Maybe<Scalars['BigInt']>;
  price_in?: Maybe<Array<Scalars['BigInt']>>;
  price_not_in?: Maybe<Array<Scalars['BigInt']>>;
  swapFeeRate?: Maybe<Scalars['BigInt']>;
  swapFeeRate_not?: Maybe<Scalars['BigInt']>;
  swapFeeRate_gt?: Maybe<Scalars['BigInt']>;
  swapFeeRate_lt?: Maybe<Scalars['BigInt']>;
  swapFeeRate_gte?: Maybe<Scalars['BigInt']>;
  swapFeeRate_lte?: Maybe<Scalars['BigInt']>;
  swapFeeRate_in?: Maybe<Array<Scalars['BigInt']>>;
  swapFeeRate_not_in?: Maybe<Array<Scalars['BigInt']>>;
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
  totalRedeemMassets?: Maybe<Scalars['String']>;
  totalRedeemMassets_not?: Maybe<Scalars['String']>;
  totalRedeemMassets_gt?: Maybe<Scalars['String']>;
  totalRedeemMassets_lt?: Maybe<Scalars['String']>;
  totalRedeemMassets_gte?: Maybe<Scalars['String']>;
  totalRedeemMassets_lte?: Maybe<Scalars['String']>;
  totalRedeemMassets_in?: Maybe<Array<Scalars['String']>>;
  totalRedeemMassets_not_in?: Maybe<Array<Scalars['String']>>;
  totalRedeemMassets_contains?: Maybe<Scalars['String']>;
  totalRedeemMassets_not_contains?: Maybe<Scalars['String']>;
  totalRedeemMassets_starts_with?: Maybe<Scalars['String']>;
  totalRedeemMassets_not_starts_with?: Maybe<Scalars['String']>;
  totalRedeemMassets_ends_with?: Maybe<Scalars['String']>;
  totalRedeemMassets_not_ends_with?: Maybe<Scalars['String']>;
  totalRedemptions?: Maybe<Scalars['String']>;
  totalRedemptions_not?: Maybe<Scalars['String']>;
  totalRedemptions_gt?: Maybe<Scalars['String']>;
  totalRedemptions_lt?: Maybe<Scalars['String']>;
  totalRedemptions_gte?: Maybe<Scalars['String']>;
  totalRedemptions_lte?: Maybe<Scalars['String']>;
  totalRedemptions_in?: Maybe<Array<Scalars['String']>>;
  totalRedemptions_not_in?: Maybe<Array<Scalars['String']>>;
  totalRedemptions_contains?: Maybe<Scalars['String']>;
  totalRedemptions_not_contains?: Maybe<Scalars['String']>;
  totalRedemptions_starts_with?: Maybe<Scalars['String']>;
  totalRedemptions_not_starts_with?: Maybe<Scalars['String']>;
  totalRedemptions_ends_with?: Maybe<Scalars['String']>;
  totalRedemptions_not_ends_with?: Maybe<Scalars['String']>;
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
  totalSwaps?: Maybe<Scalars['String']>;
  totalSwaps_not?: Maybe<Scalars['String']>;
  totalSwaps_gt?: Maybe<Scalars['String']>;
  totalSwaps_lt?: Maybe<Scalars['String']>;
  totalSwaps_gte?: Maybe<Scalars['String']>;
  totalSwaps_lte?: Maybe<Scalars['String']>;
  totalSwaps_in?: Maybe<Array<Scalars['String']>>;
  totalSwaps_not_in?: Maybe<Array<Scalars['String']>>;
  totalSwaps_contains?: Maybe<Scalars['String']>;
  totalSwaps_not_contains?: Maybe<Scalars['String']>;
  totalSwaps_starts_with?: Maybe<Scalars['String']>;
  totalSwaps_not_starts_with?: Maybe<Scalars['String']>;
  totalSwaps_ends_with?: Maybe<Scalars['String']>;
  totalSwaps_not_ends_with?: Maybe<Scalars['String']>;
};

export enum FeederPool_OrderBy {
  Id = 'id',
  AmpData = 'ampData',
  Basket = 'basket',
  CacheSize = 'cacheSize',
  CumulativeFeesPaid = 'cumulativeFeesPaid',
  CumulativeInterestCollected = 'cumulativeInterestCollected',
  CumulativeInterestDistributed = 'cumulativeInterestDistributed',
  CumulativeLiquidatorDeposited = 'cumulativeLiquidatorDeposited',
  CumulativeMinted = 'cumulativeMinted',
  CumulativeRedeemed = 'cumulativeRedeemed',
  CumulativeSwapped = 'cumulativeSwapped',
  DailyApy = 'dailyAPY',
  InvariantK = 'invariantK',
  Fasset = 'fasset',
  GovernanceFeeRate = 'governanceFeeRate',
  HardMax = 'hardMax',
  HardMin = 'hardMin',
  Masset = 'masset',
  PendingFees = 'pendingFees',
  Price = 'price',
  SwapFeeRate = 'swapFeeRate',
  RedemptionFeeRate = 'redemptionFeeRate',
  Token = 'token',
  TotalMints = 'totalMints',
  TotalRedeemMassets = 'totalRedeemMassets',
  TotalRedemptions = 'totalRedemptions',
  TotalSupply = 'totalSupply',
  TotalSwaps = 'totalSwaps',
  MintMultiTransactions = 'mintMultiTransactions',
  MintSingleTransactions = 'mintSingleTransactions',
  RedeemTransactions = 'redeemTransactions',
  SwapTransactions = 'swapTransactions',
  Vault = 'vault',
  Accounts = 'accounts'
}

export type FeederPoolAccount = {
  id: Scalars['ID'];
  account: Account;
  feederPool: FeederPool;
  cumulativeEarned: Metric;
  cumulativeEarnedVault: Metric;
  balance: Scalars['BigInt'];
  price: Scalars['BigInt'];
  lastUpdate: Scalars['Int'];
  balanceVault: Scalars['BigInt'];
  priceVault: Scalars['BigInt'];
  lastUpdateVault: Scalars['Int'];
};

export type FeederPoolAccount_Filter = {
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
  feederPool?: Maybe<Scalars['String']>;
  feederPool_not?: Maybe<Scalars['String']>;
  feederPool_gt?: Maybe<Scalars['String']>;
  feederPool_lt?: Maybe<Scalars['String']>;
  feederPool_gte?: Maybe<Scalars['String']>;
  feederPool_lte?: Maybe<Scalars['String']>;
  feederPool_in?: Maybe<Array<Scalars['String']>>;
  feederPool_not_in?: Maybe<Array<Scalars['String']>>;
  feederPool_contains?: Maybe<Scalars['String']>;
  feederPool_not_contains?: Maybe<Scalars['String']>;
  feederPool_starts_with?: Maybe<Scalars['String']>;
  feederPool_not_starts_with?: Maybe<Scalars['String']>;
  feederPool_ends_with?: Maybe<Scalars['String']>;
  feederPool_not_ends_with?: Maybe<Scalars['String']>;
  cumulativeEarned?: Maybe<Scalars['String']>;
  cumulativeEarned_not?: Maybe<Scalars['String']>;
  cumulativeEarned_gt?: Maybe<Scalars['String']>;
  cumulativeEarned_lt?: Maybe<Scalars['String']>;
  cumulativeEarned_gte?: Maybe<Scalars['String']>;
  cumulativeEarned_lte?: Maybe<Scalars['String']>;
  cumulativeEarned_in?: Maybe<Array<Scalars['String']>>;
  cumulativeEarned_not_in?: Maybe<Array<Scalars['String']>>;
  cumulativeEarned_contains?: Maybe<Scalars['String']>;
  cumulativeEarned_not_contains?: Maybe<Scalars['String']>;
  cumulativeEarned_starts_with?: Maybe<Scalars['String']>;
  cumulativeEarned_not_starts_with?: Maybe<Scalars['String']>;
  cumulativeEarned_ends_with?: Maybe<Scalars['String']>;
  cumulativeEarned_not_ends_with?: Maybe<Scalars['String']>;
  cumulativeEarnedVault?: Maybe<Scalars['String']>;
  cumulativeEarnedVault_not?: Maybe<Scalars['String']>;
  cumulativeEarnedVault_gt?: Maybe<Scalars['String']>;
  cumulativeEarnedVault_lt?: Maybe<Scalars['String']>;
  cumulativeEarnedVault_gte?: Maybe<Scalars['String']>;
  cumulativeEarnedVault_lte?: Maybe<Scalars['String']>;
  cumulativeEarnedVault_in?: Maybe<Array<Scalars['String']>>;
  cumulativeEarnedVault_not_in?: Maybe<Array<Scalars['String']>>;
  cumulativeEarnedVault_contains?: Maybe<Scalars['String']>;
  cumulativeEarnedVault_not_contains?: Maybe<Scalars['String']>;
  cumulativeEarnedVault_starts_with?: Maybe<Scalars['String']>;
  cumulativeEarnedVault_not_starts_with?: Maybe<Scalars['String']>;
  cumulativeEarnedVault_ends_with?: Maybe<Scalars['String']>;
  cumulativeEarnedVault_not_ends_with?: Maybe<Scalars['String']>;
  balance?: Maybe<Scalars['BigInt']>;
  balance_not?: Maybe<Scalars['BigInt']>;
  balance_gt?: Maybe<Scalars['BigInt']>;
  balance_lt?: Maybe<Scalars['BigInt']>;
  balance_gte?: Maybe<Scalars['BigInt']>;
  balance_lte?: Maybe<Scalars['BigInt']>;
  balance_in?: Maybe<Array<Scalars['BigInt']>>;
  balance_not_in?: Maybe<Array<Scalars['BigInt']>>;
  price?: Maybe<Scalars['BigInt']>;
  price_not?: Maybe<Scalars['BigInt']>;
  price_gt?: Maybe<Scalars['BigInt']>;
  price_lt?: Maybe<Scalars['BigInt']>;
  price_gte?: Maybe<Scalars['BigInt']>;
  price_lte?: Maybe<Scalars['BigInt']>;
  price_in?: Maybe<Array<Scalars['BigInt']>>;
  price_not_in?: Maybe<Array<Scalars['BigInt']>>;
  lastUpdate?: Maybe<Scalars['Int']>;
  lastUpdate_not?: Maybe<Scalars['Int']>;
  lastUpdate_gt?: Maybe<Scalars['Int']>;
  lastUpdate_lt?: Maybe<Scalars['Int']>;
  lastUpdate_gte?: Maybe<Scalars['Int']>;
  lastUpdate_lte?: Maybe<Scalars['Int']>;
  lastUpdate_in?: Maybe<Array<Scalars['Int']>>;
  lastUpdate_not_in?: Maybe<Array<Scalars['Int']>>;
  balanceVault?: Maybe<Scalars['BigInt']>;
  balanceVault_not?: Maybe<Scalars['BigInt']>;
  balanceVault_gt?: Maybe<Scalars['BigInt']>;
  balanceVault_lt?: Maybe<Scalars['BigInt']>;
  balanceVault_gte?: Maybe<Scalars['BigInt']>;
  balanceVault_lte?: Maybe<Scalars['BigInt']>;
  balanceVault_in?: Maybe<Array<Scalars['BigInt']>>;
  balanceVault_not_in?: Maybe<Array<Scalars['BigInt']>>;
  priceVault?: Maybe<Scalars['BigInt']>;
  priceVault_not?: Maybe<Scalars['BigInt']>;
  priceVault_gt?: Maybe<Scalars['BigInt']>;
  priceVault_lt?: Maybe<Scalars['BigInt']>;
  priceVault_gte?: Maybe<Scalars['BigInt']>;
  priceVault_lte?: Maybe<Scalars['BigInt']>;
  priceVault_in?: Maybe<Array<Scalars['BigInt']>>;
  priceVault_not_in?: Maybe<Array<Scalars['BigInt']>>;
  lastUpdateVault?: Maybe<Scalars['Int']>;
  lastUpdateVault_not?: Maybe<Scalars['Int']>;
  lastUpdateVault_gt?: Maybe<Scalars['Int']>;
  lastUpdateVault_lt?: Maybe<Scalars['Int']>;
  lastUpdateVault_gte?: Maybe<Scalars['Int']>;
  lastUpdateVault_lte?: Maybe<Scalars['Int']>;
  lastUpdateVault_in?: Maybe<Array<Scalars['Int']>>;
  lastUpdateVault_not_in?: Maybe<Array<Scalars['Int']>>;
};

export enum FeederPoolAccount_OrderBy {
  Id = 'id',
  Account = 'account',
  FeederPool = 'feederPool',
  CumulativeEarned = 'cumulativeEarned',
  CumulativeEarnedVault = 'cumulativeEarnedVault',
  Balance = 'balance',
  Price = 'price',
  LastUpdate = 'lastUpdate',
  BalanceVault = 'balanceVault',
  PriceVault = 'priceVault',
  LastUpdateVault = 'lastUpdateVault'
}

export type FpMintMultiTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  block: Scalars['Int'];
  sender: Scalars['Bytes'];
  recipient: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  /** The Feeder Pool the transaction relates to. */
  feederPool: FeederPool;
  /** The amount minted in Masset units. */
  massetUnits: Scalars['BigInt'];
  /**
   * The tokens used as the collateral asset for this mint.
   * This can be fAsset or mAsset.
   */
  inputs: Array<Basset>;
  /** The respective Basset units for each Basset used in this mint. */
  bassetsUnits: Array<Scalars['BigInt']>;
};


export type FpMintMultiTransactionInputsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Basset_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Basset_Filter>;
};

export type FpMintMultiTransaction_Filter = {
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
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  recipient?: Maybe<Scalars['Bytes']>;
  recipient_not?: Maybe<Scalars['Bytes']>;
  recipient_in?: Maybe<Array<Scalars['Bytes']>>;
  recipient_not_in?: Maybe<Array<Scalars['Bytes']>>;
  recipient_contains?: Maybe<Scalars['Bytes']>;
  recipient_not_contains?: Maybe<Scalars['Bytes']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feederPool?: Maybe<Scalars['String']>;
  feederPool_not?: Maybe<Scalars['String']>;
  feederPool_gt?: Maybe<Scalars['String']>;
  feederPool_lt?: Maybe<Scalars['String']>;
  feederPool_gte?: Maybe<Scalars['String']>;
  feederPool_lte?: Maybe<Scalars['String']>;
  feederPool_in?: Maybe<Array<Scalars['String']>>;
  feederPool_not_in?: Maybe<Array<Scalars['String']>>;
  feederPool_contains?: Maybe<Scalars['String']>;
  feederPool_not_contains?: Maybe<Scalars['String']>;
  feederPool_starts_with?: Maybe<Scalars['String']>;
  feederPool_not_starts_with?: Maybe<Scalars['String']>;
  feederPool_ends_with?: Maybe<Scalars['String']>;
  feederPool_not_ends_with?: Maybe<Scalars['String']>;
  massetUnits?: Maybe<Scalars['BigInt']>;
  massetUnits_not?: Maybe<Scalars['BigInt']>;
  massetUnits_gt?: Maybe<Scalars['BigInt']>;
  massetUnits_lt?: Maybe<Scalars['BigInt']>;
  massetUnits_gte?: Maybe<Scalars['BigInt']>;
  massetUnits_lte?: Maybe<Scalars['BigInt']>;
  massetUnits_in?: Maybe<Array<Scalars['BigInt']>>;
  massetUnits_not_in?: Maybe<Array<Scalars['BigInt']>>;
  inputs?: Maybe<Array<Scalars['String']>>;
  inputs_not?: Maybe<Array<Scalars['String']>>;
  inputs_contains?: Maybe<Array<Scalars['String']>>;
  inputs_not_contains?: Maybe<Array<Scalars['String']>>;
  bassetsUnits?: Maybe<Array<Scalars['BigInt']>>;
  bassetsUnits_not?: Maybe<Array<Scalars['BigInt']>>;
  bassetsUnits_contains?: Maybe<Array<Scalars['BigInt']>>;
  bassetsUnits_not_contains?: Maybe<Array<Scalars['BigInt']>>;
};

export enum FpMintMultiTransaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Sender = 'sender',
  Recipient = 'recipient',
  Timestamp = 'timestamp',
  FeederPool = 'feederPool',
  MassetUnits = 'massetUnits',
  Inputs = 'inputs',
  BassetsUnits = 'bassetsUnits'
}

export type FpMintSingleTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  block: Scalars['Int'];
  sender: Scalars['Bytes'];
  recipient: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  /** The Feeder Pool the transaction relates to. */
  feederPool: FeederPool;
  /** The amount minted in Masset units. */
  massetUnits: Scalars['BigInt'];
  /**
   * The token used as the collateral asset for this mint.
   * This can be fAsset, mAsset or mpAsset (main pool asset).
   */
  input: Token;
  /** The amount of the Basset used for this mint, in Basset units. */
  bassetUnits: Scalars['BigInt'];
};

export type FpMintSingleTransaction_Filter = {
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
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  recipient?: Maybe<Scalars['Bytes']>;
  recipient_not?: Maybe<Scalars['Bytes']>;
  recipient_in?: Maybe<Array<Scalars['Bytes']>>;
  recipient_not_in?: Maybe<Array<Scalars['Bytes']>>;
  recipient_contains?: Maybe<Scalars['Bytes']>;
  recipient_not_contains?: Maybe<Scalars['Bytes']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feederPool?: Maybe<Scalars['String']>;
  feederPool_not?: Maybe<Scalars['String']>;
  feederPool_gt?: Maybe<Scalars['String']>;
  feederPool_lt?: Maybe<Scalars['String']>;
  feederPool_gte?: Maybe<Scalars['String']>;
  feederPool_lte?: Maybe<Scalars['String']>;
  feederPool_in?: Maybe<Array<Scalars['String']>>;
  feederPool_not_in?: Maybe<Array<Scalars['String']>>;
  feederPool_contains?: Maybe<Scalars['String']>;
  feederPool_not_contains?: Maybe<Scalars['String']>;
  feederPool_starts_with?: Maybe<Scalars['String']>;
  feederPool_not_starts_with?: Maybe<Scalars['String']>;
  feederPool_ends_with?: Maybe<Scalars['String']>;
  feederPool_not_ends_with?: Maybe<Scalars['String']>;
  massetUnits?: Maybe<Scalars['BigInt']>;
  massetUnits_not?: Maybe<Scalars['BigInt']>;
  massetUnits_gt?: Maybe<Scalars['BigInt']>;
  massetUnits_lt?: Maybe<Scalars['BigInt']>;
  massetUnits_gte?: Maybe<Scalars['BigInt']>;
  massetUnits_lte?: Maybe<Scalars['BigInt']>;
  massetUnits_in?: Maybe<Array<Scalars['BigInt']>>;
  massetUnits_not_in?: Maybe<Array<Scalars['BigInt']>>;
  input?: Maybe<Scalars['String']>;
  input_not?: Maybe<Scalars['String']>;
  input_gt?: Maybe<Scalars['String']>;
  input_lt?: Maybe<Scalars['String']>;
  input_gte?: Maybe<Scalars['String']>;
  input_lte?: Maybe<Scalars['String']>;
  input_in?: Maybe<Array<Scalars['String']>>;
  input_not_in?: Maybe<Array<Scalars['String']>>;
  input_contains?: Maybe<Scalars['String']>;
  input_not_contains?: Maybe<Scalars['String']>;
  input_starts_with?: Maybe<Scalars['String']>;
  input_not_starts_with?: Maybe<Scalars['String']>;
  input_ends_with?: Maybe<Scalars['String']>;
  input_not_ends_with?: Maybe<Scalars['String']>;
  bassetUnits?: Maybe<Scalars['BigInt']>;
  bassetUnits_not?: Maybe<Scalars['BigInt']>;
  bassetUnits_gt?: Maybe<Scalars['BigInt']>;
  bassetUnits_lt?: Maybe<Scalars['BigInt']>;
  bassetUnits_gte?: Maybe<Scalars['BigInt']>;
  bassetUnits_lte?: Maybe<Scalars['BigInt']>;
  bassetUnits_in?: Maybe<Array<Scalars['BigInt']>>;
  bassetUnits_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum FpMintSingleTransaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Sender = 'sender',
  Recipient = 'recipient',
  Timestamp = 'timestamp',
  FeederPool = 'feederPool',
  MassetUnits = 'massetUnits',
  Input = 'input',
  BassetUnits = 'bassetUnits'
}

export type FpRedeemTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  block: Scalars['Int'];
  sender: Scalars['Bytes'];
  recipient: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  /** The Feeder Pool the transaction relates to. */
  feederPool: FeederPool;
  /** The amount redeemed in Masset units. */
  massetUnits: Scalars['BigInt'];
  /** The Bassets selected as assets to redeem. */
  bassets: Array<Basset>;
  /** The respective units of each Basset selected to redeem. */
  bassetsUnits: Array<Scalars['BigInt']>;
};


export type FpRedeemTransactionBassetsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Basset_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Basset_Filter>;
};

export type FpRedeemTransaction_Filter = {
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
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  recipient?: Maybe<Scalars['Bytes']>;
  recipient_not?: Maybe<Scalars['Bytes']>;
  recipient_in?: Maybe<Array<Scalars['Bytes']>>;
  recipient_not_in?: Maybe<Array<Scalars['Bytes']>>;
  recipient_contains?: Maybe<Scalars['Bytes']>;
  recipient_not_contains?: Maybe<Scalars['Bytes']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feederPool?: Maybe<Scalars['String']>;
  feederPool_not?: Maybe<Scalars['String']>;
  feederPool_gt?: Maybe<Scalars['String']>;
  feederPool_lt?: Maybe<Scalars['String']>;
  feederPool_gte?: Maybe<Scalars['String']>;
  feederPool_lte?: Maybe<Scalars['String']>;
  feederPool_in?: Maybe<Array<Scalars['String']>>;
  feederPool_not_in?: Maybe<Array<Scalars['String']>>;
  feederPool_contains?: Maybe<Scalars['String']>;
  feederPool_not_contains?: Maybe<Scalars['String']>;
  feederPool_starts_with?: Maybe<Scalars['String']>;
  feederPool_not_starts_with?: Maybe<Scalars['String']>;
  feederPool_ends_with?: Maybe<Scalars['String']>;
  feederPool_not_ends_with?: Maybe<Scalars['String']>;
  massetUnits?: Maybe<Scalars['BigInt']>;
  massetUnits_not?: Maybe<Scalars['BigInt']>;
  massetUnits_gt?: Maybe<Scalars['BigInt']>;
  massetUnits_lt?: Maybe<Scalars['BigInt']>;
  massetUnits_gte?: Maybe<Scalars['BigInt']>;
  massetUnits_lte?: Maybe<Scalars['BigInt']>;
  massetUnits_in?: Maybe<Array<Scalars['BigInt']>>;
  massetUnits_not_in?: Maybe<Array<Scalars['BigInt']>>;
  bassets?: Maybe<Array<Scalars['String']>>;
  bassets_not?: Maybe<Array<Scalars['String']>>;
  bassets_contains?: Maybe<Array<Scalars['String']>>;
  bassets_not_contains?: Maybe<Array<Scalars['String']>>;
  bassetsUnits?: Maybe<Array<Scalars['BigInt']>>;
  bassetsUnits_not?: Maybe<Array<Scalars['BigInt']>>;
  bassetsUnits_contains?: Maybe<Array<Scalars['BigInt']>>;
  bassetsUnits_not_contains?: Maybe<Array<Scalars['BigInt']>>;
};

export enum FpRedeemTransaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Sender = 'sender',
  Recipient = 'recipient',
  Timestamp = 'timestamp',
  FeederPool = 'feederPool',
  MassetUnits = 'massetUnits',
  Bassets = 'bassets',
  BassetsUnits = 'bassetsUnits'
}

export type FpSwapTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  block: Scalars['Int'];
  sender: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  /** The Feeder Pool the transaction relates to. */
  feederPool: FeederPool;
  /** The amount of the swap output in Masset units */
  massetUnits: Scalars['BigInt'];
  /** The Basset used as the input for this swap. */
  inputBasset: Basset;
  /** The Basset used as the output for this swap. */
  outputBasset: Basset;
  /** The recipient of the swap output. */
  recipient: Scalars['Bytes'];
};

export type FpSwapTransaction_Filter = {
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
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  feederPool?: Maybe<Scalars['String']>;
  feederPool_not?: Maybe<Scalars['String']>;
  feederPool_gt?: Maybe<Scalars['String']>;
  feederPool_lt?: Maybe<Scalars['String']>;
  feederPool_gte?: Maybe<Scalars['String']>;
  feederPool_lte?: Maybe<Scalars['String']>;
  feederPool_in?: Maybe<Array<Scalars['String']>>;
  feederPool_not_in?: Maybe<Array<Scalars['String']>>;
  feederPool_contains?: Maybe<Scalars['String']>;
  feederPool_not_contains?: Maybe<Scalars['String']>;
  feederPool_starts_with?: Maybe<Scalars['String']>;
  feederPool_not_starts_with?: Maybe<Scalars['String']>;
  feederPool_ends_with?: Maybe<Scalars['String']>;
  feederPool_not_ends_with?: Maybe<Scalars['String']>;
  massetUnits?: Maybe<Scalars['BigInt']>;
  massetUnits_not?: Maybe<Scalars['BigInt']>;
  massetUnits_gt?: Maybe<Scalars['BigInt']>;
  massetUnits_lt?: Maybe<Scalars['BigInt']>;
  massetUnits_gte?: Maybe<Scalars['BigInt']>;
  massetUnits_lte?: Maybe<Scalars['BigInt']>;
  massetUnits_in?: Maybe<Array<Scalars['BigInt']>>;
  massetUnits_not_in?: Maybe<Array<Scalars['BigInt']>>;
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

export enum FpSwapTransaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Sender = 'sender',
  Timestamp = 'timestamp',
  FeederPool = 'feederPool',
  MassetUnits = 'massetUnits',
  InputBasset = 'inputBasset',
  OutputBasset = 'outputBasset',
  Recipient = 'recipient'
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
  basset?: Maybe<Basset>;
  bassets: Array<Basset>;
  basket?: Maybe<Basket>;
  baskets: Array<Basket>;
  ampData?: Maybe<AmpData>;
  ampDatas: Array<AmpData>;
  boostedSavingsVault?: Maybe<BoostedSavingsVault>;
  boostedSavingsVaults: Array<BoostedSavingsVault>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  boostedSavingsVaultAccount?: Maybe<BoostedSavingsVaultAccount>;
  boostedSavingsVaultAccounts: Array<BoostedSavingsVaultAccount>;
  boostedSavingsVaultRewardEntry?: Maybe<BoostedSavingsVaultRewardEntry>;
  boostedSavingsVaultRewardEntries: Array<BoostedSavingsVaultRewardEntry>;
  boostedSavingsVaultStakeTransaction?: Maybe<BoostedSavingsVaultStakeTransaction>;
  boostedSavingsVaultStakeTransactions: Array<BoostedSavingsVaultStakeTransaction>;
  boostedSavingsVaultRewardAddedTransaction?: Maybe<BoostedSavingsVaultRewardAddedTransaction>;
  boostedSavingsVaultRewardAddedTransactions: Array<BoostedSavingsVaultRewardAddedTransaction>;
  boostedSavingsVaultRewardPaidTransaction?: Maybe<BoostedSavingsVaultRewardPaidTransaction>;
  boostedSavingsVaultRewardPaidTransactions: Array<BoostedSavingsVaultRewardPaidTransaction>;
  boostedSavingsVaultWithdrawTransaction?: Maybe<BoostedSavingsVaultWithdrawTransaction>;
  boostedSavingsVaultWithdrawTransactions: Array<BoostedSavingsVaultWithdrawTransaction>;
  feederPool?: Maybe<FeederPool>;
  feederPools: Array<FeederPool>;
  feederPoolAccount?: Maybe<FeederPoolAccount>;
  feederPoolAccounts: Array<FeederPoolAccount>;
  fpswapTransaction?: Maybe<FpSwapTransaction>;
  fpswapTransactions: Array<FpSwapTransaction>;
  fpmintSingleTransaction?: Maybe<FpMintSingleTransaction>;
  fpmintSingleTransactions: Array<FpMintSingleTransaction>;
  fpmintMultiTransaction?: Maybe<FpMintMultiTransaction>;
  fpmintMultiTransactions: Array<FpMintMultiTransaction>;
  fpredeemTransaction?: Maybe<FpRedeemTransaction>;
  fpredeemTransactions: Array<FpRedeemTransaction>;
  boostDirector?: Maybe<BoostDirector>;
  boostDirectors: Array<BoostDirector>;
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


export type QueryAmpDataArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryAmpDatasArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AmpData_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AmpData_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryBoostedSavingsVaultArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryBoostedSavingsVaultsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVault_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVault_Filter>;
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


export type QueryBoostedSavingsVaultAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryBoostedSavingsVaultAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultAccount_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryBoostedSavingsVaultRewardEntryArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryBoostedSavingsVaultRewardEntriesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultRewardEntry_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultRewardEntry_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryBoostedSavingsVaultStakeTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryBoostedSavingsVaultStakeTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultStakeTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultStakeTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryBoostedSavingsVaultRewardAddedTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryBoostedSavingsVaultRewardAddedTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultRewardAddedTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultRewardAddedTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryBoostedSavingsVaultRewardPaidTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryBoostedSavingsVaultRewardPaidTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultRewardPaidTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultRewardPaidTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryBoostedSavingsVaultWithdrawTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryBoostedSavingsVaultWithdrawTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultWithdrawTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultWithdrawTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryFeederPoolArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryFeederPoolsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FeederPool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FeederPool_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryFeederPoolAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryFeederPoolAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FeederPoolAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FeederPoolAccount_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryFpswapTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryFpswapTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FpSwapTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FpSwapTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryFpmintSingleTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryFpmintSingleTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FpMintSingleTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FpMintSingleTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryFpmintMultiTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryFpmintMultiTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FpMintMultiTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FpMintMultiTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryFpredeemTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryFpredeemTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FpRedeemTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FpRedeemTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryBoostDirectorArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryBoostDirectorsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostDirector_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostDirector_Filter>;
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

export type Subscription = {
  token?: Maybe<Token>;
  tokens: Array<Token>;
  metric?: Maybe<Metric>;
  metrics: Array<Metric>;
  counter?: Maybe<Counter>;
  counters: Array<Counter>;
  basset?: Maybe<Basset>;
  bassets: Array<Basset>;
  basket?: Maybe<Basket>;
  baskets: Array<Basket>;
  ampData?: Maybe<AmpData>;
  ampDatas: Array<AmpData>;
  boostedSavingsVault?: Maybe<BoostedSavingsVault>;
  boostedSavingsVaults: Array<BoostedSavingsVault>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  boostedSavingsVaultAccount?: Maybe<BoostedSavingsVaultAccount>;
  boostedSavingsVaultAccounts: Array<BoostedSavingsVaultAccount>;
  boostedSavingsVaultRewardEntry?: Maybe<BoostedSavingsVaultRewardEntry>;
  boostedSavingsVaultRewardEntries: Array<BoostedSavingsVaultRewardEntry>;
  boostedSavingsVaultStakeTransaction?: Maybe<BoostedSavingsVaultStakeTransaction>;
  boostedSavingsVaultStakeTransactions: Array<BoostedSavingsVaultStakeTransaction>;
  boostedSavingsVaultRewardAddedTransaction?: Maybe<BoostedSavingsVaultRewardAddedTransaction>;
  boostedSavingsVaultRewardAddedTransactions: Array<BoostedSavingsVaultRewardAddedTransaction>;
  boostedSavingsVaultRewardPaidTransaction?: Maybe<BoostedSavingsVaultRewardPaidTransaction>;
  boostedSavingsVaultRewardPaidTransactions: Array<BoostedSavingsVaultRewardPaidTransaction>;
  boostedSavingsVaultWithdrawTransaction?: Maybe<BoostedSavingsVaultWithdrawTransaction>;
  boostedSavingsVaultWithdrawTransactions: Array<BoostedSavingsVaultWithdrawTransaction>;
  feederPool?: Maybe<FeederPool>;
  feederPools: Array<FeederPool>;
  feederPoolAccount?: Maybe<FeederPoolAccount>;
  feederPoolAccounts: Array<FeederPoolAccount>;
  fpswapTransaction?: Maybe<FpSwapTransaction>;
  fpswapTransactions: Array<FpSwapTransaction>;
  fpmintSingleTransaction?: Maybe<FpMintSingleTransaction>;
  fpmintSingleTransactions: Array<FpMintSingleTransaction>;
  fpmintMultiTransaction?: Maybe<FpMintMultiTransaction>;
  fpmintMultiTransactions: Array<FpMintMultiTransaction>;
  fpredeemTransaction?: Maybe<FpRedeemTransaction>;
  fpredeemTransactions: Array<FpRedeemTransaction>;
  boostDirector?: Maybe<BoostDirector>;
  boostDirectors: Array<BoostDirector>;
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


export type SubscriptionAmpDataArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionAmpDatasArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AmpData_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AmpData_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionBoostedSavingsVaultArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionBoostedSavingsVaultsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVault_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVault_Filter>;
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


export type SubscriptionBoostedSavingsVaultAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionBoostedSavingsVaultAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultAccount_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionBoostedSavingsVaultRewardEntryArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionBoostedSavingsVaultRewardEntriesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultRewardEntry_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultRewardEntry_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionBoostedSavingsVaultStakeTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionBoostedSavingsVaultStakeTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultStakeTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultStakeTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionBoostedSavingsVaultRewardAddedTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionBoostedSavingsVaultRewardAddedTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultRewardAddedTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultRewardAddedTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionBoostedSavingsVaultRewardPaidTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionBoostedSavingsVaultRewardPaidTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultRewardPaidTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultRewardPaidTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionBoostedSavingsVaultWithdrawTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionBoostedSavingsVaultWithdrawTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostedSavingsVaultWithdrawTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostedSavingsVaultWithdrawTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionFeederPoolArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionFeederPoolsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FeederPool_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FeederPool_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionFeederPoolAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionFeederPoolAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FeederPoolAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FeederPoolAccount_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionFpswapTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionFpswapTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FpSwapTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FpSwapTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionFpmintSingleTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionFpmintSingleTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FpMintSingleTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FpMintSingleTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionFpmintMultiTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionFpmintMultiTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FpMintMultiTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FpMintMultiTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionFpredeemTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionFpredeemTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<FpRedeemTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<FpRedeemTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionBoostDirectorArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionBoostDirectorsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<BoostDirector_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<BoostDirector_Filter>;
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

type TransactionFields_FpMintMultiTransaction_Fragment = Pick<FpMintMultiTransaction, 'id' | 'hash' | 'timestamp' | 'block' | 'sender'>;

type TransactionFields_FpMintSingleTransaction_Fragment = Pick<FpMintSingleTransaction, 'id' | 'hash' | 'timestamp' | 'block' | 'sender'>;

type TransactionFields_FpRedeemTransaction_Fragment = Pick<FpRedeemTransaction, 'id' | 'hash' | 'timestamp' | 'block' | 'sender'>;

type TransactionFields_FpSwapTransaction_Fragment = Pick<FpSwapTransaction, 'id' | 'hash' | 'timestamp' | 'block' | 'sender'>;

type TransactionFields_BoostedSavingsVaultStakeTransaction_Fragment = Pick<BoostedSavingsVaultStakeTransaction, 'id' | 'hash' | 'timestamp' | 'block' | 'sender'>;

type TransactionFields_BoostedSavingsVaultRewardPaidTransaction_Fragment = Pick<BoostedSavingsVaultRewardPaidTransaction, 'id' | 'hash' | 'timestamp' | 'block' | 'sender'>;

type TransactionFields_BoostedSavingsVaultWithdrawTransaction_Fragment = Pick<BoostedSavingsVaultWithdrawTransaction, 'id' | 'hash' | 'timestamp' | 'block' | 'sender'>;

type TransactionFields_BoostedSavingsVaultRewardAddedTransaction_Fragment = Pick<BoostedSavingsVaultRewardAddedTransaction, 'id' | 'hash' | 'timestamp' | 'block' | 'sender'>;

export type TransactionFieldsFragment = TransactionFields_FpMintMultiTransaction_Fragment | TransactionFields_FpMintSingleTransaction_Fragment | TransactionFields_FpRedeemTransaction_Fragment | TransactionFields_FpSwapTransaction_Fragment | TransactionFields_BoostedSavingsVaultStakeTransaction_Fragment | TransactionFields_BoostedSavingsVaultRewardPaidTransaction_Fragment | TransactionFields_BoostedSavingsVaultWithdrawTransaction_Fragment | TransactionFields_BoostedSavingsVaultRewardAddedTransaction_Fragment;

export type MetricFieldsFragment = Pick<Metric, 'exact' | 'decimals' | 'simple'>;

export type FpMetricsFragment = (
  Pick<FeederPool, 'price' | 'invariantK' | 'dailyAPY'>
  & { cumulativeSwapped: MetricFieldsFragment, cumulativeInterestCollected: MetricFieldsFragment, cumulativeInterestDistributed: MetricFieldsFragment, cumulativeFeesPaid: MetricFieldsFragment, cumulativeMinted: MetricFieldsFragment, cumulativeRedeemed: MetricFieldsFragment, totalMints: Pick<Counter, 'value'>, totalRedeemMassets: Pick<Counter, 'value'>, totalRedemptions: Pick<Counter, 'value'>, totalSupply: MetricFieldsFragment, totalSwaps: Pick<Counter, 'value'> }
);

export type TokenAllFragment = (
  Pick<Token, 'id' | 'address' | 'decimals' | 'symbol'>
  & { totalSupply: MetricFieldsFragment }
);

export type BassetAllFragment = (
  Pick<Basset, 'id' | 'isTransferFeeCharged' | 'ratio' | 'status' | 'maxWeight'>
  & { vaultBalance: MetricFieldsFragment, token: TokenAllFragment }
);

export type BoostedSavingsVaultAllFragment = (
  Pick<BoostedSavingsVault, 'id' | 'lastUpdateTime' | 'lockupDuration' | 'unlockPercentage' | 'periodDuration' | 'periodFinish' | 'rewardPerTokenStored' | 'rewardRate' | 'stakingContract' | 'totalStakingRewards' | 'totalSupply' | 'priceCoeff' | 'boostCoeff'>
  & { stakingToken: Pick<Token, 'address'>, accounts: Array<(
    Pick<BoostedSavingsVaultAccount, 'id' | 'boostedBalance' | 'lastAction' | 'lastClaim' | 'rawBalance' | 'rewardCount' | 'rewardPerTokenPaid' | 'rewards'>
    & { rewardEntries: Array<Pick<BoostedSavingsVaultRewardEntry, 'id' | 'finish' | 'index' | 'rate' | 'start'>> }
  )> }
);

export type FeederPoolsQueryVariables = {
  account: Scalars['String'];
  hasAccount: Scalars['Boolean'];
};


export type FeederPoolsQuery = { feederPools: Array<(
    Pick<FeederPool, 'id' | 'swapFeeRate' | 'redemptionFeeRate' | 'governanceFeeRate' | 'dailyAPY' | 'price' | 'invariantK'>
    & { basket: (
      Pick<Basket, 'undergoingRecol' | 'failed'>
      & { bassets: Array<BassetAllFragment> }
    ), token: TokenAllFragment, fasset: TokenAllFragment, masset: Pick<Token, 'id'>, vault: BoostedSavingsVaultAllFragment, accounts: Array<(
      Pick<FeederPoolAccount, 'balance' | 'price' | 'lastUpdate' | 'balanceVault' | 'priceVault' | 'lastUpdateVault'>
      & { cumulativeEarned: Pick<Metric, 'exact' | 'decimals'>, cumulativeEarnedVault: Pick<Metric, 'exact' | 'decimals'> }
    )> }
  )>, otherVaults: Array<BoostedSavingsVaultAllFragment> };

export type FeederTokensQueryVariables = {};


export type FeederTokensQuery = { feederPools: Array<{ token: TokenAllFragment, fasset: TokenAllFragment }> };

export type FeederPoolMetricsQueryVariables = {
  feederPool: Scalars['ID'];
  block: Block_Height;
};


export type FeederPoolMetricsQuery = { current?: Maybe<FpMetricsFragment>, historic?: Maybe<FpMetricsFragment> };

export const TransactionFieldsFragmentDoc = gql`
    fragment TransactionFields on Transaction {
  id
  hash
  timestamp
  block
  sender
}
    `;
export const MetricFieldsFragmentDoc = gql`
    fragment MetricFields on Metric {
  exact
  decimals
  simple
}
    `;
export const FpMetricsFragmentDoc = gql`
    fragment FPMetrics on FeederPool {
  cumulativeSwapped {
    ...MetricFields
  }
  cumulativeInterestCollected {
    ...MetricFields
  }
  cumulativeInterestDistributed {
    ...MetricFields
  }
  cumulativeFeesPaid {
    ...MetricFields
  }
  cumulativeMinted {
    ...MetricFields
  }
  cumulativeRedeemed {
    ...MetricFields
  }
  totalMints {
    value
  }
  totalRedeemMassets {
    value
  }
  totalRedemptions {
    value
  }
  totalSupply {
    ...MetricFields
  }
  totalSwaps {
    value
  }
  price
  invariantK
  dailyAPY
}
    ${MetricFieldsFragmentDoc}`;
export const TokenAllFragmentDoc = gql`
    fragment TokenAll on Token {
  id
  address
  decimals
  symbol
  totalSupply {
    ...MetricFields
  }
}
    ${MetricFieldsFragmentDoc}`;
export const BassetAllFragmentDoc = gql`
    fragment BassetAll on Basset {
  id
  vaultBalance {
    ...MetricFields
  }
  isTransferFeeCharged
  ratio
  status
  maxWeight
  token {
    ...TokenAll
  }
}
    ${MetricFieldsFragmentDoc}
${TokenAllFragmentDoc}`;
export const BoostedSavingsVaultAllFragmentDoc = gql`
    fragment BoostedSavingsVaultAll on BoostedSavingsVault {
  id
  lastUpdateTime
  lockupDuration
  unlockPercentage
  periodDuration
  periodFinish
  rewardPerTokenStored
  rewardRate
  stakingContract
  stakingToken {
    address
  }
  totalStakingRewards
  totalSupply
  priceCoeff
  boostCoeff
  accounts(where: {account: $account}) @include(if: $hasAccount) {
    id
    boostedBalance
    lastAction
    lastClaim
    rawBalance
    rewardCount
    rewardPerTokenPaid
    rewards
    rewardEntries(orderBy: index, orderDirection: asc) {
      id
      finish
      index
      rate
      start
    }
  }
}
    `;
export const FeederPoolsDocument = gql`
    query FeederPools($account: String!, $hasAccount: Boolean!) @api(name: feeders) {
  feederPools {
    id
    swapFeeRate
    redemptionFeeRate
    governanceFeeRate
    dailyAPY
    price
    invariantK
    basket {
      bassets {
        ...BassetAll
      }
      undergoingRecol
      failed
    }
    token {
      ...TokenAll
    }
    fasset {
      ...TokenAll
    }
    masset {
      id
    }
    vault {
      ...BoostedSavingsVaultAll
    }
    accounts(where: {account: $account}) @include(if: $hasAccount) {
      balance
      price
      lastUpdate
      balanceVault
      priceVault
      lastUpdateVault
      cumulativeEarned {
        exact
        decimals
      }
      cumulativeEarnedVault {
        exact
        decimals
      }
    }
  }
  otherVaults: boostedSavingsVaults(where: {feederPool: null}) {
    ...BoostedSavingsVaultAll
  }
}
    ${BassetAllFragmentDoc}
${TokenAllFragmentDoc}
${BoostedSavingsVaultAllFragmentDoc}`;

/**
 * __useFeederPoolsQuery__
 *
 * To run a query within a React component, call `useFeederPoolsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFeederPoolsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeederPoolsQuery({
 *   variables: {
 *      account: // value for 'account'
 *      hasAccount: // value for 'hasAccount'
 *   },
 * });
 */
export function useFeederPoolsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FeederPoolsQuery, FeederPoolsQueryVariables>) {
        return ApolloReactHooks.useQuery<FeederPoolsQuery, FeederPoolsQueryVariables>(FeederPoolsDocument, baseOptions);
      }
export function useFeederPoolsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FeederPoolsQuery, FeederPoolsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<FeederPoolsQuery, FeederPoolsQueryVariables>(FeederPoolsDocument, baseOptions);
        }
export type FeederPoolsQueryHookResult = ReturnType<typeof useFeederPoolsQuery>;
export type FeederPoolsLazyQueryHookResult = ReturnType<typeof useFeederPoolsLazyQuery>;
export type FeederPoolsQueryResult = ApolloReactCommon.QueryResult<FeederPoolsQuery, FeederPoolsQueryVariables>;
export const FeederTokensDocument = gql`
    query FeederTokens @api(name: feeders) {
  feederPools {
    token {
      ...TokenAll
    }
    fasset {
      ...TokenAll
    }
  }
}
    ${TokenAllFragmentDoc}`;

/**
 * __useFeederTokensQuery__
 *
 * To run a query within a React component, call `useFeederTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useFeederTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeederTokensQuery({
 *   variables: {
 *   },
 * });
 */
export function useFeederTokensQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FeederTokensQuery, FeederTokensQueryVariables>) {
        return ApolloReactHooks.useQuery<FeederTokensQuery, FeederTokensQueryVariables>(FeederTokensDocument, baseOptions);
      }
export function useFeederTokensLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FeederTokensQuery, FeederTokensQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<FeederTokensQuery, FeederTokensQueryVariables>(FeederTokensDocument, baseOptions);
        }
export type FeederTokensQueryHookResult = ReturnType<typeof useFeederTokensQuery>;
export type FeederTokensLazyQueryHookResult = ReturnType<typeof useFeederTokensLazyQuery>;
export type FeederTokensQueryResult = ApolloReactCommon.QueryResult<FeederTokensQuery, FeederTokensQueryVariables>;
export const FeederPoolMetricsDocument = gql`
    query FeederPoolMetrics($feederPool: ID!, $block: Block_height!) @api(name: feeders) {
  current: feederPool(id: $feederPool) {
    ...FPMetrics
  }
  historic: feederPool(id: $feederPool, block: $block) {
    ...FPMetrics
  }
}
    ${FpMetricsFragmentDoc}`;

/**
 * __useFeederPoolMetricsQuery__
 *
 * To run a query within a React component, call `useFeederPoolMetricsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFeederPoolMetricsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeederPoolMetricsQuery({
 *   variables: {
 *      feederPool: // value for 'feederPool'
 *      block: // value for 'block'
 *   },
 * });
 */
export function useFeederPoolMetricsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<FeederPoolMetricsQuery, FeederPoolMetricsQueryVariables>) {
        return ApolloReactHooks.useQuery<FeederPoolMetricsQuery, FeederPoolMetricsQueryVariables>(FeederPoolMetricsDocument, baseOptions);
      }
export function useFeederPoolMetricsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<FeederPoolMetricsQuery, FeederPoolMetricsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<FeederPoolMetricsQuery, FeederPoolMetricsQueryVariables>(FeederPoolMetricsDocument, baseOptions);
        }
export type FeederPoolMetricsQueryHookResult = ReturnType<typeof useFeederPoolMetricsQuery>;
export type FeederPoolMetricsLazyQueryHookResult = ReturnType<typeof useFeederPoolMetricsLazyQuery>;
export type FeederPoolMetricsQueryResult = ApolloReactCommon.QueryResult<FeederPoolMetricsQuery, FeederPoolMetricsQueryVariables>;