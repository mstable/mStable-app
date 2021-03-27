import { BigNumber } from 'ethers';

import type { MassetName, SubscribedToken } from '../../types';
import type {
  BassetState,
  BassetStatus,
  BoostedSavingsVaultState,
  DataState,
  FeederPoolState,
  MassetState,
  SavingsContractState,
} from './types';
import type { Tokens } from '../TokensProvider';

import { BigDecimal } from '../../web3/BigDecimal';
import { MassetsQueryResult, TokenAllFragment } from '../../graphql/protocol';
import { FeederPoolsQueryResult } from '../../graphql/feeders';

type NonNullableMasset = NonNullable<
  NonNullable<MassetsQueryResult['data']>['massets'][number]
>;

type NonNullableFeederPools = NonNullable<
  NonNullable<FeederPoolsQueryResult['data']>['feederPools']
>;

type SavingsContractV1QueryResult = NonNullableMasset['savingsContractsV1'][number];

type SavingsContractV2QueryResult = NonNullableMasset['savingsContractsV2'][number];

const transformBasset = (
  basset: NonNullableMasset['basket']['bassets'][0],
  tokens: Tokens,
): BassetState => {
  const {
    ratio,
    status,
    maxWeight,
    vaultBalance,
    isTransferFeeCharged,
    token: { address, totalSupply, decimals, symbol },
  } = basset;
  return {
    address,
    isTransferFeeCharged,
    maxWeight: maxWeight ? BigNumber.from(maxWeight) : undefined,
    ratio: BigNumber.from(ratio),
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
    balanceInMasset: new BigDecimal(0),
    basketShare: new BigDecimal(0),
    maxWeightInMasset: new BigDecimal(0),
    overweight: false,
    totalVaultInMasset: new BigDecimal(0),
  };
};

const transformBassets = (
  bassets: NonNullableMasset['basket']['bassets'],
  tokens: Tokens,
): MassetState['bAssets'] => {
  return Object.fromEntries(
    bassets.map(basset => [basset.id, transformBasset(basset, tokens)]),
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
  accounts,
  lastUpdateTime,
  lockupDuration,
  periodDuration,
  periodFinish,
  rewardPerTokenStored,
  rewardRate,
  stakingContract,
  totalStakingRewards,
  totalSupply,
  unlockPercentage,
}: NonNullable<
  SavingsContractV2QueryResult['boostedSavingsVaults'][number]
>): BoostedSavingsVaultState => {
  let account: BoostedSavingsVaultState['account'];

  if (accounts?.[0]) {
    const [
      {
        boostedBalance: _boostedBalance,
        lastAction,
        lastClaim,
        rawBalance: _rawBalance,
        rewardCount,
        rewardEntries,
        rewardPerTokenPaid,
        rewards,
      },
    ] = accounts;
    const boostedBalance = new BigDecimal(_boostedBalance);
    const rawBalance = new BigDecimal(_rawBalance);
    account = {
      boostedBalance,
      boostMultiplier:
        boostedBalance.simple > 0 && rawBalance.simple > 0
          ? (boostedBalance.simple / rawBalance.simple) * 2
          : 0,
      lastAction,
      lastClaim,
      rawBalance,
      rewardCount,
      rewardPerTokenPaid: BigNumber.from(rewardPerTokenPaid),
      rewards: BigNumber.from(rewards),
      rewardEntries: rewardEntries.map(({ rate, finish, index, start }) => ({
        rate: BigNumber.from(rate),
        finish,
        index,
        start,
      })),
    };
  }

  return {
    account,
    address,
    lastUpdateTime,
    lockupDuration,
    periodDuration,
    periodFinish,
    rewardPerTokenStored: BigNumber.from(rewardPerTokenStored),
    rewardRate: BigNumber.from(rewardRate),
    stakingContract,
    totalStakingRewards: BigDecimal.parse(totalStakingRewards),
    totalSupply: new BigDecimal(totalSupply),
    unlockPercentage: BigNumber.from(unlockPercentage),
  };
};

