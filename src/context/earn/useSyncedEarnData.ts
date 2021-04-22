import { useEffect, useMemo, useRef, useState } from 'react'

import { useAccount } from '../AccountProvider'
import { BigDecimal } from '../../web3/BigDecimal'
import { usePoolsQuery as useBalancerPoolsQuery } from '../../graphql/balancer'
import { useStakingRewardsContractsQuery } from '../../graphql/ecosystem'
import { usePairsQuery } from '../../graphql/uniswap'
import { useSushiPairsQuery } from '../../graphql/sushi'
import { Platforms } from '../../types'
import {
  NormalizedPool,
  NormalizedPoolsMap,
  RawPairData,
  RawPlatformPools,
  RawPoolData,
  RawStakingRewardsContracts,
  RawSyncedEarnData,
  SyncedEarnData,
  TokenPricesMap,
} from './types'
import { CoingeckoPrices, fetchCoingeckoPrices } from '../../utils/fetchCoingeckoPrices'
import { useMerkleDrops } from './useMerkleDrops'
import { AllNetworks, useNetwork } from '../NetworkProvider'
import { CURVE_ADDRESSES } from './CurveProvider'

const STABLECOIN_SYMBOLS = ['BUSD', 'DAI', 'SUSD', 'TUSD', 'USDC', 'USDT', 'mUSD']

const getUniqueTokens = (
  rawStakingContractsData: RawStakingRewardsContracts,
  rawPlatformsData: RawPlatformPools,
  network: AllNetworks,
): { [address: string]: number } => {
  // Get unique tokens: rewards tokens, platform tokens,
  // and pool tokens.
  const tokens = rawStakingContractsData?.stakingRewardsContracts.reduce(
    (_tokens, { rewardsToken, platformToken, stakingToken }) => ({
      ..._tokens,
      [rewardsToken.address.toLowerCase()]: rewardsToken.decimals,
      [stakingToken.address.toLowerCase()]: stakingToken.decimals,
      ...(platformToken
        ? {
            [platformToken.address.toLowerCase()]: platformToken.decimals,
          }
        : null),
    }),
    {},
  )

  const balancerTokens = rawPlatformsData.Balancer.reduce(
    (_balancerTokens, currentPlatform) => ({
      ..._balancerTokens,
      ...(currentPlatform.tokens || []).reduce(
        (_tokens, currentToken) => ({
          ..._tokens,
          [currentToken.address.toLowerCase()]: currentToken.decimals,
        }),
        {},
      ),
    }),
    {},
  )

  const uniswapTokens = rawPlatformsData.Uniswap.reduce(
    (_tokens, { token0, token1 }) => ({
      ..._tokens,
      [token0.address.toLowerCase()]: parseInt(token0.decimals, 10),
      [token1.address.toLowerCase()]: parseInt(token1.decimals, 10),
    }),
    {},
  )

  const sushiTokens = rawPlatformsData.Sushi.reduce(
    (_tokens, { token0, token1 }) => ({
      ..._tokens,
      [token0.address.toLowerCase()]: parseInt(token0.decimals, 10),
      [token1.address.toLowerCase()]: parseInt(token1.decimals, 10),
    }),
    {},
  )

  return {
    ...Object.fromEntries(Object.values(network.addresses.ERC20).map(address => [address, 18])),
    [network.addresses.MTA]: 18,
    ...tokens,
    ...balancerTokens,
    ...uniswapTokens,
    ...sushiTokens,
  }
}

const FIFTEEN_MINUTES = 15 * 60 * 1e3

