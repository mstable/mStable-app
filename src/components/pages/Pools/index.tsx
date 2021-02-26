import React, { FC } from 'react';
import styled from 'styled-components';

import { Button } from '../../core/Button';
import { PageAction, PageHeader } from '../PageHeader';
import { Card } from './cards/Card';
import { OnboardingCard, OnboardType } from './cards/OnboardingCard';
import { AssetCard } from './cards/AssetCard';

const LoadMore = styled.h3`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.color.bodyAccent};
  font-weight: 600;
  margin: 1rem 2rem;
  text-align: center;
`;

const Cards = styled.div`
  > * {
    margin-bottom: 1rem;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

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

const Container = styled.div``;

export const Pools: FC = () => {
  return (
    <Container>
      <PageHeader
        action={PageAction.Pools}
        subtitle="Earn fees and ecosystem rewards"
      />
      <Row>
        <h2>Your Pools</h2>
        <div>
          <Button onClick={() => {}}>Explore Pools</Button>
          <Button highlighted onClick={() => {}}>
            Add Liquidity
          </Button>
        </div>
      </Row>
      <Cards>
        <Card>
          <LoadMore>Load more</LoadMore>
        </Card>
        <OnboardingCard type={OnboardType.Rewards} />
        <AssetCard
          tokenAddresses={[
            '0x0000000000085d4780b73119b644ae5ecd22b376',
            '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
          ]}
        />
      </Cards>
      {/* 
      <OnboardingCard type={OnboardType.Ecosystem} /> */}
    </Container>
  );
};
