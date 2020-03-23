import React, {
  ComponentProps,
  FC,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { Connectors, useWallet } from 'use-wallet';
import styled from 'styled-components';
import { AVAILABLE_CONNECTORS } from '../../web3/constants';
import { RecentTransactions } from './RecentTransactions';
import { EtherscanLink } from '../core/EtherscanLink';
import { Button } from '../core/Button';
import { Size } from '../../theme';

interface Connector {
  id: keyof Connectors;
  label: string;
  disabled?: boolean;
}

enum Status {
  Disconnected,
  Connecting,
  Connected,
}

interface State {
  connector?: keyof Connectors;
  status: Status;
}

type Action =
  | { type: 'SELECT_CONNECTOR'; payload: keyof Connectors }
  | { type: 'CONNECT_SUCCESS'; payload: keyof Connectors };

interface Dispatch {
  selectConnector(connector: keyof Connectors): void;
  connectSuccess(): void;
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'SELECT_CONNECTOR':
      return { status: Status.Connecting, connector: action.payload };
    case 'CONNECT_SUCCESS':
      return { status: Status.Connected, connector: action.payload };
    default:
      return state;
  }
};

const initialState: State = { status: Status.Disconnected };

const allConnectors: Record<keyof Connectors, Connector> = {
  authereum: { id: 'authereum', label: 'Authereum' },
  fortmatic: { id: 'fortmatic', label: 'Fortmatic' },
  frame: { id: 'frame', label: 'Frame' },
  injected: { id: 'injected', label: 'MetaMask' },
  portis: { id: 'portis', label: 'Portis' },
  squarelink: { id: 'squarelink', label: 'Squarelink' },
  torus: { id: 'torus', label: 'Torus' },
  walletconnect: { id: 'walletconnect', label: 'WalletConnect' },
  walletlink: { id: 'walletlink', label: 'WalletLink' },
};

const Container = styled.div`
  background: white;
  padding: ${props => props.theme.spacing.s};
`;

const ConnectorsContainer = styled.div``;

const ConnectedContainer = styled.div``;

const ConnectedAccount = styled.div``;

const Blockie = styled.div``;

const ConnectorLabel = styled.div``;

const AccountDetails = styled.div``;

const AccountAddress = styled.div``;

const DisconnectButton = styled(Button)<ComponentProps<typeof Button>>``;

const CollapseButton = styled(Button)<ComponentProps<typeof Button>>``;

const ConnectorsList = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
`;

const ConnectorItem = styled.li`
  margin-bottom: ${props => props.theme.spacing.s};
`;

const Connecting: FC<{ connector: NonNullable<State['connector']> }> = ({
  connector,
}) => {
  const { label } = allConnectors[connector];
  return (
    <div>
      <div>Connecting to {label}</div>
      <div>Activity indicator goes here...</div>
    </div>
  );
};

const Disconnected: FC<{
  selectConnector: Dispatch['selectConnector'];
}> = ({ selectConnector }) => {
  const list: Connector[] = useMemo(
    () =>
      Object.keys(allConnectors).map(key => ({
        ...allConnectors[key as keyof typeof allConnectors],
        disabled: !Object.hasOwnProperty.call(AVAILABLE_CONNECTORS, key),
      })),
    [],
  );

  // TODO wallet button style incl. logo
  return (
    <ConnectorsContainer>
      <ConnectorsList>
        {list.map(({ id, label, disabled }) => (
          <ConnectorItem key={id}>
            <Button
              type="button"
              disabled={disabled}
              onClick={() => selectConnector(id)}
              size={Size.m}
            >
              {label}
            </Button>
          </ConnectorItem>
        ))}
      </ConnectorsList>
    </ConnectorsContainer>
  );
};

const Connected: FC<{
  account: string;
  connector: keyof Connectors;
  deactivate(): void;
}> = ({ account, connector, deactivate }) => (
  <ConnectedContainer>
    <ConnectedAccount>
      <AccountDetails>
        <Blockie>blockie</Blockie>
        <ConnectorLabel>{allConnectors[connector].label}</ConnectorLabel>
      </AccountDetails>
      <AccountAddress>
        <EtherscanLink data={account} type="account" showData />
      </AccountAddress>
      <RecentTransactions />
      <DisconnectButton type="submit" onClick={deactivate} size={Size.m}>
        Disconnect
      </DisconnectButton>
    </ConnectedAccount>
  </ConnectedContainer>
);

export const WalletConnection: FC<{ collapse: () => void }> = ({
  collapse,
}) => {
  const [{ status, connector }, dispatch] = useReducer(reducer, initialState);
  const { activate, connected, account, activated, deactivate } = useWallet();

  const selectConnector = useCallback(
    (selected: keyof Connectors) => {
      dispatch({ type: 'SELECT_CONNECTOR', payload: selected });
      activate(selected);
    },
    [activate],
  );

  useEffect(() => {
    if (connected) {
      dispatch({ type: 'CONNECT_SUCCESS', payload: activated });
    }
  }, [connected, activated]);

  return (
    <>
      <Container>
        {status === Status.Connected && connector && account ? (
          <Connected
            account={account}
            connector={connector}
            deactivate={deactivate}
          />
        ) : status === Status.Connecting && connector ? (
          <Connecting connector={connector} />
        ) : (
          <Disconnected selectConnector={selectConnector} />
        )}
        <CollapseButton type="button" onClick={collapse} size={Size.m}>
          x
        </CollapseButton>
      </Container>
    </>
  );
};
