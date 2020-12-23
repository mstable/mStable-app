import React, { FC } from 'react';

import { FormProvider } from '../../../../forms/TransactionForm/FormProvider';
import { AssetExchange } from '../AssetExchange';

const WithdrawForm: FC = () => {
  return <AssetExchange />;
};

export const Withdraw: FC = () => (
  <FormProvider formId="withdraw">
    <WithdrawForm />
  </FormProvider>
);
