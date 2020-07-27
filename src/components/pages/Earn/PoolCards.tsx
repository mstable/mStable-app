import React, { FC } from 'react';
import styled from 'styled-components';

import { useStakingRewardsContracts } from '../../../context/earn/EarnDataProvider';
import { Slider } from '../../core/Slider';
import { ViewportWidth } from '../../../theme';
import { Card } from './Card';

const Container = styled.div`
  height: 300px;

  > div > div > div {
    margin: 0 auto;
    width: 360px;

    @media (min-width: ${ViewportWidth.m}) {
      transform: translateX(-50%);
    }

    > section {
      padding: 0 8px;
    }
  }
`;

export const PoolCards: FC<{}> = () => {
  const stakingRewardContracts = useStakingRewardsContracts();
  return (
    <Container>
      <Slider
        items={Object.keys(stakingRewardContracts).map(address => ({
          children: <Card address={address} linkToPool />,
          key: address,
        }))}
      />
    </Container>
  );
};
