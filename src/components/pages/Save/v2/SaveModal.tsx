import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { TabBtn, TabsContainer } from '../../../core/Tabs';
import { SaveDeposit } from './SaveDeposit';
import { SaveRedeem } from './SaveRedeem';

enum Tabs {
  Deposit,
  Redeem,
}

const Container = styled.div`
  > :last-child {
    padding: 2rem;
  }
`;

// TODO fixed height active tab (i.e. the tab with the greatest height)
export const SaveModal: FC = () => {
  const [tab, setTab] = useState<Tabs>(Tabs.Deposit);
  const isDeposit = tab === Tabs.Deposit;

  return (
    <Container>
      <TabsContainer>
        <TabBtn
          active={tab === Tabs.Deposit}
          onClick={() => {
            setTab(Tabs.Deposit);
          }}
        >
          Deposit collateral
        </TabBtn>
        <TabBtn
          active={tab === Tabs.Redeem}
          onClick={() => {
            setTab(Tabs.Redeem);
          }}
        >
          Redeem collateral
        </TabBtn>
      </TabsContainer>
      {isDeposit ? <SaveDeposit /> : <SaveRedeem />}
    </Container>
  );
};
