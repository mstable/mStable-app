import React, { FC } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';
import { H3 } from '../core/Typography';
import { CountUp } from '../core/CountUp';
import { BasketStats } from './BasketStats';

interface Props {
  totalSupply: string | null;
}

const StatsGraphic = styled.div`
  width: 100%;
  flex-grow: 1;
  padding-bottom: 20px;
`;

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const MusdStats: FC<Props> = ({ totalSupply }) => (
  <StatsRow>
    <StatsGraphic>
      <H3 borderTop>mUSD basket share</H3>
      <BasketStats />
    </StatsGraphic>
    <StatsGraphic>
      <H3 borderTop>Total mUSD supply</H3>
      {totalSupply ? (
        <CountUp end={parseFloat(totalSupply)} decimals={2} />
      ) : (
        <Skeleton />
      )}
    </StatsGraphic>
  </StatsRow>
);
