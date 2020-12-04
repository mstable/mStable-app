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
            "name": "SavingsContractDepositTransaction"
          },
          {
            "name": "SavingsContractWithdrawTransaction"
          },
          {
            "name": "SwapTransaction"
          },
          {
            "name": "PaidFeeTransaction"
          },
          {
            "name": "RedeemMassetTransaction"
          },
          {
            "name": "MintMultiTransaction"
          },
          {
            "name": "MintSingleTransaction"
          },
          {
            "name": "RedeemTransaction"
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
};

/**
 * An Ethereum account that has interacted with Save v1
 * @deprecated
 */
export type Account = {
  /** Address of the account */
  id: Scalars['ID'];
  /** Credit balance of the account (Save v1 only) */
  creditBalance?: Maybe<CreditBalance>;
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
  creditBalance?: Maybe<Scalars['String']>;
  creditBalance_not?: Maybe<Scalars['String']>;
  creditBalance_gt?: Maybe<Scalars['String']>;
  creditBalance_lt?: Maybe<Scalars['String']>;
  creditBalance_gte?: Maybe<Scalars['String']>;
  creditBalance_lte?: Maybe<Scalars['String']>;
  creditBalance_in?: Maybe<Array<Scalars['String']>>;
  creditBalance_not_in?: Maybe<Array<Scalars['String']>>;
  creditBalance_contains?: Maybe<Scalars['String']>;
  creditBalance_not_contains?: Maybe<Scalars['String']>;
  creditBalance_starts_with?: Maybe<Scalars['String']>;
  creditBalance_not_starts_with?: Maybe<Scalars['String']>;
  creditBalance_ends_with?: Maybe<Scalars['String']>;
  creditBalance_not_ends_with?: Maybe<Scalars['String']>;
};

export enum Account_OrderBy {
  Id = 'id',
  CreditBalance = 'creditBalance'
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
  Masset = 'masset'
}

/** Basket Asset (e.g. DAI for the mUSD basket) */
export type Basset = {
  /** Address of the Basset token contract */
  id: Scalars['ID'];
  /** Basket the Basset is contained in */
  basket: Basket;
  /** Target weight of the Basset */
  maxWeight: Scalars['BigInt'];
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
  Basket = 'basket',
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

/**
 * A credit balance for a given savings contract (Save v1 only)
 * @deprecated
 */
export type CreditBalance = {
  id: Scalars['ID'];
  /** Account */
  account: Account;
  /** Amount as an exact value */
  amount: Scalars['BigInt'];
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
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
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
  SavingsContract = 'savingsContract'
}

export type ExchangeRate = {
  id: Scalars['ID'];
  /**
   * The exchange rate; this is used to derive the `totalSavings` on the Savings Contract;
   * totalCredits * exchangeRate = totalSavings
   */
  rate: Scalars['BigDecimal'];
  /** The timestamp at which the rate was created. */
  timestamp: Scalars['Int'];
  /** The SavingsContract this ExchangeRate relates to. */
  savingsContract: SavingsContract;
  /** The next exchange rate for the savings contract (by timestamp); used for calculating APY. */
  next?: Maybe<ExchangeRate>;
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
  rate?: Maybe<Scalars['BigDecimal']>;
  rate_not?: Maybe<Scalars['BigDecimal']>;
  rate_gt?: Maybe<Scalars['BigDecimal']>;
  rate_lt?: Maybe<Scalars['BigDecimal']>;
  rate_gte?: Maybe<Scalars['BigDecimal']>;
  rate_lte?: Maybe<Scalars['BigDecimal']>;
  rate_in?: Maybe<Array<Scalars['BigDecimal']>>;
  rate_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
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
  next?: Maybe<Scalars['String']>;
  next_not?: Maybe<Scalars['String']>;
  next_gt?: Maybe<Scalars['String']>;
  next_lt?: Maybe<Scalars['String']>;
  next_gte?: Maybe<Scalars['String']>;
  next_lte?: Maybe<Scalars['String']>;
  next_in?: Maybe<Array<Scalars['String']>>;
  next_not_in?: Maybe<Array<Scalars['String']>>;
  next_contains?: Maybe<Scalars['String']>;
  next_not_contains?: Maybe<Scalars['String']>;
  next_starts_with?: Maybe<Scalars['String']>;
  next_not_starts_with?: Maybe<Scalars['String']>;
  next_ends_with?: Maybe<Scalars['String']>;
  next_not_ends_with?: Maybe<Scalars['String']>;
};

export enum ExchangeRate_OrderBy {
  Id = 'id',
  Rate = 'rate',
  Timestamp = 'timestamp',
  SavingsContract = 'savingsContract',
  Next = 'next'
}

/** An mStable asset (e.g. mUSD) */
export type Masset = {
  /** Address of the Masset contract */
  id: Scalars['ID'];
  /** The Basket of Bassets for this Masset */
  basket: Basket;
  /** The address of the `BasketManager` contract for this Masset */
  basketManager: Scalars['Bytes'];
  /** The swap fee rate */
  feeRate: Scalars['BigInt'];
  /** The redemption fee rate */
  redemptionFeeRate: Scalars['BigInt'];
  /** Total number of mint transactions for this Masset */
  totalMints: Counter;
  /** Total number of swap transactions for this Masset */
  totalSwaps: Counter;
  /** Total number of redemption transactions for this Masset (excluding proportional redemption) */
  totalRedemptions: Counter;
  /** Total number of proportional redemption (i.e. `RedeemMasset`) transactions for this Masset */
  totalRedeemMassets: Counter;
  /** Total supply of the Masset token */
  totalSupply: Metric;
  /** Cumulative amount of this Masset that has been minted */
  cumulativeMinted: Metric;
  /** Cumulative amount of this Masset that has been swapped */
  cumulativeSwapped: Metric;
  /** Cumulative amount of this Masset that has been redeemed */
  cumulativeRedeemed: Metric;
  /** Cumulative amount of this Masset that has been proportionally redeemed (i.e. `RedeemMasset`) */
  cumulativeRedeemedMasset: Metric;
  /** Cumulative amount of fees paid (e.g. for swaps and redemptions) for this Masset */
  cumulativeFeesPaid: Metric;
  /** The underlying Token for this Masset */
  token: Token;
  /** All savings Contracts for this Masset */
  savingsContracts: Array<SavingsContract>;
  /** All swap transactions sent with this Masset */
  swapTransactions: Array<SwapTransaction>;
  /** All transactions sent with this Masset where a fee was paid */
  paidFeeTransactions: Array<PaidFeeTransaction>;
  /** All proportional redemption (`RedeemMasset`) transactions sent with this Masset */
  redeemMassetTransactions: Array<RedeemMassetTransaction>;
  /** All mint-multi transactions sent with this Masset */
  mintMultiTransactions: Array<MintMultiTransaction>;
  /** All mint-single transactions sent with this Masset */
  mintSingleTransactions: Array<MintSingleTransaction>;
  /** All redemption transactions sent with this Masset (excluding proportional redemptions) */
  redeemTransactions: Array<RedeemTransaction>;
};


/** An mStable asset (e.g. mUSD) */
export type MassetSavingsContractsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SavingsContract_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SavingsContract_Filter>;
};


