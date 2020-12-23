import React, { FC } from 'react';
import styled from 'styled-components';

import { TabsContainer, TabBtn } from '../../../core/Tabs';
import { SaveProvider, useSaveState, useSaveDispatch } from './SaveProvider';
import { SaveMode } from './types';
import { Deposit } from './Deposit';
import { Withdraw } from './Withdraw';

const MODE_TYPES = {
  [SaveMode.Deposit]: {
    label: 'Deposit',
  },
  [SaveMode.Withdraw]: {
    label: 'Withdraw',
  },
};

const TabButton: FC<{ tabMode: SaveMode }> = ({ tabMode }) => {
  const { mode } = useSaveState();
  const { setModeType } = useSaveDispatch();
  return (
    <TabBtn
      type="button"
      onClick={() => {
        setModeType(tabMode);
      }}
      active={mode === tabMode}
    >
      {MODE_TYPES[tabMode].label}
    </TabBtn>
  );
};

const Container = styled.div`
  border-radius: 0 0 2px 2px;
  padding: 16px 0 32px 0;
  text-align: left;
`;

const SaveContent: FC = () => {
  const { mode } = useSaveState();
  return (
    <Container>
      <TabsContainer>
        <TabButton tabMode={SaveMode.Deposit} />
        <TabButton tabMode={SaveMode.Withdraw} />
      </TabsContainer>
      {mode === SaveMode.Deposit ? <Deposit /> : <Withdraw />}
    </Container>
  );
};

export const Save: FC = () => {
  return (
    <SaveProvider>
      <SaveContent />
    </SaveProvider>
  );
};
