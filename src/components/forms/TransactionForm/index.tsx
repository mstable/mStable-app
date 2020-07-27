import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { InputPane } from './InputPane';
import { ConfirmPane } from './ConfirmPane';
import { TransactionsPane } from './TransactionsPane';

interface Props {
  confirm?: ReactNode;
  confirmLabel: string;
  input?: ReactNode;
  transactionsLabel: string;
  valid: boolean;
}

const Container = styled.div`
  padding-bottom: 16px;

  > * {
    padding-bottom: 16px;
  }
`;

export const TransactionForm: FC<Props> = ({
  confirm,
  confirmLabel,
  input,
  transactionsLabel,
  valid,
}) => (
  <Container>
    {input ? <InputPane>{input}</InputPane> : null}
    <ConfirmPane confirmLabel={confirmLabel} valid={valid}>
      {valid ? confirm : null}
    </ConfirmPane>
    <TransactionsPane transactionsLabel={transactionsLabel} />
  </Container>
);
