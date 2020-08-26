import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { InputPane } from './InputPane';
import { ConfirmPane } from './ConfirmPane';
import { TransactionsPane } from './TransactionsPane';

interface Props {
  className?: string;
  compact?: boolean;
  confirm?: ReactNode;
  confirmLabel: JSX.Element | string;
  input?: ReactNode;
  transactionsLabel?: string;
  valid: boolean;
}

const Container = styled.div<{ compact?: boolean }>`
  padding-bottom: ${({ compact }) => (compact ? 4 : 16)}px;

  > * {
    padding-bottom: ${({ compact }) => (compact ? 4 : 16)}px;
  }
`;

export const TransactionForm: FC<Props> = ({
  className,
  compact,
  confirm,
  confirmLabel,
  input,
  transactionsLabel = 'Transactions',
  valid,
}) => (
  <Container className={className} compact={compact}>
    {input ? <InputPane>{input}</InputPane> : null}
    <ConfirmPane compact={compact} confirmLabel={confirmLabel} valid={valid}>
      {valid ? confirm : null}
    </ConfirmPane>
    {compact ? null : (
      <TransactionsPane transactionsLabel={transactionsLabel} />
    )}
  </Container>
);
