import { BigNumber } from 'ethers';

import { BigDecimal } from '../../web3/BigDecimal';
import { MassetName, SubscribedToken } from '../../types';
import { MusdQueryResult, TokenAllFragment } from '../../graphql/protocol';
import {
  BassetStatus,
  BoostedSavingsVaultState,
  DataState,
  MassetState,
  SavingsContractState,
} from './types';
import { Tokens } from '../TokensProvider';
import { MbtcQueryResult } from '../../graphql/mbtc';

type NonNullableMasset = NonNullable<
  NonNullable<MusdQueryResult['data']>['masset']
>;

type SavingsContractV1QueryResult = NonNullableMasset['savingsContractsV1'][number];

type SavingsContractV2QueryResult = NonNullableMasset['savingsContractsV2'][number];

const transformBassets = (
  bassets: NonNullable<
    NonNullable<MusdQueryResult['data']>['masset']
  >['basket']['bassets'],
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

const transformMassetData = (
  {
    // currentSavingsContract,
    feeRate,
    forgeValidator,
    redemptionFeeRate,
    invariantStartTime,
    invariantStartingCap,
    invariantCapFactor,
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
  }: NonNullableMasset,
  tokens: Tokens,
): MassetState => {
  const bAssets = transformBassets(_bassets, decimals, tokens);

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
    // Initial values
    blacklistedBassets: [],
    overweightBassets: [],
    allBassetsNormal: true,
  };
};

export const transformRawData = ([musd, mbtc, tokens]: [
  MusdQueryResult['data'],
  MbtcQueryResult['data'],
  Tokens,
]): DataState => {
  return Object.fromEntries(
    [musd, mbtc]
      .filter(data => data?.masset)
      .map(data => [
        (data as {
          masset: NonNullableMasset;
        }).masset.token.symbol.toLowerCase() as MassetName,
        transformMassetData(
          (data as {
            masset: NonNullableMasset;
          }).masset,
          tokens,
        ),
      ]),
  );
};
