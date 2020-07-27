import React, { FC } from 'react';
import styled from 'styled-components';

import { Button } from '../../../core/Button';
import { Color, Size } from '../../../../theme';
import { Tabs } from '../types';
import { useStakingRewardContractDispatch, useStakingRewardsContractState } from '../StakingRewardsContractProvider';
import { Stake } from './Stake';
import { Claim } from './Claim';
import { Exit } from './Exit';

const TAB_LABELS = {
  [Tabs.Stake]: 'Deposit stake',
  [Tabs.Claim]: 'Claim rewards',
  [Tabs.Exit]: 'Exit pool',
};

const TabsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 16px 0;
  border-top: 1px ${Color.blackTransparent} solid;
`;

const TabBtn = styled(Button)<{ active: boolean }>`
  text-transform: uppercase;
  color: ${({ active }) => (active ? Color.black : Color.blackTransparent)};
`;

const TabButton: FC<{ tab: Tabs }> = ({ tab }) => {
  const { activeTab } = useStakingRewardsContractState();
  const { setActiveTab } = useStakingRewardContractDispatch();
  return (
    <TabBtn
      type="button"
      size={Size.s}
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
  padding: 16px;
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
