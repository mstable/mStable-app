import React, { FC, useMemo } from 'react';
import { Connectors, useWallet } from 'use-wallet';
import styled from 'styled-components';
import {
  useIsWalletConnecting,
  useResetWallet,
  useConnectWallet,
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
  flex: 1;
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.color.white};
  padding: ${({ theme }) => `80px ${theme.spacing.l} ${theme.spacing.l}`};
`;

const Rows = styled.div`
  width: 100%;
`;

const Row = styled.div`
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  border-top: 1px ${({ theme }) => theme.color.whiteTransparent} solid;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${({ theme }) => theme.spacing.xl};
  border-top: 1px ${({ theme }) => theme.color.whiteTransparent} solid;
`;

const DisconnectButton = styled(Button)`
  color: ${({ theme }) => theme.color.white};
  background: ${({ theme }) => theme.color.red};
`;

const AddressGroup = styled.div`
  display: flex;
  justify-content: space-between;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
    flex-grow: 1;
    align-items: center;
  }
  svg {
    width: 100%;
    height: auto;
    max-height: 96px;
    margin-bottom: ${({ theme }) => theme.spacing.s};
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
      {list.map(({ id, label, icon: Icon }) => (
        <ConnectorButton
          key={id}
          type="button"
          onClick={() => connect(id)}
          size={Size.m}
          inverted
        >
          <div>{Icon ? <Icon /> : null}</div>
          <span>{label}</span>
        </ConnectorButton>
      ))}
    </ConnectorsList>
  );
};

const Connected: FC<{ walletLabel: string; account: string }> = ({
  walletLabel,
  account,
}) => {
  const resetWallet = useResetWallet();
  return (
    <Rows>
      <Row>
        <H3>Connected with {walletLabel}</H3>
        <AddressGroup>
          <Address address={account} type="account" copyable />
          <DisconnectButton size={Size.s} type="button" onClick={resetWallet}>
            Disconnect
          </DisconnectButton>
        </AddressGroup>
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
};

export const Wallet: FC<{}> = () => {
  const { connector, error } = useWalletState();
  const connecting = useIsWalletConnecting();
  const connectWallet = useConnectWallet();
  const { connected, account } = useWallet();
  const wallet = useMemo(
    () => (connector ? CONNECTORS.find(({ id }) => id === connector) : null),
    [connector],
  );

  return (
    <Container>
      {connected ? null : (
        <Header>
          <H2>
            {connecting && wallet
              ? `Connecting to ${wallet.label} wallet`
              : 'Connect wallet'}
          </H2>
        </Header>
      )}
      {error ? <Error>{error}</Error> : null}
      <FlexRow>
        { /* FIXME problem when first connecting; updates on unmounted components */ }
        {connected && account && wallet ? (
          <Connected walletLabel={wallet.label} account={account} />
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
