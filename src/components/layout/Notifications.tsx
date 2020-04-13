import React, { FC } from 'react';
import styled from 'styled-components';
import {
  Notification,
  NotificationType,
  useNotificationsState,
  useRemoveNotification,
} from '../../context/NotificationsProvider';

const Container = styled.div`
  position: fixed;
  top: 40px;
  right: 40px;
  width: 20%;
`;

const Item = styled.div<Pick<Notification, 'type'>>`
  background: ${({ theme, type }) =>
    type === NotificationType.Success ? theme.color.green : theme.color.red};
  font-weight: bold;
  padding: ${({ theme }) => theme.spacing.s};
  margin-bottom: ${({ theme }) => theme.spacing.m};
`;

export const Notifications: FC<{}> = () => {
  const notifications = useNotificationsState();
  const remove = useRemoveNotification();
  return (
    <Container>
      {Object.keys(notifications).map(id => (
        <Item key={id} type={notifications[id].type} onClick={() => remove(id)}>
          {notifications[id].message}
        </Item>
      ))}
    </Container>
  );
};
