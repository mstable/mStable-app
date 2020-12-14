import React, { FC } from 'react';

import { useSelectedSavingsContractState } from '../../../../context/SelectedSaveVersionProvider';
import { FormProvider } from '../../../forms/TransactionForm/FormProvider';
import { SaveForm } from './SaveForm';
import { SaveProvider } from './SaveProvider';

export const SaveV1: FC = () => {
  const savingsContractState = useSelectedSavingsContractState();
  const isCurrent = savingsContractState?.current;
  return isCurrent ? (
    <FormProvider formId="save-v1">
      <SaveProvider>
        <SaveForm />
      </SaveProvider>
    </FormProvider>
  ) : null;
};
