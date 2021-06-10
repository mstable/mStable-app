import { StreamType } from '../../../context/RewardStreamsProvider'

// Need to replace symbol mapping, probably ...
export const assetColorMapping: Record<string, string> = {
  'mBTC/fAST': '#eb6ba9',
  'mUSD/GUSD': '#1ecdea',
  'mUSD/BUSD': '#F0B90B',
  'mUSD/FRAX': '#cccccc',
  'mBTC/HBTC': '#0B197D',
  'mBTC/TBTC': '#DCD1AB',
  fAST: '#eb6ba9',
  GUSD: '#17d4f2',
  mBTC: '#000',
  mUSD: '#000',
}

const greenRewards = {
  point: 'rgb(82,204,147)',
  fill1: 'rgb(133,231,185)',
  fill2: 'rgba(133,231,185,0.2)',
  light: 'rgb(39,99,72)',
  dark: 'rgb(67,196,138)',
}

const blueRewards = {
  point: 'rgb(38,132,255)',
  fill1: 'rgb(88,156,241)',
  fill2: 'rgba(88,156,241,0.2)',
  light: 'rgb(18,63,121)',
  dark: 'rgb(52, 139, 250)',
}

export const rewardsColorMapping: Record<StreamType, { fill1: string; fill2: string; point: string; dark: string; light: string }> = {
  [StreamType.Earned]: {
    point: 'rgb(255,192,81)',
    fill1: 'rgb(255,219,160)',
    fill2: 'rgba(255,219,160,0.2)',
    light: 'rgb(102,79,33)',
    dark: 'rgb(201, 150, 46)',
  },
  [StreamType.Unclaimed]: greenRewards,
  [StreamType.Unlocked]: greenRewards,
  [StreamType.Locked]: blueRewards,
  [StreamType.LockedPreview]: blueRewards,
}
