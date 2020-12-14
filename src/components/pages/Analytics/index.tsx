import React, { FC, useLayoutEffect } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';
import { BasketStats } from '../../stats/BasketStats';
import { H2, H3, P } from '../../core/Typography';
import { CountUp } from '../../core/CountUp';
import { VolumeChart } from '../../stats/VolumeChart';
import { AggregateChart } from '../../stats/AggregateChart';
import { PageHeader } from '../PageHeader';
import { Size } from '../../../theme';
import { DailyApys } from '../../stats/DailyApys';
import { ToggleSave } from '../Save/ToggleSave';
import { useSelectedSavingsContractState } from '../../../context/SelectedSaveVersionProvider';

const Section = styled.section`
  padding-bottom: 32px;
`;

const TotalSupply: FC = () => {
  const massetState = useSelectedMassetState();
  const totalSupply = massetState?.token.totalSupply;
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

const TotalSavings: FC = () => {
  const savingsContractState = useSelectedSavingsContractState();
  const totalSavings = savingsContractState?.totalSavings;
  // // eslint-disable-next-line no-console
  // console.log('totalSavings', totalSavings);
  // const totalSavings = massetState?.savingsContracts?.v1?.totalSavings;
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

const ToggleContainer = styled.div<{ borderTop?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ theme, borderTop }) => (borderTop ? theme.mixins.borderTop : '')}
`;

export const Analytics: FC = () => {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Explore activity across mStable"
      />
      <Section id="save">
        <ToggleContainer borderTop>
          <H2>SAVE</H2>
          <ToggleSave />
        </ToggleContainer>
        <DailyApys />
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
