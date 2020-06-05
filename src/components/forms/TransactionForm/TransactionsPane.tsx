import React, { FC } from 'react';
import { Transactions } from '../../wallet/Transactions';
import { H3 } from '../../core/Typography';
import { useFormId } from './FormProvider';

interface Props {
  transactionsLabel: string;
}

export const TransactionsPane: FC<Props> = ({ transactionsLabel }) => {
  const formId = useFormId();
  return (
    <div>
      <H3 borderTop>{transactionsLabel}</H3>
      <Transactions formId={formId} />
    </div>
  );
};
