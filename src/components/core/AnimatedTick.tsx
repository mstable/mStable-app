import React, { FC } from 'react';
import styled from 'styled-components';

const DEFAULT_SIZE = 56;

interface Props {
  size?: number;
}

const StyledTick = styled.svg<{ increase: number }>`
  width: ${({ increase }) => increase + DEFAULT_SIZE}px;
  height: ${({ increase }) => increase + DEFAULT_SIZE}px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  margin: 10% auto;
  box-shadow: inset 0px 0px 0px #7ac142;
  animation: fill 0.4s ease-in-out 0.4s forwards,
    scale 0.3s ease-in-out 0.9s both;

  > circle {
    stroke-dasharray: ${({ increase }) => increase + 166};
    stroke-dashoffset: ${({ increase }) => increase + 166};
    stroke-width: 2;
    stroke-miterlimit: 10;
    stroke: #7ac142;
    fill: none;
    animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
  }

  > path {
    transform-origin: 50% 50%;
    stroke-dasharray: ${({ increase }) => increase + 48};
    stroke-dashoffset: ${({ increase }) => increase + 48};
    animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
  }

  @keyframes stroke {
    100% {
      stroke-dashoffset: 0;
    }
  }
  @keyframes scale {
    0%,
    100% {
      transform: none;
    }
    50% {
      transform: scale3d(1.1, 1.1, 1);
    }
  }
  @keyframes fill {
    100% {
      box-shadow: inset 0px 0px 0px ${({ increase }) => increase + 80}px #7ac142;
    }
  }
`;

export const AnimatedTick: FC<Props> = ({ size = 56 }) => {
  const increase = size - DEFAULT_SIZE;
  return (
    <StyledTick increase={increase} viewBox="0 0 52 52">
      <circle cx="26" cy="26" r="25" fill="none" />
      <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
    </StyledTick>
  );
};