const useTokenPrices = (rawStakingContractsData: RawStakingRewardsContracts, rawPlatformsData: RawPlatformPools): TokenPricesMap => {
  const fetchedAddresses = useRef<string[]>([])
  const lastUpdateTime = useRef<number>(0)
  const updating = useRef<boolean>(false)
  const [coingeckoData, setCoingeckoData] = useState<CoingeckoPrices>({})
  const network = useNetwork() as AllNetworks

  const uniqueTokens = useMemo(() => getUniqueTokens(rawStakingContractsData, rawPlatformsData, network), [
    rawPlatformsData,
    rawStakingContractsData,
    network,
  ])

  const addresses = Object.keys(uniqueTokens)

  useEffect(() => {
    const addressesExist = addresses.length > 0

    const missingAddresses = addresses.filter(address => !fetchedAddresses.current.includes(address))

    const stale = Date.now() - lastUpdateTime.current > FIFTEEN_MINUTES

    if (addressesExist && !updating.current && (stale || missingAddresses.length > 0)) {
      lastUpdateTime.current = Date.now()
      updating.current = true
      fetchCoingeckoPrices(addresses)
        .then((result: CoingeckoPrices) => {
          fetchedAddresses.current = addresses
          setCoingeckoData(result)
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.warn(error)
        })
        .finally(() => {
          updating.current = false
        })
    }
  }, [addresses])

  return useMemo(
    () =>
      Object.keys(coingeckoData).reduce(
        (_prices, address) => ({
          ..._prices,
          [address.toLowerCase()]: BigDecimal.maybeParse(
            coingeckoData[address.toLowerCase()].usd.toString(),
            uniqueTokens[address.toLowerCase()],
          ),
        }),
        {},
      ),
    [coingeckoData, uniqueTokens],
  )
}

const normalizeUniswapToken = (
  { address, symbol, decimals: _decimals }: RawPairData['token0'],
  reserve: RawPairData['reserve0'],
): NormalizedPool['tokens'][number] => {
  const decimals = parseInt(_decimals, 10)
  return {
    address,
    decimals,
    symbol,
    liquidity: BigDecimal.parse(reserve, decimals),
    ratio: 50, // All Uniswap pairs are 50/50
    totalSupply: new BigDecimal(0, decimals),
  }
}

const normalizeUniswapPool = ({ address, totalSupply, reserveUSD, reserve0, reserve1, token0, token1 }: RawPairData): NormalizedPool => {
  const tokens = [normalizeUniswapToken(token0, reserve0), normalizeUniswapToken(token1, reserve1)]
  return {
    address,
    platform: Platforms.Uniswap,
    totalSupply: BigDecimal.parse(totalSupply, 18),
    reserveUSD: BigDecimal.parse(reserveUSD, 18),
    tokens,
    onlyStablecoins: tokens.every(token => STABLECOIN_SYMBOLS.includes(token.symbol)),
  }
}
const normalizeSushiPool = ({ address, totalSupply, reserveUSD, reserve0, reserve1, token0, token1 }: RawPairData): NormalizedPool => {
  const tokens = [normalizeUniswapToken(token0, reserve0), normalizeUniswapToken(token1, reserve1)]
  return {
    address,
    platform: Platforms.Sushi,
    totalSupply: BigDecimal.parse(totalSupply, 18),
    reserveUSD: BigDecimal.parse(reserveUSD, 18),
    tokens,
    onlyStablecoins: tokens.every(token => STABLECOIN_SYMBOLS.includes(token.symbol)),
  }
}

const normalizeCurvePools = (): NormalizedPool[] => {
  return [
    {
      address: CURVE_ADDRESSES.MUSD_LP_TOKEN,
      platform: Platforms.Curve,
      tokens: [
        {
          address: CURVE_ADDRESSES.MUSD_TOKEN,
          symbol: 'mUSD',
          decimals: 18,
          totalSupply: BigDecimal.ZERO,
        },
        {
          address: CURVE_ADDRESSES['3POOL_TOKEN'],
          symbol: '3POOL',
          decimals: 18,
          totalSupply: BigDecimal.ZERO,
        },
      ],
      onlyStablecoins: true,
    },
  ]
}

const normalizeBalancerPool = ({
  address,
  tokens: _tokens,
  totalShares,
  totalSwapVolume,
  totalWeight,
  swapFee,
}: RawPoolData): NormalizedPool => {
  const tokens =
    _tokens?.map(({ address: _address, decimals, denormWeight, balance, symbol }) => ({
      address: _address,
      decimals,
      liquidity: BigDecimal.parse(balance, decimals),
      symbol: symbol as string,
      ratio: Math.floor((parseFloat(denormWeight) / parseFloat(totalWeight)) * 100),
      totalSupply: new BigDecimal(0, decimals),
    })) ?? []
  return {
    address,
    platform: Platforms.Balancer,
    totalSupply: BigDecimal.parse(totalShares, 18),
    totalSwapVolume: BigDecimal.parse(totalSwapVolume, 18),
    swapFee: BigDecimal.parse(swapFee, 18),
    tokens,
    onlyStablecoins: tokens.every(token => STABLECOIN_SYMBOLS.includes(token.symbol)),
  }
}

