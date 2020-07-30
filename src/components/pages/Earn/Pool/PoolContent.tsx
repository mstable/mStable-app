import React, { FC } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { Card } from '../Card';
import { H2 } from '../../../core/Typography';
import { ButtonLink } from '../../../core/Button';
import { useCurrentStakingRewardsContract } from '../StakingRewardsContractProvider';
import { PoolForms } from './PoolForms';
import { PoolBalances } from './PoolBalances';

const StyledH2 = styled(H2)`
  line-height: normal;
  text-align: center;
  padding: 0 8px;
`;

const BackLink = styled(ButtonLink)`
  background: transparent;
  padding: 4px 8px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;

  > :last-child {
    width: 60px;
  }
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  padding: 32px 0px;

  > * {
    padding-bottom: 32px;
  }
`;

const Container = styled.div`
  width: 100%;
`;

export const PoolContent: FC<{ address: string }> = ({ address }) => {
  const stakingRewardsContract = useCurrentStakingRewardsContract();
  return (
    <Container>
      <Header>
        <BackLink href="/earn">Back</BackLink>
        {stakingRewardsContract ? (
          <StyledH2>{stakingRewardsContract.title}</StyledH2>
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
