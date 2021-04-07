import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { useSelectedMassetName } from '../../../../context/SelectedMassetNameProvider';
import { ViewportWidth } from '../../../../theme';
import { SaveDeposit } from './SaveDeposit';
import { SaveRedeem } from './SaveRedeem';
import { TabSwitch } from '../../../core/Tabs';
import { ToggleSave } from '../ToggleSave';

enum Tabs {
  Deposit = 'Deposit',
  Redeem = 'Redeem',
}

const ButtonPanel = styled.div`
  display: flex;
  background: 1px solid ${({ theme }) => theme.color.accent};
  border: 1px solid ${({ theme }) => theme.color.accent};

  align-items: flex-start;
  justify-content: center;
  border-radius: 1rem;
  padding: 1rem;
`;

const Sidebar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  border-radius: 1rem;
  padding: 0 1rem;

  > * {
    margin-bottom: 1rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-basis: calc(35% - 0.5rem);
  }
`;

const Exchange = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color.accent};
  padding: 0.25rem 1rem 1rem;
  border-radius: 1rem;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (min-width: ${ViewportWidth.m}) {
    flex-basis: calc(65% - 0.5rem);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

export const Save: FC = () => {
  const massetName = useSelectedMassetName();
  const [activeTab, setActiveTab] = useState<string>(Tabs.Deposit as string);

  const tabs = {
    [Tabs.Deposit]: {
      title: `Deposit`,
      component: <SaveDeposit />,
    },
    [Tabs.Redeem]: {
      title: `Redeem`,
      component: <SaveRedeem />,
    },
  };

  return (
    <Container>
      <Exchange>
        <TabSwitch tabs={tabs} active={activeTab} onClick={setActiveTab} />
      </Exchange>
      <Sidebar>
        <ButtonPanel>
          {massetName === 'musd' ? <ToggleSave /> : <div />}
        </ButtonPanel>
      </Sidebar>
    </Container>
  );
};
