import React, { FC, ReactElement } from 'react';
import styled from 'styled-components';
import { InputPane } from './InputPane';
import { ConfirmPane } from './ConfirmPane';
import { TransactionsPane } from './TransactionsPane';

interface Props {
  confirm: ReactElement;
  confirmLabel: string;
  formId: string;
  input: ReactElement;
  transactionsLabel: string;
  valid: boolean;
}

const Container = styled.div`
  padding-bottom: 32px;

  > * {
    padding-bottom: 32px;
  }
`;

export const TransactionForm: FC<Props> = ({
  confirm,
  confirmLabel,
  formId,
  input,
  transactionsLabel,
  valid,
}) => (
  <Container>
    <InputPane formId={formId}>{input}</InputPane>
    <ConfirmPane formId={formId} confirmLabel={confirmLabel} valid={valid}>
      {confirm}
    </ConfirmPane>
    <TransactionsPane formId={formId} transactionsLabel={transactionsLabel} />
  </Container>
);
