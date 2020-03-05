import React, { FC } from 'react';
import { useWallet } from 'use-wallet';

import { useUIContext } from '../context/UIProvider';
import styles from './Wallet.module.css';
import { useTruncatedAddress } from '../web3/hooks';
import { useHasPendingTransactions } from '../context/TransactionsProvider';

interface InjectedEthereum {
  enable(): Promise<string[]>;
}

export const WalletConnection: FC<{}> = () => {
  const { connected, account } = useWallet<InjectedEthereum>();
  const truncatedAddress = useTruncatedAddress(account);
  const [, { showWalletModal }] = useUIContext();
  const hasPendingTransactions = useHasPendingTransactions();
  return (
    <>
      <div className={styles.container}>
        {connected ? (
          <div className={styles.connected}>
            {hasPendingTransactions ? (
              <div className={styles.pendingIndicator} />
            ) : null}
            <button
              type="submit"
              onClick={showWalletModal}
              className={styles.account}
            >
              {truncatedAddress}
            </button>
          </div>
        ) : (
          <button type="submit" onClick={showWalletModal}>
            connect wallet
          </button>
        )}
      </div>
    </>
  );
};