/** An mStable asset (e.g. mUSD) */
export type MassetSwapTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SwapTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SwapTransaction_Filter>;
};


/** An mStable asset (e.g. mUSD) */
export type MassetPaidFeeTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PaidFeeTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PaidFeeTransaction_Filter>;
};


/** An mStable asset (e.g. mUSD) */
export type MassetRedeemMassetTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<RedeemMassetTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<RedeemMassetTransaction_Filter>;
};


/** An mStable asset (e.g. mUSD) */
export type MassetMintMultiTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MintMultiTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MintMultiTransaction_Filter>;
};


/** An mStable asset (e.g. mUSD) */
export type MassetMintSingleTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MintSingleTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MintSingleTransaction_Filter>;
};


/** An mStable asset (e.g. mUSD) */
export type MassetRedeemTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<RedeemTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<RedeemTransaction_Filter>;
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
  basketManager?: Maybe<Scalars['Bytes']>;
  basketManager_not?: Maybe<Scalars['Bytes']>;
  basketManager_in?: Maybe<Array<Scalars['Bytes']>>;
  basketManager_not_in?: Maybe<Array<Scalars['Bytes']>>;
  basketManager_contains?: Maybe<Scalars['Bytes']>;
  basketManager_not_contains?: Maybe<Scalars['Bytes']>;
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
  cumulativeRedeemedMasset?: Maybe<Scalars['String']>;
  cumulativeRedeemedMasset_not?: Maybe<Scalars['String']>;
  cumulativeRedeemedMasset_gt?: Maybe<Scalars['String']>;
  cumulativeRedeemedMasset_lt?: Maybe<Scalars['String']>;
  cumulativeRedeemedMasset_gte?: Maybe<Scalars['String']>;
  cumulativeRedeemedMasset_lte?: Maybe<Scalars['String']>;
  cumulativeRedeemedMasset_in?: Maybe<Array<Scalars['String']>>;
  cumulativeRedeemedMasset_not_in?: Maybe<Array<Scalars['String']>>;
  cumulativeRedeemedMasset_contains?: Maybe<Scalars['String']>;
  cumulativeRedeemedMasset_not_contains?: Maybe<Scalars['String']>;
  cumulativeRedeemedMasset_starts_with?: Maybe<Scalars['String']>;
  cumulativeRedeemedMasset_not_starts_with?: Maybe<Scalars['String']>;
  cumulativeRedeemedMasset_ends_with?: Maybe<Scalars['String']>;
  cumulativeRedeemedMasset_not_ends_with?: Maybe<Scalars['String']>;
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

export enum Masset_OrderBy {
  Id = 'id',
  Basket = 'basket',
  BasketManager = 'basketManager',
  FeeRate = 'feeRate',
  RedemptionFeeRate = 'redemptionFeeRate',
  TotalMints = 'totalMints',
  TotalSwaps = 'totalSwaps',
  TotalRedemptions = 'totalRedemptions',
  TotalRedeemMassets = 'totalRedeemMassets',
  TotalSupply = 'totalSupply',
  CumulativeMinted = 'cumulativeMinted',
  CumulativeSwapped = 'cumulativeSwapped',
  CumulativeRedeemed = 'cumulativeRedeemed',
  CumulativeRedeemedMasset = 'cumulativeRedeemedMasset',
  CumulativeFeesPaid = 'cumulativeFeesPaid',
  Token = 'token',
  SavingsContracts = 'savingsContracts',
  SwapTransactions = 'swapTransactions',
  PaidFeeTransactions = 'paidFeeTransactions',
  RedeemMassetTransactions = 'redeemMassetTransactions',
  MintMultiTransactions = 'mintMultiTransactions',
  MintSingleTransactions = 'mintSingleTransactions',
  RedeemTransactions = 'redeemTransactions'
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

export type MintMultiTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  block: Scalars['Int'];
  sender: Scalars['Bytes'];
  recipient: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  /** The Masset the transaction relates to. */
  masset: Masset;
  /** The amount of the Masset minted, in Masset units. */
  massetUnits: Scalars['BigInt'];
  /** The Bassets used as collateral assets for this mint. */
  bassets: Array<Basset>;
  /** The respective Basset units for each Basset used in this mint. */
  bassetsUnits: Array<Scalars['BigInt']>;
};


export type MintMultiTransactionBassetsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Basset_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Basset_Filter>;
};

export type MintMultiTransaction_Filter = {
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

export enum MintMultiTransaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Sender = 'sender',
  Recipient = 'recipient',
  Timestamp = 'timestamp',
  Masset = 'masset',
  MassetUnits = 'massetUnits',
  Bassets = 'bassets',
  BassetsUnits = 'bassetsUnits'
}

export type MintSingleTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  block: Scalars['Int'];
  sender: Scalars['Bytes'];
  recipient: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  /** The Masset the transaction relates to. */
  masset: Masset;
  /** The amount of the Masset minted, in Masset units. */
  massetUnits: Scalars['BigInt'];
  /** The Basset used as the collateral asset for this mint. */
  basset: Basset;
  /** The amount of the Basset used for this mint, in Basset units. */
  bassetUnits: Scalars['BigInt'];
};

