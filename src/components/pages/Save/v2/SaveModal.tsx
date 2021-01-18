import React, { FC, useMemo, useState } from 'react';
import styled from 'styled-components';

import { TabBtn, TabsContainer } from '../../../core/Tabs';
import { SaveDeposit } from './SaveDeposit';
import { SaveDepositETH } from './SaveDepositETH';
import { SaveRedeem } from './SaveRedeem';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { PreDeposit } from './PreDeposit';
import { ADDRESSES } from '../../../../constants';

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

// TODO TabbedModal
export const SaveModal: FC = () => {
  const massetState = useSelectedMassetState();
  const isActive = massetState?.savingsContracts.v2?.active;

  const [tab, setTab] = useState<Tabs>(Tabs.DepositStablecoins);

  const [tabs, ActiveComponent] = useMemo(() => {
    const _tabs = [
      {
        tab: Tabs.DepositStablecoins,
        label: isActive ? 'Deposit stablecoins' : 'Pre-deposit',
        component: isActive ? SaveDeposit : PreDeposit,
        active: tab === Tabs.DepositStablecoins,
      },
      ...(isActive && ADDRESSES.mUSD.SaveWrapper
        ? [
            {
              tab: Tabs.DepositETH,
              label: 'Deposit ETH',
              component: SaveDepositETH,
              active: tab === Tabs.DepositETH,
            },
          ]
        : []),
      {
        tab: Tabs.Redeem,
        label: 'Redeem collateral',
        component: SaveRedeem,
        active: tab === Tabs.Redeem,
      },
    ];
    const activeComponent = _tabs.find(t => t.active)?.component as FC;
    return [_tabs, activeComponent];
  }, [tab, isActive]);

  return (
    <Container>
      <TabsContainer>
        {tabs.map(_tab => (
          <TabBtn
            key={_tab.tab.toString()}
            active={_tab.active}
            onClick={() => {
              setTab(_tab.tab);
            }}
          >
            {_tab.label}
          </TabBtn>
        ))}
      </TabsContainer>
      {ActiveComponent && <ActiveComponent />}
    </Container>
  );
};
