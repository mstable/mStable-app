import { BigNumber } from 'ethers'

import type { MassetName, SubscribedToken } from '../../types'
import type {
  BassetState,
  BassetStatus,
  BoostedSavingsVaultState,
  DataState,
  FeederPoolAccountState,
  FeederPoolState,
  MassetState,
  SavingsContractState,
} from './types'
import type { Tokens } from '../TokensProvider'

import { BigDecimal } from '../../web3/BigDecimal'
import { MassetsQueryResult, TokenAllFragment } from '../../graphql/protocol'
import { BoostedSavingsVaultAllFragment, FeederPoolsQueryResult } from '../../graphql/feeders'

type NonNullableMasset = NonNullable<NonNullable<MassetsQueryResult['data']>['massets'][number]>

type NonNullableFeederPools = NonNullable<NonNullable<FeederPoolsQueryResult['data']>['feederPools']>

type SavingsContractV1QueryResult = NonNullableMasset['savingsContractsV1'][number]

type SavingsContractV2QueryResult = NonNullableMasset['savingsContractsV2'][number]

const transformBasset = (basset: NonNullableMasset['basket']['bassets'][0], tokens: Tokens): BassetState => {
  const {
    ratio,
    status,
    maxWeight,
    vaultBalance,
    isTransferFeeCharged,
    token: { address, totalSupply, decimals, symbol },
  } = basset
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
      symbol: symbol.replace(/^PoS-/, ''),
    },

    // Initial values
    balanceInMasset: new BigDecimal(0),
    basketShare: new BigDecimal(0),
    maxWeightInMasset: new BigDecimal(0),
    overweight: false,
    totalVaultInMasset: new BigDecimal(0),
  }
}

const transformBassets = (bassets: NonNullableMasset['basket']['bassets'], tokens: Tokens): MassetState['bAssets'] => {
  return Object.fromEntries(bassets.map(basset => [basset.id, transformBasset(basset, tokens)]))
}

const transformSavingsContractV1 = (
  savingsContract: SavingsContractV1QueryResult,
  tokens: Tokens,
  massetAddress: string,
  current: boolean,
): Extract<SavingsContractState, { version: 1 }> => {
  const { active, creditBalances, dailyAPY, id, latestExchangeRate, totalCredits, totalSavings, version } = savingsContract
  const creditBalance = creditBalances?.[0]

  return {
    active,
    current,
    address: id,
    creditBalance: creditBalance ? new BigDecimal(creditBalance.amount) : undefined,
    dailyAPY: parseFloat(dailyAPY),
    latestExchangeRate: latestExchangeRate
      ? {
          rate: BigDecimal.parse(latestExchangeRate.rate),
          timestamp: latestExchangeRate.timestamp,
        }
      : undefined,
    massetAddress,
    massetAllowance: tokens[massetAddress]?.allowances?.[id] ?? new BigDecimal(0),
    savingsBalance: {},
    totalCredits: BigDecimal.fromMetric(totalCredits as NonNullable<typeof totalCredits>),
    totalSavings: BigDecimal.fromMetric(totalSavings),
    version: version as 1,
  }
}

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
  stakingToken,
  totalStakingRewards,
  priceCoeff,
  boostCoeff,
  totalSupply,
  unlockPercentage,
}: NonNullable<
  BoostedSavingsVaultAllFragment & {
    priceCoeff?: string | null
    boostCoeff?: string | null
  }
