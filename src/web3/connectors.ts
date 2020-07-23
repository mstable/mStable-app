import { Connectors } from 'use-wallet';

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
  clientId: process.env.REACT_APP_SQUARELINK_CLIENT_ID,
};

const portis = { dAppId: process.env.REACT_APP_PORTIS_DAPP_ID };

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
        fortmatic: { apiKey: process.env.REACT_APP_FORTMATIC_API_KEY },
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
        fortmatic: { apiKey: process.env.REACT_APP_FORTMATIC_API_KEY },
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
