import React, { FC } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useWalletPosition } from '../../context/AppProvider';

interface Props {
  walletExpanded: boolean;
}

const wipeIn = keyframes`
  0% {
    filter: blur(80px);
    opacity: 0.5;
    r: 0;
  }
  100% {
    filter: blur(0);
    opacity: 1;
    r: 100%;
  }
`;

const Container = styled.div<Props>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
  z-index: -1;
  transition: background-color 0.5s linear;
  background-color: ${({ theme, walletExpanded }) =>
    walletExpanded ? theme.color.foreground : theme.color.background};
`;

const CircleSVG = styled.svg`
  width: 100%;
  height: 100%;
`;

const Animation = styled(CSSTransition)<{ cx: number; cy: number }>`
  fill: ${({ theme }) => theme.color.foreground};

  ${({ classNames }) => `&.${classNames}-enter`} {
    animation: ${css`
        ${wipeIn}`} 0.6s cubic-bezier(0.19, 1, 0.22, 1) normal;
  }

  ${({ classNames }) => `&.${classNames}-enter-done`} {
    r: 100%;
  }

  ${({ classNames }) => `&.${classNames}-exit-active`} {
    animation: ${css`
        ${wipeIn}`} 0.3s cubic-bezier(0.19, 1, 0.22, 1) reverse;
  }
`;

const Circle: FC<Props> = ({ walletExpanded }) => {
  const { cx, cy } = useWalletPosition();
  return (
    <CircleSVG>
      <TransitionGroup component={null}>
        {walletExpanded ? (
          <Animation timeout={{ enter: 600, exit: 300 }} classNames="circle">
            <circle cx={cx} cy={cy} />
          </Animation>
        ) : null}
      </TransitionGroup>
    </CircleSVG>
  );
};

export const Background: FC<Props> = ({ walletExpanded }) => (
  <Container walletExpanded={walletExpanded}>
    <Circle walletExpanded={walletExpanded} />
  </Container>
);