export type MintSingleTransaction_Filter = {
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
  massetUnits?: Maybe<Scalars['BigInt']>;
  massetUnits_not?: Maybe<Scalars['BigInt']>;
  massetUnits_gt?: Maybe<Scalars['BigInt']>;
  massetUnits_lt?: Maybe<Scalars['BigInt']>;
  massetUnits_gte?: Maybe<Scalars['BigInt']>;
  massetUnits_lte?: Maybe<Scalars['BigInt']>;
  massetUnits_in?: Maybe<Array<Scalars['BigInt']>>;
  massetUnits_not_in?: Maybe<Array<Scalars['BigInt']>>;
  basset?: Maybe<Scalars['String']>;
  basset_not?: Maybe<Scalars['String']>;
  basset_gt?: Maybe<Scalars['String']>;
  basset_lt?: Maybe<Scalars['String']>;
  basset_gte?: Maybe<Scalars['String']>;
  basset_lte?: Maybe<Scalars['String']>;
  basset_in?: Maybe<Array<Scalars['String']>>;
  basset_not_in?: Maybe<Array<Scalars['String']>>;
  basset_contains?: Maybe<Scalars['String']>;
  basset_not_contains?: Maybe<Scalars['String']>;
  basset_starts_with?: Maybe<Scalars['String']>;
  basset_not_starts_with?: Maybe<Scalars['String']>;
  basset_ends_with?: Maybe<Scalars['String']>;
  basset_not_ends_with?: Maybe<Scalars['String']>;
  bassetUnits?: Maybe<Scalars['BigInt']>;
  bassetUnits_not?: Maybe<Scalars['BigInt']>;
  bassetUnits_gt?: Maybe<Scalars['BigInt']>;
  bassetUnits_lt?: Maybe<Scalars['BigInt']>;
  bassetUnits_gte?: Maybe<Scalars['BigInt']>;
  bassetUnits_lte?: Maybe<Scalars['BigInt']>;
  bassetUnits_in?: Maybe<Array<Scalars['BigInt']>>;
  bassetUnits_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum MintSingleTransaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Sender = 'sender',
  Recipient = 'recipient',
  Timestamp = 'timestamp',
  Masset = 'masset',
  MassetUnits = 'massetUnits',
  Basset = 'basset',
  BassetUnits = 'bassetUnits'
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type PaidFeeTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  block: Scalars['Int'];
  sender: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  /** The Masset the transaction relates to. */
  masset: Masset;
  /** The amount of the fee that was paid, in Masset units. */
  massetUnits: Scalars['BigInt'];
  /** The Basset the fee was paid in. */
  basset: Basset;
  /** The amount of the fee that was paid, in Basset units. */
  bassetUnits: Scalars['BigInt'];
};

export type PaidFeeTransaction_Filter = {
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
  massetUnits?: Maybe<Scalars['BigInt']>;
  massetUnits_not?: Maybe<Scalars['BigInt']>;
  massetUnits_gt?: Maybe<Scalars['BigInt']>;
  massetUnits_lt?: Maybe<Scalars['BigInt']>;
  massetUnits_gte?: Maybe<Scalars['BigInt']>;
  massetUnits_lte?: Maybe<Scalars['BigInt']>;
  massetUnits_in?: Maybe<Array<Scalars['BigInt']>>;
  massetUnits_not_in?: Maybe<Array<Scalars['BigInt']>>;
  basset?: Maybe<Scalars['String']>;
  basset_not?: Maybe<Scalars['String']>;
  basset_gt?: Maybe<Scalars['String']>;
  basset_lt?: Maybe<Scalars['String']>;
  basset_gte?: Maybe<Scalars['String']>;
  basset_lte?: Maybe<Scalars['String']>;
  basset_in?: Maybe<Array<Scalars['String']>>;
  basset_not_in?: Maybe<Array<Scalars['String']>>;
  basset_contains?: Maybe<Scalars['String']>;
  basset_not_contains?: Maybe<Scalars['String']>;
  basset_starts_with?: Maybe<Scalars['String']>;
  basset_not_starts_with?: Maybe<Scalars['String']>;
  basset_ends_with?: Maybe<Scalars['String']>;
  basset_not_ends_with?: Maybe<Scalars['String']>;
  bassetUnits?: Maybe<Scalars['BigInt']>;
  bassetUnits_not?: Maybe<Scalars['BigInt']>;
  bassetUnits_gt?: Maybe<Scalars['BigInt']>;
  bassetUnits_lt?: Maybe<Scalars['BigInt']>;
  bassetUnits_gte?: Maybe<Scalars['BigInt']>;
  bassetUnits_lte?: Maybe<Scalars['BigInt']>;
  bassetUnits_in?: Maybe<Array<Scalars['BigInt']>>;
  bassetUnits_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum PaidFeeTransaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Sender = 'sender',
  Timestamp = 'timestamp',
  Masset = 'masset',
  MassetUnits = 'massetUnits',
  Basset = 'basset',
  BassetUnits = 'bassetUnits'
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
  masset?: Maybe<Masset>;
  massets: Array<Masset>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  creditBalance?: Maybe<CreditBalance>;
  creditBalances: Array<CreditBalance>;
  savingsContract?: Maybe<SavingsContract>;
  savingsContracts: Array<SavingsContract>;
  exchangeRate?: Maybe<ExchangeRate>;
  exchangeRates: Array<ExchangeRate>;
  swapTransaction?: Maybe<SwapTransaction>;
  swapTransactions: Array<SwapTransaction>;
  paidFeeTransaction?: Maybe<PaidFeeTransaction>;
  paidFeeTransactions: Array<PaidFeeTransaction>;
  mintSingleTransaction?: Maybe<MintSingleTransaction>;
  mintSingleTransactions: Array<MintSingleTransaction>;
  mintMultiTransaction?: Maybe<MintMultiTransaction>;
  mintMultiTransactions: Array<MintMultiTransaction>;
  redeemTransaction?: Maybe<RedeemTransaction>;
  redeemTransactions: Array<RedeemTransaction>;
  redeemMassetTransaction?: Maybe<RedeemMassetTransaction>;
  redeemMassetTransactions: Array<RedeemMassetTransaction>;
  savingsContractDepositTransaction?: Maybe<SavingsContractDepositTransaction>;
  savingsContractDepositTransactions: Array<SavingsContractDepositTransaction>;
  savingsContractWithdrawTransaction?: Maybe<SavingsContractWithdrawTransaction>;
  savingsContractWithdrawTransactions: Array<SavingsContractWithdrawTransaction>;
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


export type QueryPaidFeeTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryPaidFeeTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PaidFeeTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PaidFeeTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryMintSingleTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryMintSingleTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MintSingleTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MintSingleTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryMintMultiTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryMintMultiTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MintMultiTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MintMultiTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryRedeemTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryRedeemTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<RedeemTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<RedeemTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryRedeemMassetTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryRedeemMassetTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<RedeemMassetTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<RedeemMassetTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type QuerySavingsContractDepositTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QuerySavingsContractDepositTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SavingsContractDepositTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SavingsContractDepositTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type QuerySavingsContractWithdrawTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QuerySavingsContractWithdrawTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SavingsContractWithdrawTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SavingsContractWithdrawTransaction_Filter>;
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

export type RedeemMassetTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  block: Scalars['Int'];
  sender: Scalars['Bytes'];
  recipient: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  /** The Masset the transaction relates to. */
  masset: Masset;
  /** The amount redeemed in Masset units. */
  massetUnits: Scalars['BigInt'];
};

