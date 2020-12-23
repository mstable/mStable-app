import { bigNumberify } from 'ethers/utils';

import { BigDecimal } from '../../web3/BigDecimal';
import { MassetName, SubscribedToken } from '../../types';
import { MassetsQueryResult, TokenAllFragment } from '../../graphql/protocol';
import {
  BassetStatus,
  BoostedSavingsVaultState,
  DataState,
  MassetState,
  SavingsContractState,
} from './types';
import { Tokens } from '../TokensProvider';

type SavingsContractV1QueryResult = NonNullable<
  MassetsQueryResult['data']
>['massets'][number]['savingsContractsV1'][number];

type SavingsContractV2QueryResult = NonNullable<
  MassetsQueryResult['data']
>['massets'][number]['savingsContractsV2'][number];

const transformBassets = (
  bassets: NonNullable<
    MassetsQueryResult['data']
  >['massets'][number]['basket']['bassets'],
  massetDecimals: number,
  tokens: Tokens,
): MassetState['bAssets'] => {
  return Object.fromEntries(
    bassets.map(
      ({
        ratio,
        status,
        maxWeight,
        vaultBalance,
        isTransferFeeCharged,
        token: { address, totalSupply, decimals, symbol },
      }) => {
        return [
          address,
          {
            address,
            isTransferFeeCharged,
            maxWeight: bigNumberify(maxWeight),
            ratio: bigNumberify(ratio),
            status: status as BassetStatus,
            totalVault: BigDecimal.fromMetric(vaultBalance),
            token: {
              balance: new BigDecimal(0, decimals),
              allowances: {},
              ...tokens[address],
              totalSupply: BigDecimal.fromMetric(totalSupply),
              address,
              decimals,
              symbol,
            },

            // Initial values
            balanceInMasset: new BigDecimal(0, massetDecimals),
            basketShare: new BigDecimal(0, massetDecimals),
            maxWeightInMasset: new BigDecimal(0, massetDecimals),
            overweight: false,
            totalVaultInMasset: new BigDecimal(0, massetDecimals),
          },
        ];
      },
    ),
  );
};

const transformSavingsContractV1 = (
  savingsContract: SavingsContractV1QueryResult,
  tokens: Tokens,
  massetAddress: string,
  current: boolean,
): Extract<SavingsContractState, { version: 1 }> => {
  const {
    active,
    creditBalances,
    dailyAPY,
    id,
    latestExchangeRate,
    totalCredits,
    totalSavings,
    version,
  } = savingsContract;
  const creditBalance = creditBalances?.[0];

  return {
    active,
    current,
    address: id,
    creditBalance: creditBalance
      ? new BigDecimal(creditBalance.amount)
      : undefined,
    dailyAPY: parseFloat(dailyAPY),
    latestExchangeRate: latestExchangeRate
      ? {
          rate: BigDecimal.parse(latestExchangeRate.rate),
          timestamp: latestExchangeRate.timestamp,
        }
      : undefined,
    massetAddress,
    massetAllowance:
      tokens[massetAddress]?.allowances?.[id] ?? new BigDecimal(0),
    savingsBalance: {},
    totalCredits: BigDecimal.fromMetric(
      totalCredits as NonNullable<typeof totalCredits>,
    ),
    totalSavings: BigDecimal.fromMetric(totalSavings),
    version: version as 1,
  };
};

