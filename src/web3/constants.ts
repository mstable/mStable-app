import { BigNumber } from 'ethers/utils';

export const SCALE = new BigNumber((1e18).toString());
export const PERCENT_SCALE = new BigNumber((1e16).toString());
export const RATIO_SCALE = new BigNumber((1e8).toString());
export const EXP_SCALE = new BigNumber((1e18).toString());

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// For now, support one chain ID per deployment; also a `use-wallet` restriction
export const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID as string, 10);

export const NETWORK_NAMES = {
  1: 'Main Ethereum network',
  3: 'Ropsten (Test network)',
  42: 'Kovan (Test network)',
  1337: 'Local network',
};

export const EMOJIS = {
  error: '❌',
  approve: '✔️',
  depositSavings: '🏦',
  swap: '🔄',
  mint: '💵',
  mintMulti: '💵',
  redeem: '💱',
  redeemMasset: '💱',
  withdraw: '🏧',
  link: '🔗',
  exit: '🚪',
  claimReward: '🏆',
  claimWeeks: '🏆',
  claimWeek: '🏆',
  'stake(uint256)': '🔒',
};

export const DAPP_VERSION =
  process.env.REACT_APP_VERSION || process.env.npm_package_version;

export const STABLECOIN_SYMBOLS = [
  'BUSD',
  'DAI',
  'SUSD',
  'TUSD',
  'USDC',
  'USDT',
  'mUSD',
];

export const rpcUrl = `${process.env.REACT_APP_RPC_URL}${process.env.REACT_APP_RPC_API_KEY}`;
