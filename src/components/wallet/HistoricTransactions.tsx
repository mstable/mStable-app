import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { useHistoricTransactionsQuery } from '../../graphql/protocol';
import { transformRawData } from './transformRawData';
import { EtherscanLink } from '../core/EtherscanLink';
import { List, ListItem } from '../core/List';
import { P } from '../core/Typography';
import { HistoricTransaction } from './types';

const TxContainer = styled.div<{}>`
  display: flex;
  > * {
    margin-right: 8px;
  }
`;

const getTxDescription = (tx: HistoricTransaction): JSX.Element => {
  switch (tx.type) {
    case 'RedeemTransaction': {
      return <>TODO</>;
    }
    case 'RedeemMassetTransaction': {
      return <>TODO</>;
    }
    case 'MintMultiTransaction': {
      return <>TODO</>;
    }
    case 'MintSingleTransaction': {
      return <>TODO</>;
    }
    case 'PaidFeeTransaction': {
      return <>TODO</>;
    }
    case 'SavingsContractDepositTransaction': {
      return <>TODO</>;
    }
    case 'SavingsContractWithdrawTransaction': {
      return <>TODO</>;
    }
    case 'SwapTransaction': {
      return <></>;
    }
    default:
      return <> Unsupported transaction </>;
  }
};

const Tx: FC<{
  tx: HistoricTransaction;
}> = ({ tx }) => {
  const description = getTxDescription(tx);
  return (
    <TxContainer>
      <EtherscanLink data={tx.hash as string} type="transaction">
        {description}
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
  const transformedData = useMemo(() => transformRawData(historicTxsData), [
    historicTxsData,
  ]);

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
