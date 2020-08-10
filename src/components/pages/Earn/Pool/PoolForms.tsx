import React, { FC } from 'react';
import styled from 'styled-components';

import { Button } from '../../../core/Button';
import { Color, FontSize } from '../../../../theme';
import { Tabs } from '../types';
import {
  useStakingRewardContractDispatch,
  useStakingRewardsContractState,
} from '../StakingRewardsContractProvider';
import { Stake } from './Stake';
import { Claim } from './Claim';
import { Exit } from './Exit';

const TAB_LABELS = {
  [Tabs.Stake]: 'Deposit stake',
  [Tabs.Claim]: 'Claim rewards',
  [Tabs.Exit]: 'Exit pool',
};

const TabsContainer = styled.div`
  padding: 16px 0;
  display: flex;
  justify-content: space-evenly;
`;

const TabBtn = styled(Button)<{ active: boolean }>`
  background: transparent;
  border-radius: 0;
  border: 0;
  border-bottom: 4px solid;
  border-color: ${({ active }) => (active ? Color.blue : 'transparent')};
  color: ${({ active }) => (active ? Color.blue : Color.black)};
  font-size: ${FontSize.m};
  text-transform: uppercase;
  transition: all 0.3s ease;
  width: 100%;
`;

const TabButton: FC<{ tab: Tabs }> = ({ tab }) => {
  const { activeTab } = useStakingRewardsContractState();
  const { setActiveTab } = useStakingRewardContractDispatch();
  return (
    <TabBtn
      type="button"
      onClick={() => {
        setActiveTab(tab);
      }}
      active={activeTab === tab}
    >
      {TAB_LABELS[tab]}
    </TabBtn>
  );
};


const Container = styled.div`
  background: ${Color.offWhite};
  border-radius: 0 0 2px 2px;
  padding: 16px 0 32px 0;
  text-align: left;
`;

export const PoolForms: FC<{ address: string }> = () => {
  const { activeTab } = useStakingRewardsContractState();
  return (
    <Container>
      <TabsContainer>
        <TabButton tab={Tabs.Stake} />
        <TabButton tab={Tabs.Claim} />
        <TabButton tab={Tabs.Exit} />
      </TabsContainer>
      <div>
        {activeTab === Tabs.Stake ? (
          <Stake />
        ) : activeTab === Tabs.Claim ? (
          <Claim />
        ) : (
          <Exit />
        )}
      </div>
    </Container>
  );
};
