import React, { FC } from 'react';
import styled from 'styled-components';

import { useSelectedSavingsContractState } from '../../../../context/SelectedSaveVersionProvider';
import { useAvailableSaveApy } from '../../../../hooks/useAvailableSaveApy';

import { BalanceHeader, BalanceRow, BalanceType } from '../BalanceRow';
import { SaveMigration } from './SaveMigration';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0 0 2px 2px;
  text-align: left;

  > * {
    margin: 0.5rem 0;
  }
`;

export const Save: FC = () => {
  const apy = useAvailableSaveApy();
  const savingsContractState = useSelectedSavingsContractState();
  const saveV1Balance = savingsContractState?.savingsBalance?.balance;

  return (
    <Container>
      <BalanceHeader />
      <BalanceRow
        apy={apy?.value}
        token={BalanceType.SavingsDeprecated}
        balance={saveV1Balance}
        warning
      />
      <SaveMigration />
    </Container>
  );
};
