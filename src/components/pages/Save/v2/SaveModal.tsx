import React, { FC, useMemo, useState } from 'react';
import styled from 'styled-components';

import { TabBtn, TabsContainer } from '../../../core/Tabs';
import { SaveDeposit } from './SaveDeposit';
import { SaveDepositETH } from './SaveDepositETH';
import { SaveRedeem } from './SaveRedeem';

enum Tabs {
  DepositStablecoins,
  DepositETH,
  Redeem,
}

const Container = styled.div`
  > :last-child {
    padding: 2rem;
  }
`;

const TABS: { tab: Tabs; label: string; component: FC }[] = [
  {
    tab: Tabs.DepositStablecoins,
    label: 'Deposit stablecoins',
    component: SaveDeposit,
  },
  {
    tab: Tabs.DepositETH,
    label: 'Deposit ETH',
    component: SaveDepositETH,
  },
  {
    tab: Tabs.Redeem,
    label: 'Redeem collateral',
    component: SaveRedeem,
  },
];

// TODO TabbedModal
export const SaveModal: FC = () => {
  const [tab, setTab] = useState<Tabs>(Tabs.DepositStablecoins);
  const activeTab = useMemo(() => TABS.find(_tab => _tab.tab === tab), [tab]);

  return (
    <Container>
      <TabsContainer>
        {TABS.map(_tab => (
          <TabBtn
            key={_tab.tab.toString()}
            active={_tab.tab === tab}
            onClick={() => {
              setTab(_tab.tab);
            }}
          >
            {_tab.label}
          </TabBtn>
        ))}
      </TabsContainer>
      {activeTab?.component && <activeTab.component />}
    </Container>
  );
};
