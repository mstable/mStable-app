import React, {
  FC,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import { Connectors, useWallet } from 'use-wallet';
import styles from './WalletModal.module.css';
import { AVAILABLE_CONNECTORS } from '../web3/constants';
import { useEtherscanLink } from '../web3/hooks';

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
    <div className={styles.connectors}>
      <ul>
        {list.map(({ id, label, disabled }) => (
          <li key={id}>
            <button
              type="submit"
              className={styles.connector}
              disabled={disabled}
              onClick={selectConnector.bind(null, id)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Connected: FC<{
  account: string;
  connector: keyof Connectors;
  deactivate(): void;
}> = ({ account, connector, deactivate }) => {
  const link = useEtherscanLink(account, 'account');
  return (
    <div className={styles.connected}>
      <div className={styles.connectedAccount}>
        <div className={styles.accountDetails}>
          <div className={styles.blockie}>blockie</div>
          <div className={styles.connectorLabel}>
            {allConnectors[connector].label}
          </div>
        </div>
        <div className={styles.accountAddress}>
          <a
            className={styles.externalLink}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {account}
          </a>
        </div>
        <button type="submit" onClick={deactivate}>
          Disconnect
        </button>
      </div>
    </div>
  );
};

export const WalletModal: FC<{ hideModal: () => void }> = ({ hideModal }) => {
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
  }, [connected]);

  return (
    <>
      <div className={styles.container}>
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
        <button type="submit" onClick={hideModal}>
          Close modal
        </button>
      </div>
    </>
  );
};
