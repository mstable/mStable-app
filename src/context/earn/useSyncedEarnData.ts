import { useMemo } from 'react';

import { useWallet } from 'use-wallet';
import { BigDecimal } from '../../web3/BigDecimal';
import {
  PoolToken,
  usePoolsAtBlockQuery,
  usePoolsQuery,
  useTokenPricesQuery,
} from '../../graphql/balancer';
import { useStakingRewardsContractsQuery } from '../../graphql/mstable';
import { usePairsAtBlockQuery, usePairsQuery } from '../../graphql/uniswap';
import { useBlockTimestampQuery } from '../../graphql/blocks';
import { BlockTimestamp, Platforms } from '../../types';
import {
  NormalizedPool,
  NormalizedPoolsMap,
  RawPairData,
  RawPlatformPoolsData,
  RawPoolData,
  RawStakingRewardsContracts,
  RawSyncedEarnData,
  RawTokenPrices,
  SyncedEarnData,
  TokenPricesMap,
} from './types';

const START = Math.floor(Date.now() / 1e3) - 24 * 60 * 60;

const useBlockTimestamp24hAgo = (): BlockTimestamp | undefined => {
  const query = useBlockTimestampQuery({
    variables: {
      start: START.toString(),
      // Adding a small window speeds up the query a lot
      end: (START + 60e3).toString(),
    },
  });

  const data = query.data?.blocks[0];

  return useMemo(
    () =>
      data
        ? {
            timestamp: parseInt(data.timestamp, 10),
            // TODO revert
            blockNumber: 10563066,
          }
        : undefined,
    [data],
  );
};

const useRawTokenPrices = (
  rawStakingContractsData: RawStakingRewardsContracts,
  rawPlatformsData: RawPlatformPoolsData,
): RawTokenPrices => {
  const tokenPricesQueryVariables = useMemo(
    () => ({
      // Get unique token addresses: rewards tokens, platform tokens,
      // and pool tokens.
      tokens: rawStakingContractsData
        .reduce(
          (_allTokens, { rewardsToken, platformToken, stakingToken }) => [
            ..._allTokens,
            rewardsToken.address,
            stakingToken.address,

            platformToken?.address,
            ...rawPlatformsData[Platforms.Balancer]
              .map(item => item.tokens?.map(_item => _item.address))
              .flat(),
            ...rawPlatformsData[Platforms.Uniswap]
              .map(item => [item.token0.id, item.token1.id])
              .flat(),
            // TODO remove these: MTA/BAL for staging testing
            '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
            '0xba100000625a3754423978a60c9317c58a424e3d',
          ],
          [] as (string | undefined)[],
        )
        .filter(Boolean) as string[],
    }),
    [rawPlatformsData, rawStakingContractsData],
  );

  const tokenPricesSub = useTokenPricesQuery({
    variables: tokenPricesQueryVariables,
    skip: tokenPricesQueryVariables.tokens.length === 0,
  });

  return tokenPricesSub.data?.tokenPrices || [];
};

const normalizeUniswapToken = ({
  id,
  totalLiquidity,
  symbol,
  decimals,
}: RawPairData['token0']): NormalizedPool['tokens'][number] => ({
  address: id,
  decimals: parseInt(decimals, 10),
  symbol,
  liquidity: BigDecimal.parse(totalLiquidity, parseInt(decimals, 10)),
  ratio: 50, // All Uniswap pairs are 50/50
});

const normalizeBalancerTokens = (
  tokens: RawPoolData['tokens'],
  totalWeight: RawPoolData['totalWeight'],
): NormalizedPool['tokens'] =>
  tokens?.map(({ address, decimals, denormWeight, balance, symbol }) => ({
    address,
    decimals,
    liquidity: BigDecimal.parse(balance, decimals),
    symbol: symbol as string,
    ratio: Math.floor(
      (parseInt(denormWeight, 10) / parseInt(totalWeight, 10)) * 100,
    ),
  })) ?? [];

const normalizePool = (
  poolOrPair?: RawPoolData | RawPairData,
): NormalizedPool | undefined => {
  if (!poolOrPair) {
    return undefined;
  }

  if ((poolOrPair as RawPairData).token0) {
    const {
      id,
      totalSupply,
      reserveUSD,
      token0,
      token1,
    } = poolOrPair as RawPairData;

    const tokens = [
      normalizeUniswapToken(token0),
      normalizeUniswapToken(token1),
    ];

    return {
      address: id,
      platform: Platforms.Uniswap,
      totalSupply: BigDecimal.parse(totalSupply, 18),
      reserveUSD: BigDecimal.parse(reserveUSD, 18),
      tokens,
    };
  }

  const {
    id,
    tokens,
    totalShares,
    totalSwapVolume,
    totalWeight,
    swapFee,
  } = poolOrPair as RawPoolData;

  return {
    address: id,
    platform: Platforms.Balancer,
    totalSupply: BigDecimal.parse(totalShares, 18),
    totalSwapVolume: BigDecimal.parse(totalSwapVolume, 18),
    swapFee: BigDecimal.parse(swapFee, 18),
    tokens: normalizeBalancerTokens(tokens, totalWeight),
  };
};

