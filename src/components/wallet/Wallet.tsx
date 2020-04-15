import React, { FC, useMemo } from 'react';
import { Connectors, useWallet } from 'use-wallet';
import styled from 'styled-components';
import {
  useAppDispatch,
  useIsWalletConnecting,
  useWalletState,
} from '../../context/AppProvider';
import { AVAILABLE_CONNECTORS, CONNECTORS } from '../../web3/constants';
import { Button } from '../core/Button';
import { H2, H3 } from '../core/Typography';
import { Address } from '../core/Address';
import { ActivitySpinner } from '../core/ActivitySpinner';
import { FlexRow } from '../core/Containers';
import { Size } from '../../theme';
import { Balances } from './Balances';
import { HistoricTransactions } from './HistoricTransactions';
import { Transactions } from './Transactions';
import { Connector } from '../../types';

const Container = styled.div`
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.color.background};
  padding: ${({ theme }) => `${theme.spacing.s} ${theme.spacing.l}`};
`;

const Rows = styled.div`
  width: 100%;
`;

const Row = styled.div`
  border-top: 1px rgba(255, 255, 255, 0.3) solid;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const HeaderTitle = styled(H2)`
  text-align: center;
`;

const DisconnectButton = styled(Button)`
  color: ${({ theme }) => theme.color.background};
  background: ${({ theme }) => theme.color.red};
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
  width: 100%;

  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  grid-column-gap: ${({ theme }) => theme.spacing.m};
`;

const ConnectorButton = styled(Button)`
  margin-bottom: ${props => props.theme.spacing.s};
  padding: ${props => props.theme.spacing.m};
  background: rgba(255, 255, 255, 0.1);
  border: none;
  img {
    display: block;
    max-width: 100%;
    margin-bottom: ${({ theme }) => theme.spacing.s};
  }
  div {
    display: block;
  }
`;

const Connecting = styled.div`
  width: 120px;
`;

const Disconnected: FC<{
  connect(connector: keyof Connectors): void;
}> = ({ connect }) => {
  const list: Connector[] = useMemo(
    () => CONNECTORS.filter(({ id }) => !!AVAILABLE_CONNECTORS[id]),
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

const Connected: FC<{}> = () => (
  <Rows>
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
    () => (connector ? CONNECTORS.find(({ id }) => id === connector) : null),
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
        {connected && account ? (
          <>
            <Address address={account} type="account" copyable />
            <DisconnectButton size={Size.s} type="button" onClick={resetWallet}>
              Disconnect
            </DisconnectButton>
          </>
        ) : null}
      </Header>
      {error ? <Error>{error}</Error> : null}
      <FlexRow>
        {connected && account ? (
          <Connected />
        ) : connecting ? (
          <Connecting>
            <ActivitySpinner />
          </Connecting>
        ) : (
          <Disconnected connect={connectWallet} />
        )}
      </FlexRow>
    </Container>
  );
};
