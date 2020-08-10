import styled from 'styled-components';
import React, { FC } from 'react';
import { A, getWorkingPath } from 'hookrouter';
import { useWallet } from 'use-wallet';

import {
  OverlayItems,
  StatusWarnings,
  useAppStatusWarnings,
  useCloseOverlay,
  useIsWalletConnecting,
  useOverlayItem,
  useOverlayOpen,
  useResetWallet,
  useToggleNotifications,
  useToggleWallet,
  useWalletConnector,
} from '../../context/AppProvider';
import { useOwnAccount } from '../../context/UserProvider';
import { Color, ViewportWidth } from '../../theme';
import { ReactComponent as LogoSvg } from '../icons/mstable.svg';
import { UnstyledButton } from '../core/Button';
import { centredLayout } from './css';
import { InjectedEthereum, TransactionStatus } from '../../types';
import { useTruncatedAddress } from '../../web3/hooks';
import { usePendingTxState } from '../../context/TransactionsProvider';
import {
  NotificationType,
  useUnreadNotifications,
} from '../../context/NotificationsProvider';
import { ActivitySpinner } from '../core/ActivitySpinner';
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

const OverlayButton = styled(UnstyledButton)<{ active: boolean }>`
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

const WalletButtonBtn = styled(OverlayButton)`
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

  ${OverlayButton} {
    color: ${({ inverted }) => (inverted ? Color.white : Color.offBlack)};
  }
`;

const useWalletIcon = (): FC<{}> | null => {
  const connector = useWalletConnector();

  if (connector) {
    return connector.icon || null;
  }

  return null;
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
  const overlayItem = useOverlayItem();
  const toggleNotifications = useToggleNotifications();
  const unread = useUnreadNotifications();
  const hasUnreadErrors = unread.some(n => n.type === NotificationType.Error);

  return (
    <OverlayButton
      onClick={toggleNotifications}
      active={overlayItem === OverlayItems.Notifications}
    >
      <span>Notifications</span>
      <CountBadge count={unread.length} error={hasUnreadErrors} />
    </OverlayButton>
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
  const overlayItem = useOverlayItem();
  const toggleWallet = useToggleWallet();
  const resetWallet = useResetWallet();
  const { status } = useWallet<InjectedEthereum>();
  const connected = status === 'connected';
  const account = useOwnAccount();
  const connecting = useIsWalletConnecting();
  const truncatedAddress = useTruncatedAddress(account);
  const WalletIcon = useWalletIcon();

  const { pendingCount, latestStatus } = usePendingTxState();
  const pending =
    (!latestStatus && connecting) || latestStatus === TransactionStatus.Pending;
  const error = latestStatus === TransactionStatus.Error;
  const success =
    (!latestStatus && connected) || latestStatus === TransactionStatus.Success;

  return (
    <WalletButtonBtn
      title="Account"
      onClick={connecting ? resetWallet : toggleWallet}
      active={overlayItem === OverlayItems.Wallet}
    >
      {connected ? (
        <>
          {WalletIcon ? (
            <Idle>
              <WalletIcon />
            </Idle>
          ) : null}
          <TruncatedAddress>{truncatedAddress}</TruncatedAddress>
        </>
      ) : (
        <span>
          {overlayItem === OverlayItems.Wallet && connecting
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

export const AppBar: FC<{}> = () => {
  const overlayOpen = useOverlayOpen();
  const closeOverlay = useCloseOverlay();
  const activePath = getWorkingPath('');
  const home = activePath === '/';

  return (
    <Container inverted={overlayOpen} home={home}>
      <Inner>
        <Top>
          <Logo inverted={overlayOpen} full={home}>
            <A href="/" title="Home" onClick={closeOverlay}>
              <LogoSvg />
            </A>
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
