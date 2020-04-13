import React, { FC } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {
  Notification,
  NotificationType,
  useNotificationsState,
  useRemoveNotification,
} from '../../context/NotificationsProvider';

const slideIn = keyframes`
  0% {
    transform: translateY(-1000px) scaleY(2.5) scaleX(0.2);
    transform-origin: 50% 0%;
    filter: blur(40px);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scaleY(1) scaleX(1);
    transform-origin: 50% 50%;
    filter: blur(0);
    opacity: 1;
  }
`;

const Container = styled.div`
  position: fixed;
  top: 40px;
  right: 40px;
  width: 20%;
  z-index: 2;
`;

const Item = styled.div<Pick<Notification, 'type'>>`
  background: ${({ theme, type }) =>
    type === NotificationType.Success ? theme.color.green : theme.color.red};
  border-radius: 4px;
  font-weight: bold;
  padding: ${({ theme }) => theme.spacing.s};
  margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const Animation = styled(CSSTransition)`
  ${({ classNames }) => `&.${classNames}-enter`} {
    animation: ${css`
        ${slideIn}`} 0.6s cubic-bezier(0.19, 1, 0.22, 1) normal;
  }

  ${({ classNames }) => `&.${classNames}-exit-active`} {
    animation: ${css`
        ${slideIn}`} 0.3s cubic-bezier(0.19, 1, 0.22, 1) reverse;
  }
`;

export const Notifications: FC<{}> = () => {
  const notifications = useNotificationsState();
  const remove = useRemoveNotification();
  return (
    <Container>
      <TransitionGroup>
        {Object.keys(notifications).map(id => (
          <Animation
            timeout={{ enter: 600, exit: 300 }}
            classNames="item"
            key={id}
          >
            <Item type={notifications[id].type} onClick={() => remove(id)}>
              {notifications[id].message}
            </Item>
          </Animation>
        ))}
      </TransitionGroup>
    </Container>
  );
};
