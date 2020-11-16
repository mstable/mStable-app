import React, { FC, useMemo } from 'react';
import { useHistoricTransactionsQuery } from '../../graphql/protocol';
import { transformRawData } from './transformRawData';

export const HistoricTransactions: FC<{ account?: string }> = ({ account }) => {
  const historicTxsQuery = useHistoricTransactionsQuery({
    variables: {
      account: account as string,
    },
  });
  const historicTxsData = historicTxsQuery.data;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const transformedData = useMemo(() => transformRawData(historicTxsData), [
    historicTxsData,
  ]);

  return <div>TODO</div>;
};
