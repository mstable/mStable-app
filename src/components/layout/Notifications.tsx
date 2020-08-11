import React, { FC } from 'react';
import styled from 'styled-components';

import {
  useMarkAllNotificationsAsRead,
  useUnreadNotifications,
} from '../../context/NotificationsProvider';
import { H2 } from '../core/Typography';
import { NotificationItem } from '../core/NotificationItem';
import { Button } from '../core/Button';

const List = styled.div`
  > * {
    margin-bottom: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  ${Button} {
    text-transform: uppercase;
  }
`;

const Container = styled.div`
  width: 100%;
  color: white;
`;

export const Notifications: FC<{}> = () => {
  const notifications = useUnreadNotifications();
  const markAllNotificationsAsRead = useMarkAllNotificationsAsRead();

  return (
    <Container>
      <Header>
        <H2>Notifications</H2>
        <Button onClick={markAllNotificationsAsRead}>Mark all as read</Button>
      </Header>
      {notifications.length === 0 ? (
        <div>No notifications</div>
      ) : (
        <List>
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </List>
      )}
    </Container>
  );
};
