import React, { FC } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { A } from 'hookrouter';
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
  top: 100px;
  right: 40px;
  width: 20%;
  min-width: 240px;
  z-index: 2;
`;

const Item = styled.div<Pick<Notification, 'type'>>`
  background: ${({ theme, type }) =>
    type === NotificationType.Success
      ? theme.color.green
      : type === NotificationType.Info
      ? theme.color.blue
      : theme.color.red};
  color: ${({ theme, type }) =>
    type === NotificationType.Info
      ? theme.color.white
      : theme.color.black};
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
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.fontSize.s};
`;

const Link = styled(A)`
  display: block;
  font-size: ${({ theme }) => theme.fontSize.s};
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
        {Object.keys(notifications).map(id => {
          const { type, title, body, link } = notifications[id];
          return (
            <Animation
              timeout={{ enter: 500, exit: 200 }}
              classNames="item"
              key={id}
            >
              <Item type={type} onClick={() => remove(id)}>
                <Title>{title}</Title>
                {body ? <div>{body}</div> : null}
                {link ? (
                  <Link
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
