import { StreamType } from './Detail/useRewardStreams';

export const assetColorMapping: Record<string, string> = {
  'mBTC/fAST': '#eb6ba9',
  'mUSD/GUSD': '#1ecdea',
  'mUSD/BUSD': '#F0B90B',
  'mBTC/HBTC': '#0B197D',
  'mBTC/tBTC': '#DCD1AB',
  fAST: '#eb6ba9',
  GUSD: '#17d4f2',
  mBTC: '#000',
  mUSD: '#000',
};

const greenRewards = {
  point: 'rgb(82,204,147)',
  fill1: 'rgb(133,231,185)',
  fill2: 'rgba(133,231,185,0.2)',
  dark: 'rgb(39,99,72)',
};

const blueRewards = {
  point: 'rgb(38,132,255)',
  fill1: 'rgb(88,156,241)',
  fill2: 'rgba(88,156,241,0.2)',
  dark: 'rgb(18,63,121)',
};

export const rewardsColorMapping: Record<
  StreamType,
  { fill1: string; fill2: string; point: string; dark: string }
> = {
  [StreamType.Earned]: {
    point: 'rgb(255,192,81)',
    fill1: 'rgb(255,219,160)',
    fill2: 'rgba(255,219,160,0.2)',
    dark: 'rgb(102,79,33)',
  },
  [StreamType.Unclaimed]: greenRewards,
  [StreamType.Unlocked]: greenRewards,
  [StreamType.Locked]: blueRewards,
  [StreamType.LockedPreview]: blueRewards,
};
