import { useEffect, useRef } from 'react';
import { Provider, TransactionReceipt } from 'ethers/providers';
import { Signer } from 'ethers';

import { TransactionStatus } from '../web3/TransactionManifest';
import { useSignerOrInfuraProvider } from '../context/OnboardProvider';
import { useBlockNumber } from '../context/BlockProvider';
import { useAccount } from '../context/UserProvider';
import {
  useTransactionsDispatch,
  useTransactionsState,
} from '../context/TransactionsProvider';

/**
 * Update the state of affected transactions when the provider or
 * block number changes.
 */
export const TransactionsUpdater = (): null => {
  const account = useAccount();
  const provider = useSignerOrInfuraProvider();
  const blockNumber = useBlockNumber();
  const accountRef = useRef<string | undefined>(account);

  const state = useTransactionsState();
  const { check, finalize, reset } = useTransactionsDispatch();

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
        Object.values(state)
          .filter(
            tx =>
              tx.status === TransactionStatus.Sent &&
              tx.hash &&
              tx.blockNumber !== blockNumber,
          )
          .forEach(tx => {
            (((provider as Signer).provider || provider) as Provider)
              .getTransactionReceipt(tx.hash as string)
              .then((receipt: TransactionReceipt) => {
                if (!stale) {
                  if (!receipt) {
                    check(tx.manifest.id, blockNumber);
                  } else {
                    finalize(tx.manifest, receipt);
                  }
                }
              })
              .catch(() => {
                check(tx.manifest.id, blockNumber);
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
