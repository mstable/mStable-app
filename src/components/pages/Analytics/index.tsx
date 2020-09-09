import React, { FC, useLayoutEffect } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import {
  useMusdTotalSupply,
  useTotalSavings,
} from '../../../context/DataProvider/DataProvider';
import { ReactComponent as AnalyticsIcon } from '../../icons/circle/analytics.svg';
import { DailyApys } from '../../stats/DailyApys';
import { BasketStats } from '../../stats/BasketStats';
import { H2, H3, P } from '../../core/Typography';
import { CountUp } from '../../core/CountUp';
import { VolumeChart } from '../../stats/VolumeChart';
import { AggregateChart } from '../../stats/AggregateChart';
import { PageHeader } from '../PageHeader';
import { Size } from '../../../theme';

const Section = styled.section`
  padding-bottom: 32px;
`;

const TotalSupply: FC<{}> = () => {
  const totalSupply = useMusdTotalSupply();
  return (
    <div>
      <H3 borderTop>Total supply</H3>
      {totalSupply ? (
        <CountUp end={totalSupply.simpleRounded} decimals={2} />
      ) : (
        <Skeleton height={50} />
      )}
    </div>
  );
};

const TotalSavings: FC<{}> = () => {
  const totalSavings = useTotalSavings();
  return (
    <div>
      <H3 borderTop>Total savings</H3>
      {totalSavings ? (
        <CountUp end={totalSavings.simpleRounded} decimals={2} />
      ) : (
        <Skeleton height={50} />
      )}
    </div>
  );
};

const NiceBigNumbers = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  > * {
    margin-right: 16px;
    width: 100%;
  }

  > :last-child {
    margin-right: 0;
  }
`;

const HistoricalApyContainer = styled.div`
  display: flex;
  justify-content: center;

  > div {
    width: 100%;
    > p {
      text-align: center;
    }
  }
`;

const HistoricalApy: FC<{}> = () => (
  <HistoricalApyContainer>
    <div>
      <DailyApys />
      <P size={Size.s}>
        <a
          href="https://docs.mstable.org/mstable-assets/massets/native-interest-rate#how-is-the-24h-apy-calculated"
          target="_blank"
          rel="noopener noreferrer"
        >
          Average daily APY over the past 7 days
        </a>
      </P>
    </div>
  </HistoricalApyContainer>
);

const BasketStatsContainer = styled.div`
  > :first-child {
    max-width: 400px;
    margin: 0 auto;
  }
`;

const ThirdPartySources = styled.ul`
  li {
    margin-bottom: 16px;
  }
`;

export const Analytics: FC<{}> = () => {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div>
      <PageHeader
        icon={<AnalyticsIcon />}
        title="Analytics"
        subtitle="Explore activity across mStable"
      />
      <Section id="save">
        <H2 borderTop>APY</H2>
        <HistoricalApy />
      </Section>
      <Section id="volumes">
        <H2 borderTop>Volumes</H2>
        <P size={Size.s}>All values in mUSD</P>
        <VolumeChart />
      </Section>
      <Section id="totals">
        <H2 borderTop>Totals</H2>
        <P size={Size.s}>All values in mUSD</P>
        <NiceBigNumbers>
          <TotalSupply />
          <TotalSavings />
        </NiceBigNumbers>
        <AggregateChart />
      </Section>
      <Section id="basket">
        <H2 borderTop>Basket share</H2>
        <BasketStatsContainer>
          <BasketStats />
        </BasketStatsContainer>
      </Section>
      <Section id="third-party">
        <H2 borderTop>Other sources</H2>
        <P>Learn more by exploring these third-party sources:</P>
        <ThirdPartySources>
          <li>
            <a
              href="https://etherscan.io/token/0xe2f2a5c287993345a840db3b0845fbc70f5935a5#tokenAnalytics"
              target="_blank"
              rel="noopener noreferrer"
            >
              mUSD on Etherscan
            </a>
          </li>
          <li>
            <a
              href="https://thegraph.com/explorer/subgraph/mstable/mstable-protocol"
              target="_blank"
              rel="noopener noreferrer"
            >
              mStable Subgraph explorer
            </a>
          </li>
        </ThirdPartySources>
      </Section>
    </div>
  );
};