export type RedeemMassetTransaction_Filter = {
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
  massetUnits?: Maybe<Scalars['BigInt']>;
  massetUnits_not?: Maybe<Scalars['BigInt']>;
  massetUnits_gt?: Maybe<Scalars['BigInt']>;
  massetUnits_lt?: Maybe<Scalars['BigInt']>;
  massetUnits_gte?: Maybe<Scalars['BigInt']>;
  massetUnits_lte?: Maybe<Scalars['BigInt']>;
  massetUnits_in?: Maybe<Array<Scalars['BigInt']>>;
  massetUnits_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum RedeemMassetTransaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Sender = 'sender',
  Recipient = 'recipient',
  Timestamp = 'timestamp',
  Masset = 'masset',
  MassetUnits = 'massetUnits'
}

export type RedeemTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  block: Scalars['Int'];
  sender: Scalars['Bytes'];
  recipient: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  /** The Masset the transaction relates to. */
  masset: Masset;
  /** The amount redeemed in Masset units. */
  massetUnits: Scalars['BigInt'];
  /** The Bassets selected as assets to redeem. */
  bassets: Array<Basset>;
  /** The respective units of each Basset selected to redeem. */
  bassetsUnits: Array<Scalars['BigInt']>;
};


export type RedeemTransactionBassetsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Basset_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Basset_Filter>;
};

export type RedeemTransaction_Filter = {
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

export enum RedeemTransaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Sender = 'sender',
  Recipient = 'recipient',
  Timestamp = 'timestamp',
  Masset = 'masset',
  MassetUnits = 'massetUnits',
  Bassets = 'bassets',
  BassetsUnits = 'bassetsUnits'
}

export type SavingsContract = {
  /** Address of the SavingsContract */
  id: Scalars['ID'];
  /** The Masset using this SavingsContract */
  masset: Masset;
  /** The amount of underlying savings in the contract */
  totalSavings: Metric;
  /**
   * Total number of savings credits issued (v1 only)
   * @deprecated
   */
  totalCredits?: Maybe<Metric>;
  /** The total number of deposits made */
  totalDeposits: Counter;
  /** The total number of withdrawals made */
  totalWithdrawals: Counter;
  /** The cumulative amount of savings deposited */
  cumulativeDeposited: Metric;
  /** The cumulative amount of savings withdrawn */
  cumulativeWithdrawn: Metric;
  /**
   * The daily APY value; this is derived from the `ExchangeRate` closest to 24h ago from the last-received
   * `ExchangeRate`, and will change whenever a new `ExchangeRate` is created.
   */
  dailyAPY: Scalars['BigDecimal'];
  /**
   * The share of the Masset that is deposited in the Savings Contract; a rate of 100% would mean all of the
   * Masset being deposited in the Savings Contract.
   */
  utilisationRate: Metric;
  /** Flag for whether the automatic collection of interest is enabled. */
  automationEnabled: Scalars['Boolean'];
  /** The latest exchange rate that was received */
  latestExchangeRate?: Maybe<ExchangeRate>;
  /**
   * The exchange rate that is closest to 24h ago from the latest exchange rate;
   * used to derive daily APYs.
   */
  exchangeRate24hAgo?: Maybe<ExchangeRate>;
  /** All credit balances relating to this Savings Contract. */
  creditBalances: Array<CreditBalance>;
  /** All exchange rates relating to this Savings Contract. */
  exchangeRates: Array<ExchangeRate>;
  /** All deposit transactions sent with this Savings Contract. */
  depositTransactions: Array<SavingsContractDepositTransaction>;
  /** All withdraw transactions sent with this Savings Contract. */
  withdrawTransactions: Array<SavingsContractWithdrawTransaction>;
  /**
   * Version of the savings contract (starting from 1). This value will never change for each entity,
   * and can be used to determine the features of the contract.
   */
  version: Scalars['Int'];
  /**
   * This field is not present in v1 savings contracts; starting from v2, savings contracts
   * are ERC20-compatible tokens.
   */
  token?: Maybe<Token>;
};


export type SavingsContractCreditBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CreditBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<CreditBalance_Filter>;
};


export type SavingsContractExchangeRatesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ExchangeRate_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<ExchangeRate_Filter>;
};


export type SavingsContractDepositTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SavingsContractDepositTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SavingsContractDepositTransaction_Filter>;
};


