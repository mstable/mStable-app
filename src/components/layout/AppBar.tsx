import styled from 'styled-components';
import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AccountItems,
  StatusWarnings,
  useAppStatusWarnings,
  useCloseAccount,
  useIsWalletConnecting,
  useAccountItem,
  useAccountOpen,
  useToggleNotifications,
  useToggleWallet,
} from '../../context/AppProvider';
import { Color, ViewportWidth } from '../../theme';
import { ReactComponent as LogoSvg } from '../icons/mstable.svg';
import { UnstyledButton } from '../core/Button';
import { centredLayout } from './css';
import { TransactionStatus } from '../../types';
import { useTruncatedAddress } from '../../web3/hooks';
import { usePendingTxState } from '../../context/TransactionsProvider';
import {
  NotificationType,
  useUnreadNotifications,
} from '../../context/NotificationsProvider';
import { ActivitySpinner } from '../core/ActivitySpinner';
import {
  useConnect,
  useConnected,
  useWalletAddress,
  useWalletContext,
} from '../../context/OnboardProvider';
import { ReactComponent as BraveIcon } from '../icons/wallets/brave.svg';
import { ReactComponent as MetaMaskIcon } from '../icons/wallets/metamask.svg';
import { ReactComponent as FortmaticIcon } from '../icons/wallets/fortmatic.svg';
import { ReactComponent as PortisIcon } from '../icons/wallets/portis.svg';
import { ReactComponent as SquarelinkIcon } from '../icons/wallets/squarelink.svg';
import { ReactComponent as WalletConnectIcon } from '../icons/wallets/walletconnect.svg';
import { ReactComponent as CoinbaseIcon } from '../icons/wallets/coinbase.svg';
import { ReactComponent as MeetOneIcon } from '../icons/wallets/meetone.svg';
import { Idle } from '../icons/Idle';

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

const CountBadgeIcon = styled.div<{ error: boolean; count: number }>`
  background: ${({ error, count }) =>
    error ? Color.blue : count === 0 ? Color.greyTransparent : Color.blue};
  font-weight: bold;
  font-size: 11px;
  width: 17px;
  height: 17px;
  border-radius: 100%;
  color: ${Color.white};
  text-align: center;
  line-height: 17px;
`;

const CountBadge: FC<{ count: number; error: boolean }> = ({
  count,
  error,
}) => (
  <CountBadgeIcon error={error} count={count}>
    {count}
  </CountBadgeIcon>
);

const Logo = styled.div<{ full: boolean; inverted?: boolean }>`
  overflow: hidden;
  flex-shrink: 0;
  width: ${({ full }) => (full ? 100 : 25)}px; // 'mSTABLE' or 'm'
  height: 100%;

  a {
    border-bottom: 0;
  }

  svg {
    // Gentle nudge to visual centre
    top: 8px;
    position: relative;
    width: 100px;

    path,
    rect {
      fill: ${({ theme, inverted }) => (inverted ? theme.color.white : 'auto')};
    }

    #stable {
      display: ${({ full }) => (full ? 'block' : 'none')};
    }
  }
`;

const AccountButton = styled(UnstyledButton)<{ active: boolean }>`
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  height: 24px;
  line-height: 100%;
  padding: 0 8px;
  text-transform: uppercase;
  transition: all 0.3s ease;
  border-bottom: 4px transparent solid;
  border-bottom-color: ${({ active }) =>
    active ? Color.white : 'transparent'};
  display: flex;
  justify-content: space-between;
  align-items: center;

  > * {
    margin-right: 4px;
    &:last-child {
      margin-right: 0;
    }
  }

  ${CountBadgeIcon} {
    margin-top: -1px;
  }

  &:hover {
    border-bottom-color: ${({ active }) =>
      active ? Color.white : Color.blackTransparent};
  }
`;

const TruncatedAddress = styled.span`
  //font-weight: normal;
  text-transform: none;
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

const Buttons = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: flex-end;
  height: 100%;

  > * {
    margin-right: 6px;
    &:last-child {
      margin-right: 0;
    }
  }

  @media (min-width: ${ViewportWidth.s}) {
    > * {
      margin-right: 16px;
    }
  }
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Inner = styled.div`
  padding: 0 16px;
  height: 100%;

  ${centredLayout}
