import React, { FC } from 'react';
import styled from 'styled-components';

type Direction = 'up' | 'down' | 'left' | 'right';

export const Container = styled.div`
  align-items: center;
  display: flex;
  font-size: 1.25rem;
  justify-content: center;
  padding: 0.75rem;
  text-align: center;
  user-select: none;
`;

const ArrowIcon: Record<Direction, string> = {
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
};

export const Arrow: FC<{ direction?: Direction }> = ({
  direction = 'down',
}) => {
  return <Container>{ArrowIcon[direction]}</Container>;
};
