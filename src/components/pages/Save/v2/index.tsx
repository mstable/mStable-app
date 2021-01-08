import React, { FC } from 'react';
import styled from 'styled-components';

import { useSaveState, useSaveDispatch, SaveProvider } from './SaveProvider';
import { TabsContainer, TabBtn } from '../../../core/Tabs';
import { Deposit } from './Deposit';
import { Withdraw } from './Withdraw';
import { SaveMode } from './types';
import { Boost } from './Boost';

const MODE_TYPES = {
  [SaveMode.Deposit]: {
    label: 'Deposit',
  },
  [SaveMode.Withdraw]: {
    label: 'Withdraw',
  },
};

const Container = styled.div`
  border-radius: 0 0 2px 2px;
  text-align: left;
`;

const TabButton: FC<{ tabMode: SaveMode }> = ({ tabMode }) => {
  const { mode } = useSaveState();
  const { setModeType } = useSaveDispatch();
  return (
    <TabBtn
      type="button"
      onClick={() => setModeType(tabMode)}
      active={mode === tabMode}
    >
      {MODE_TYPES[tabMode].label}
    </TabBtn>
  );
};

const SaveForm: FC = () => {
  const { mode } = useSaveState();

  // TODO: - Make boost conditionally render if use has staked balance
  const userHasStaked = false;

  return (
    <Container>
      {userHasStaked && <Boost />}
      <TabsContainer>
        <TabButton tabMode={SaveMode.Deposit} />
        <TabButton tabMode={SaveMode.Withdraw} />
      </TabsContainer>
      <div>{mode === SaveMode.Deposit ? <Deposit /> : <Withdraw />}</div>
    </Container>
  );
};

export const Save: FC = () => {
  return (
    <SaveProvider>
      <SaveForm />
    </SaveProvider>
  );
};
