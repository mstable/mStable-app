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

  const [state, { check, finalize }] = useTransactionsContext();

  useEffect((): (() => void) | void => {
    if (provider && blockNumber) {
      let stale = false;
      Object.keys(state)
        .filter(
          hash =>
            !state[hash].receipt &&
            state[hash].response.blockNumber !== blockNumber,
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
  }, [provider, state, blockNumber, check, finalize]);

  return null;
};
