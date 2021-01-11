import React, { FC } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { Button } from './Button';

interface Props {
  className?: string;
  title: string;
  hideModal?(): void;
  open: boolean;
  onExited(): void;
}

const Title = styled.div`
  font-size: 1.4rem;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
`;

const Body = styled.div``;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 50vw;
  max-width: 90vw;
  max-height: 90vw;
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px ${({ theme }) => theme.color.lightGrey} solid;
`;

const FixedContainer = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  background: rgba(255, 255, 255, 0.8);
`;

const scaleIn = keyframes`
  0% {
    transform: scale(2);
    transform-origin: 50% 50%;
    filter: blur(40px);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    transform-origin: 50% 50%;
    filter: blur(0);
    opacity: 1;
  }
`;

const Animation = styled(CSSTransition)`
  ${({ classNames }) => `&.${classNames}-enter`} {
    animation: ${css`
        ${scaleIn}`} 0.5s cubic-bezier(0.19, 1, 0.22, 1) normal;
  }

  ${({ classNames }) => `&.${classNames}-exit-active`} {
    animation: ${css`
        ${scaleIn}`} 0.3s cubic-bezier(0.19, 1, 0.22, 1) reverse;
  }
`;

export const Modal: FC<Props> = ({
  children,
  title,
  className,
  hideModal,
  open,
}) => {
  return (
    <TransitionGroup>
      {open && (
        <Animation timeout={{ enter: 500, exit: 300 }} classNames="item">
          <FixedContainer onClick={hideModal}>
            <Container className={className}>
              <Header>
                <Title>{title}</Title>
                {hideModal && (
                  <Button scale={0.7} onClick={hideModal}>
                    x
                  </Button>
                )}
              </Header>
              <Body>{children}</Body>
            </Container>
          </FixedContainer>
        </Animation>
      )}
    </TransitionGroup>
  );
};
