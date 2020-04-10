import React, { FC } from 'react';
import styled from 'styled-components';

const Spinner = styled.svg`
  animation: rotate 2s linear infinite;
  width: 50px;
  height: 50px;

  circle {
    stroke: ${({ theme }) => theme.color.blue};
    stroke-width: 6px;
    stroke-linecap: round;
    fill: none;
    animation: dash 1.5s ease-in-out infinite;
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

export const ActivitySpinner: FC<{}> = () => (
   <Container>
     <Spinner viewBox="0 0 50 50">
       <circle cx="25" cy="25" r="20" />
     </Spinner>
   </Container>
 );
