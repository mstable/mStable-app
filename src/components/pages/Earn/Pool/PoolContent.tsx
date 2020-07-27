import React, { FC } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { Card } from '../Card';
import { H2 } from '../../../core/Typography';
import { ButtonLink } from '../../../core/Button';
import { useCurrentStakingRewardsContract } from '../StakingRewardsContractProvider';
import { PoolForms } from './PoolForms';
import { PoolBalances } from './PoolBalances';

const BackLink = styled(ButtonLink)`
  background: transparent;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  > * {
    margin: 0 8px;
  }
  > :last-child {
    width: 58px;
  }
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  padding: 32px 16px;

  > * {
    padding-bottom: 32px;
  }
`;

const Container = styled.div`
  width: 100%;
`;

export const PoolContent: FC<{ address: string }> = ({
  address,
}) => {
  const stakingRewardsContract = useCurrentStakingRewardsContract();
  return (
    <Container>
      <Header>
        <BackLink href="/earn">Back</BackLink>
        {stakingRewardsContract ? (
          <H2>{stakingRewardsContract.title}</H2>
        ) : (
          <Skeleton />
        )}
        <div />
      </Header>
      <CardContainer>
        <Card address={address} />
      </CardContainer>
      <Content>
        <PoolBalances />
        <PoolForms address={address} />
      </Content>
    </Container>
  );
};