export type SavingsContractWithdrawTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SavingsContractWithdrawTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SavingsContractWithdrawTransaction_Filter>;
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
  totalSavings?: Maybe<Scalars['String']>;
  totalSavings_not?: Maybe<Scalars['String']>;
  totalSavings_gt?: Maybe<Scalars['String']>;
  totalSavings_lt?: Maybe<Scalars['String']>;
  totalSavings_gte?: Maybe<Scalars['String']>;
  totalSavings_lte?: Maybe<Scalars['String']>;
  totalSavings_in?: Maybe<Array<Scalars['String']>>;
  totalSavings_not_in?: Maybe<Array<Scalars['String']>>;
  totalSavings_contains?: Maybe<Scalars['String']>;
  totalSavings_not_contains?: Maybe<Scalars['String']>;
  totalSavings_starts_with?: Maybe<Scalars['String']>;
  totalSavings_not_starts_with?: Maybe<Scalars['String']>;
  totalSavings_ends_with?: Maybe<Scalars['String']>;
  totalSavings_not_ends_with?: Maybe<Scalars['String']>;
  totalCredits?: Maybe<Scalars['String']>;
  totalCredits_not?: Maybe<Scalars['String']>;
  totalCredits_gt?: Maybe<Scalars['String']>;
  totalCredits_lt?: Maybe<Scalars['String']>;
  totalCredits_gte?: Maybe<Scalars['String']>;
  totalCredits_lte?: Maybe<Scalars['String']>;
  totalCredits_in?: Maybe<Array<Scalars['String']>>;
  totalCredits_not_in?: Maybe<Array<Scalars['String']>>;
  totalCredits_contains?: Maybe<Scalars['String']>;
  totalCredits_not_contains?: Maybe<Scalars['String']>;
  totalCredits_starts_with?: Maybe<Scalars['String']>;
  totalCredits_not_starts_with?: Maybe<Scalars['String']>;
  totalCredits_ends_with?: Maybe<Scalars['String']>;
  totalCredits_not_ends_with?: Maybe<Scalars['String']>;
  totalDeposits?: Maybe<Scalars['String']>;
  totalDeposits_not?: Maybe<Scalars['String']>;
  totalDeposits_gt?: Maybe<Scalars['String']>;
  totalDeposits_lt?: Maybe<Scalars['String']>;
  totalDeposits_gte?: Maybe<Scalars['String']>;
  totalDeposits_lte?: Maybe<Scalars['String']>;
  totalDeposits_in?: Maybe<Array<Scalars['String']>>;
  totalDeposits_not_in?: Maybe<Array<Scalars['String']>>;
  totalDeposits_contains?: Maybe<Scalars['String']>;
  totalDeposits_not_contains?: Maybe<Scalars['String']>;
  totalDeposits_starts_with?: Maybe<Scalars['String']>;
  totalDeposits_not_starts_with?: Maybe<Scalars['String']>;
  totalDeposits_ends_with?: Maybe<Scalars['String']>;
  totalDeposits_not_ends_with?: Maybe<Scalars['String']>;
  totalWithdrawals?: Maybe<Scalars['String']>;
  totalWithdrawals_not?: Maybe<Scalars['String']>;
  totalWithdrawals_gt?: Maybe<Scalars['String']>;
  totalWithdrawals_lt?: Maybe<Scalars['String']>;
  totalWithdrawals_gte?: Maybe<Scalars['String']>;
  totalWithdrawals_lte?: Maybe<Scalars['String']>;
  totalWithdrawals_in?: Maybe<Array<Scalars['String']>>;
  totalWithdrawals_not_in?: Maybe<Array<Scalars['String']>>;
  totalWithdrawals_contains?: Maybe<Scalars['String']>;
  totalWithdrawals_not_contains?: Maybe<Scalars['String']>;
  totalWithdrawals_starts_with?: Maybe<Scalars['String']>;
  totalWithdrawals_not_starts_with?: Maybe<Scalars['String']>;
  totalWithdrawals_ends_with?: Maybe<Scalars['String']>;
  totalWithdrawals_not_ends_with?: Maybe<Scalars['String']>;
  cumulativeDeposited?: Maybe<Scalars['String']>;
  cumulativeDeposited_not?: Maybe<Scalars['String']>;
  cumulativeDeposited_gt?: Maybe<Scalars['String']>;
  cumulativeDeposited_lt?: Maybe<Scalars['String']>;
  cumulativeDeposited_gte?: Maybe<Scalars['String']>;
  cumulativeDeposited_lte?: Maybe<Scalars['String']>;
  cumulativeDeposited_in?: Maybe<Array<Scalars['String']>>;
  cumulativeDeposited_not_in?: Maybe<Array<Scalars['String']>>;
  cumulativeDeposited_contains?: Maybe<Scalars['String']>;
  cumulativeDeposited_not_contains?: Maybe<Scalars['String']>;
  cumulativeDeposited_starts_with?: Maybe<Scalars['String']>;
  cumulativeDeposited_not_starts_with?: Maybe<Scalars['String']>;
  cumulativeDeposited_ends_with?: Maybe<Scalars['String']>;
  cumulativeDeposited_not_ends_with?: Maybe<Scalars['String']>;
  cumulativeWithdrawn?: Maybe<Scalars['String']>;
  cumulativeWithdrawn_not?: Maybe<Scalars['String']>;
  cumulativeWithdrawn_gt?: Maybe<Scalars['String']>;
  cumulativeWithdrawn_lt?: Maybe<Scalars['String']>;
  cumulativeWithdrawn_gte?: Maybe<Scalars['String']>;
  cumulativeWithdrawn_lte?: Maybe<Scalars['String']>;
  cumulativeWithdrawn_in?: Maybe<Array<Scalars['String']>>;
  cumulativeWithdrawn_not_in?: Maybe<Array<Scalars['String']>>;
  cumulativeWithdrawn_contains?: Maybe<Scalars['String']>;
  cumulativeWithdrawn_not_contains?: Maybe<Scalars['String']>;
  cumulativeWithdrawn_starts_with?: Maybe<Scalars['String']>;
  cumulativeWithdrawn_not_starts_with?: Maybe<Scalars['String']>;
  cumulativeWithdrawn_ends_with?: Maybe<Scalars['String']>;
  cumulativeWithdrawn_not_ends_with?: Maybe<Scalars['String']>;
  dailyAPY?: Maybe<Scalars['BigDecimal']>;
  dailyAPY_not?: Maybe<Scalars['BigDecimal']>;
  dailyAPY_gt?: Maybe<Scalars['BigDecimal']>;
  dailyAPY_lt?: Maybe<Scalars['BigDecimal']>;
  dailyAPY_gte?: Maybe<Scalars['BigDecimal']>;
  dailyAPY_lte?: Maybe<Scalars['BigDecimal']>;
  dailyAPY_in?: Maybe<Array<Scalars['BigDecimal']>>;
  dailyAPY_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  utilisationRate?: Maybe<Scalars['String']>;
  utilisationRate_not?: Maybe<Scalars['String']>;
  utilisationRate_gt?: Maybe<Scalars['String']>;
  utilisationRate_lt?: Maybe<Scalars['String']>;
  utilisationRate_gte?: Maybe<Scalars['String']>;
  utilisationRate_lte?: Maybe<Scalars['String']>;
  utilisationRate_in?: Maybe<Array<Scalars['String']>>;
  utilisationRate_not_in?: Maybe<Array<Scalars['String']>>;
  utilisationRate_contains?: Maybe<Scalars['String']>;
  utilisationRate_not_contains?: Maybe<Scalars['String']>;
  utilisationRate_starts_with?: Maybe<Scalars['String']>;
  utilisationRate_not_starts_with?: Maybe<Scalars['String']>;
  utilisationRate_ends_with?: Maybe<Scalars['String']>;
  utilisationRate_not_ends_with?: Maybe<Scalars['String']>;
  automationEnabled?: Maybe<Scalars['Boolean']>;
  automationEnabled_not?: Maybe<Scalars['Boolean']>;
  automationEnabled_in?: Maybe<Array<Scalars['Boolean']>>;
  automationEnabled_not_in?: Maybe<Array<Scalars['Boolean']>>;
  latestExchangeRate?: Maybe<Scalars['String']>;
  latestExchangeRate_not?: Maybe<Scalars['String']>;
  latestExchangeRate_gt?: Maybe<Scalars['String']>;
  latestExchangeRate_lt?: Maybe<Scalars['String']>;
  latestExchangeRate_gte?: Maybe<Scalars['String']>;
  latestExchangeRate_lte?: Maybe<Scalars['String']>;
  latestExchangeRate_in?: Maybe<Array<Scalars['String']>>;
  latestExchangeRate_not_in?: Maybe<Array<Scalars['String']>>;
  latestExchangeRate_contains?: Maybe<Scalars['String']>;
  latestExchangeRate_not_contains?: Maybe<Scalars['String']>;
  latestExchangeRate_starts_with?: Maybe<Scalars['String']>;
  latestExchangeRate_not_starts_with?: Maybe<Scalars['String']>;
  latestExchangeRate_ends_with?: Maybe<Scalars['String']>;
  latestExchangeRate_not_ends_with?: Maybe<Scalars['String']>;
  exchangeRate24hAgo?: Maybe<Scalars['String']>;
  exchangeRate24hAgo_not?: Maybe<Scalars['String']>;
  exchangeRate24hAgo_gt?: Maybe<Scalars['String']>;
  exchangeRate24hAgo_lt?: Maybe<Scalars['String']>;
  exchangeRate24hAgo_gte?: Maybe<Scalars['String']>;
  exchangeRate24hAgo_lte?: Maybe<Scalars['String']>;
  exchangeRate24hAgo_in?: Maybe<Array<Scalars['String']>>;
  exchangeRate24hAgo_not_in?: Maybe<Array<Scalars['String']>>;
  exchangeRate24hAgo_contains?: Maybe<Scalars['String']>;
  exchangeRate24hAgo_not_contains?: Maybe<Scalars['String']>;
  exchangeRate24hAgo_starts_with?: Maybe<Scalars['String']>;
  exchangeRate24hAgo_not_starts_with?: Maybe<Scalars['String']>;
  exchangeRate24hAgo_ends_with?: Maybe<Scalars['String']>;
  exchangeRate24hAgo_not_ends_with?: Maybe<Scalars['String']>;
  version?: Maybe<Scalars['Int']>;
  version_not?: Maybe<Scalars['Int']>;
  version_gt?: Maybe<Scalars['Int']>;
  version_lt?: Maybe<Scalars['Int']>;
  version_gte?: Maybe<Scalars['Int']>;
  version_lte?: Maybe<Scalars['Int']>;
  version_in?: Maybe<Array<Scalars['Int']>>;
  version_not_in?: Maybe<Array<Scalars['Int']>>;
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

