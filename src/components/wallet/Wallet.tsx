import React, { FC } from 'react';
import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import { useCollapseWallet } from '../../context/UIProvider';
import { WalletConnection } from './WalletConnection';
import { RecentTransactions } from './RecentTransactions';
import { Balances } from './Balances';
import { Button } from '../core/Button';
import { Size } from '../../theme';
import { H3 } from '../core/Typography';

interface InjectedEthereum {
  enable(): Promise<string[]>;
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: ${props => props.theme.color.foreground};
  color: ${props => props.theme.color.background};
  padding: ${props => props.theme.spacing.s} ${props => props.theme.spacing.l};
`;

const Row = styled.div`
  margin-bottom: ${props => props.theme.spacing.m};
`;

const CollapseButton = styled(Button)``;

export const Wallet: FC<{}> = () => {
  const { connected } = useWallet<InjectedEthereum>();
  const collapseWallet = useCollapseWallet();
  return (
    <Container>
      {connected ? (
        <>
          <Row>
            <CollapseButton onClick={collapseWallet} size={Size.m}>
              Close
            </CollapseButton>
          </Row>
          <Row>
            <H3>Transactions</H3>
            <RecentTransactions />
          </Row>
          <Row>
            <H3>Balances</H3>
            <Balances />
          </Row>
        </>
      ) : (
        <WalletConnection collapse={collapseWallet} />
      )}
    </Container>
  );
};
