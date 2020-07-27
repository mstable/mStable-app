import React, { FC } from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  error?: boolean;
  success?: boolean;
  pending?: boolean;
}

const Spinner = styled.svg<Props>`
  animation: ${({ pending }) =>
    pending ? 'rotate 2s linear infinite' : 'none'};
  width: 50px;
  height: 50px;

  circle {
    stroke: ${({ theme, error, success, pending }) =>
      error
        ? theme.color.red
        : success
        ? theme.color.green
        : pending
        ? theme.color.blue
        : theme.color.greyTransparent};
    stroke-width: 8px;
    stroke-linecap: round;
    fill: none;
    animation: ${({ pending }) =>
      pending ? 'dash 1.5s ease-in-out infinite' : 'none'};
    transition: stroke 0.5s ease;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
`;

const Container = styled.div`
  svg {
    width: 100%;
    height: auto;
  }
`;

export const ActivitySpinner: FC<Props> = ({ error, success, pending, className }) => (
  <Container className={className}>
    <Spinner
      viewBox="0 0 50 50"
      error={error}
      pending={pending}
      success={success}
    >
      <circle cx="25" cy="25" r="20" />
    </Spinner>
  </Container>
);
