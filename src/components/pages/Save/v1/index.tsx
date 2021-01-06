import React, { FC } from 'react';

import { useSelectedSavingsContractState } from '../../../../context/SelectedSaveVersionProvider';
import { SaveForm } from './SaveForm';
import { SaveProvider } from './SaveProvider';

export const Save: FC = () => {
  const savingsContractState = useSelectedSavingsContractState();
  const isCurrent = savingsContractState?.current;
  return isCurrent ? (
    <SaveProvider>
      <SaveForm />
    </SaveProvider>
  ) : null;
};
