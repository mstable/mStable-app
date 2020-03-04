import React, { FC } from 'react';

import { useWallet } from 'use-wallet';
import styles from './Wallet.module.css';

interface InjectedEthereum {
  enable(): Promise<string[]>;
}

export const WalletConnection: FC<{}> = () => {
  const { connected, account, activate, deactivate } = useWallet<
    InjectedEthereum
  >();
  return (
    <div className={styles.container}>
      {connected ? (
        <>
          <div className={styles.account}>{account}</div>
          <button
            type="submit"
            onClick={deactivate}
            className={styles.deactivate}
          >
            disconnect wallet
          </button>
        </>
      ) : (
        <button type="submit" onClick={() => activate('injected')}>
          connect wallet
        </button>
      )}
    </div>
  );
};
