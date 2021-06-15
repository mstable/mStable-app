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

import type { RawData } from './DataProvider'
import { BigDecimal } from '../../web3/BigDecimal'
import { TokenAllFragment } from '../../graphql/protocol'
import { BoostedSavingsVaultAllFragment } from '../../graphql/feeders'

type NonNullableMasset = NonNullable<RawData['massets']>['massets'][number]

type NonNullableFeederPools = NonNullable<RawData['feederPools']>['feederPools']

type SavingsContractV1QueryResult = NonNullableMasset['savingsContractsV1'][number]

type SavingsContractV2QueryResult = NonNullableMasset['savingsContractsV2'][number]

const transformBasset = (
  basset: NonNullableMasset['basket']['bassets'][0],
  vaultBalances: RawData['vaultBalances'],
  tokens: Tokens,
): BassetState => {
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
    totalVault: new BigDecimal(vaultBalances[address] ?? vaultBalance.exact, decimals),
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

const transformBassets = (
  bassets: NonNullableMasset['basket']['bassets'],
  vaultBalances: RawData['vaultBalances'],
  tokens: Tokens,
): MassetState['bAssets'] => {
  return Object.fromEntries(bassets.map(basset => [basset.id, transformBasset(basset, vaultBalances, tokens)]))
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
            masset: { ...transformBasset(masset, {}, tokens), feederPoolAddress: address },
            fasset: { ...transformBasset(fasset, {}, tokens), feederPoolAddress: address },
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
  }: NonNullable<RawData['massets']>['massets'][0],
  {
    boostDirectors,
    feederPools: allFeederPools,
    saveVaults,
    userVaults: _userVaults,
    vaultIds: _vaultIds,
  }: NonNullable<RawData['feederPools']>,
  vaultBalances: RawData['vaultBalances'],
  tokens: Tokens,
): MassetState => {
  const bAssets = transformBassets(_bassets, vaultBalances, tokens)

  const mockFeederPools = [
    {
      __typename: 'FeederPool',
      id: '0x48c59199da51b7e30ea200a74ea07974e62c4ba7',
      swapFeeRate: '600000000000000',
      redemptionFeeRate: '600000000000000',
      governanceFeeRate: '100000000000000000',
      dailyAPY: '0',
      price: '1001286380514048630',
      invariantK: '126723296924145930033',
      basket: {
        __typename: 'Basket',
        bassets: [
          {
            __typename: 'Basset',
            id: '0x48c59199da51b7e30ea200a74ea07974e62c4ba7.0x0316eb71485b0ab14103307bf65a021042c6d380',
            vaultBalance: {
              __typename: 'Metric',
              exact: '69558073335774820992',
              decimals: 18,
              simple: '69.558073335774820992',
            },
            isTransferFeeCharged: false,
            ratio: '100000000',
            status: 'Normal',
            maxWeight: null,
            token: {
              __typename: 'Token',
              id: '0x0316eb71485b0ab14103307bf65a021042c6d380',
              address: '0x0316eb71485b0ab14103307bf65a021042c6d380',
              decimals: 18,
              symbol: 'FRAX',
              totalSupply: {
                __typename: 'Metric',
                exact: '27906376659990000000000',
                decimals: 18,
                simple: '27906.37665999',
              },
            },
          },
          {
            __typename: 'Basset',
            id: '0x48c59199da51b7e30ea200a74ea07974e62c4ba7.0x945facb997494cc2570096c74b5f66a3507330a1',
            vaultBalance: {
              __typename: 'Metric',
              exact: '57168963043467983666',
              decimals: 18,
              simple: '57.168963043467983666',
            },
            isTransferFeeCharged: false,
            ratio: '100000000',
            status: 'Normal',
            maxWeight: null,
            token: {
              __typename: 'Token',
              id: '0x945facb997494cc2570096c74b5f66a3507330a1',
              address: '0x945facb997494cc2570096c74b5f66a3507330a1',
              decimals: 18,
              symbol: 'mUSD',
              totalSupply: {
                __typename: 'Metric',
                exact: '188173789713309587593',
                decimals: 18,
                simple: '188.173789713309587593',
              },
            },
          },
        ],
        undergoingRecol: false,
        failed: false,
      },
      token: {
        __typename: 'Token',
        id: '0x48c59199da51b7e30ea200a74ea07974e62c4ba7',
        address: '0x48c59199da51b7e30ea200a74ea07974e62c4ba7',
        decimals: 18,
        symbol: 'fPmUSD/FRAX',
        totalSupply: {
          __typename: 'Metric',
          exact: '126557349005859985036',
          decimals: 18,
          simple: '126.557349005859985036',
        },
      },
      fasset: {
        __typename: 'Token',
        id: '0x0316eb71485b0ab14103307bf65a021042c6d380',
        address: '0x0316eb71485b0ab14103307bf65a021042c6d380',
        decimals: 18,
        symbol: 'FRAX',
        totalSupply: {
          __typename: 'Metric',
          exact: '27906376659990000000000',
          decimals: 18,
          simple: '27906.37665999',
        },
      },
      masset: {
        __typename: 'Token',
        id: '0x945facb997494cc2570096c74b5f66a3507330a1',
      },
      vault: {
        __typename: 'BoostedSavingsVault',
        id: '0xf65d53aa6e2e4a5f4f026e73cb3e22c22d75e35c',
        lastUpdateTime: 1623320410,
        lockupDuration: 15724800,
        unlockPercentage: '330000000000000000',
        periodDuration: 604800,
        periodFinish: 1623656327,
        rewardPerTokenStored: '2684293231396573495117963',
        rewardRate: '49781630291005291',
        stakingContract: '0x48c59199da51b7e30ea200a74ea07974e62c4ba7',
        stakingToken: {
          __typename: 'Token',
          address: '0x48c59199da51b7e30ea200a74ea07974e62c4ba7',
          symbol: 'fPmUSD/FRAX',
        },
        totalStakingRewards: '30107',
        totalSupply: '228210435463409369879',
        priceCoeff: '58000000000000000000000',
        boostCoeff: '48',
        accounts: [
          {
            __typename: 'BoostedSavingsVaultAccount',
            id: '0xd124b55f70d374f58455c8aedf308e52cf2a6207.0x869Ab16Dd6283cb310f49507412D3278606d4DC1',
            boostedBalance: '0',
            lastAction: 1621844972,
            lastClaim: 1621844972,
            rawBalance: '0',
            rewardCount: 2,
            rewardPerTokenPaid: '2869143657016277801',
            rewards: '0',
            rewardEntries: [
              {
                __typename: 'BoostedSavingsVaultRewardEntry',
                id: '0xd124b55f70d374f58455c8aedf308e52cf2a6207.0x869Ab16Dd6283cb310f49507412D3278606d4DC1.0',
                finish: 1635080750,
                index: 0,
                rate: '203962654801176',
                start: 1634724918,
              },
              {
                __typename: 'BoostedSavingsVaultRewardEntry',
                id: '0xd124b55f70d374f58455c8aedf308e52cf2a6207.0x869Ab16Dd6283cb310f49507412D3278606d4DC1.1',
                finish: 1637567844,
                index: 1,
                rate: '219366322979620',
                start: 1635080750,
              },
            ],
          },
        ],
      },
      accounts: [],
    },
  ]

  const feederPools = transformFeederPoolsData(mockFeederPools, tokens)

  // TODO: Restore
  // const feederPools = transformFeederPoolsData(
  //   allFeederPools.filter(fp => fp.masset.id === address),
  //   tokens,
  // )

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

export const transformRawData = ({ massets, feederPools, vaultBalances, tokens }: RawData): DataState => {
  if (!massets || !feederPools) return {}

  return Object.fromEntries(
    massets.massets.map(masset => {
      const massetName = masset.token.symbol
        .toLowerCase()
        .replace(/(\(pos\) mstable usd)|(mstable usd \(polygon pos\))/, 'musd') as MassetName
      return [massetName, transformMassetData(masset, feederPools, vaultBalances, tokens)]
    }),
  )
}