export enum SavingsContract_OrderBy {
  Id = 'id',
  Masset = 'masset',
  TotalSavings = 'totalSavings',
  TotalCredits = 'totalCredits',
  TotalDeposits = 'totalDeposits',
  TotalWithdrawals = 'totalWithdrawals',
  CumulativeDeposited = 'cumulativeDeposited',
  CumulativeWithdrawn = 'cumulativeWithdrawn',
  DailyApy = 'dailyAPY',
  UtilisationRate = 'utilisationRate',
  AutomationEnabled = 'automationEnabled',
  LatestExchangeRate = 'latestExchangeRate',
  ExchangeRate24hAgo = 'exchangeRate24hAgo',
  CreditBalances = 'creditBalances',
  ExchangeRates = 'exchangeRates',
  DepositTransactions = 'depositTransactions',
  WithdrawTransactions = 'withdrawTransactions',
  Version = 'version',
  Token = 'token'
}

export type SavingsContractDepositTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  block: Scalars['Int'];
  sender: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  /** The SavingsContract the transaction relates to. */
  savingsContract: SavingsContract;
  /** The amount deposited. */
  amount: Scalars['BigInt'];
};

export type SavingsContractDepositTransaction_Filter = {
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
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum SavingsContractDepositTransaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Sender = 'sender',
  Timestamp = 'timestamp',
  SavingsContract = 'savingsContract',
  Amount = 'amount'
}

export type SavingsContractWithdrawTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  block: Scalars['Int'];
  sender: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  /** The SavingsContract the transaction relates to. */
  savingsContract: SavingsContract;
  /** The amount withdrawn. */
  amount: Scalars['BigInt'];
};

export type SavingsContractWithdrawTransaction_Filter = {
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
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum SavingsContractWithdrawTransaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Sender = 'sender',
  Timestamp = 'timestamp',
  SavingsContract = 'savingsContract',
  Amount = 'amount'
}

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
  masset?: Maybe<Masset>;
  massets: Array<Masset>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  creditBalance?: Maybe<CreditBalance>;
  creditBalances: Array<CreditBalance>;
  savingsContract?: Maybe<SavingsContract>;
  savingsContracts: Array<SavingsContract>;
  exchangeRate?: Maybe<ExchangeRate>;
  exchangeRates: Array<ExchangeRate>;
  swapTransaction?: Maybe<SwapTransaction>;
  swapTransactions: Array<SwapTransaction>;
  paidFeeTransaction?: Maybe<PaidFeeTransaction>;
  paidFeeTransactions: Array<PaidFeeTransaction>;
  mintSingleTransaction?: Maybe<MintSingleTransaction>;
  mintSingleTransactions: Array<MintSingleTransaction>;
  mintMultiTransaction?: Maybe<MintMultiTransaction>;
  mintMultiTransactions: Array<MintMultiTransaction>;
  redeemTransaction?: Maybe<RedeemTransaction>;
  redeemTransactions: Array<RedeemTransaction>;
  redeemMassetTransaction?: Maybe<RedeemMassetTransaction>;
  redeemMassetTransactions: Array<RedeemMassetTransaction>;
  savingsContractDepositTransaction?: Maybe<SavingsContractDepositTransaction>;
  savingsContractDepositTransactions: Array<SavingsContractDepositTransaction>;
  savingsContractWithdrawTransaction?: Maybe<SavingsContractWithdrawTransaction>;
  savingsContractWithdrawTransactions: Array<SavingsContractWithdrawTransaction>;
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


export type SubscriptionPaidFeeTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionPaidFeeTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<PaidFeeTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<PaidFeeTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionMintSingleTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionMintSingleTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MintSingleTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MintSingleTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionMintMultiTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionMintMultiTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MintMultiTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MintMultiTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionRedeemTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionRedeemTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<RedeemTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<RedeemTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionRedeemMassetTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionRedeemMassetTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<RedeemMassetTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<RedeemMassetTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionSavingsContractDepositTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionSavingsContractDepositTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SavingsContractDepositTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SavingsContractDepositTransaction_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionSavingsContractWithdrawTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionSavingsContractWithdrawTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SavingsContractWithdrawTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SavingsContractWithdrawTransaction_Filter>;
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

export type SwapTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  block: Scalars['Int'];
  sender: Scalars['Bytes'];
  timestamp: Scalars['BigInt'];
  /** The Masset the transaction relates to. */
  masset: Masset;
  /** The amount of the swap output in Masset units */
  massetUnits: Scalars['BigInt'];
  /** The Basset used as the input for this swap. */
  inputBasset: Basset;
  /** The Basset used as the output for this swap. */
  outputBasset: Basset;
  /** The recipient of the swap output. */
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

export enum SwapTransaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Sender = 'sender',
  Timestamp = 'timestamp',
  Masset = 'masset',
  MassetUnits = 'massetUnits',
  InputBasset = 'inputBasset',
  OutputBasset = 'outputBasset',
  Recipient = 'recipient'
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
  & { totalSupply: MetricFieldsFragment }
);

