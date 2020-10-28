// eslint-disable-next-line import/no-unresolved
import { API, Subscriptions } from 'bnc-onboard/dist/src/interfaces';
import Onboard from 'bnc-onboard';
import { CHAIN_ID } from '../web3/constants';

const dappId = 'c179119c-5ba8-49bb-9989-0e7584a06028';

export const initOnboard = (subscriptions: Subscriptions): API => {
  return Onboard({
    dappId,
    hideBranding: false,
    networkId: CHAIN_ID,
    subscriptions,
    walletSelect: {
      wallets: [{ walletName: 'metamask' }],
    },
    walletCheck: [
      { checkName: 'derivationPath' },
      { checkName: 'connect' },
      { checkName: 'accounts' },
      { checkName: 'network' },
    ],
  });
};
