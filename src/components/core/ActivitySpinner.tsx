import React, { FC } from 'react'
import styled from 'styled-components'

interface Props {
  className?: string
  pending?: boolean
  size?: number
}

const Spinner = styled.svg<Pick<Props, 'size'>>`
  animation: rotate 2s linear infinite;
  width: ${({ size }) => (size ? `${size}px` : `50px`)};
  height: ${({ size }) => (size ? `${size}px` : `50px`)};

  circle {
    stroke: ${({ theme }) => theme.color.primary};
    stroke-width: ${({ size }) => (size ? `${(size * 8) / 50}px` : `8px`)};
    stroke-linecap: round;
    fill: none;
    animation: dash 1.5s ease-in-out infinite;
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
`

const Container = styled.div<Props>`
  display: flex;
  align-items: center;
  svg {
    height: ${({ size }) => `${size}px`};
    width: ${({ size }) => `${size}px`};
  }
`

export const ActivitySpinner: FC<Props> = ({ pending, className, size = 20 }) =>
  pending ? (
    <Container className={className} size={size}>
      <Spinner viewBox={`0 0 ${size} ${size}`} size={size}>
        <circle cx={size / 2} cy={size / 2} r={(size / 2) * 0.8} />
      </Spinner>
    </Container>
  ) : null
