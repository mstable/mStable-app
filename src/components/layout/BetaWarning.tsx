import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components';

const STORAGE_KEY = 'acknowledged-beta-warning';

const Container = styled.div`
  width: 100%;
  border: 1px ${({ theme }) => theme.color.redTransparent} solid;
  border-radius: 3px;
  padding: ${({ theme }) => theme.spacing.s};
  margin: ${({ theme }) => theme.spacing.m} 0;
  cursor: pointer;
`;

export const BetaWarning: FC<{}> = () => {
  const [hidden, setHidden] = useState(!!localStorage.getItem(STORAGE_KEY));
  const handleClick = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    } finally {
      setHidden(true);
    }
  }, [setHidden]);

  return hidden ? null : (
    <Container onClick={handleClick}>
      This project is in beta. Use at your own risk.
    </Container>
  );
};
