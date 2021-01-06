import React, { FC } from 'react';
import styled from 'styled-components';

import {
  Transaction,
  useOrderedCurrentTransactions,
} from '../../context/TransactionsProvider';
import { TransactionStatus } from '../../web3/TransactionManifest';
import { EMOJIS } from '../../constants';
import { ActivitySpinner } from '../core/ActivitySpinner';
import { EtherscanLink } from '../core/EtherscanLink';
import { List, ListItem } from '../core/List';
import { P } from '../core/Typography';

const PendingTxContainer = styled.div<{ inverted?: boolean }>`
  display: flex;
  > * {
    margin-right: 8px;
  }

  a {
    color: ${({ theme, inverted }) =>
      inverted ? theme.color.white : theme.color.black};
    border-bottom: none;

    span {
      border-bottom: 1px
        ${({ theme, inverted }) =>
          inverted ? theme.color.white : theme.color.black}
        solid;
    }
  }
`;

const TxStatusContainer = styled.div`
  height: 16px;
  width: 16px;
`;

const TxStatusIndicator: FC<{ tx: Transaction }> = ({ tx }) => {
  return (
    <TxStatusContainer title={tx.status}>
      {tx.status === TransactionStatus.Sent ? (
        <ActivitySpinner pending />
      ) : tx.status === TransactionStatus.Error ? (
        <span>{EMOJIS.error}</span>
      ) : (
        <span>{EMOJIS[tx.manifest.fn as keyof typeof EMOJIS]}</span>
      )}
    </TxStatusContainer>
  );
};

const PendingTx: FC<{
  tx: Transaction;
  inverted: boolean;
}> = ({ tx, inverted }) => {
  return (
    <PendingTxContainer inverted={inverted}>
      <TxStatusIndicator tx={tx} />
      <EtherscanLink data={tx.hash as string} type="transaction">
        {tx.status === TransactionStatus.Error ? 'Error: ' : ''}
        {tx.status === TransactionStatus.Confirmed
          ? tx.manifest.purpose.past
          : tx.manifest.purpose.present}
      </EtherscanLink>
    </PendingTxContainer>
  );
};

/**
 * List of recently-sent transactions.
 */
export const Transactions: FC = () => {
  const pending = useOrderedCurrentTransactions();

  return (
    <div>
      {pending.length === 0 ? (
        <P size={2}>No transactions sent in the current session.</P>
      ) : (
        <List>
          {pending.map(tx => (
            <ListItem key={tx.hash}>
              <PendingTx tx={tx} inverted />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};
