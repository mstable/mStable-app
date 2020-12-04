import { useEffect, useMemo, useRef, useState } from 'react';

import { useAccount } from '../UserProvider';
import { BigDecimal } from '../../web3/BigDecimal';
import { usePoolsQuery as useBalancerPoolsQuery } from '../../graphql/balancer';
// import { usePoolsQuery as useCurvePoolsQuery } from '../../graphql/curve';
import { useStakingRewardsContractsQuery } from '../../graphql/ecosystem';
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
import { STABLECOIN_SYMBOLS } from '../../web3/constants';
import { useMerkleDrops } from './useMerkleDrops';
import {
  CURVE_ADDRESSES,
  CurveJsonData,
  useCurveJsonData,
} from './CurveProvider';

interface CoingeckoPrices {
  [address: string]: { usd: number };
}

const START = Math.floor(Date.now() / 1e3) - 16 * 60 * 60;

const useBlockTimestamp24hAgo = (): BlockTimestamp | undefined => {
  const query = useBlockTimestampQuery({
    variables: {
      start: START.toString(),
      // Adding a small window speeds up the query a lot
      end: (START + 60e3).toString(),
    },
    fetchPolicy: 'cache-and-network',
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
    // MTA/BAL/CRV
    '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2': 18,
    '0xba100000625a3754423978a60c9317c58a424e3d': 18,
    [CURVE_ADDRESSES.CRV_TOKEN]: 18,
    ...tokens,
    ...balancerTokens,
    ...uniswapTokens,
  };
};

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

const FIFTEEN_MINUTES = 15 * 60 * 1e3;

const useTokenPrices = (
  rawStakingContractsData: RawStakingRewardsContracts,
  rawPlatformsData: RawPlatformPools,
): TokenPricesMap => {
  const fetchedAddresses = useRef<string[]>([]);
  const lastUpdateTime = useRef<number>(0);
  const updating = useRef<boolean>(false);
  const [coingeckoData, setCoingeckoData] = useState<CoingeckoPrices>({});

  const uniqueTokens = useMemo(
    () => getUniqueTokens(rawStakingContractsData, rawPlatformsData),
    [rawPlatformsData, rawStakingContractsData],
  );

  const addresses = Object.keys(uniqueTokens);

  useEffect(() => {
    const addressesExist = addresses.length > 0;

    const missingAddresses = addresses.filter(
      address => !fetchedAddresses.current.includes(address),
    );

    const stale = Date.now() - lastUpdateTime.current > FIFTEEN_MINUTES;

    if (
      addressesExist &&
      !updating.current &&
      (stale || missingAddresses.length > 0)
    ) {
      lastUpdateTime.current = Date.now();
      updating.current = true;
      fetchCoingeckoPrices(addresses)
        .then((result: CoingeckoPrices) => {
          fetchedAddresses.current = addresses;
          setCoingeckoData(result);
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.warn(error);
        })
        .finally(() => {
          updating.current = false;
        });
    }
  }, [addresses]);

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
  );
};

const normalizeUniswapToken = (
  { address, symbol, decimals: _decimals }: RawPairData['token0'],
  reserve: RawPairData['reserve0'],
): NormalizedPool['tokens'][number] => {
  const decimals = parseInt(_decimals, 10);
  return {
    address,
    decimals,
    symbol,
    liquidity: BigDecimal.parse(reserve, decimals),
    ratio: 50, // All Uniswap pairs are 50/50
    totalSupply: new BigDecimal(0, decimals),
  };
};

const normalizeUniswapPool = ({
  address,
  totalSupply,
  reserveUSD,
  reserve0,
  reserve1,
  token0,
  token1,
}: RawPairData): NormalizedPool => {
  const tokens = [
    normalizeUniswapToken(token0, reserve0),
    normalizeUniswapToken(token1, reserve1),
  ];
  return {
    address,
    platform: Platforms.Uniswap,
    totalSupply: BigDecimal.parse(totalSupply, 18),
    reserveUSD: BigDecimal.parse(reserveUSD, 18),
    tokens,
    onlyStablecoins: tokens.every(token =>
      STABLECOIN_SYMBOLS.includes(token.symbol),
    ),
  };
};

const normalizeCurvePools = (
  curveJsonData?: CurveJsonData,
): NormalizedPool[] => {
  const {
    stats: { balances, prices, supply },
  } = curveJsonData || { stats: {} };

  return [
    {
      address: CURVE_ADDRESSES.MUSD_LP_TOKEN,
      platform: Platforms.Curve,
      totalSupply: supply?.value ? new BigDecimal(supply.value, 18) : undefined,
      tokens: [
        {
          address: CURVE_ADDRESSES.MUSD_TOKEN,
          symbol: 'mUSD',
          decimals: 18,
          liquidity: balances?.[0]?.value
            ? new BigDecimal(balances[0].value, 18)
            : undefined,
          price: BigDecimal.maybeParse(prices?.['0-2']?.[0]?.value, 18),
          totalSupply: new BigDecimal(0, 18),
        },
        {
          address: CURVE_ADDRESSES['3POOL_TOKEN'],
          symbol: '3POOL',
          decimals: 18,
          liquidity: balances?.[1]?.value
            ? new BigDecimal(balances[1].value, 18)
            : undefined,
          price: BigDecimal.maybeParse(prices?.['0-2']?.[1]?.value, 18),
          totalSupply: new BigDecimal(0, 18),
        },
      ],
      onlyStablecoins: true,
    },
  ];
};

