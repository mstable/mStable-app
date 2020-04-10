import React, { FC, useMemo } from 'react';
import { Connectors, useWallet } from 'use-wallet';
import styled from 'styled-components';
import {
  useAppDispatch,
  useIsWalletConnecting,
  useWalletState,
} from '../../context/AppProvider';
import { AVAILABLE_CONNECTORS } from '../../web3/constants';
import { Button } from '../core/Button';
import { H3 } from '../core/Typography';
import { Address } from '../core/Address';
import { ActivitySpinner } from '../core/ActivitySpinner';
import { Size } from '../../theme';
import { Balances } from './Balances';
import { HistoricTransactions } from './HistoricTransactions';
import { Transactions } from './Transactions';

interface Connector {
  id: keyof Connectors;
  label: string;
  icon?: string;
}

const allConnectors: Connector[] = [
  { id: 'injected', label: 'MetaMask', icon: 'metamask.png' },
  { id: 'fortmatic', label: 'Fortmatic', icon: 'fortmatic.png' },
  { id: 'portis', label: 'Portis', icon: 'portis.png' },
  // TODO add missing icons
  { id: 'authereum', label: 'Authereum' },
  { id: 'squarelink', label: 'Squarelink' },
  { id: 'torus', label: 'Torus' },
  { id: 'walletconnect', label: 'WalletConnect' },
  { id: 'walletlink', label: 'WalletLink' },
  { id: 'frame', label: 'Frame' },
];

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.color.foreground};
  color: ${({ theme }) => theme.color.background};
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.l}`};
`;

const Rows = styled.div`
  width: 100%;
`;

const Row = styled.div`
  border-top: ${({ theme }) => `2px ${theme.color.background} solid`};
  margin-bottom: ${({ theme }) => theme.spacing.l};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const HeaderTitle = styled(H3)`
  text-align: center;
`;

const DisconnectButton = styled(Button)`
  color: ${({ theme }) => theme.color.background};
  background: ${({ theme }) => theme.color.red};
`;

const Content = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

const Error = styled.div`
  color: ${({ theme }) => theme.color.red};
  font-weight: bold;
  margin: ${({ theme }) => theme.spacing.m} 0;
`;

const ConnectorsList = styled.div`
  padding: 0;
  margin: 0;
  list-style: none;
  display: grid;

  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: minmax(min-content, max-content);
  grid-column-gap: ${({ theme }) => theme.spacing.m};
`;

const ConnectorButton = styled(Button)`
  margin-bottom: ${props => props.theme.spacing.s};
  padding: ${props => props.theme.spacing.m};
  img {
    display: block;
    max-width: 150px;
    margin-bottom: ${({ theme }) => theme.spacing.s};
  }
  div {
    display: block;
  }
`;

const Connecting = styled.div`
  width: 150px;
`;

const Disconnected: FC<{
  connect(connector: keyof Connectors): void;
}> = ({ connect }) => {
  const list: Connector[] = useMemo(
    () => allConnectors.filter(({ id }) => !!AVAILABLE_CONNECTORS[id]),
    [],
  );

  return (
    <ConnectorsList>
      {list.map(({ id, label, icon }) => (
        <ConnectorButton
          key={id}
          type="button"
          onClick={() => connect(id)}
          size={Size.m}
          inverted
        >
          {icon ? (
            <img src={`${process.env.PUBLIC_URL}/icons/${icon}`} alt={label} />
          ) : null}
          <div>{label}</div>
        </ConnectorButton>
      ))}
    </ConnectorsList>
  );
};

const Connected: FC<{ account: string }> = ({ account }) => (
  <Rows>
    <Row>
      <H3>Address</H3>
      <Address address={account} type="account" copyable />
    </Row>
    <Row>
      <H3>Balances</H3>
      <Balances />
    </Row>
    <Row>
      <H3>Transactions</H3>
      <Transactions />
    </Row>
    <Row>
      <H3>Historic transactions</H3>
      <HistoricTransactions />
    </Row>
  </Rows>
);

export const Wallet: FC<{}> = () => {
  const { connector, error } = useWalletState();
  const connecting = useIsWalletConnecting();
  const { connectWallet, resetWallet } = useAppDispatch();
  const { connected, account } = useWallet();
  const wallet = useMemo(
    () => (connector ? allConnectors.find(({ id }) => id === connector) : null),
    [connector],
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>
          {connected
            ? 'Wallet'
            : connecting
            ? `Connecting to ${
                (wallet as NonNullable<typeof wallet>).label
              } wallet`
            : 'Connect wallet'}
        </HeaderTitle>
        {connected ? (
          <DisconnectButton size={Size.s} type="button" onClick={resetWallet}>
            Disconnect
          </DisconnectButton>
        ) : null}
      </Header>
      {error ? <Error>{error}</Error> : null}
      <Content>
        {connected && account ? (
          <Connected account={account} />
        ) : connecting ? (
          <Connecting>
            <ActivitySpinner />
          </Connecting>
        ) : (
          <Disconnected connect={connectWallet} />
        )}
      </Content>
    </Container>
  );
};
