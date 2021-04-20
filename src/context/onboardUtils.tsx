// eslint-disable-next-line import/no-unresolved
import { API, Subscriptions } from 'bnc-onboard/dist/src/interfaces';
import Onboard from '@gnosis.pm/safe-apps-onboard';
import { CHAIN_ID, rpcUrl } from '../constants';

export const WALLETS = [
  { walletName: 'coinbase', preferred: true },
  { walletName: 'trust', preferred: true, rpcUrl },
  { walletName: 'metamask', preferred: true },
  { walletName: 'dapper' },
  {
    walletName: 'trezor',
    appUrl: window.location.hostname,
    email: 'info@mstable.org',
    rpcUrl,
    preferred: true,
  },
  {
    walletName: 'ledger',
    rpcUrl,
    preferred: true,
  },
  {
    walletName: 'lattice',
    rpcUrl,
    appName: 'mStable',
  },
  {
    walletName: 'fortmatic',
    apiKey: process.env.REACT_APP_FORTMATIC_API_KEY,
  },
  {
    walletName: 'portis',
    apiKey: process.env.REACT_APP_PORTIS_DAPP_ID,
  },
  {
    walletName: 'squarelink',
    apiKey: process.env.REACT_APP_SQUARELINK_CLIENT_ID,
  },
  { walletName: 'authereum' },
  {
    walletName: 'walletConnect',
    infuraKey: process.env.REACT_APP_RPC_API_KEY,
    preferred: true,
  },
  { walletName: 'opera' },
  { walletName: 'operaTouch' },
  { walletName: 'torus' },
  { walletName: 'status' },
  { walletName: 'unilogin' },
  { walletName: 'walletLink', rpcUrl, appName: 'mStable' },
  { walletName: 'imToken', rpcUrl },
  { walletName: 'meetone' },
  { walletName: 'mykey', rpcUrl },
  { walletName: 'huobiwallet', rpcUrl },
  { walletName: 'hyperpay' },
  { walletName: 'wallet.io', rpcUrl },
];

export const initOnboard = (subscriptions: Subscriptions): API => {
  return Onboard({
    hideBranding: true,
    networkId: CHAIN_ID,
    subscriptions,
    walletSelect: {
      wallets: WALLETS,
    },
    walletCheck: [
      { checkName: 'derivationPath' },
      { checkName: 'connect' },
      { checkName: 'accounts' },
      { checkName: 'network' },
    ],
  });
};
