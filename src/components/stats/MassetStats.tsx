import React, { FC } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { useMassetTotalSupply } from '../../context/DataProvider/DataProvider';
import { useSelectedMasset } from '../../context/MassetsProvider';
import { H3, H2 } from '../core/Typography';
import { CountUp } from '../core/CountUp';
import { BasketStats } from './BasketStats';
import { AnalyticsLink } from '../pages/Analytics/AnalyticsLink';

const StatsGraphic = styled.div`
  width: 100%;
  flex-grow: 1;
  padding-bottom: 20px;
`;

const StatsGraphicNull = styled.div`
  width: 10%;
  flex-grow: 0;
  padding-bottom: 20px;
`;

const StatsContainer = styled.div`
  padding-top: 60px;
`;

const StatsRow = styled.div`
  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    display: flex;
    justify-content: space-between;
  }
`;

export const MassetStats: FC<{}> = () => {
  const { name } = useSelectedMasset();
  const totalSupply = useMassetTotalSupply();
  return (
    <StatsContainer>
      <H2>Basket Stats</H2>
      <StatsRow>
        <StatsGraphic>
          <H3 borderTop>{name} basket share</H3>
          <BasketStats />
        </StatsGraphic>
        <StatsGraphicNull />
        <StatsGraphic>
          <H3 borderTop>Total {name} supply</H3>
          {totalSupply ? (
            <CountUp end={totalSupply.simple} decimals={2} />
          ) : (
            <Skeleton />
          )}
        </StatsGraphic>
      </StatsRow>
      <AnalyticsLink />
    </StatsContainer>
  );
};