const useRawPlatformPools = (rawStakingRewardsContracts: RawStakingRewardsContracts): RawPlatformPools => {
  const ids = rawStakingRewardsContracts?.stakingRewardsContracts.map(item => item.stakingToken.address)

  const options = {
    variables: { ids },
    skip: !ids || ids.length === 0,
    fetchPolicy: 'cache-and-network',
  }

  const poolsQuery = useBalancerPoolsQuery(options as Parameters<typeof useBalancerPoolsQuery>[0])
  const pairsQuery = usePairsQuery(options as Parameters<typeof usePairsQuery>[0])
  const sushiPairsQuery = useSushiPairsQuery({
    variables: {
      ids: ['0xf5a434fbaa1c00b33ea141122603c43de86cc9fe'],
    },
    fetchPolicy: 'cache-and-network',
  })

  return {
    [Platforms.Balancer]: poolsQuery.data?.pools ?? [],
    [Platforms.Uniswap]: pairsQuery.data?.pairs ?? [],
    [Platforms.Sushi]: sushiPairsQuery.data?.pairs ?? [],
  }
}

const addPricesToPools = (pools: NormalizedPool[], tokenPricesMap: TokenPricesMap): NormalizedPoolsMap =>
  Object.fromEntries(
    pools.map(pool => [
      pool.address,
      {
        ...pool,
        tokens: pool.tokens.map(token => {
          let price = token.price ?? tokenPricesMap[token.address]

          // Currently, mBTC's price is not tracked; use WBTC
          // (small differences shouldn't matter for these purposes)
          if (token.symbol === 'mBTC' && !price) {
            price = tokenPricesMap['0x2260fac5e5542a773aa44fbcfedf7c193bc2c599']
          }

          return {
            ...token,
            price,
          }
        }),
      },
    ]),
  )

const getPools = ({
  rawPlatformPools: { [Platforms.Balancer]: balancer, [Platforms.Uniswap]: uniswap, [Platforms.Sushi]: sushi },
  tokenPrices,
}: RawSyncedEarnData): NormalizedPoolsMap => {
  const curvePools = normalizeCurvePools()

  const pools = [
    ...balancer.map(normalizeBalancerPool),
    ...uniswap.map(normalizeUniswapPool),
    ...sushi.map(normalizeSushiPool),
    ...curvePools,
  ]

  return addPricesToPools(pools, tokenPrices)
}

const getStakingTokenPrices = (normalizedPools: NormalizedPoolsMap): TokenPricesMap => {
  return Object.fromEntries(
    Object.values(normalizedPools)
      .filter(pool => pool.totalSupply?.exact.gt(0) && pool.tokens.every(token => token.liquidity?.exact.gt(0) && token.price?.exact.gt(0)))
      .map(({ address, tokens, totalSupply }) => {
        const price = BigDecimal.parse(
          tokens
            .filter(t => t.price && t.liquidity)
            .reduce((prev, current) => prev + (current.liquidity as BigDecimal).simple * (current.price as BigDecimal).simple, 0)
            .toString(),
          18, // Both BPT and UNI-V2 are 18 decimals
        ).divPrecisely(totalSupply as BigDecimal)

        return [address, price]
      }),
  )
}

const transformRawSyncedEarnData = (rawSyncedEarnData: RawSyncedEarnData): SyncedEarnData => {
  const { tokenPrices, merkleDrops } = rawSyncedEarnData

  const pools = getPools(rawSyncedEarnData)

  const stakingTokensPrices = getStakingTokenPrices(pools)

  return {
    pools,
    tokenPrices: {
      ...tokenPrices,
      ...stakingTokensPrices,
    },
    merkleDrops,
  }
}

export const useSyncedEarnData = (): SyncedEarnData => {
  const account = useAccount()

  const stakingRewardsContractsQuery = useStakingRewardsContractsQuery({
    variables: { account: account ?? null },
    fetchPolicy: 'cache-and-network',
  })

  const merkleDrops = useMerkleDrops(account?.toLowerCase())

  const rawPlatformPools = useRawPlatformPools(stakingRewardsContractsQuery.data)

  const tokenPrices = useTokenPrices(stakingRewardsContractsQuery.data, rawPlatformPools)

  return useMemo(
    () =>
      transformRawSyncedEarnData({
        rawPlatformPools,
        tokenPrices,
        merkleDrops,
      }),
    [rawPlatformPools, tokenPrices, merkleDrops],
  )
}
