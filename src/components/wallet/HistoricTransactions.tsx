import React, { FC } from 'react';
import { useHistoricTransactionsQuery } from '../../graphql/protocol';

export const HistoricTransactions: FC<{ account?: string }> = ({ account }) => {
  const historicTxsQuery = useHistoricTransactionsQuery({
    variables: {
      account: account as string,
    },
    fetchPolicy: 'cache-and-network',
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const historicTxsData = historicTxsQuery.data;

  return <div>TODO</div>;
};
