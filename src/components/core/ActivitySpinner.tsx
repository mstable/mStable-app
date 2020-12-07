import React, { FC } from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  error?: boolean;
  success?: boolean;
  pending?: boolean;
  size?: number;
}

const Spinner = styled.svg<Props>`
  animation: ${({ pending }) =>
    pending ? 'rotate 2s linear infinite' : 'none'};
  width: ${({ size }) => (size ? `${size}px` : `50px`)};
  height: ${({ size }) => (size ? `${size}px` : `50px`)};

  circle {
    stroke: ${({ theme, error, success, pending }) =>
      error
        ? theme.color.red
        : success
        ? theme.color.green
        : pending
        ? theme.color.blue
        : theme.color.greyTransparent};
    stroke-width: ${({ size }) => (size ? `${(size * 8) / 50}px` : `8px`)};
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

const Container = styled.div<Props>`
  svg {
    height: ${({ size }) => `${size}px`};
    width: ${({ size }) => `${size}px`};
  }
`;

export const ActivitySpinner: FC<Props> = ({
  error,
  success,
  pending,
  className,
  size = 50,
}) => (
  <Container className={className} size={size}>
    <Spinner
      viewBox={`0 0 ${size} ${size}`}
      error={error}
      pending={pending}
      success={success}
      size={size}
    >
      <circle cx={size / 2} cy={size / 2} r={size / 4} />
    </Spinner>
  </Container>
);
