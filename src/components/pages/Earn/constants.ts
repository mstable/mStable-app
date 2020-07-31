import { Platforms } from '../../../types';
import { PlatformMetadata } from './types';

export const PLATFORM_METADATA: Record<Platforms, PlatformMetadata> = {
  [Platforms.Balancer]: {
    colors: {
      light: '#cfd4ff',
      accent: '#5568f9',
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
      light: '#ffc3db',
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
