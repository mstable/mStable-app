import { BigNumber } from 'ethers';
import { Connectors } from 'use-wallet';
import { asciiToHex as aToH } from 'web3-utils';
import { getConnectors } from './connectors';
import { Connector } from '../types';
import { ReactComponent as BraveIcon } from '../components/icons/brave.svg';
import { ReactComponent as MetaMaskIcon } from '../components/icons/metamask.svg';
import { ReactComponent as FortmaticIcon } from '../components/icons/fortmatic.svg';
import { ReactComponent as PortisIcon } from '../components/icons/portis.svg';
import { ReactComponent as SquarelinkIcon } from '../components/icons/squarelink.svg';
import { ReactComponent as WalletConnectIcon } from '../components/icons/walletconnect.svg';
import { ReactComponent as CoinbaseIcon } from '../components/icons/coinbase.svg';

export const SCALE = BigNumber.from((1e18).toString());
export const PERCENT_SCALE = BigNumber.from((1e16).toString());
export const RATIO_SCALE = BigNumber.from((1e8).toString());
export const EXP_SCALE = BigNumber.from((1e18).toString());

export const KEY_META = aToH('MTA');
export const KEY_MUSD = aToH('mUSD');
export const KEY_MGLD = aToH('mGLD');

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// For now, support one chain ID per deployment; also a `use-wallet` restriction
export const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID, 10);

export const NETWORK_NAMES = {
  1: 'Main Ethereum network',
  3: 'Ropsten (Test network)',
  1337: 'Local network',
};

export const NETWORKS = {
  1: 'mainnet',
  3: 'ropsten',
  1337: 'local',
};

export const AVAILABLE_CONNECTORS: Connectors = getConnectors(CHAIN_ID);

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
};

export const CONNECTORS: Connector[] = [
  {
    id: 'injected',
    subType: 'metamask',
    label: 'MetaMask',
    icon: MetaMaskIcon,
  },
  {
    id: 'injected',
    subType: 'brave',
    label: 'Brave',
    icon: BraveIcon,
  },
  { id: 'fortmatic', label: 'Fortmatic', icon: FortmaticIcon },
  { id: 'portis', label: 'Portis', icon: PortisIcon },
  // TODO add missing icons
  { id: 'authereum', label: 'Authereum' },
  { id: 'squarelink', label: 'Squarelink', icon: SquarelinkIcon },
  { id: 'torus', label: 'Torus' },
  { id: 'walletconnect', label: 'WalletConnect', icon: WalletConnectIcon },
  { id: 'walletlink', label: 'WalletLink', icon: CoinbaseIcon },
  { id: 'frame', label: 'Frame' },
];

export const DAPP_VERSION = process.env.REACT_APP_VERSION;
