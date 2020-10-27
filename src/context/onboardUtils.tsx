// eslint-disable-next-line import/no-unresolved
import { API, Subscriptions } from 'bnc-onboard/dist/src/interfaces';
import Onboard from 'bnc-onboard';

const networkId = 3;
const dappId = 'c179119c-5ba8-49bb-9989-0e7584a06028';

export const initOnboard = (subscriptions: Subscriptions): API => {
  const onboard = Onboard({
    dappId,
    hideBranding: false,
    networkId,
    subscriptions,
    walletSelect: {
      wallets: [{ walletName: 'metamask' }],
    },
    walletCheck: [{ checkName: 'connect' }, { checkName: 'network' }],
  });
  return onboard;
};
