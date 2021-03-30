import React, { FC } from 'react';
import styled from 'styled-components';

import { ViewportWidth } from '../../../../theme';
import { useSelectedFeederPoolState } from '../FeederPoolProvider';

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 1rem;
  padding: 1rem;

  > button {
    width: 100%;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.color.body};
    margin-bottom: 0.75rem;
  }
`;

const Container = styled(Card)`
  background: ${({ theme }) => theme.color.backgroundAccent};
  flex-direction: column;
  align-items: center;

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    align-items: flex-start;

    > div {
      margin-bottom: 0;
    }

    > button {
      width: inherit;
    }
  }
`;

export const ProvideLiquidityMessage: FC = () => {
  const feederPool = useSelectedFeederPoolState();
  return (
    <Container>
      <div>
        <h3>Need {feederPool.token.symbol} tokens to stake?</h3>
        <p>
          Provide liquidity by depositing below, and stake to earn rewards in
          addition to trade fees
        </p>
      </div>
    </Container>
  );
};
