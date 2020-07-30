import { useMemo } from 'react';

import { useWallet } from 'use-wallet';
import { BigDecimal } from '../../web3/BigDecimal';
import {
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
            blockNumber: parseInt(data.number, 10),
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
          (_allTokens, { rewardsToken, platformToken }) => [
            ..._allTokens,
            rewardsToken.address,
            platformToken?.address,
            ...rawPlatformsData[Platforms.Balancer]
              .map(item => item.tokens?.map(_item => _item.address))
              .flat(),
            ...rawPlatformsData[Platforms.Uniswap]
              .map(item => [item.token0.id, item.token1.id])
              .flat(),
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
    return {
      address: id,
      platform: Platforms.Uniswap,
      tokens: [
        {
          address: token0.id,
          decimals: parseInt(token0.decimals, 10),
          symbol: token0.symbol,
          liquidity: BigDecimal.parse(
            token0.totalLiquidity,
            parseInt(token0.decimals, 10),
          ),
        },
        {
          address: token1.id,
          decimals: parseInt(token1.decimals, 10),
          symbol: token1.symbol,
          liquidity: BigDecimal.parse(
            token1.totalLiquidity,
            parseInt(token1.decimals, 10),
          ),
        },
      ],
      [Platforms.Uniswap]: {
        // TODO check decimals
        totalSupply: BigDecimal.parse(totalSupply, 18),
        reserveUSD: BigDecimal.parse(reserveUSD, 18),
      },
    };
  }

  const {
    id,
    tokens,
    totalShares,
    totalSwapVolume,
    swapFee,
  } = poolOrPair as RawPoolData;
  return {
    address: id,
    platform: Platforms.Balancer,
    tokens:
      tokens?.map(({ address, decimals, balance, symbol }) => ({
        address,
        decimals,
        liquidity: BigDecimal.parse(balance, decimals),
        symbol: symbol as string,
      })) || [],
    [Platforms.Balancer]: {
      // TODO check decimals
      totalShares: BigDecimal.parse(totalShares, 18),
      totalSwapVolume: BigDecimal.parse(totalSwapVolume, 18),
      swapFee: BigDecimal.parse(swapFee, 18),
    },
  };
};

const useRawPlatformPoolsData = (
  rawStakingRewardsContracts: RawStakingRewardsContracts,
): RawPlatformPoolsData => {
  const options = useMemo(() => {
    // const ids = rawStakingRewardsContracts.map(item => item.id);
    // TODO remove fake mainnet data
    const ids = [
      '0x003a70265a3662342010823bea15dc84c6f7ed54', // balancer MTA/mUSD
      '0xa776f8e15704f4797ffbf6cbb8e4848e0d614fa5', // uniswap USDC/MTA
    ];
    return {
      variables: { ids },
      skip: ids.length === 0,
      fetchPolicy: 'cache-and-network',
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // TODO restore real data
    // [Platforms.Balancer]: pools,
    // [Platforms.Uniswap]: pairs,
    [Platforms.Balancer]: rawStakingRewardsContracts[1]
      ? [
          {
            ...pools[0],
            id: rawStakingRewardsContracts[1].stakingToken.address,
          },
        ]
      : [],
    [Platforms.Uniswap]: rawStakingRewardsContracts[0]
      ? [
          {
            ...pairs[0],
            id: rawStakingRewardsContracts[0].stakingToken.address,
          },
        ]
      : [],
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
    fetchPolicy: 'cache-first',
  });

  const pairIds = rawPlatformPoolsData[Platforms.Uniswap].map(item => item.id);
  const pairsQuery = usePairsAtBlockQuery({
    variables: {
      ids: pairIds,
      blockNumber: block24hAgo?.blockNumber as number,
    },
    skip: pairIds.length === 0 || !block24hAgo,
    fetchPolicy: 'cache-first',
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
  ].filter(Boolean) as NormalizedPool[]).reduce(
    (_pools, pool) => ({
      ..._pools,
      [pool.address]: {
        ...pool,
        tokens: pool.tokens.map(token => ({
          ...token,
          price: tokenPricesMap[token.address],
        })),
      },
    }),
    {},
  );
};

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

  return {
    block24hAgo,
    normalizedPoolsMap,
    normalizedPoolsMap24hAgo,
    tokenPricesMap,
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
