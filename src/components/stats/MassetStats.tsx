import React, { FC } from 'react';
import styled from 'styled-components';

import { useSelectedMassetState } from '../../context/DataProvider/DataProvider';
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

export const MassetStats: FC = () => {
  const masset = useSelectedMassetState();
  return masset ? (
    <StatsContainer>
      <H2>Basket Stats</H2>
      <StatsRow>
        <StatsGraphic>
          <H3>{masset.token.symbol} basket share</H3>
          <BasketStats />
        </StatsGraphic>
        <StatsGraphicNull />
        <StatsGraphic>
          <H3>Total {masset.token.symbol} supply</H3>
          <CountUp end={masset.token.totalSupply.simple} />
        </StatsGraphic>
      </StatsRow>
      <AnalyticsLink />
    </StatsContainer>
  ) : null;
};