>): BoostedSavingsVaultState => {
  let account: BoostedSavingsVaultState['account']

  // FIXME: - Replace this with something better
  const isImusd = address === '0x78befca7de27d07dc6e71da295cc2946681a6c7b' // imUSD vault address

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
    ] = accounts
    const boostedBalance = new BigDecimal(_boostedBalance)
    const rawBalance = new BigDecimal(_rawBalance)
    const boostMultiplier = !!boostedBalance.simple && !!rawBalance.simple ? boostedBalance.simple / rawBalance.simple : 1
    account = {
      boostedBalance,
      boostMultiplier: isImusd ? boostMultiplier * 2 : boostMultiplier,
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
    }
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
    stakingToken: {
      address: stakingToken.address,
      symbol: stakingToken.symbol,
    },
    totalStakingRewards: BigDecimal.parse(totalStakingRewards),
    totalSupply: new BigDecimal(totalSupply),
    unlockPercentage: BigNumber.from(unlockPercentage),
    boostCoeff: boostCoeff ? parseFloat(boostCoeff) : undefined,
    priceCoeff: priceCoeff ? parseFloat(priceCoeff) : undefined,
    isImusd,
  }
}

const transformSavingsContractV2 = (
  savingsContract: SavingsContractV2QueryResult & { boostedSavingsVaults: BoostedSavingsVaultAllFragment[] },
  tokens: Tokens,
  massetAddress: string,
  current: boolean,
): Extract<SavingsContractState, { version: 2 }> => {
  const { dailyAPY, id, latestExchangeRate, totalSavings, version, boostedSavingsVaults } = savingsContract

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
          rate: BigDecimal.fromSimple(0.1),
          timestamp: Date.now(),
        },
    massetAddress,
    savingsBalance: {},
    token: tokens[id],
    totalSavings: BigDecimal.fromMetric(totalSavings),
    version: version as 2,
    boostedSavingsVault: boostedSavingsVaults[0] ? transformBoostedSavingsVault(boostedSavingsVaults[0]) : undefined,
  }
}

const transformTokenData = ({ address, totalSupply, symbol, decimals }: TokenAllFragment, tokens: Tokens): SubscribedToken => ({
  balance: new BigDecimal(0, decimals),
  allowances: {},
  ...tokens[address],
  totalSupply: BigDecimal.fromMetric(totalSupply),
  address,
  decimals,
  symbol,
})

const transformFeederPoolAccountData = ({
  cumulativeEarned,
  cumulativeEarnedVault,
  balance,
  balanceVault,
  price,
  priceVault,
  lastUpdate,
  lastUpdateVault,
}: NonNullable<NonNullableFeederPools[number]['accounts']>[number]): FeederPoolAccountState => ({
  cumulativeEarned: BigDecimal.fromMetric(cumulativeEarned),
  cumulativeEarnedVault: BigDecimal.fromMetric(cumulativeEarnedVault),
  balance: new BigDecimal(balance),
  balanceVault: new BigDecimal(balanceVault),
  price: new BigDecimal(price),
  priceVault: new BigDecimal(priceVault),
  lastUpdate,
  lastUpdateVault,
})

const transformFeederPoolsData = (feederPools: NonNullableFeederPools, tokens: Tokens): MassetState['feederPools'] => {
  return Object.fromEntries(
    feederPools.map<[string, FeederPoolState]>(
      ({
        id: address,
        basket: { bassets, failed, undergoingRecol },
        fasset: fassetToken,
        masset: massetToken,
        price,
        token,
        dailyAPY,
        governanceFeeRate,
        invariantK,
        redemptionFeeRate,
        swapFeeRate,
        vault,
        accounts,
      }) => {
        const masset = bassets.find(b => b.token.address === massetToken.id) as NonNullableMasset['basket']['bassets'][0]
        const fasset = bassets.find(b => b.token.address === fassetToken.id) as NonNullableMasset['basket']['bassets'][0]
        return [
          address,
          {
            address,
            masset: { ...transformBasset(masset, tokens), feederPoolAddress: address },
            fasset: { ...transformBasset(fasset, tokens), feederPoolAddress: address },
            token: { ...token, ...tokens[address] } as SubscribedToken,
            totalSupply: BigDecimal.fromMetric(fassetToken.totalSupply),
            governanceFeeRate: BigNumber.from(governanceFeeRate),
            liquidity: new BigDecimal(invariantK).mulTruncate(price),
            feeRate: BigNumber.from(swapFeeRate),
            redemptionFeeRate: BigNumber.from(redemptionFeeRate),
            invariantK: BigNumber.from(invariantK),
            dailyApy: parseFloat(dailyAPY),
            price: new BigDecimal(price ?? 0),
            failed,
            title: bassets
              .map(b => b.token.symbol)
              .sort(s => (s === masset.token.symbol ? -1 : 1))
              .join('/'),
            undergoingRecol,
            vault: transformBoostedSavingsVault(vault),
            account: accounts?.length ? transformFeederPoolAccountData(accounts[0]) : undefined,
          },
        ]
      },
    ),
  )
}

