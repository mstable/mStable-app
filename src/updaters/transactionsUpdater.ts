import { useEffect } from 'react';
import { useWallet } from 'use-wallet';
import { TransactionReceipt } from 'ethers/providers';
import { useTransactionsContext } from '../context/TransactionsProvider';
import { useWeb3Provider } from '../context/SignerProvider';

/**
 * Update the state of affected transactions when the provider or
 * block number changes.
 */
export const TransactionsUpdater = (): null => {
  const provider = useWeb3Provider();
  const { getBlockNumber } = useWallet();
  const blockNumber = getBlockNumber();

  const [{ current }, { check, finalize }] = useTransactionsContext();

  useEffect(
    (): (() => void) | void => {
      if (provider && blockNumber) {
        let stale = false;
        Object.keys(current)
          .filter(
            hash =>
              current[hash].status === null &&
              current[hash].response.blockNumber !== blockNumber,
          )
          .forEach(hash => {
            provider
              .getTransactionReceipt(hash)
              .then((receipt: TransactionReceipt) => {
                if (!stale) {
                  if (!receipt) {
                    check(hash, blockNumber);
                  } else {
                    finalize(hash, receipt);
                  }
                }
              })
              .catch(() => {
                check(hash, blockNumber);
              });
          });

        return () => {
          stale = true;
        };
      }
      return undefined;
    },
    // blockNumber should be the *only* dep; otherwise it will check too often.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [blockNumber],
  );

  return null;
};