const transformSavingsContractV2 = (
  savingsContract: SavingsContractV2QueryResult,
  tokens: Tokens,
  massetAddress: string,
  current: boolean,
): Extract<SavingsContractState, { version: 2 }> => {
  const {
    // active,
    dailyAPY,
    id,
    latestExchangeRate,
    totalSavings,
    version,
    boostedSavingsVaults,
  } = savingsContract;

  return {
    active: true,
    current,
    address: id,
    dailyAPY: parseFloat(dailyAPY),
    latestExchangeRate: latestExchangeRate
      ? {
          rate: BigDecimal.parse(latestExchangeRate.rate),
          timestamp: latestExchangeRate.timestamp,
        }
      : {
          rate: BigDecimal.parse('0.10'),
          timestamp: Date.now(),
        },
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

const transformFeederPoolsData = (
  feederPools: NonNullableFeederPools,
  tokens: Tokens,
): MassetState['feederPools'] => {
  return Object.fromEntries(
    feederPools.map<[string, FeederPoolState]>(
      ({
        id: address,
        basket: { bassets, failed, undergoingRecol },
        fasset,
        price,
        token,
        dailyAPY,
        governanceFeeRate,
        invariantK,
        redemptionFeeRate,
        swapFeeRate,
        vault,
      }) => [
        address,
        {
          address,
          masset: transformBasset(bassets[0], tokens),
          fasset: transformBasset(bassets[1], tokens),
          token: { ...token, ...tokens[address] } as SubscribedToken,
          totalSupply: BigDecimal.fromMetric(fasset.totalSupply),
          governanceFeeRate: BigNumber.from(governanceFeeRate),
          feeRate: BigNumber.from(swapFeeRate),
          redemptionFeeRate: BigNumber.from(redemptionFeeRate),
          invariantK: BigNumber.from(invariantK),
          dailyApy: parseFloat(dailyAPY),
          price: parseFloat(price),
          failed,
          title: bassets.map(b => b.token.symbol).join('/'),
          undergoingRecol,
          vault: transformBoostedSavingsVault(vault),
        },
      ],
    ),
  );
};

const transformMassetData = (
  {
    // currentSavingsContract,
    feeRate,
    forgeValidator,
    redemptionFeeRate,
    invariantStartTime,
    invariantStartingCap,
    invariantCapFactor,
    token: { address },
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
  }: NonNullableMasset,
  allFeederPools: NonNullableFeederPools,
  tokens: Tokens,
): MassetState => {
  const bAssets = transformBassets(_bassets, tokens);

  const feederPools = transformFeederPoolsData(
    allFeederPools.filter(fp => fp.masset.id === address),
    tokens,
  );
  const fAssets = Object.fromEntries(
    Object.entries(feederPools).map(([key, { fasset }]) => [key, fasset]),
  );

  return {
    address,
    failed,
    forgeValidator,
    invariantStartTime: invariantStartTime || undefined,
    invariantStartingCap: invariantStartingCap
      ? BigNumber.from(invariantStartingCap)
      : undefined,
    invariantCapFactor: invariantCapFactor
      ? BigNumber.from(invariantCapFactor)
      : undefined,
    undergoingRecol,
    token: transformTokenData(token, tokens),
    bAssets,
    removedBassets: Object.fromEntries(
      removedBassets.map(b => [
        b.token.address,
        transformTokenData(b.token, tokens),
      ]),
    ),
    collateralisationRatio: collateralisationRatio
      ? BigNumber.from(collateralisationRatio)
      : undefined,
    feeRate: BigNumber.from(feeRate),
    redemptionFeeRate: BigNumber.from(redemptionFeeRate),
    feederPools,
    fAssets,
    savingsContracts: {
      v1: savingsContractV1
        ? transformSavingsContractV1(
            savingsContractV1,
            tokens,
            address,
            // savingsContractV1.id === currentSavingsContract?.id,
            // TODO marking as inactive manually because of a subgraph issue
            false,
          )
        : undefined,
      v2: savingsContractV2
        ? transformSavingsContractV2(
            savingsContractV2,
            tokens,
            address,
            // savingsContractV2.id === currentSavingsContract?.id,
            // TODO marking as active manually because of a subgraph issue
            true,
          )
        : undefined,
    },
    bassetRatios: Object.fromEntries(
      Object.values(bAssets).map(b => [b.address, b.ratio]),
    ),
    // Initial values
    blacklistedBassets: [],
    overweightBassets: [],
    allBassetsNormal: true,
    isLegacy: !!collateralisationRatio,
  };
};

export const transformRawData = ([massetsData, feedersData, tokens]: [
  MassetsQueryResult['data'],
  FeederPoolsQueryResult['data'],
  Tokens,
]): DataState => {
  return Object.fromEntries(
    (massetsData?.massets ?? [])
      .filter(masset => !!masset.token.symbol)
      .map(masset => {
        const feeders = feedersData?.feederPools ?? [];
        const massetName = masset.token.symbol.toLowerCase() as MassetName;
        return [massetName, transformMassetData(masset, feeders, tokens)];
      }),
  );
};
