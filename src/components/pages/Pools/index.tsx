import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components';

import { Button } from '../../core/Button';
import { PageAction, PageHeader } from '../PageHeader';
import { Card } from './cards/Card';
import { OnboardingCard } from './cards/OnboardingCard';
import { AssetCard } from './cards/AssetCard';
import { PoolType } from './types';
import { mockData, MockPoolData } from './mock';

const DEFAULT_ITEM_COUNT = 3;

const LoadCard = styled(Card)`
  align-items: center;
  justify-content: center;

  h3 {
    font-size: 1.25rem;
    color: ${({ theme }) => theme.color.bodyAccent};
    font-weight: 600;
    text-align: center;
    flex: 1;
  }
`;

const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  > * {
    margin-bottom: 1rem;
    flex-basis: calc(50% - 0.75rem);
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  > div {
    button:not(:last-child) {
      margin-right: 1rem;
    }
  }
`;

const Section = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.color.accent};
  padding-bottom: 3rem;
  margin-bottom: 3rem;
`;

const Container = styled.div``;

const Title: Record<PoolType, string> = {
  [PoolType.User]: 'Your Pools',
  [PoolType.Active]: 'Active Pools',
  [PoolType.Deprecated]: 'Deprecated Pools',
};

export const Pools: FC = () => {
  const {
    pools: { user, active, deprecated },
  } = mockData;

  const sections: Record<PoolType, MockPoolData[]> = {
    [PoolType.User]: user,
    [PoolType.Active]: active,
    [PoolType.Deprecated]: deprecated,
  };

  const [numPoolsVisible, setNumPoolsVisible] = useState({
    [PoolType.User]: DEFAULT_ITEM_COUNT,
    [PoolType.Active]: DEFAULT_ITEM_COUNT,
    [PoolType.Deprecated]: DEFAULT_ITEM_COUNT,
  });

  const showMorePools = useCallback(
    (type: PoolType) =>
      setNumPoolsVisible({
        ...numPoolsVisible,
        [type]: numPoolsVisible[type] + 3,
      }),
    [numPoolsVisible],
  );

  const handleExploreClick = (): void => {};
  const handleAddLiquidityClick = (): void => {};

  return (
    <Container>
      <PageHeader
        action={PageAction.Pools}
        subtitle="Earn fees and ecosystem rewards"
      />
      {Object.keys(sections).map((type) => {
        const section = sections[type as PoolType];
        return (
          <Section>
            <Row>
              <h2>{Title[type as PoolType]}</h2>
              {(type as PoolType) === PoolType.User && (
                <div>
                  <Button onClick={handleExploreClick}>Explore Pools</Button>
                  <Button highlighted onClick={handleAddLiquidityClick}>
                    Add Liquidity
                  </Button>
                </div>
              )}
            </Row>
            <Cards>
              <OnboardingCard type={(type as 'active' | 'user') ?? undefined} />
              {section
                .filter((_, i) => i < numPoolsVisible[type as PoolType])
                .map(({ tokenPair, address }) => (
                  <AssetCard
                    key={address}
                    address={address}
                    tokenPair={tokenPair}
                    deprecated={(type as PoolType) === PoolType.Deprecated}
                  />
                ))}
              {section.length > numPoolsVisible[type as PoolType] && (
                <LoadCard onClick={() => showMorePools(type as PoolType)}>
                  <h3>Load more</h3>
                </LoadCard>
              )}
            </Cards>
          </Section>
        );
      })}
    </Container>
  );
};
