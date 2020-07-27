import { Platforms } from '../../../types';
import { PlatformMetadata } from './types';

export const PLATFORM_METADATA: Record<Platforms, PlatformMetadata> = {
  [Platforms.Balancer]: {
    colors: {
      accent: '#727380',
      base: '#201d4a',
      text: '#dbdbec',
    },
    name: 'Balancer',
    getPlatformLink: ({ stakingToken: { address } }) =>
      `https://pools.balancer.exchange/#/pool/${address}`,
    slug: 'balancer',
  },
  [Platforms.Uniswap]: {
    colors: {
      accent: '#fff',
      base: '#ff007a',
      text: '#4f0026',
    },
    name: 'Uniswap',
    getPlatformLink: ({
      pool: {
        tokens: [token0, token1],
      },
    }) => `https://app.uniswap.org/#/add/${token0.address}/${token1.address}`,
    slug: 'uniswap',
  },
};
