import { useEffect, useRef } from 'react';
import { useWallet } from 'use-wallet';
import { useStorageClear, useStorageRestore } from '../context/StorageProvider';

export const StorageUpdater = (): null => {
  const { account } = useWallet();
  const prevAccount = useRef(account);
  const storageRestore = useStorageRestore();
  const storageClear = useStorageClear();

  /**
   * Restore from storage once, on start.
   */
  useEffect(() => {
    storageRestore();
  }, [storageRestore]);

  /**
   * On disconnecting the account, clear the storage.
   */
  useEffect(() => {
    if (account !== prevAccount.current) {
      if (prevAccount.current && !account) {
        storageClear();
      }
      prevAccount.current = account;
    }
  }, [storageClear, account, prevAccount]);

  return null;
};
