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
  | { type: 'CONNECT_SUCCESS' };

interface Dispatch {
  selectConnector(connector: keyof Connectors): void;
  connectSuccess(): void;
}

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'SELECT_CONNECTOR':
      return { status: Status.Connecting, connector: action.payload };
    case 'CONNECT_SUCCESS':
      return { ...state, status: Status.Connected };
    default:
      return state;
  }
};

const initialState: State = { status: Status.Disconnected };

const allConnectors: Connector[] = [
  { id: 'authereum', label: 'Authereum' },
  { id: 'fortmatic', label: 'Fortmatic' },
  { id: 'frame', label: 'Frame' },
  { id: 'injected', label: 'MetaMask' },
  { id: 'portis', label: 'Portis' },
  { id: 'squarelink', label: 'Squarelink' },
  { id: 'torus', label: 'Torus' },
  { id: 'walletconnect', label: 'WalletConnect' },
  { id: 'walletlink', label: 'WalletLink' },
];

const Connecting: FC<{ connector: NonNullable<State['connector']> }> = ({
  connector,
}) => {
  const { label } = allConnectors.find(
    ({ id }) => id === connector,
  ) as Connector;
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
      allConnectors.map(connector => ({
        ...connector,
        disabled: !Object.hasOwnProperty.call(
          AVAILABLE_CONNECTORS,
          connector.id,
        ),
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

const Connected: FC<{}> = () => <div>Connected</div>;

export const WalletModal: FC<{ hideModal: () => void }> = ({ hideModal }) => {
  const [{ status, connector }, dispatch] = useReducer(reducer, initialState);
  const { activate, connected } = useWallet();

  const selectConnector = useCallback(
    (selected: keyof Connectors) => {
      dispatch({ type: 'SELECT_CONNECTOR', payload: selected });
      activate(selected);
    },
    [activate],
  );

  useEffect(() => {
    if (connected) {
      dispatch({ type: 'CONNECT_SUCCESS' });
    }
  }, [connected]);

  return (
    <>
      <div className={styles.container}>
        {status === Status.Disconnected ? (
          <Disconnected selectConnector={selectConnector} />
        ) : status === Status.Connecting && connector ? (
          <Connecting connector={connector} />
        ) : (
          <Connected />
        )}
        <button type="submit" onClick={hideModal}>
          Close modal
        </button>
      </div>
    </>
  );
};
