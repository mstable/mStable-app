import { Connectors } from 'use-wallet';

import { ReactComponent as BraveIcon } from '../components/icons/wallets/brave.svg';
import { ReactComponent as MetaMaskIcon } from '../components/icons/wallets/metamask.svg';
import { ReactComponent as FortmaticIcon } from '../components/icons/wallets/fortmatic.svg';
import { ReactComponent as PortisIcon } from '../components/icons/wallets/portis.svg';
import { ReactComponent as SquarelinkIcon } from '../components/icons/wallets/squarelink.svg';
import { ReactComponent as WalletConnectIcon } from '../components/icons/wallets/walletconnect.svg';
import { ReactComponent as CoinbaseIcon } from '../components/icons/wallets/coinbase.svg';
import { Connector } from '../types';
import { CHAIN_ID } from './constants';

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

const injected = {};

if (!process.env.REACT_APP_RPC_URL) {
  throw new Error('`REACT_APP_RPC_URL` must be set');
}

if (!process.env.REACT_APP_RPC_API_KEY) {
  throw new Error('`REACT_APP_RPC_API_KEY` must be set');
}

const RPC_URL = `${process.env.REACT_APP_RPC_URL}${process.env.REACT_APP_RPC_API_KEY}`;

const walletlink = {
  url: RPC_URL,
  appLogoUrl: 'https://app.mstable.org/icons/apple-icon-180x180.png',
  appName: 'mStable',
};

const squarelink = {
  options: {},
  clientId: process.env.REACT_APP_SQUARELINK_CLIENT_ID as string,
};

const portis = { dAppId: process.env.REACT_APP_PORTIS_DAPP_ID as string };

const walletconnect = {
  rpcUrl: RPC_URL,
};

// These connectors are currently not fully supported by `use-wallet`
// const torus = {
//   initOptions: {
//     showTorusButton: true,
//   },
// };

export const getConnectors = (chainId: number): Connectors => {
  switch (chainId) {
    case 1:
      return {
        injected,
        portis,
        squarelink,
        fortmatic: {
          apiKey: process.env.REACT_APP_FORTMATIC_API_KEY as string,
        },
        walletlink,
        walletconnect,
        // torus: {
        //   ...torus,
        //   chainId,
        // },
      };
    case 3:
      return {
        injected,
        portis,
        squarelink,
        fortmatic: {
          apiKey: process.env.REACT_APP_FORTMATIC_API_KEY as string,
        },
        walletconnect,
        // walletlink, // In theory it supports Ropsten; in reality the tx gas is broken :(
        // torus: {
        //   ...torus,
        //   chainId,
        // },
      };
    case 1337:
      return {
        injected,
      };
    default:
      return {};
  }
};

export const AVAILABLE_CONNECTORS: Connectors = getConnectors(CHAIN_ID);
