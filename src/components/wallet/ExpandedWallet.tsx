import React, { FC } from 'react';
import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import { useCollapseWallet } from '../../context/UIProvider';
import { WalletConnection } from './WalletConnection';
import { RecentTransactions } from "./RecentTransactions";
import { Balances } from "./Balances";

interface InjectedEthereum {
  enable(): Promise<string[]>;
}

const Container = styled.div`
  height: 100%;
  background: ${props => props.theme.color.foreground};
  color: ${props => props.theme.color.background};
  padding: ${props => props.theme.spacing.s} ${props => props.theme.spacing.l};
`;

const CollapseButton = styled.button``;

export const ExpandedWallet: FC<{}> = () => {
  const { connected } = useWallet<InjectedEthereum>();
  const collapseWallet = useCollapseWallet();
  return (
    <Container>
      {connected ? (
        <>
          <CollapseButton onClick={collapseWallet}>x</CollapseButton>
          <RecentTransactions />
          <Balances />
        </>
      ) : (
        <WalletConnection collapse={collapseWallet} />
      )}
    </Container>
  );
};
