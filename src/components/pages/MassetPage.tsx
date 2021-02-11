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
    font-size: 0.85rem;
    line-height: 1.2rem;
    margin-bottom: 1rem;
  }
`;

const description = {
  // TODO token descriptions
  mBTC: 'mBTC is a pretty sweet token ngl, you should mint some maybe',
  mUSD: "mUSD? More like I'm-a-use-these amirite",
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

const Container = styled.div`
  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    justify-content: space-between;
    align-items: flex-start;

    > :first-child {
      flex-basis: 75%;
    }

    > :last-child {
      flex-basis: 25%;
      min-width: 12rem;
    }
  }
`;

export const MassetPage: FC = ({ children }) => {
  return (
    <Container>
      <div>{children}</div>
      <Separator />
      <MassetAside />
    </Container>
  );
};
