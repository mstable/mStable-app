import React, { FC } from 'react';
import Styled from 'styled-components';

interface Props {
  value?: number;
  max?: number;
  color?: string;
}

const Container = Styled.div<{ color?: string }>`
  progress {
    margin-right: 8px;
  }

  progress[value] {
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
  }

  progress[value]::-webkit-progress-bar {
    height: 10px;
    border-radius: 20px;
    background-color: #eee;
  }  

  progress[value]::-webkit-progress-value {
    height: 10px;
    border-radius: 20px;
    background-color: ${props => props.color};
  }
`;

export const ProgressBar: FC<Props> = ({ value, max, color }) => {
  return (
    <Container color={color}>
      <progress value={value} max={max} />
    </Container>
  );
};
