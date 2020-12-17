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

interface Network {
  [key: number]: object;
}

const ADDRESSES_BY_NETWORK: Network = Object.freeze({
  1: {
    MTA: '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
    SaveWrapper: 'TODO',
  },
  3: {
    MTA: '0x273bc479e5c21caa15aa8538decbf310981d14c0',
    SaveWrapper: '0xF078E3146160459fF7bb09D1D5e2D40238A7bCbe',
  },
  42: {
    MTA: '0xcda64b5d3ca85800ab9f7409686985b59f2b9598',
    SaveWrapper: 'TODO',
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ADDRESSES = ADDRESSES_BY_NETWORK[CHAIN_ID];

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
