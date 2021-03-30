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
  top: 4.5rem;
  left: 1rem;
  width: 20%;
  min-width: 280px;
  z-index: 2;
  > * {
    > * {
      display: inline-block;
      margin-bottom: 0.5rem;
    }
  }
`;

const Animation = styled(CSSTransition)`
  ${({ classNames }) => `&.${classNames}-enter`} {
    animation: ${css`
        ${slideIn}`} 0.4s cubic-bezier(0.19, 1, 0.22, 1) normal;
  }

  ${({ classNames }) => `&.${classNames}-exit-active`} {
    animation: ${css`
        ${slideIn}`} 0.2s cubic-bezier(0.19, 1, 0.22, 1) reverse;
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
              timeout={{ enter: 350, exit: 150 }}
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
