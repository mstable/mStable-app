import { useEffect, useRef } from 'react';
import { TransactionReceipt } from 'ethers/providers';
import { useTransactionsContext } from '../context/TransactionsProvider';
import { useWeb3Provider } from '../context/SignerProvider';
import { useBlockNumber } from '../context/DataProvider/BlockProvider';
import { useAccount } from '../context/UserProvider';

/**
 * Update the state of affected transactions when the provider or
 * block number changes.
 */
export const TransactionsUpdater = (): null => {
  const account = useAccount();
  const provider = useWeb3Provider();
  const blockNumber = useBlockNumber();
  const accountRef = useRef<string | null>(account);

  const [{ current }, { check, finalize, reset }] = useTransactionsContext();

  /**
   * Reset transactions state on account change
   */
  useEffect(() => {
    if (accountRef.current !== account) {
      reset();
      accountRef.current = account;
    }
  }, [account, accountRef, reset]);

  /**
   * Check pending transaction status on new blocks, and finalize if possible.
   */
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
                    finalize(hash, receipt, current[hash]);
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
    // `blockNumber` and `provider` should be the only deps; otherwise it will
    // check too often.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [blockNumber, provider],
  );

  return null;
};
