import React, { FC } from 'react';
import styled from 'styled-components';

import { useSelectedSavingsContractState } from '../../../../context/SelectedSaveVersionProvider';
import { useAvailableSaveApy } from '../../../../hooks/useAvailableSaveApy';

import { BalanceHeader, BalanceRow, BalanceType } from '../BalanceRow';
import { SaveMigration } from './SaveMigration';
import { SaveForm } from './SaveForm';
import { SaveProvider } from './SaveProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';

const SaveV1Separator = styled.div`
  margin-top: 5rem;
  border-top: 1px #eee solid;
  padding-top: 1rem;
  font-size: 1.5rem;
`;

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
  const apy = useAvailableSaveApy();
  const massetState = useSelectedMassetState();
  const saveV2Exists = !!massetState?.savingsContracts.v2;
  const savingsContractState = useSelectedSavingsContractState();
  const isCurrent = savingsContractState?.current;
  const saveV1Balance = savingsContractState?.savingsBalance?.balance;

  return (
    <Container>
      <BalanceHeader />
      <BalanceRow
        apy={apy?.value}
        token={BalanceType.SavingsContractV1}
        balance={saveV1Balance}
        warning
      />
      <SaveMigration />
      {isCurrent && (
        <SaveProvider>
          {saveV2Exists && <SaveV1Separator>Save v1</SaveV1Separator>}
          <SaveForm />
        </SaveProvider>
      )}
    </Container>
  );
};
