import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { TabBtn, TabsContainer, Message } from '../../../core/Tabs';
import { SaveDeposit } from './SaveDeposit';
import { SaveDepositETH } from './SaveDepositETH';
import { VaultWithdraw } from './VaultWithdraw';
import { VaultExit } from './VaultExit';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { ADDRESSES } from '../../../../constants';

enum Tabs {
  Deposit = 'Deposit',
  DepositETH = 'DepositETH',
  Withdraw = 'Withdraw',
  Exit = 'Exit',
}

const { Deposit, DepositETH, Withdraw, Exit } = Tabs;

const Content = styled.div`
  padding: 2rem;
`;

const Container = styled.div``;

const tabTitles: { [key in Tabs]: string } = {
  [Deposit]: 'Deposit via Stablecoin',
  [DepositETH]: 'Deposit via ETH',
  [Withdraw]: 'Withdraw',
  [Exit]: 'Exit',
};

const tabInfo: { [key in Tabs]: string | undefined } = {
  [Deposit]:
    'mUSD will be minted from your selected stablecoin and deposited into the Vault',
  [DepositETH]:
    'ETH will be automatically traded via Uniswap V2 & Curve for mUSD. Your mUSD will then be swapped for imUSD and deposited into the Vault',
  [Withdraw]: 'Withdraw an amount of imUSD from the Vault',
  [Exit]:
    'Exiting the Vault will return your imUSD, you will no longer receive new MTA rewards but you will continue earning interest',
};

export const VaultModal: FC = () => {
  const massetState = useSelectedMassetState();
  const [tab, setTab] = useState<Tabs>(Tabs.Deposit);

  const canDepositWithWrapper =
    massetState?.savingsContracts.v2?.active && !!ADDRESSES.mUSD.SaveWrapper;

  const tabs = [
    Withdraw,
    Deposit,
    canDepositWithWrapper ? DepositETH : undefined,
    Exit,
  ];

  const tabInfoMessage = tabInfo[tab];

  return (
    <Container>
      <TabsContainer>
        {tabs.map(
          t =>
            t && (
              <TabBtn active={tab === t} onClick={() => setTab(t)} key={t}>
                {tabTitles[t]}
              </TabBtn>
            ),
        )}
      </TabsContainer>
      {tabInfoMessage && (
        <Message>
          <span>{tabInfoMessage}</span>
        </Message>
      )}
      <Content>
        {
          ({
            [Deposit]: <SaveDeposit saveAndStake />,
            [DepositETH]: <SaveDepositETH saveAndStake />,
            [Withdraw]: <VaultWithdraw />,
            [Exit]: <VaultExit />,
          } as { [key in Tabs]: JSX.Element })[tab]
        }
      </Content>
    </Container>
  );
};
