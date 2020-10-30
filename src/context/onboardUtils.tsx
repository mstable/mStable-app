// eslint-disable-next-line import/no-unresolved
import { API, Subscriptions } from 'bnc-onboard/dist/src/interfaces';
import Onboard from 'bnc-onboard';
import { CHAIN_ID, rpcUrl } from '../web3/constants';

const dappId = 'c179119c-5ba8-49bb-9989-0e7584a06028';

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
    apiKey: 'pk_live_A0F1CE58073CA3D9',
  },
  {
    walletName: 'portis',
    apiKey: '39018c3e-5767-4438-abe2-27d004c2261c',
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
