import React, { useMemo, FC } from 'react';
import { useAllTransactions } from '../context/TransactionsProvider';

/**
 * List of all sent transactions.
 *
 * TODO: ensure transactions are sorted by timestamp
 * TODO: correct design
 */
export const Transactions: FC<{}> = () => {
  const state = useAllTransactions();
  const keys = useMemo(() => Object.keys(state), [state]);

  return (
    <>
      {keys.map(hash => {
        const tx = state[hash];
        return (
          <div key={hash}>
            <div>To: {tx.response.to}</div>
            <div>Confirmations: {tx.receipt?.confirmations || 0}</div>
            <div>Function: {tx.fnName}</div>
          </div>
        );
      })}
    </>
  );
};
