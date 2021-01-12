import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { TabBtn, TabsContainer } from '../../../core/Tabs';
import { VaultWithdraw } from './VaultWithdraw';
import { VaultExit } from './VaultExit';

enum Tabs {
  Withdraw,
  Exit,
}

const Container = styled.div`
  > :last-child {
    padding: 2rem;
  }
`;

export const VaultModal: FC = () => {
  const [tab, setTab] = useState<Tabs>(Tabs.Withdraw);

  return (
    <Container>
      <TabsContainer>
        <TabBtn
          active={tab === Tabs.Withdraw}
          onClick={() => {
            setTab(Tabs.Withdraw);
          }}
        >
          Withdraw
        </TabBtn>
        <TabBtn
          active={tab === Tabs.Exit}
          onClick={() => {
            setTab(Tabs.Exit);
          }}
        >
          Exit
        </TabBtn>
      </TabsContainer>
      {tab === Tabs.Withdraw ? <VaultWithdraw /> : <VaultExit />}
    </Container>
  );
};