`;

const Container = styled.div<{ inverted: boolean; home: boolean }>`
  background: ${({ inverted, home }) =>
    inverted ? Color.black : home ? Color.gold : Color.offWhite};
  height: 32px;
  display: flex;
  justify-content: center;

  ${AccountButton} {
    color: ${({ inverted }) => (inverted ? Color.white : Color.offBlack)};
  }
`;

const WalletIcon: FC = (): JSX.Element => {
  const wallet = useWalletContext();
  switch (wallet?.name) {
    case 'coinbase':
      return <CoinbaseIcon />;
    case 'MetaMask':
      return <MetaMaskIcon />;
    case 'fortmatic':
      return <FortmaticIcon />;
    case 'portis':
      return <PortisIcon />;
    case 'squareLink':
      return <SquarelinkIcon />;
    case 'walletConnect':
      return <WalletConnectIcon />;
    case 'brave':
      return <BraveIcon />;
    case 'meetone':
      return <MeetOneIcon />;
    default:
      return <div />;
  }
};

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

const StatusWarningsRow: FC<{}> = () => {
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

const NotificationsButton: FC<{}> = () => {
  const accountItem = useAccountItem();
  const toggleNotifications = useToggleNotifications();
  const unread = useUnreadNotifications();
  const hasUnreadErrors = unread.some(n => n.type === NotificationType.Error);

  return (
    <AccountButton
      onClick={toggleNotifications}
      active={accountItem === AccountItems.Notifications}
    >
      <span>Notifications</span>
      <CountBadge count={unread.length} error={hasUnreadErrors} />
    </AccountButton>
  );
};

const PendingTxContainer = styled.div<{
  pending: boolean;
  error: boolean;
  success: boolean;
}>`
  width: 17px;
  height: 17px;
  position: relative;
  margin-top: -1px;
  transition: color 0.5s ease;
  color: ${({ error, pending, success, theme }) =>
    error
      ? theme.color.red
      : success
      ? theme.color.green
      : pending
      ? theme.color.blue
      : theme.color.greyTransparent};
  font-weight: bold;
  font-size: 11px;
  text-align: center;
  line-height: 17px;

  > div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const WalletButton: FC<{}> = () => {
  const accountItem = useAccountItem();
  const toggleWallet = useToggleWallet();
  const connected = useConnected();
  const account = useWalletAddress();
  const connecting = useIsWalletConnecting();
  const truncatedAddress = useTruncatedAddress(account);
  const connect = useConnect();

  const { pendingCount, latestStatus } = usePendingTxState();
  const pending =
    (!latestStatus && connecting) || latestStatus === TransactionStatus.Pending;
  const error = latestStatus === TransactionStatus.Error;
  const success =
    (!latestStatus && connected) || latestStatus === TransactionStatus.Success;

  return (
    <WalletButtonBtn
      title="Account"
      onClick={connected ? toggleWallet : connect}
      active={accountItem === AccountItems.Wallet}
    >
      {connected ? (
        <>
          <Idle>
            <WalletIcon />
          </Idle>
          <TruncatedAddress>{truncatedAddress}</TruncatedAddress>
        </>
      ) : (
        <span>
          {accountItem === AccountItems.Wallet && connecting
            ? 'Back'
            : 'Connect'}
        </span>
      )}
      <PendingTxContainer pending={pending} error={error} success={success}>
        <ActivitySpinner pending={pending} error={error} success={success} />
        <div>
          {success
            ? '✓'
            : error
            ? '✗'
            : pendingCount === 0
            ? null
            : pendingCount}
        </div>
      </PendingTxContainer>
    </WalletButtonBtn>
  );
};

export const AppBar: FC = () => {
  const accountOpen = useAccountOpen();
  const closeAccount = useCloseAccount();
  const { pathname } = useLocation();
  const home = pathname === '/';

  return (
    <Container inverted={accountOpen} home={home}>
      <Inner>
        <Top>
          <Logo inverted={accountOpen} full={home}>
            <Link to="/" title="Home" onClick={closeAccount}>
              <LogoSvg />
            </Link>
          </Logo>
          <Buttons>
            {home ? null : <NotificationsButton />}
            <WalletButton />
          </Buttons>
        </Top>
      </Inner>
      <StatusWarningsRow />
    </Container>
  );
};
