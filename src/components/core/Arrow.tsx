import React, { FC } from 'react';
import styled from 'styled-components';

export const Container = styled.div`
  align-items: center;
  display: flex;
  font-size: 1.25rem;
  justify-content: center;
  padding: 0.75rem;
  text-align: center;
  user-select: none;
`;

export const Arrow: FC<{ direction?: 'up' | 'down' }> = ({
  direction = 'down',
}) => {
  const arrowIcon = direction === 'up' ? '↑' : '↓';
  return <Container>{arrowIcon}</Container>;
};
