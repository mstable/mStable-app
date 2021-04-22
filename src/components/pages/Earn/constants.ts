import { Platforms } from '../../../types'
import { PlatformMetadata } from './types'

export const PLATFORM_METADATA: Record<Platforms, PlatformMetadata> = {
  [Platforms.Balancer]: {
    colors: {
      light: '#cfd4ff',
      accent: '#5568f9',
      base: '#201d4a',
      text: '#dbdbec',
    },
    name: 'Balancer',
    getPlatformLink: ({ stakingToken: { address } }) => `https://pools.balancer.exchange/#/pool/${address}`,
    slug: 'balancer',
  },
  [Platforms.Uniswap]: {
    colors: {
      light: '#ffc3db',
      accent: '#fff',
      base: '#ff007a',
      text: '#ffffff',
    },
    name: 'Uniswap',
    getPlatformLink: ({
      pool: {
        tokens: [token0, token1],
      },
    }) => `https://app.uniswap.org/#/add/${token0.address}/${token1.address}`,
    slug: 'uniswap',
  },
  [Platforms.Curve]: {
    colors: {
      light: '#a4a3cc',
      accent: '#bebebe',
      base: '#3464a3',
      text: '#ffffff',
    },
    name: 'Curve',
    getPlatformLink: () => 'https://www.curve.fi/musd',
    slug: 'curve',
  },
  [Platforms.Sushi]: {
    colors: {
      light: '#69ACE1',
      accent: '#fa52a0',
      base: '#69ACE1',
      text: '#ffffff',
    },
    name: 'Sushi',
    getPlatformLink: () => 'https://sushiswap.fi/',
    slug: 'sushi',
  },
  [Platforms.Badger]: {
    colors: {
      light: '#DFA33A',
      accent: '#ffe4b5',
      base: '#DFA33A',
      text: '#ffffff',
    },
    name: 'Badger',
    getPlatformLink: () => 'https://app.badger.finance/',
    slug: 'badger',
  },
  [Platforms.Cream]: {
    colors: {
      light: '#cdc5ff',
      accent: '#8FF6F0',
      base: '#a89fe3',
      text: '#ffffff',
    },
    name: 'Cream',
    getPlatformLink: () => 'https://app.cream.finance/',
    slug: 'cream',
  },
}
