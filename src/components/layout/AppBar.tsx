import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import {
  StatusWarnings,
  useAccountOpen,
  useAppStatusWarnings,
  useCloseAccount,
  useThemeMode,
  useToggleThemeMode,
  useToggleWallet,
} from '../../context/AppProvider';
import { Color, ViewportWidth } from '../../theme';
import { ReactComponent as LogoSvg } from '../icons/mstable-small.svg';
import { UnstyledButton } from '../core/Button';
import { ActivitySpinner } from '../core/ActivitySpinner';
import { truncateAddress } from '../../utils/strings';
import {
  useConnect,
  useConnected,
  useWallet,
  useWalletAddress,
} from '../../context/OnboardProvider';
import { useTransactionsState } from '../../context/TransactionsProvider';
import { TransactionStatus } from '../../web3/TransactionManifest';
import { ReactComponent as BraveIcon } from '../icons/wallets/brave.svg';
import { ReactComponent as MetaMaskIcon } from '../icons/wallets/metamask.svg';
import { ReactComponent as FortmaticIcon } from '../icons/wallets/fortmatic.svg';
import { ReactComponent as PortisIcon } from '../icons/wallets/portis.svg';
import { ReactComponent as SquarelinkIcon } from '../icons/wallets/squarelink.svg';
import { ReactComponent as WalletConnectIcon } from '../icons/wallets/walletconnect.svg';
import { ReactComponent as CoinbaseIcon } from '../icons/wallets/coinbase.svg';
import { ReactComponent as MeetOneIcon } from '../icons/wallets/meetone.svg';
import { Idle } from '../icons/Idle';
import { MassetDropdown } from '../core/MassetDropdown';
import { LocalStorage } from '../../localStorage';
import { Navigation } from './Navigation';
import { useTCModal } from '../../hooks/useTCModal';
import { NetworkDropdown } from '../core/NetworkDropdown';

const statusWarnings: Record<
  StatusWarnings,
  { label: string; error?: boolean }
> = {
  [StatusWarnings.UnsupportedChain]: {
    label: 'Unsupported chain',
    error: true,
  },
  [StatusWarnings.NotOnline]: {
    label: 'Not online',
  },
};

const Logo = styled(LogoSvg)`
  width: 20px;
  height: 24px;
  padding-top: 2px;
`;

const LogoAndMasset = styled.div<{ inverted?: boolean }>`
  display: flex;
  align-items: center;

  a {
    border-bottom: 0;
  }

  ${Logo} {
    path,
    rect {
      fill: ${({ theme, inverted }) =>
        inverted ? theme.color.white : theme.color.body};
    }
  }
`;

const AccountButton = styled(UnstyledButton)<{ active: boolean }>`
  align-items: center;
  border-radius: 1rem;
  cursor: pointer;
  display: flex;
  font-weight: bold;
  height: 2rem;
  justify-content: space-between;
  line-height: 100%;
  padding: 0.25rem 0.8rem;
  text-transform: uppercase;
  transition: all 0.3s ease;

  > * {
    margin-right: 4px;
    &:last-child {
      margin-right: 0;
    }
  }

  background: ${({ active }) =>
    active ? Color.whiteTransparent : 'transparent'};

  &:hover {
    background: ${({ active, theme }) =>
      active ? Color.whiteTransparent : theme.color.bodyTransparent};
  }
`;

const WalletButtonBtn = styled(AccountButton)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  > div {
    > svg {
      width: 16px;
      height: 16px;

      @media (min-width: ${ViewportWidth.m}) {
        width: 28px;
        height: 28px;
      }
    }
  }
`;

const ToggleButton = styled(UnstyledButton)`
  margin-left: 1rem;
`;

const TruncatedAddress = styled.span`
  display: none;

  @media (min-width: ${ViewportWidth.s}) {
    font-family: 'DM Mono', monospace;
    text-transform: none;
    display: inherit;
  }
`;

const Inner = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;

  > div {
    flex-basis: 33.33%;
  }
`;

const MassetContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 2rem;

  > *:not(:last-child) {
    margin-right: 1rem;
  }
`;

const Container = styled.div<{ inverted: boolean }>`
  background: ${({ inverted, theme }) =>
    inverted ? Color.black : theme.color.background};
  height: 56px;
  display: flex;
  justify-content: center;

  padding-top: 2px;
  border-bottom: 1px solid ${({ theme }) => theme.color.defaultBorder};

  ${AccountButton} {
    color: ${({ inverted, theme }) =>
      inverted ? Color.white : theme.color.body};
  }
