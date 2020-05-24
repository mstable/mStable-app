import React, { FC } from 'react';
import { Transactions } from '../../wallet/Transactions';
import { H3 } from '../../core/Typography';

interface Props {
  formId: string;
  transactionsLabel: string;
}

export const TransactionsPane: FC<Props> = ({ formId, transactionsLabel }) => (
  <div>
    <H3 borderTop>{transactionsLabel}</H3>
    <Transactions formId={formId} />
  </div>
);