const normalizeBalancerPool = ({
  address,
  tokens: _tokens,
  totalShares,
  totalSwapVolume,
  totalWeight,
  swapFee,
}: RawPoolData): NormalizedPool => {
  const tokens =
    _tokens?.map(
      ({ address: _address, decimals, denormWeight, balance, symbol }) => ({
        address: _address,
        decimals,
        liquidity: BigDecimal.parse(balance, decimals),
        symbol: symbol as string,
        ratio: Math.floor(
          (parseFloat(denormWeight) / parseFloat(totalWeight)) * 100,
        ),
        totalSupply: new BigDecimal(0, decimals),
      }),
    ) ?? [];
  return {
    address,
    platform: Platforms.Balancer,
    totalSupply: BigDecimal.parse(totalShares, 18),
    totalSwapVolume: BigDecimal.parse(totalSwapVolume, 18),
    swapFee: BigDecimal.parse(swapFee, 18),
    tokens,
    onlyStablecoins: tokens.every(token =>
      STABLECOIN_SYMBOLS.includes(token.symbol),
    ),
  };
};

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

  const poolsQuery = useBalancerPoolsQuery(
    options as Parameters<typeof useBalancerPoolsQuery>[0],
  );
  const pairsQuery = usePairsQuery(
    options as Parameters<typeof usePairsQuery>[0],
  );

  // TODO later: include when the subgraph works
  // const curveQuery = useCurvePoolsQuery({
  //   variables: {
  //     basePool: CURVE_ADDRESSES['3POOL_SWAP'],
  //     musdPool: CURVE_ADDRESSES.MUSD_SWAP,
  //   },
  //   fetchPolicy: 'cache-and-network',
  // });

  return {
    [Platforms.Balancer]: {
      current: poolsQuery.data?.current || [],
      historic: poolsQuery.data?.historic || [],
    },
    [Platforms.Uniswap]: {
      current: pairsQuery.data?.current || [],
      historic: pairsQuery.data?.historic || [],
    },
    // [Platforms.Curve]: curveQuery.data,
  };
};

const addPricesToPools = (
  pools: NormalizedPool[],
  tokenPricesMap: TokenPricesMap,
): NormalizedPoolsMap =>
  Object.fromEntries(
    pools.map(pool => [
      pool.address,
      {
        ...pool,
        tokens: pool.tokens.map(token => ({
          ...token,
          price: token.price || tokenPricesMap[token.address],
        })),
      },
    ]),
  );

const getPools = ({
  rawPlatformPools: {
    [Platforms.Balancer]: balancer,
    [Platforms.Uniswap]: uniswap,
  },
  curveJsonData,
  tokenPrices,
}: RawSyncedEarnData): {
  current: NormalizedPoolsMap;
  historic: NormalizedPoolsMap;
} => {
  const curvePools = normalizeCurvePools(curveJsonData);
  const current = [
    ...balancer.current.map(normalizeBalancerPool),
    ...uniswap.current.map(normalizeUniswapPool),
    ...curvePools,
  ];
  const historic = [
    ...balancer.historic.map(normalizeBalancerPool),
    ...uniswap.historic.map(normalizeUniswapPool),
  ];

  return {
    current: addPricesToPools(current, tokenPrices),
    historic: addPricesToPools(historic, tokenPrices),
  };
};

const getStakingTokenPrices = (normalizedPools: {
  current: NormalizedPoolsMap;
  historic: NormalizedPoolsMap;
}): TokenPricesMap => {
  return Object.fromEntries(
    Object.values(normalizedPools.current)
      .filter(
        pool =>
          pool.totalSupply?.exact.gt(0) &&
          pool.tokens.every(
            token => token.liquidity?.exact.gt(0) && token.price?.exact.gt(0),
          ),
      )
      .map(({ address, tokens, totalSupply }) => {
        const price = BigDecimal.parse(
          tokens
            .filter(t => t.price && t.liquidity)
            .reduce(
              (prev, current) =>
                prev +
                (current.liquidity as BigDecimal).simple *
                  (current.price as BigDecimal).simple,
              0,
            )
            .toString(),
          18, // Both BPT and UNI-V2 are 18 decimals
        ).divPrecisely(totalSupply as BigDecimal);

        return [address, price];
      }),
  );
};

const transformRawSyncedEarnData = (
  rawSyncedEarnData: RawSyncedEarnData,
): SyncedEarnData => {
  const {
    block24hAgo,
    tokenPrices,
    curveJsonData,
    merkleDrops,
  } = rawSyncedEarnData;

  const pools = getPools(rawSyncedEarnData);

  const stakingTokensPrices = getStakingTokenPrices(pools);

  return {
    block24hAgo,
    curveJsonData,
    pools,
    tokenPrices: {
      ...tokenPrices,
      ...stakingTokensPrices,
    },
    merkleDrops,
  };
};

export const useSyncedEarnData = (): SyncedEarnData => {
  const account = useAccount();
  const block24hAgo = useBlockTimestamp24hAgo();

  const stakingRewardsContractsQuery = useStakingRewardsContractsQuery({
    variables: { account: account ?? null, includeHistoric: false },
    fetchPolicy: 'cache-and-network',
  });

  const merkleDrops = useMerkleDrops(account?.toLowerCase());

  const rawPlatformPools = useRawPlatformPools(
    stakingRewardsContractsQuery.data,
    block24hAgo,
  );

  const curveJsonData = useCurveJsonData();

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
        merkleDrops,
        curveJsonData,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawPlatformPools, tokenPrices, merkleDrops],
  );
};
