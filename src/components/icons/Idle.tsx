import React, { FC } from 'react';
import styled from 'styled-components';

import { useIsIdle } from '../../context/UserProvider';

const Container = styled.div<{ idle: boolean }>`
  position: relative;
  overflow: visible;
  ${({ idle }) =>
    idle
      ? `&:after {
    content: '';
    display: block;
    background: url('/icons/nightcap.png') no-repeat center center;
    background-size: contain;
    position: absolute;
    top: -20%;
    left: 10%;
    width: 100%;
    height: 100%;
  }`
      : ''}
`;

export const Idle: FC<{ className?: string }> = ({ children, className }) => (
  <Container className={className} idle={useIsIdle()}>
    {children}
  </Container>
);
