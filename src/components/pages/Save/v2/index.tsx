import React, { FC } from 'react';

import { FormProvider } from '../../../forms/TransactionForm/FormProvider';
import { SaveForm } from './SaveForm';
import { SaveProvider } from './SaveProvider';

export const SaveV2: FC = () => {
  return (
    <FormProvider formId="save-v2">
      <SaveProvider>
        <SaveForm />
      </SaveProvider>
    </FormProvider>
  );
};
