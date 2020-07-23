import { Connectors } from 'use-wallet';

const injected = {};

if (!process.env.REACT_APP_RPC_URL) {
  throw new Error('`REACT_APP_RPC_URL` must be set');
}

const walletlink = {
  url: process.env.REACT_APP_RPC_URL,
  appLogoUrl: 'https://app.mstable.org/icons/apple-icon-180x180.png',
  appName: 'mStable',
};

const squarelink = {
  options: {},
  clientId: process.env.REACT_APP_SQUARELINK_CLIENT_ID,
};

const portis = { dAppId: process.env.REACT_APP_PORTIS_DAPP_ID };

const walletconnect = {
  rpcUrl: process.env.REACT_APP_RPC_URL,
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
        fortmatic: { apiKey: process.env.REACT_APP_FORTMATIC_API_KEY_MAINNET },
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
        fortmatic: { apiKey: process.env.REACT_APP_FORTMATIC_API_KEY_ROPSTEN },
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
