import React, { FC } from 'react';

import { FormProvider } from '../../../../forms/TransactionForm/FormProvider';
import { AssetExchange } from '../AssetExchange';

const DepositForm: FC = () => {
  return <AssetExchange />;
};

export const Deposit: FC = () => (
  <FormProvider formId="deposit">
    <DepositForm />
  </FormProvider>
);
