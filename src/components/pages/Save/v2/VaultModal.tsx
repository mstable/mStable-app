import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { TabBtn, TabsContainer } from '../../../core/Tabs';
import { SaveDeposit } from './SaveDeposit';
import { SaveDepositETH } from './SaveDepositETH';
import { VaultWithdraw } from './VaultWithdraw';
import { VaultExit } from './VaultExit';

enum Tabs {
  Deposit,
  DepositETH,
  Withdraw,
  Exit,
}

const Container = styled.div`
  > :last-child {
    padding: 2rem;
  }
`;

export const VaultModal: FC = () => {
  const [tab, setTab] = useState<Tabs>(Tabs.Deposit);

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
          active={tab === Tabs.Deposit}
          onClick={() => {
            setTab(Tabs.Deposit);
          }}
        >
          Deposit stablecoins
        </TabBtn>
        <TabBtn
          active={tab === Tabs.DepositETH}
          onClick={() => {
            setTab(Tabs.DepositETH);
          }}
        >
          Deposit ETH
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
      {tab === Tabs.Withdraw ? (
        <VaultWithdraw />
      ) : tab === Tabs.Deposit ? (
        <SaveDeposit saveAndStake />
      ) : tab === Tabs.DepositETH ? (
        <SaveDepositETH saveAndStake />
      ) : (
        <VaultExit />
      )}
    </Container>
  );
};
