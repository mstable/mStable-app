import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { useHistoricTransactionsQuery } from '../../graphql/protocol';
import { transformRawData } from './transformRawData';
import { EtherscanLink } from '../core/EtherscanLink';
import { List, ListItem } from '../core/List';
import { P } from '../core/Typography';
import { HistoricTransaction } from './types';
import { useDataState } from '../../context/DataProvider/DataProvider';

const TxContainer = styled.div<{}>`
  display: flex;
  > * {
    margin-right: 8px;
  }
`;

const Tx: FC<{
  tx: HistoricTransaction;
}> = ({ tx }) => {
  return (
    <TxContainer>
      <EtherscanLink data={tx.hash as string} type="transaction">
        {tx.formattedDate}: {tx.description}
      </EtherscanLink>
    </TxContainer>
  );
};

export const HistoricTransactions: FC<{ account?: string }> = ({ account }) => {
  const historicTxsQuery = useHistoricTransactionsQuery({
    variables: {
      account: account as string,
    },
  });
  const historicTxsData = historicTxsQuery.data;
  const dataState = useDataState();
  const transformedData = useMemo(
    () => transformRawData(historicTxsData, dataState),
    [historicTxsData, dataState],
  );
  return (
    <div>
      {transformedData.length === 0 ? (
        <P size={2}>No transactions sent in the current session.</P>
      ) : (
        <List>
          {transformedData.map(tx => (
            <ListItem key={tx.hash}>
              <Tx tx={tx} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};