const transformMassetData = (
  {
    redemptionFeeRate,
    invariantStartTime,
    invariantStartingCap,
    invariantCapFactor,
    token: { address },
    token,
    basket: { bassets: _bassets, collateralisationRatio, failed, removedBassets, undergoingRecol },
    savingsContractsV1: [savingsContractV1],
    savingsContractsV2: [savingsContractV2],
  }: NonNullableMasset,
  {
    boostDirectors,
    feederPools: allFeederPools,
    saveVaults,
    userVaults: _userVaults,
    vaultIds: _vaultIds,
  }: NonNullable<FeederPoolsQueryResult['data']>,
  tokens: Tokens,
): MassetState => {
  const bAssets = transformBassets(_bassets, tokens)

  const feederPools = transformFeederPoolsData(
    allFeederPools.filter(fp => fp.masset.id === address),
    tokens,
  )

  // Vaults are on the feeder pools subgraph
  const boostedSavingsVaults = saveVaults.filter(v => v.stakingToken.address === savingsContractV2.id)

  const boostDirector = boostDirectors.length > 0 ? boostDirectors[0].id : undefined
  const userVaults = Object.fromEntries(_userVaults.map(v => [v.id, v.boostDirection.map(b => b.directorVaultId as number)]))
  const vaultIds = Object.fromEntries(_vaultIds.map(v => [v.directorVaultId ?? 0, v.id]))

  return {
    address,
    failed,
    invariantStartTime: invariantStartTime || undefined,
    invariantStartingCap: invariantStartingCap ? BigNumber.from(invariantStartingCap) : undefined,
    invariantCapFactor: invariantCapFactor ? BigNumber.from(invariantCapFactor) : undefined,
    undergoingRecol,
    token: transformTokenData(
      { ...token, symbol: token.symbol.replace(/(\(pos\) mstable usd)|(mstable usd \(polygon pos\))/i, 'mUSD') },
      tokens,
    ),
    bAssets,
    removedBassets: Object.fromEntries(removedBassets.map(b => [b.token.address, transformTokenData(b.token, tokens)])),
    collateralisationRatio: collateralisationRatio ? BigNumber.from(collateralisationRatio) : undefined,
    feeRate: BigNumber.from(200000000000000),
    redemptionFeeRate: BigNumber.from(redemptionFeeRate),
    feederPools,
    hasFeederPools: Object.keys(feederPools).length > 0,
    savingsContracts: {
      v1: savingsContractV1 ? transformSavingsContractV1(savingsContractV1, tokens, address, false) : undefined,
      v2: transformSavingsContractV2({ ...savingsContractV2, boostedSavingsVaults }, tokens, address, true),
    },
    bassetRatios: Object.fromEntries(Object.values(bAssets).map(b => [b.address, b.ratio])),
    userVaults,
    vaultIds,
    boostDirector,
    // Initial values, set in recalculateState
    fAssets: {},
  }
}

export const transformRawData = ([massetsData, feedersData, tokens]: [
  NonNullable<MassetsQueryResult['data']>,
  NonNullable<FeederPoolsQueryResult['data']>,
  Tokens,
]): DataState => {
  return Object.fromEntries(
    massetsData.massets.map(masset => {
      const massetName = masset.token.symbol
        .toLowerCase()
        .replace(/(\(pos\) mstable usd)|(mstable usd \(polygon pos\))/, 'musd') as MassetName
      return [massetName, transformMassetData(masset, feedersData, tokens)]
    }),
  )
}
