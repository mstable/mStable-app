import React, { FC } from 'react';
import styled from 'styled-components';

import { Button } from '../../core/Button';
import { OnboardingCard, OnboardType } from '../../core/OnboardingCard';
import { PageAction, PageHeader } from '../PageHeader';

const Container = styled.div``;

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
      <OnboardingCard type={OnboardType.Rewards} />
      <OnboardingCard type={OnboardType.Ecosystem} />
    </Container>
  );
};
