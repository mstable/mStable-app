import React, { FC } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { useNotificationsState } from '../../context/NotificationsProvider';
import { NotificationItem } from '../core/NotificationItem';

const slideIn = keyframes`
  0% {
    transform: translateY(-1000px) scaleY(2.5) scaleX(0.2);
    transform-origin: 50% 0;
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
  top: 24px;
  right: 40px;
  width: 20%;
  min-width: 240px;
  z-index: 2;
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

export const NotificationToasts: FC<{}> = () => {
  const notifications = useNotificationsState();

  return (
    <Container>
      <TransitionGroup>
        {notifications
          .filter(n => !(n.hideToast || n.read))
          .map(notification => (
            <Animation
              timeout={{ enter: 500, exit: 200 }}
              classNames="item"
              key={notification.id}
            >
              <NotificationItem notification={notification} />
            </Animation>
          ))}
      </TransitionGroup>
    </Container>
  );
};
