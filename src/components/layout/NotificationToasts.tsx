import React, { FC } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {
  Notification,
  NotificationType,
  useMarkNotificationAsRead,
  useNotificationsState,
} from '../../context/NotificationsProvider';

const Item = styled.div<Pick<Notification, 'type'>>`
  background: ${({ theme, type }) =>
    type === NotificationType.Success
      ? theme.color.green
      : type === NotificationType.Info
      ? theme.color.blue
      : theme.color.red};
  color: ${({ theme, type }) =>
    type === NotificationType.Success ? theme.color.black : theme.color.white};
  border-radius: 4px;
  padding: ${({ theme }) => theme.spacing.s};
  margin-bottom: ${({ theme }) => theme.spacing.m};

  > * {
    margin-bottom: ${({ theme }) => theme.spacing.s};
  }

  > :last-child {
    margin-bottom: 0;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSize.s};
`;

const Link = styled.a<{ nType: NotificationType }>`
  font-size: ${({ theme }) => theme.fontSize.s};
  color: ${({ theme, nType }) =>
    nType === NotificationType.Success ? theme.color.black : theme.color.white};
  border-color: ${({ theme, nType }) =>
    nType === NotificationType.Success ? theme.color.black : theme.color.white};
  &:after {
    content: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAQElEQVR42qXKwQkAIAxDUUdxtO6/RBQkQZvSi8I/pL4BoGw/XPkh4XigPmsUgh0626AjRsgxHTkUThsG2T/sIlzdTsp52kSS1wAAAABJRU5ErkJggg==');
    margin: 0 3px 0 5px;
    filter: ${({ nType }) =>
      nType === NotificationType.Success
        ? 'none'
        : 'invert(99%) sepia(1%) saturate(2%) hue-rotate(39deg) brightness(100%) contrast(101%)'}
`;

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
  const markAsRead = useMarkNotificationAsRead();
  // const unreadCount = useUnreadNotificationsCount();

  return (
    <Container>
      <TransitionGroup>
        {Object.keys(notifications)
          .filter(
            id => !(notifications[id].hideToast || notifications[id].read),
          )
          .map(id => {
            const { type, title, body, link } = notifications[id];
            return (
              <Animation
                timeout={{ enter: 500, exit: 200 }}
                classNames="item"
                key={id}
              >
                <Item type={type} onClick={() => markAsRead(id)}>
                  <Title>{title}</Title>
                  {body ? <div>{body}</div> : null}
                  {link ? (
                    <Link
                      nType={type}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.title}
                    </Link>
                  ) : null}
                </Item>
              </Animation>
            );
          })}
      </TransitionGroup>
    </Container>
  );
};