export type SavingsContractAllFragment = (
  Pick<SavingsContract, 'id' | 'dailyAPY' | 'automationEnabled' | 'version'>
  & { totalSavings: MetricFieldsFragment, latestExchangeRate?: Maybe<Pick<ExchangeRate, 'rate' | 'timestamp'>> }
);

type TransactionFields_SavingsContractDepositTransaction_Fragment = Pick<SavingsContractDepositTransaction, 'id' | 'hash' | 'timestamp' | 'block' | 'sender'>;

type TransactionFields_SavingsContractWithdrawTransaction_Fragment = Pick<SavingsContractWithdrawTransaction, 'id' | 'hash' | 'timestamp' | 'block' | 'sender'>;

type TransactionFields_SwapTransaction_Fragment = Pick<SwapTransaction, 'id' | 'hash' | 'timestamp' | 'block' | 'sender'>;

type TransactionFields_PaidFeeTransaction_Fragment = Pick<PaidFeeTransaction, 'id' | 'hash' | 'timestamp' | 'block' | 'sender'>;

type TransactionFields_RedeemMassetTransaction_Fragment = Pick<RedeemMassetTransaction, 'id' | 'hash' | 'timestamp' | 'block' | 'sender'>;

type TransactionFields_MintMultiTransaction_Fragment = Pick<MintMultiTransaction, 'id' | 'hash' | 'timestamp' | 'block' | 'sender'>;

type TransactionFields_MintSingleTransaction_Fragment = Pick<MintSingleTransaction, 'id' | 'hash' | 'timestamp' | 'block' | 'sender'>;

type TransactionFields_RedeemTransaction_Fragment = Pick<RedeemTransaction, 'id' | 'hash' | 'timestamp' | 'block' | 'sender'>;

export type TransactionFieldsFragment = TransactionFields_SavingsContractDepositTransaction_Fragment | TransactionFields_SavingsContractWithdrawTransaction_Fragment | TransactionFields_SwapTransaction_Fragment | TransactionFields_PaidFeeTransaction_Fragment | TransactionFields_RedeemMassetTransaction_Fragment | TransactionFields_MintMultiTransaction_Fragment | TransactionFields_MintSingleTransaction_Fragment | TransactionFields_RedeemTransaction_Fragment;

export type MetricFieldsFragment = Pick<Metric, 'exact' | 'decimals' | 'simple'>;

export type MassetsQueryVariables = {
  account: Scalars['String'];
  hasAccount: Scalars['Boolean'];
};


export type MassetsQuery = { massets: Array<(
    Pick<Masset, 'id' | 'feeRate' | 'redemptionFeeRate'>
    & { token: TokenDetailsFragment, basket: (
      Pick<Basket, 'failed' | 'collateralisationRatio' | 'undergoingRecol'>
      & { bassets: Array<(
        Pick<Basset, 'id' | 'isTransferFeeCharged' | 'ratio' | 'status' | 'maxWeight'>
        & { vaultBalance: MetricFieldsFragment, token: TokenDetailsFragment }
      )>, removedBassets: Array<(
        Pick<Basset, 'id'>
        & { token: TokenDetailsFragment }
      )> }
    ), savingsContractsV1: Array<(
      { totalCredits?: Maybe<MetricFieldsFragment>, creditBalances: Array<Pick<CreditBalance, 'amount'>> }
      & SavingsContractAllFragment
    )>, savingsContractsV2: Array<(
      { token?: Maybe<TokenDetailsFragment> }
      & SavingsContractAllFragment
    )> }
  )> };

export type AllTokensQueryVariables = {};


export type AllTokensQuery = { savingsContracts: Array<(
    Pick<SavingsContract, 'id'>
    & { address: SavingsContract['id'] }
  )>, tokens: Array<TokenDetailsFragment> };

export type TokenQueryVariables = {
  id: Scalars['ID'];
};


export type TokenQuery = { token?: Maybe<TokenDetailsFragment> };

export type HistoricTransactionsQueryVariables = {
  account?: Maybe<Scalars['Bytes']>;
};


export type HistoricTransactionsQuery = { transactions: Array<(
    { __typename: 'SavingsContractDepositTransaction' }
    & Pick<SavingsContractDepositTransaction, 'amount' | 'id' | 'hash' | 'block' | 'timestamp' | 'sender'>
    & { savingsContract: (
      Pick<SavingsContract, 'id'>
      & { masset: Pick<Masset, 'id'> }
    ) }
  ) | (
    { __typename: 'SavingsContractWithdrawTransaction' }
    & Pick<SavingsContractWithdrawTransaction, 'amount' | 'id' | 'hash' | 'block' | 'timestamp' | 'sender'>
    & { savingsContract: (
      Pick<SavingsContract, 'id'>
      & { masset: Pick<Masset, 'id'> }
    ) }
  ) | (
    { __typename: 'SwapTransaction' }
    & Pick<SwapTransaction, 'massetUnits' | 'id' | 'hash' | 'block' | 'timestamp' | 'sender'>
    & { masset: Pick<Masset, 'id'>, inputBasset: Pick<Basset, 'id'>, outputBasset: Pick<Basset, 'id'> }
  ) | (
    { __typename: 'PaidFeeTransaction' }
    & Pick<PaidFeeTransaction, 'bassetUnits' | 'massetUnits' | 'id' | 'hash' | 'block' | 'timestamp' | 'sender'>
    & { basset: Pick<Basset, 'id'>, masset: Pick<Masset, 'id'> }
  ) | (
    { __typename: 'RedeemMassetTransaction' }
    & Pick<RedeemMassetTransaction, 'massetUnits' | 'recipient' | 'id' | 'hash' | 'block' | 'timestamp' | 'sender'>
    & { masset: Pick<Masset, 'id'> }
  ) | (
    { __typename: 'MintMultiTransaction' }
    & Pick<MintMultiTransaction, 'massetUnits' | 'bassetsUnits' | 'id' | 'hash' | 'block' | 'timestamp' | 'sender'>
    & { masset: Pick<Masset, 'id'>, bassets: Array<Pick<Basset, 'id'>> }
  ) | (
    { __typename: 'MintSingleTransaction' }
    & Pick<MintSingleTransaction, 'bassetUnits' | 'massetUnits' | 'id' | 'hash' | 'block' | 'timestamp' | 'sender'>
    & { masset: Pick<Masset, 'id'>, basset: Pick<Basset, 'id'> }
  ) | (
    { __typename: 'RedeemTransaction' }
    & Pick<RedeemTransaction, 'massetUnits' | 'bassetsUnits' | 'recipient' | 'id' | 'hash' | 'block' | 'timestamp' | 'sender'>
    & { masset: Pick<Masset, 'id'>, bassets: Array<Pick<Basset, 'id'>> }
  )> };

