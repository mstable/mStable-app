import { useMemo, useState } from 'react';
import { useWallet } from 'use-wallet';
import useThrottle from 'react-use/lib/useThrottle';

import { BigDecimal } from '../../web3/BigDecimal';
import { usePoolsQuery } from '../../graphql/balancer';
import { useStakingRewardsContractsQuery } from '../../graphql/mstable';
import { usePairsQuery } from '../../graphql/uniswap';
import { useBlockTimestampQuery } from '../../graphql/blocks';
import { BlockTimestamp, Platforms } from '../../types';
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
} from './types';

interface CoingeckoPrices {
  [address: string]: { usd: number };
}

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

const getUniqueTokens = (
  rawStakingContractsData: RawStakingRewardsContracts,
  rawPlatformsData: RawPlatformPools,
): { [address: string]: number } => {
  // Get unique tokens: rewards tokens, platform tokens,
  // and pool tokens.
  const tokens = (rawStakingContractsData?.current || []).reduce(
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
  );

  const balancerTokens = rawPlatformsData.Balancer.current.reduce(
    (_tokens, platform) =>
      (platform.tokens || []).reduce(
        (acc, token) => ({
          ...acc,
          [token.address.toLowerCase()]: token.decimals,
        }),
        {},
      ),
    {},
  );

  const uniswapTokens = rawPlatformsData.Uniswap.current.reduce(
    (_tokens, { token0, token1 }) => ({
      ..._tokens,
      [token0.address.toLowerCase()]: parseInt(token0.decimals, 10),
      [token1.address.toLowerCase()]: parseInt(token1.decimals, 10),
    }),
    {},
  );

  return {
    ...tokens,
    ...balancerTokens,
    ...uniswapTokens,
    // MTA/BAL for staging testing
    '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2': 18,
    '0xba100000625a3754423978a60c9317c58a424e3d': 18,
  };
};

const TEN_MINUTES = 10 * 60 * 1000;

const fetchCoingeckoPrices = async (
  addresses: string[],
): Promise<CoingeckoPrices> => {
  const result = await fetch(
    `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${addresses.join(
      ',',
    )}&vs_currencies=USD`,
  );
  return result.json();
};

const useTokenPrices = (
  rawStakingContractsData: RawStakingRewardsContracts,
  rawPlatformsData: RawPlatformPools,
): TokenPricesMap => {
  const [coingeckoPrices, setData] = useState<CoingeckoPrices>({});

  const uniqueTokens = useMemo(
    () => getUniqueTokens(rawStakingContractsData, rawPlatformsData),
    [rawPlatformsData, rawStakingContractsData],
  );

  const addresses = Object.keys(uniqueTokens);

  useThrottle(() => {
    if (addresses.length > 0) {
      fetchCoingeckoPrices(addresses).then((result: CoingeckoPrices) => {
        setData(result);
      });
    }
  }, TEN_MINUTES);

  return useMemo(
    () =>
      Object.keys(coingeckoPrices).reduce(
        (_prices, address) => ({
          ..._prices,
          [address.toLowerCase()]: BigDecimal.maybeParse(
            coingeckoPrices[address.toLowerCase()].usd.toString(),
            uniqueTokens[address.toLowerCase()],
          ),
        }),
        {},
      ),
    [coingeckoPrices, uniqueTokens],
  );
};

const normalizeUniswapToken = (
  { address, symbol, decimals }: RawPairData['token0'],
  reserve: RawPairData['reserve0'],
): NormalizedPool['tokens'][number] => ({
  address,
  decimals: parseInt(decimals, 10),
  symbol,
  liquidity: BigDecimal.parse(reserve, parseInt(decimals, 10)),
  ratio: 50, // All Uniswap pairs are 50/50
});

const normalizeUniswapPool = ({
  address,
  totalSupply,
  reserveUSD,
  reserve0,
  reserve1,
  token0,
  token1,
}: RawPairData): NormalizedPool => ({
  address,
  platform: Platforms.Uniswap,
  totalSupply: BigDecimal.parse(totalSupply, 18),
  reserveUSD: BigDecimal.parse(reserveUSD, 18),
  tokens: [
    normalizeUniswapToken(token0, reserve0),
    normalizeUniswapToken(token1, reserve1),
  ],
});