const transformBoostedSavingsVault = ({
  id: address,
  totalSupply,
  accounts,
  rewardPerTokenStored,
  rewardRate,
  stakingContract,
  totalStakingRewards,
}: NonNullable<
  SavingsContractV2QueryResult['boostedSavingsVaults'][number]
>): BoostedSavingsVaultState => {
  let account: BoostedSavingsVaultState['account'];

  if (accounts?.[0]) {
    const [
      {
        rewardCount,
        rewardEntries,
        rewardPerTokenPaid,
        rewards,
        lastAction,
        lastClaim,
      },
    ] = accounts;
    account = {
      rewardCount,
      rewardPerTokenPaid: bigNumberify(rewardPerTokenPaid),
      rewards: bigNumberify(rewards),
      rewardEntries: rewardEntries.map(({ rate, finish, index, start }) => ({
        rate: bigNumberify(rate),
        finish,
        index,
        start,
      })),
      lastAction,
      lastClaim,
    };
  }

  return {
    address,
    account,
    rewardRate: bigNumberify(rewardRate),
    rewardPerTokenStored: bigNumberify(rewardPerTokenStored),
    stakingContract,
    totalSupply: new BigDecimal(totalSupply),
    totalStakingRewards: BigDecimal.parse(totalStakingRewards),
  };
};

const transformSavingsContractV2 = (
  savingsContract: SavingsContractV2QueryResult,
  tokens: Tokens,
  massetAddress: string,
  current: boolean,
): Extract<SavingsContractState, { version: 2 }> => {
  const {
    active,
    dailyAPY,
    id,
    latestExchangeRate,
    totalSavings,
    version,
    boostedSavingsVaults,
  } = savingsContract;

  return {
    active,
    current,
    address: id,
    dailyAPY: parseFloat(dailyAPY),
    latestExchangeRate: latestExchangeRate
      ? {
          rate: BigDecimal.parse(latestExchangeRate.rate),
          timestamp: latestExchangeRate.timestamp,
        }
      : undefined,
    massetAddress,
    savingsBalance: {},
    token: tokens[id],
    totalSavings: BigDecimal.fromMetric(totalSavings),
    version: version as 2,
    boostedSavingsVault: boostedSavingsVaults[0]
      ? transformBoostedSavingsVault(boostedSavingsVaults[0])
      : undefined,
  };
};

const transformTokenData = (
  { address, totalSupply, symbol, decimals }: TokenAllFragment,
  tokens: Tokens,
): SubscribedToken => ({
  balance: new BigDecimal(0, decimals),
  allowances: {},
  ...tokens[address],
  totalSupply: BigDecimal.fromMetric(totalSupply),
  address,
  decimals,
  symbol,
});

const transformMassetData = (
  {
    currentSavingsContract,
    feeRate,
    redemptionFeeRate,
    token: { decimals, address },
    token,
    basket: {
      bassets: _bassets,
      collateralisationRatio,
      failed,
      removedBassets,
      undergoingRecol,
    },
    savingsContractsV1: [savingsContractV1],
    savingsContractsV2: [savingsContractV2],
  }: NonNullable<MassetsQueryResult['data']>['massets'][number],
  tokens: Tokens,
): MassetState => {
  const bAssets = transformBassets(_bassets, decimals, tokens);

  return {
    address,
    failed,
    undergoingRecol,
    token: transformTokenData(token, tokens),
    bAssets,
    removedBassets: Object.fromEntries(
      removedBassets.map(b => [
        b.token.address,
        transformTokenData(b.token, tokens),
      ]),
    ),
    collateralisationRatio: bigNumberify(collateralisationRatio),
    feeRate: bigNumberify(feeRate),
    redemptionFeeRate: bigNumberify(redemptionFeeRate),
    savingsContracts: {
      v1: savingsContractV1
        ? transformSavingsContractV1(
            savingsContractV1,
            tokens,
            address,
            savingsContractV1.id === currentSavingsContract?.id,
          )
        : undefined,
      v2: savingsContractV2
        ? transformSavingsContractV2(
            savingsContractV2,
            tokens,
            address,
            savingsContractV2.id === currentSavingsContract?.id,
          )
        : undefined,
    },
    // Initial values
    blacklistedBassets: [],
    overweightBassets: [],
    allBassetsNormal: true,
  };
};

export const transformRawData = ([data, tokens]: [
  MassetsQueryResult['data'],
  Tokens,
]): DataState => {
  return Object.fromEntries(
    (data?.massets ?? []).map(masset => [
      masset.token.symbol as MassetName,
      transformMassetData(masset, tokens),
    ]),
  );
};