export const MetricFieldsFragmentDoc = gql`
    fragment MetricFields on Metric {
  exact
  decimals
  simple
}
    `;
export const TokenDetailsFragmentDoc = gql`
    fragment TokenDetails on Token {
  id
  address
  decimals
  symbol
  totalSupply {
    ...MetricFields
  }
}
    ${MetricFieldsFragmentDoc}`;
export const SavingsContractAllFragmentDoc = gql`
    fragment SavingsContractAll on SavingsContract {
  id
  totalSavings {
    ...MetricFields
  }
  latestExchangeRate {
    rate
    timestamp
  }
  dailyAPY
  automationEnabled
  version
}
    ${MetricFieldsFragmentDoc}`;
export const TransactionFieldsFragmentDoc = gql`
    fragment TransactionFields on Transaction {
  id
  hash
  timestamp
  block
  sender
}
    `;
export const MassetsDocument = gql`
    query Massets($account: String!, $hasAccount: Boolean!) @api(name: protocol) {
  massets {
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
      bassets: bassets(where: {removed: false}) {
        id
        vaultBalance {
          ...MetricFields
        }
        isTransferFeeCharged
        ratio
        status
        maxWeight
        token {
          ...TokenDetails
        }
      }
      removedBassets: bassets(where: {removed: true}) {
        id
        token {
          ...TokenDetails
        }
      }
    }
    savingsContractsV1: savingsContracts(where: {version: 1}) {
      ...SavingsContractAll
      totalCredits {
        ...MetricFields
      }
      creditBalances(where: {account: $account}) @include(if: $hasAccount) {
        amount
      }
    }
    savingsContractsV2: savingsContracts(where: {version: 2}) {
      ...SavingsContractAll
      token {
        ...TokenDetails
      }
    }
  }
}
    ${TokenDetailsFragmentDoc}
${MetricFieldsFragmentDoc}
${SavingsContractAllFragmentDoc}`;

/**
 * __useMassetsQuery__
 *
 * To run a query within a React component, call `useMassetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMassetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMassetsQuery({
 *   variables: {
 *      account: // value for 'account'
 *      hasAccount: // value for 'hasAccount'
 *   },
 * });
 */
export function useMassetsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<MassetsQuery, MassetsQueryVariables>) {
        return ApolloReactHooks.useQuery<MassetsQuery, MassetsQueryVariables>(MassetsDocument, baseOptions);
      }
export function useMassetsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MassetsQuery, MassetsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<MassetsQuery, MassetsQueryVariables>(MassetsDocument, baseOptions);
        }
export type MassetsQueryHookResult = ReturnType<typeof useMassetsQuery>;
export type MassetsLazyQueryHookResult = ReturnType<typeof useMassetsLazyQuery>;
export type MassetsQueryResult = ApolloReactCommon.QueryResult<MassetsQuery, MassetsQueryVariables>;
export const AllTokensDocument = gql`
    query AllTokens @api(name: protocol) {
  savingsContracts(where: {version: 1}) {
    address: id
    id
  }
  tokens {
    ...TokenDetails
  }
}
    ${TokenDetailsFragmentDoc}`;

/**
 * __useAllTokensQuery__
 *
 * To run a query within a React component, call `useAllTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useAllTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAllTokensQuery({
 *   variables: {
 *   },
 * });
 */
export function useAllTokensQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<AllTokensQuery, AllTokensQueryVariables>) {
        return ApolloReactHooks.useQuery<AllTokensQuery, AllTokensQueryVariables>(AllTokensDocument, baseOptions);
      }
export function useAllTokensLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<AllTokensQuery, AllTokensQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<AllTokensQuery, AllTokensQueryVariables>(AllTokensDocument, baseOptions);
        }
export type AllTokensQueryHookResult = ReturnType<typeof useAllTokensQuery>;
export type AllTokensLazyQueryHookResult = ReturnType<typeof useAllTokensLazyQuery>;
export type AllTokensQueryResult = ApolloReactCommon.QueryResult<AllTokensQuery, AllTokensQueryVariables>;
export const TokenDocument = gql`
    query Token($id: ID!) @api(name: protocol) {
  token(id: $id) {
    ...TokenDetails
  }
}
    ${TokenDetailsFragmentDoc}`;

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
export const HistoricTransactionsDocument = gql`
    query HistoricTransactions($account: Bytes) @api(name: protocol) {
  transactions(where: {sender: $account}, orderBy: timestamp, orderDirection: desc) {
    id
    hash
    block
    timestamp
    sender
    __typename
    ... on RedeemTransaction {
      masset {
        id
      }
      massetUnits
      bassets {
        id
      }
      bassetsUnits
      recipient
    }
    ... on RedeemMassetTransaction {
      masset {
        id
      }
      massetUnits
      recipient
    }
    ... on MintMultiTransaction {
      masset {
        id
      }
      massetUnits
      bassets {
        id
      }
      bassetsUnits
    }
    ... on MintSingleTransaction {
      bassetUnits
      masset {
        id
      }
      basset {
        id
      }
      massetUnits
    }
    ... on PaidFeeTransaction {
      basset {
        id
      }
      bassetUnits
      masset {
        id
      }
      massetUnits
    }
    ... on SavingsContractDepositTransaction {
      amount
      savingsContract {
        id
        masset {
          id
        }
      }
    }
    ... on SavingsContractWithdrawTransaction {
      amount
      savingsContract {
        id
        masset {
          id
        }
      }
    }
    ... on SwapTransaction {
      masset {
        id
      }
      inputBasset {
        id
      }
      outputBasset {
        id
      }
      massetUnits
    }
  }
}
    `;

/**
 * __useHistoricTransactionsQuery__
 *
 * To run a query within a React component, call `useHistoricTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useHistoricTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHistoricTransactionsQuery({
 *   variables: {
 *      account: // value for 'account'
 *   },
 * });
 */
export function useHistoricTransactionsQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<HistoricTransactionsQuery, HistoricTransactionsQueryVariables>) {
        return ApolloReactHooks.useQuery<HistoricTransactionsQuery, HistoricTransactionsQueryVariables>(HistoricTransactionsDocument, baseOptions);
      }
export function useHistoricTransactionsLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<HistoricTransactionsQuery, HistoricTransactionsQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<HistoricTransactionsQuery, HistoricTransactionsQueryVariables>(HistoricTransactionsDocument, baseOptions);
        }
export type HistoricTransactionsQueryHookResult = ReturnType<typeof useHistoricTransactionsQuery>;
export type HistoricTransactionsLazyQueryHookResult = ReturnType<typeof useHistoricTransactionsLazyQuery>;
export type HistoricTransactionsQueryResult = ApolloReactCommon.QueryResult<HistoricTransactionsQuery, HistoricTransactionsQueryVariables>;