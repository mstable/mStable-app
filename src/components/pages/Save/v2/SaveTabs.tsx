import React, { FC, useState } from 'react';
import styled from 'styled-components';

import { TabBtn, TabsContainer } from '../../../core/Tabs';
import { InfoMessage } from '../../../core/InfoMessage';
import { SaveDeposit } from './SaveDeposit';
import { SaveRedeem } from './SaveRedeem';
import { SaveDepositETH } from './SaveDepositETH';
import { VaultWithdraw } from './VaultWithdraw';
import { SaveMint } from './SaveMint';
import { VaultExit } from './VaultExit';

export enum TabType {
  Masset,
  Save,
  Vault,
}

enum Action {
  Mint,
  Deposit,
  DepositETH,
  Redeem,
  Withdraw,
  Exit,
}

interface Props {
  type: TabType;
  defaultIndex?: number;
}

const { Masset, Save, Vault } = TabType;
const { Mint, Deposit, DepositETH, Redeem, Withdraw, Exit } = Action;

const modalActions: { [key in TabType]: Action[] } = {
  [Masset]: [Mint],
  [Save]: [Deposit, DepositETH, Redeem],
  [Vault]: [Withdraw, Deposit, DepositETH, Exit],
};

const tabTitles: { [key in Action]: string } = {
  [Mint]: 'Mint',
  [Deposit]: 'Deposit via Stablecoin',
  [DepositETH]: 'Deposit via ETH',
  [Redeem]: 'Redeem mUSD',
  [Withdraw]: 'Withdraw',
  [Exit]: 'Exit',
};

const tabInfo = (vault = false): { [key in Action]: string | undefined } => ({
  [Mint]:
    'mUSD will be deposited and you will receive imUSD (interest-bearing mUSD). Deposit to the Vault to earn bonus MTA rewards.',
  [Deposit]: vault
    ? 'imUSD will be minted from your selected stablecoin & deposited into the Vault'
    : 'imUSD will be minted from your selected stablecoin',
  [DepositETH]: vault
    ? 'ETH will be traded via Uniswap V2 & Curve for mUSD. Your mUSD will then mint imUSD & be deposited into the Vault'
    : 'ETH will be traded via Uniswap V2 & Curve for mUSD. Your mUSD will then mint imUSD',
  [Redeem]: 'Redeem an amount of imUSD for mUSD',
  [Withdraw]: 'Withdraws an amount of imUSD from the Vault',
  [Exit]:
    'Exiting the Vault will return your imUSD, you will no longer receive new MTA rewards but you will continue earning interest',
});

const tabMoreInfo: { [key in Action]: string | undefined } = {
  [Mint]: undefined,
  [Deposit]: undefined,
  [DepositETH]: undefined,
  [Redeem]: undefined,
  [Withdraw]: 'This transaction will claim any available MTA rewards.',
  [Exit]: 'This transaction will claim any available MTA rewards.',
};

const tabContent = (vault = false): { [key in Action]: JSX.Element } => ({
  [Mint]: <SaveMint />,
  [Deposit]: vault ? <SaveDeposit saveAndStake /> : <SaveDeposit />,
  [DepositETH]: vault ? <SaveDepositETH saveAndStake /> : <SaveDepositETH />,
  [Redeem]: <SaveRedeem />,
  [Withdraw]: <VaultWithdraw />,
  [Exit]: <VaultExit />,
});

const MoreInfo = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.bodyAccent};
  text-align: center;
  align-self: center;
  margin-top: 2rem;
`;

const Message = styled(InfoMessage)`
  margin: 2rem 0;
`;

const Content = styled.div`
  margin: 2rem 4rem 2rem 4rem;
`;

const Container = styled.div``;

export const SaveTabs: FC<Props> = ({ type, defaultIndex }) => {
  const actions = modalActions[type];
  const [tab, setTab] = useState<Action>(actions[defaultIndex ?? 0]);

  const isMasset = type === Masset;
  const saveTabInfo = tabInfo(type === Vault)[tab];
  const saveTabMoreInfo = tabMoreInfo[tab];
  const saveTabContent = tabContent(type === Vault)[tab];

  return (
    <Container>
      {!isMasset && (
        <TabsContainer>
          {actions.map(t => (
            <TabBtn active={tab === t} onClick={() => setTab(t)} key={t}>
              {tabTitles[t]}
            </TabBtn>
          ))}
        </TabsContainer>
      )}
      <Content>
        {saveTabInfo && (
          <Message>
            <span>{saveTabInfo}</span>
          </Message>
        )}
        <div>{saveTabContent}</div>
        {saveTabMoreInfo && <MoreInfo>{saveTabMoreInfo}</MoreInfo>}
      </Content>
    </Container>
  );
};
