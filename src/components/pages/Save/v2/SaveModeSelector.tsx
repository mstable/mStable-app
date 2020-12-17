import React, { FC } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { SaveMode } from './types';
import { useSaveState, useSaveDispatch } from './SaveProvider';
import { TabsContainer, TabBtn } from '../../../core/Tabs';

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
  padding: 16px 0 32px 0;
  text-align: left;
`;

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

export const SaveModeSelector: FC = () => {
  const { mode } = useSaveState();
  return (
    <Container>
      <TabsContainer>
        <TabButton tabMode={SaveMode.Deposit} />
        <TabButton tabMode={SaveMode.Withdraw} />
      </TabsContainer>
      <div>
        {mode === SaveMode.Deposit ? (
          <p>Deposit</p>
        ) : mode === SaveMode.Withdraw ? (
          <p>Withdraw</p>
        ) : (
          <Skeleton />
        )}
      </div>
    </Container>
  );
};