const useRawPlatformPoolsData = (
  rawStakingRewardsContracts: RawStakingRewardsContracts,
): RawPlatformPoolsData => {
  const options = useMemo(() => {
    const ids = rawStakingRewardsContracts.map(
      item => item.stakingToken.address,
    );
    return {
      variables: { ids },
      skip: ids.length === 0,
      fetchPolicy: 'cache-and-network',
    };
  }, [rawStakingRewardsContracts]);

  const poolsQuery = usePoolsQuery(
    options as Parameters<typeof usePoolsQuery>[0],
  );
  const pairsQuery = usePairsQuery(
    options as Parameters<typeof usePairsQuery>[0],
  );

  const pools = poolsQuery.data?.pools || [];
  const pairs = pairsQuery.data?.pairs || [];

  return {
    [Platforms.Balancer]: pools,
    [Platforms.Uniswap]: pairs,
  };
};

const useRawPlatformPoolsData24hAgo = (
  rawPlatformPoolsData: RawPlatformPoolsData,
  block24hAgo?: BlockTimestamp,
): RawPlatformPoolsData => {
  const poolIds = rawPlatformPoolsData[Platforms.Balancer].map(item => item.id);
  const poolsQuery = usePoolsAtBlockQuery({
    variables: {
      ids: poolIds,
      blockNumber: block24hAgo?.blockNumber as number,
    },
    skip: poolIds.length === 0 || !block24hAgo,
    // fetchPolicy: 'cache-first',
  });

  const pairIds = rawPlatformPoolsData[Platforms.Uniswap].map(item => item.id);
  const pairsQuery = usePairsAtBlockQuery({
    variables: {
      ids: pairIds,
      blockNumber: block24hAgo?.blockNumber as number,
    },
    skip: pairIds.length === 0 || !block24hAgo,
    // fetchPolicy: 'cache-first',
  });

  const pools = poolsQuery.data?.pools || [];
  const pairs = pairsQuery.data?.pairs || [];

  return { [Platforms.Balancer]: pools, [Platforms.Uniswap]: pairs };
};

const getNormalizedPoolsMap = (
  rawPlatformPoolsData: RawPlatformPoolsData,
  tokenPricesMap: TokenPricesMap,
): NormalizedPoolsMap => {
  if (!rawPlatformPoolsData) return {};

  return ([
    ...rawPlatformPoolsData[Platforms.Balancer].map(normalizePool),
    ...rawPlatformPoolsData[Platforms.Uniswap].map(normalizePool),
  ].filter(Boolean) as NormalizedPool[]).reduce((_pools, pool) => {
    // Add price to pool tokens
    const tokens = pool.tokens.map(token => ({
      ...token,
      price: tokenPricesMap[token.address],
    }));

    return {
      ..._pools,
      [pool.address]: {
        ...pool,
        tokens,
      },
    };
  }, {});
};

const getStakingTokenPricesMap = (
  normalizedPools: NormalizedPoolsMap,
): TokenPricesMap =>
  Object.values(normalizedPools).reduce(
    (prices, { address, tokens, totalSupply }) => ({
      ...prices,
      [address]: BigDecimal.parse(
        tokens
          .reduce(
            (total, token) =>
              token.price ? token.liquidity.simple * token.price.simple : total,
            0,
          )
          .toString(),
        18, // Both BPT and UNI-V2 are 18 decimals
      ).divPrecisely(totalSupply),
    }),
    {},
  );

const transformRawSyncedEarnData = ({
  block24hAgo,
  rawTokenPrices,
  rawPlatformPoolsData,
  rawPlatformPoolsData24hAgo,
}: RawSyncedEarnData): SyncedEarnData => {
  const tokenPricesMap = rawTokenPrices.reduce(
    (_tokenPrices, { id, price, decimals }) => ({
      ..._tokenPrices,
      [id]: BigDecimal.parse(price, decimals),
    }),
    {},
  );

  const normalizedPoolsMap = getNormalizedPoolsMap(
    rawPlatformPoolsData,
    tokenPricesMap,
  );

  const normalizedPoolsMap24hAgo = getNormalizedPoolsMap(
    rawPlatformPoolsData24hAgo,
    tokenPricesMap, // Should use token prices from 24h ago
  );

  const stakingTokensPricesMap = getStakingTokenPricesMap(normalizedPoolsMap);

  return {
    block24hAgo,
    normalizedPoolsMap,
    normalizedPoolsMap24hAgo,
    tokenPricesMap: {
      ...tokenPricesMap,
      ...stakingTokensPricesMap,
    },
  };
};

export const useSyncedEarnData = (): SyncedEarnData => {
  const { account } = useWallet();
  const block24hAgo = useBlockTimestamp24hAgo();

  const stakingRewardsContractsQuery = useStakingRewardsContractsQuery({
    variables: { account },
    fetchPolicy: 'cache-and-network',
  });

  const rawStakingRewardsContracts =
    stakingRewardsContractsQuery.data?.stakingRewardsContracts ?? [];

  const rawPlatformPoolsData = useRawPlatformPoolsData(
    rawStakingRewardsContracts,
  );

  const rawPlatformPoolsData24hAgo = useRawPlatformPoolsData24hAgo(
    rawPlatformPoolsData,
    block24hAgo,
  );

  const rawTokenPrices = useRawTokenPrices(
    rawStakingRewardsContracts,
    rawPlatformPoolsData,
  );

  return useMemo(
    () =>
      transformRawSyncedEarnData({
        block24hAgo,
        rawPlatformPoolsData,
        rawPlatformPoolsData24hAgo,
        rawTokenPrices,
      }),
    [
      block24hAgo,
      rawPlatformPoolsData,
      rawPlatformPoolsData24hAgo,
      rawTokenPrices,
    ],
  );
};
