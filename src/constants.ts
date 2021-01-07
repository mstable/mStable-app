import { BigNumber } from 'ethers/utils';

interface Connector {
  id: string;
  subType?: string;
  label: string;
}

export const SCALE = new BigNumber((1e18).toString());
export const PERCENT_SCALE = new BigNumber((1e16).toString());
export const RATIO_SCALE = new BigNumber((1e8).toString());
export const EXP_SCALE = new BigNumber((1e18).toString());

// For now, support one chain ID per deployment; also a `use-wallet` restriction
export const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID as string, 10);

interface Addresses {
  MTA: string;
  vMTA: string;

  mUSD: {
    SaveWrapper: string;
  };
  mBTC?: {
    SaveWrapper: string;
  };
}

type AddressesByNetwork = Record<typeof CHAIN_ID, Addresses>;

const ADDRESSES_BY_NETWORK: AddressesByNetwork = Object.freeze({
  1: {
    MTA: '0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2',
    vMTA: '0xae8bc96da4f9a9613c323478be181fdb2aa0e1bf',
    mUSD: {
      SaveWrapper: 'TODO',
    },
  },
  3: {
    MTA: '0x273bc479e5c21caa15aa8538decbf310981d14c0',
    vMTA: '0x77f9bf80e0947408f64faa07fd150920e6b52015',
    mUSD: {
      SaveWrapper: '0xf078e3146160459ff7bb09d1d5e2d40238a7bcbe',
    },
  },
  42: {
    MTA: '0xcda64b5d3ca85800ab9f7409686985b59f2b9598',
    vMTA: 'TODO',
    mUSD: {
      SaveWrapper: 'TODO',
    },
  },
});

export const ADDRESSES: Addresses = ADDRESSES_BY_NETWORK[CHAIN_ID];

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

export const CONNECTORS: Connector[] = [
  {
    id: 'injected',
    subType: 'metamask',
    label: 'MetaMask',
  },
  {
    id: 'injected',
    subType: 'brave',
    label: 'Brave',
  },
  {
    id: 'injected',
    subType: 'meetOne',
    label: 'MEET.ONE',
  },
  { id: 'fortmatic', label: 'Fortmatic' },
  { id: 'portis', label: 'Portis' },
  { id: 'authereum', label: 'Authereum' },
  { id: 'squarelink', label: 'Squarelink' },
  { id: 'torus', label: 'Torus' },
  { id: 'walletconnect', label: 'WalletConnect' },
  { id: 'walletlink', label: 'WalletLink' },
  { id: 'frame', label: 'Frame' },
];
