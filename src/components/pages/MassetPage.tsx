import React, { FC } from 'react';
import styled from 'styled-components';

import { MassetState } from '../../context/DataProvider/types';
import { useSelectedMassetState } from '../../context/DataProvider/DataProvider';

import { SimpleMassetStats } from '../stats/SimpleMassetStats';

const MassetAsideContainer = styled.aside`
  padding: 1rem;
  border-radius: 0.75rem;
  flex-shrink: 1;
  height: auto;

  ${({ theme }) => `
    background: ${theme.color.backgroundAccent};
  `}

  > h3 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  > p {
    font-size: 0.875rem;
    line-height: 1.2rem;
    margin-bottom: 1rem;
  }
`;

const description = {
  mBTC:
    'mStable mBTC is a meta-stablecoin based on tokenised Bitcoin, with a weight-limited basket of assets and a native interest rate.',
  mUSD:
    'mStable mUSD is a meta-stablecoin based on USD, with with a weight-limited basket of assets, 1:1 zero-slippage swaps and a high native interest rate.',
};

const MassetAside: FC = () => {
  const massetState = useSelectedMassetState() as MassetState;
  return (
    <MassetAsideContainer>
      <h3>About {massetState.token.symbol}</h3>
      <p>{description[massetState.token.symbol as keyof typeof description]}</p>
      <SimpleMassetStats />
    </MassetAsideContainer>
  );
};

const Separator = styled.div`
  height: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.color.accent};
  width: 100%;
  padding-bottom: 2rem;
  margin-bottom: 2rem;

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    display: none;
  }
`;

const Inner = styled.div`
  @media (min-width: ${({ theme }) => theme.viewportWidth.l}) {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    justify-content: space-between;
    align-items: flex-start;

    > :first-child {
      flex-basis: 70%;
    }

    > :last-child {
      flex-basis: 30%;
      min-width: 12rem;
    }
  }
`;

const MigrationOverlay = styled.div`
  * {
    cursor: not-allowed;
    pointer-events: none;
  }

  opacity: 0.75;
  background: ${({ theme }) => theme.color.background};
  z-index: 4;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
`;

const Container = styled.div`
  position: relative;
`;

export const MassetPage: FC<{ asideVisible?: boolean }> = ({
  children,
  asideVisible,
}) => {
  const { undergoingRecol } = useSelectedMassetState() ?? {};
  return (
    <Container>
      {undergoingRecol && <MigrationOverlay />}
      {asideVisible ? (
        <Inner>
          <div>{children}</div>
          <Separator />
          <MassetAside />
        </Inner>
      ) : (
        <div>{children}</div>
      )}
    </Container>
  );
};
