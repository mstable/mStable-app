import React, { FC, useState } from 'react';
import styled from 'styled-components';

import {
  formatMassetName,
  useSelectedMassetName,
} from '../../../../context/SelectedMassetNameProvider';
import { ViewportWidth } from '../../../../theme';
import { SaveDeposit } from './SaveDeposit';
import { SaveRedeem } from './SaveRedeem';
import { TabCard } from '../../../core/Tabs';
import { ToggleSave } from '../ToggleSave';
import { SaveOverview } from './SaveOverview';
import { InfoBox } from '../../../core/InfoBox';

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
  flex-direction: column;

  align-items: flex-start;
  justify-content: flex-start;
  border-radius: 1rem;

  > * {
    margin-bottom: 1rem;
    width: 100%;
  }
`;

const Content = styled.div`
  @media (min-width: ${ViewportWidth.m}) {
    > div:first-child {
      flex-basis: calc(65% - 0.5rem);
    }
    > div:last-child {
      flex-basis: calc(35% - 0.5rem);
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;

  > div:last-child {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;

    @media (min-width: ${ViewportWidth.m}) {
      flex-direction: row;
      justify-content: space-between;
    }
  }
`;

export const Save: FC = () => {
  const massetName = useSelectedMassetName();
  const formattedName = formatMassetName(massetName);
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
      <SaveOverview />
      <Content>
        <TabCard tabs={tabs} active={activeTab} onClick={setActiveTab} />
        <Sidebar>
          {massetName === 'musd' && (
            <ButtonPanel>
              {massetName === 'musd' ? <ToggleSave /> : <div />}
            </ButtonPanel>
          )}
          <InfoBox>
            <p>
              <span>imAssets are interest-bearing.</span>
            </p>
            <p>
              By depositing to {`i${formattedName}`} you will begin earning
              interest on your underlying {formattedName}.
            </p>
            <p>
              Deposits from assets other than {formattedName} will first mint{' '}
              {formattedName} before being deposited.
            </p>
          </InfoBox>
        </Sidebar>
      </Content>
    </Container>
  );
};
