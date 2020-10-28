// eslint-disable-next-line import/no-unresolved
import { API, Subscriptions } from 'bnc-onboard/dist/src/interfaces';
import Onboard from 'bnc-onboard';
import { CHAIN_ID } from '../web3/constants';

const dappId = 'c179119c-5ba8-49bb-9989-0e7584a06028';
export const RPC_URL = `${process.env.REACT_APP_RPC_URL}${process.env.REACT_APP_RPC_API_KEY}`;

export const WALLETS = [
  { walletName: 'coinbase', preferred: true },
  { walletName: 'trust', preferred: true, rpcUrl: RPC_URL },
  { walletName: 'metamask', preferred: true },
  { walletName: 'dapper', preferred: true },
  {
    walletName: 'trezor',
    appUrl: window.location.hostname,
    email: 'info@mstable.org',
    rpcUrl: RPC_URL,
  },
  {
    walletName: 'ledger',
    rpcUrl: RPC_URL,
  },
  {
    walletName: 'lattice',
    rpcUrl: RPC_URL,
    appName: 'mStable',
  },
  {
    walletName: 'fortmatic',
    apiKey: process.env.REACT_APP_FORTMATIC_API_KEY,
    preferred: true,
  },
  {
    walletName: 'portis',
    apiKey: process.env.REACT_APP_PORTIS_DAPP_ID,
    preferred: true,
  },
  {
    walletName: 'squarelink',
    apiKey: process.env.REACT_APP_SQUARELINK_CLIENT_ID,
  },
  { walletName: 'authereum' },
  {
    walletName: 'walletConnect',
    infuraKey: process.env.REACT_APP_RPC_API_KEY,
  },
  { walletName: 'opera' },
  { walletName: 'operaTouch' },
  { walletName: 'torus' },
  { walletName: 'status' },
  { walletName: 'unilogin' },
  { walletName: 'walletLink', rpcUrl: RPC_URL, appName: 'mStable' },
  { walletName: 'imToken', rpcUrl: RPC_URL },
  { walletName: 'meetone' },
  { walletName: 'mykey', rpcUrl: RPC_URL },
  { walletName: 'huobiwallet', rpcUrl: RPC_URL },
  { walletName: 'hyperpay' },
  { walletName: 'wallet.io', rpcUrl: RPC_URL },
];

export const initOnboard = (subscriptions: Subscriptions): API => {
  return Onboard({
    dappId,
    hideBranding: false,
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
