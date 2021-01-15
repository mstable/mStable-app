import React, { FC } from 'react';
import styled from 'styled-components';

import { useSelectedSavingsContractState } from '../../../../context/SelectedSaveVersionProvider';
import { BalanceHeader, BalanceRow, BalanceType } from '../BalanceRow';
import { SaveMigration } from '../SaveMigration';
import { SaveForm } from './SaveForm';
import { SaveProvider } from './SaveProvider';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-radius: 0 0 2px 2px;
  text-align: left;
  border-top: 1px solid ${({ theme }) => theme.color.accent};
  padding-top: 1rem;
`;

export const Save: FC = () => {
  const savingsContractState = useSelectedSavingsContractState();
  const isCurrent = savingsContractState?.current;
  const saveV1Balance = savingsContractState?.savingsBalance?.balance;

  return isCurrent ? (
    <SaveProvider>
      <SaveForm />
    </SaveProvider>
  ) : (
    <Container>
      <BalanceHeader />
      <BalanceRow
        token={BalanceType.SavingsContractV1}
        balance={saveV1Balance}
        warning
      />
      {saveV1Balance && saveV1Balance?.simple !== 0 && <SaveMigration />}
    </Container>
  );
};
