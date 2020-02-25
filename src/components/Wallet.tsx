import React, { FunctionComponent } from 'react';
import { useWallet, Wallet } from 'use-wallet';

interface InjectedEthereum {
  enable(): Promise<string[]>;
}

const WalletConnected: FunctionComponent<{
  wallet: Wallet<InjectedEthereum>;
}> = ({ wallet }) => (
  <div>
    <p>Connected: {wallet.account}</p>
    <button type="submit" onClick={wallet.deactivate}>
      Disconnect
    </button>
  </div>
);

const WalletDisconnected: FunctionComponent<{
  wallet: Wallet<InjectedEthereum>;
}> = ({ wallet }) => (
  <div>
    <p>Disconnected</p>
    <button type="submit" onClick={() => wallet.activate('injected')}>
      Connect
    </button>
  </div>
);

export const WalletConnection = () => {
  const wallet = useWallet<InjectedEthereum>();
  return (
    <div>
      {wallet.connected ? (
        <WalletConnected wallet={wallet} />
      ) : (
        <WalletDisconnected wallet={wallet} />
      )}
    </div>
  );
};
