import React, { FC } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { useMusdTotalSupply } from '../../context/DataProvider/DataProvider';
import { H3, H2 } from '../core/Typography';
import { CountUp } from '../core/CountUp';
import { BasketStats } from './BasketStats';
import { DataState } from '../../context/DataProvider/types';

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

export const MusdStats: FC<{ simulation?: DataState }> = ({ simulation }) => {
  const realTotalSupply = useMusdTotalSupply();
  // const simulatedTotalSupply = simulation?.mAsset.totalSupply;
  // const totalSupply = simulatedTotalSupply || realTotalSupply;
  return (
    <StatsContainer>
      <H2>Basket Stats</H2>
      <StatsRow>
        <StatsGraphic>
          <H3 borderTop>mUSD basket share</H3>
          <BasketStats simulation={simulation} />
        </StatsGraphic>
        <StatsGraphicNull />
        <StatsGraphic>
          <H3 borderTop>Total mUSD supply</H3>
          {realTotalSupply ? (
            <CountUp end={realTotalSupply.simple} decimals={2} />
          ) : (
            <Skeleton />
          )}
        </StatsGraphic>
      </StatsRow>
    </StatsContainer>
  );
};
