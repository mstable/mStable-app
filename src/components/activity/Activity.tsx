import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const Container = styled.div`
  background: ${props => props.theme.color.blue};
  width: 16px;
  height: 16px;
  animation: ${rotate} 1s linear infinite;
`;

/**
 * Component to show app activity such as pending transactions.
 * @TODO design and content
 */
export const Activity: FC<{}> = () => <Container />;
