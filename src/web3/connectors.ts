import { Connectors } from 'use-wallet';

const injected = {};

// const walletlink = {
//   url: 'https://mstable.org',
//   // TODO a better logo URL
//   appLogoUrl:
//     'https://pbs.twimg.com/profile_images/1226087357461487616/Iq1CHt3I_400x400.jpg',
//   appName: 'mStable',
// };

const squarelink = {
  options: {},
  clientId: process.env.REACT_APP_SQUARELINK_CLIENT_ID,
};

const portis = { dAppId: process.env.REACT_APP_PORTIS_DAPP_ID };

// These connectors are currently not fully supported by `use-wallet`
// const torus = {
//   initOptions: {
//     showTorusButton: true,
//   },
// };
// const walletconnect = {};

export const getConnectors = (chainId: number): Connectors => {
  switch (chainId) {
    case 1:
      return {
        injected,
        portis,
        squarelink,
        fortmatic: { apiKey: process.env.REACT_APP_FORTMATIC_API_KEY_MAINNET },
        // walletlink,
        // walletconnect,
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