const normalizeBalancerPool = ({
  address,
  tokens,
  totalShares,
  totalSwapVolume,
  totalWeight,
  swapFee,
}: RawPoolData): NormalizedPool => ({
  address,
  platform: Platforms.Balancer,
  totalSupply: BigDecimal.parse(totalShares, 18),
  totalSwapVolume: BigDecimal.parse(totalSwapVolume, 18),
  swapFee: BigDecimal.parse(swapFee, 18),
  tokens:
    tokens?.map(
      ({ address: _address, decimals, denormWeight, balance, symbol }) => ({
        address: _address,
        decimals,
        liquidity: BigDecimal.parse(balance, decimals),
        symbol: symbol as string,
        ratio: Math.floor(
          (parseFloat(denormWeight) / parseFloat(totalWeight)) * 100,
        ),
      }),
    ) ?? [],
});

const useRawPlatformPools = (
  rawStakingRewardsContracts: RawStakingRewardsContracts,
  block24hAgo?: BlockTimestamp,
): RawPlatformPools => {
  const block = block24hAgo ? { number: block24hAgo.blockNumber } : undefined;
  const includeHistoric = !!block;

  const ids = (rawStakingRewardsContracts?.current || []).map(
    item => item.stakingToken.address,
  );

  const options = {
    variables: {
      ids,
      block,
      includeHistoric,
    },
    skip: ids.length === 0,
    fetchPolicy: 'cache-and-network',
  };

  const poolsQuery = usePoolsQuery(
    options as Parameters<typeof usePoolsQuery>[0],
  );
  const pairsQuery = usePairsQuery(
    options as Parameters<typeof usePairsQuery>[0],
  );

  return {
    [Platforms.Balancer]: {
      current: poolsQuery.data?.current || [],
      historic: poolsQuery.data?.historic || [],
    },
    [Platforms.Uniswap]: {
      current: pairsQuery.data?.current || [],
      historic: pairsQuery.data?.historic || [],
    },
  };
};

const addPricesToPools = (
  pools: NormalizedPool[],
  tokenPricesMap: TokenPricesMap,
): NormalizedPoolsMap =>
  pools.reduce(
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

const getPools = (
  {
    [Platforms.Balancer]: balancer,
    [Platforms.Uniswap]: uniswap,
  }: RawPlatformPools,
  tokenPricesMap: TokenPricesMap,
): { current: NormalizedPoolsMap; historic: NormalizedPoolsMap } => {
  const current = [
    ...balancer.current.map(normalizeBalancerPool),
    ...uniswap.current.map(normalizeUniswapPool),
  ];
  const historic = [
    ...balancer.historic.map(normalizeBalancerPool),
    ...uniswap.historic.map(normalizeUniswapPool),
  ];

  return {
    current: addPricesToPools(current, tokenPricesMap),
    historic: addPricesToPools(historic, tokenPricesMap),
  };
};

const getStakingTokenPrices = (normalizedPools: {
  current: NormalizedPoolsMap;
  historic: NormalizedPoolsMap;
}): TokenPricesMap =>
  Object.values(normalizedPools.current).reduce(
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
  tokenPrices,
  rawPlatformPools,
}: RawSyncedEarnData): SyncedEarnData => {
  const pools = getPools(rawPlatformPools, tokenPrices);

  const stakingTokensPrices = getStakingTokenPrices(pools);

  return {
    block24hAgo,
    pools,
    tokenPrices: {
      ...tokenPrices,
      ...stakingTokensPrices,
    },
  };
};

export const useSyncedEarnData = (): SyncedEarnData => {
  const { account } = useWallet();
  const block24hAgo = useBlockTimestamp24hAgo();

  const stakingRewardsContractsQuery = useStakingRewardsContractsQuery({
    variables: { account, includeHistoric: false },
    fetchPolicy: 'cache-and-network',
    returnPartialData: true,
  });

  const rawPlatformPools = useRawPlatformPools(
    stakingRewardsContractsQuery.data,
    block24hAgo,
  );

  const tokenPrices = useTokenPrices(
    stakingRewardsContractsQuery.data,
    rawPlatformPools,
  );

  return useMemo(
    () =>
      transformRawSyncedEarnData({
        block24hAgo,
        rawPlatformPools,
        tokenPrices,
      }),
    [block24hAgo, rawPlatformPools, tokenPrices],
  );
};
