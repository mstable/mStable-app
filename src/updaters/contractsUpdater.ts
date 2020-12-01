import { useEffect } from 'react';

import { useConnected } from '../context/OnboardProvider';
import { useTransactionsDispatch } from '../context/TransactionsProvider';
import { useAccount } from '../context/UserProvider';

export const ContractsUpdater = (): null => {
  const connected = useConnected();
  const account = useAccount();
  const { reset } = useTransactionsDispatch();

  /**
   * When the account changes, reset the transactions state.
   */
  useEffect(reset, [account, connected, reset]);

  return null;
};
