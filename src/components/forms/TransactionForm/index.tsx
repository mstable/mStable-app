import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';
import { InputPane } from './InputPane';
import { ConfirmPane } from './ConfirmPane';
import { TransactionsPane } from './TransactionsPane';

interface Props {
  confirm?: ReactElement;
  confirmLabel: string;
  input: ReactElement;
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
    <InputPane>{input}</InputPane>
    <ConfirmPane confirmLabel={confirmLabel} valid={valid}>
      {confirm}
    </ConfirmPane>
    <TransactionsPane transactionsLabel={transactionsLabel} />
  </Container>
);
