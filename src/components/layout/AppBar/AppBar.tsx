import styled from 'styled-components';
import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

import {
  AccountItems,
  useCloseAccount,
  useAccountItem,
  useAccountOpen,
  useToggleNotifications,
} from '../../../context/AppProvider';
import {
  NotificationType,
  useUnreadNotifications,
} from '../../../context/NotificationsProvider';

import { Color } from '../../../theme';
import { ReactComponent as LogoSvg } from '../../icons/mstable-icon.svg';
import { centredLayout } from '../css';
import { MassetSwitcher } from './MassetSwitcher';
import { WalletButton } from './WalletButton';
import { StatusWarningsRow } from './StatusWarnings';
import { AccountButton } from './AccountButton';

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

const Logo = styled.div<{ inverted?: boolean }>`
  display: flex;
  align-items: center;

  a {
    border-bottom: 0;
    line-height: 0;
    display: block;
  }

  svg {
    height: 20px;

    path,
    rect {
      fill: ${({ theme, inverted }) => (inverted ? theme.color.white : 'auto')};
    }
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 100%;
  gap: 0.5rem;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Inner = styled.div`
  padding: 0 20px;
  height: 100%;

  ${centredLayout}
`;

const Container = styled.div<{ inverted: boolean }>`
  background: ${({ inverted }) => (inverted ? Color.black : Color.white)};
  height: 48px;
  display: flex;
  justify-content: center;
  padding-top: 2px;
  border-bottom: 1px solid ${Color.blackTransparenter};

  ${AccountButton} {
    color: ${({ inverted }) => (inverted ? Color.white : Color.offBlack)};
  }
`;

const NotificationsButton: FC = () => {
  const accountItem = useAccountItem();
  const toggleNotifications = useToggleNotifications();
  const unread = useUnreadNotifications();
  const hasUnreadErrors = unread.some(n => n.type === NotificationType.Error);

  return (
    <AccountButton
      onClick={toggleNotifications}
      active={accountItem === AccountItems.Notifications}
    >
      <CountBadge count={unread.length} error={hasUnreadErrors} />
    </AccountButton>
  );
};

export const AppBar: FC = () => {
  const { pathname } = useLocation();
  const accountOpen = useAccountOpen();
  const closeAccount = useCloseAccount();
  const home = pathname === '/';

  return (
    <Container inverted={accountOpen}>
      <Inner>
        <Top>
          <Logo inverted={accountOpen}>
            <Link to="/" title="Home" onClick={closeAccount}>
              <LogoSvg />
            </Link>
            {!home && <MassetSwitcher />}
          </Logo>
          <Buttons>
            {!home && <NotificationsButton />}
            <WalletButton />
          </Buttons>
        </Top>
      </Inner>
      <StatusWarningsRow />
    </Container>
  );
};