`;

const WalletIcon: FC = () => {
  const wallet = useWallet();
  switch (wallet?.name) {
    case 'Coinbase':
      return <CoinbaseIcon />;
    case 'MetaMask':
      return <MetaMaskIcon />;
    case 'Fortmatic':
      return <FortmaticIcon />;
    case 'Portis':
      return <PortisIcon />;
    case 'SquareLink':
      return <SquarelinkIcon />;
    case 'WalletConnect':
      return <WalletConnectIcon />;
    case 'Brave':
      return <BraveIcon />;
    case 'Meetone':
      return <MeetOneIcon />;
    default:
      return <div />;
  }
};

const WalletAndSpinner = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  align-items: center;
`;

const StatusWarning = styled.div<{ error?: boolean }>`
  text-transform: uppercase;
  font-weight: bold;
  font-size: 12px;
  color: ${({ error }) => (error ? Color.red : Color.offBlack)};
  background: ${Color.white};
  border-right: 1px ${Color.red} solid;
  border-bottom: 1px ${Color.red} solid;
  padding: 8px 16px;
`;

const StatusWarningsRowContainer = styled.div`
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  > * {
    margin-right: 16px;
  }
`;

const CloseAccountBtn = styled(UnstyledButton)`
  font-weight: 600;
  color: white;
  cursor: pointer;
  font-size: 1.25rem;
`;

const CloseAccount: FC = () => {
  const closeAccount = useCloseAccount();
  return (
    <CloseAccountBtn type="button" onClick={closeAccount}>
      Back to App
    </CloseAccountBtn>
  );
};

const StatusWarningsRow: FC = () => {
  const warnings = useAppStatusWarnings();

  return (
    <StatusWarningsRowContainer>
      {warnings.map(warning => (
        <StatusWarning key={warning} error={statusWarnings[warning].error}>
          {statusWarnings[warning].label}
        </StatusWarning>
      ))}
    </StatusWarningsRowContainer>
  );
};

const WalletButton: FC = () => {
  const accountOpen = useAccountOpen();
  const toggleWallet = useToggleWallet();
  const connected = useConnected();
  const account = useWalletAddress();

  const connect = useConnect();
  const showTCModal = useTCModal();

  const viewedTerms = LocalStorage.get('tcsViewed');

  const handleClick = (): void => {
    if (connected && account) {
      return toggleWallet();
    }
    if (!viewedTerms) {
      return showTCModal();
    }
    connect();
  };

  return (
    <WalletButtonBtn title="Account" onClick={handleClick} active={accountOpen}>
      {connected ? (
        <>
          <Idle>
            <WalletIcon />
          </Idle>
          <TruncatedAddress>
            {account && truncateAddress(account)}
          </TruncatedAddress>
        </>
      ) : (
        <span>Connect</span>
      )}
    </WalletButtonBtn>
  );
};

const TransactionsSpinner: FC = () => {
  const transactions = useTransactionsState();

  const pending = useMemo(
    () =>
      Object.values(transactions).some(
        tx =>
          tx.status === TransactionStatus.Response ||
          tx.status === TransactionStatus.Sent,
      ),
    [transactions],
  );

  return <ActivitySpinner pending={pending} />;
};

export const AppBar: FC<{ home?: boolean }> = ({ home }) => {
  const accountOpen = useAccountOpen();
  const closeAccount = useCloseAccount();
  const toggleThemeMode = useToggleThemeMode();
  const themeMode = useThemeMode();

  const handleThemeToggle = (): void => {
    LocalStorage.set('themeMode', themeMode === 'light' ? 'dark' : 'light');
    toggleThemeMode();
  };

  return (
    <Container inverted={accountOpen}>
      <Inner>
        <LogoAndMasset inverted={accountOpen}>
          <Link to="/" title="Home" onClick={closeAccount}>
            <Logo />
          </Link>
          <MassetContainer>
            {!home && <MassetDropdown />}
            <NetworkDropdown />
          </MassetContainer>
        </LogoAndMasset>
        {home ? (
          accountOpen && <CloseAccount />
        ) : accountOpen ? (
          <CloseAccount />
        ) : (
          <Navigation />
        )}
        <WalletAndSpinner>
          <ToggleButton onClick={handleThemeToggle}>
            {themeMode === 'light' ? '☀️' : '🌙'}
          </ToggleButton>
          <TransactionsSpinner />
          <WalletButton />
        </WalletAndSpinner>
      </Inner>
      <StatusWarningsRow />
    </Container>
  );
};
