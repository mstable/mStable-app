import React, { FC, useLayoutEffect } from 'react';
import styled from 'styled-components';

import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';
import { BasketStats } from '../../stats/BasketStats';
import { H2, H3, P } from '../../core/Typography';
import { CountUp } from '../../core/CountUp';
import { ThemedSkeleton } from '../../core/ThemedSkeleton';
import { VolumeChart } from '../../stats/VolumeChart';
import { AggregateChart } from '../../stats/AggregateChart';
import { PageAction, PageHeader } from '../PageHeader';
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
      <H3>Total supply</H3>
      {totalSupply ? (
        <CountUp prefix="$" end={totalSupply.simpleRounded} decimals={2} />
      ) : (
        <ThemedSkeleton height={50} />
      )}
    </div>
  );
};

const TotalSavings: FC<{ version: 'v1' | 'v2' }> = ({ version }) => {
  const massetState = useSelectedMassetState();
  const savingsContract = massetState?.savingsContracts[version];
  const exchangeRate = savingsContract?.latestExchangeRate?.rate.simple;
  const totalSavings = savingsContract?.totalSavings?.simple;
  const value =
    exchangeRate && totalSavings ? exchangeRate * totalSavings : undefined;
  return (
    <div>
      <H3>Total savings ({version})</H3>
      {value ? (
        <CountUp prefix="$" end={value} decimals={2} />
      ) : (
        <ThemedSkeleton height={50} />
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

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;

  > :first-child {
    padding-bottom: 0;
    padding-top: 0;
  }
`;

export const Analytics: FC = () => {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div>
      <PageHeader
        action={PageAction.Analytics}
        subtitle="Explore activity across mStable"
      />
      <Section id="save">
        <ToggleContainer>
          <H2>SAVE</H2>
          <ToggleSave />
        </ToggleContainer>
        <DailyApys />
      </Section>
      <Section id="volumes">
        <H2>Volumes</H2>
        <VolumeChart />
      </Section>
      <Section id="totals">
        <H2>Totals</H2>
        <NiceBigNumbers>
          <TotalSupply />
          <TotalSavings version="v1" />
          <TotalSavings version="v2" />
        </NiceBigNumbers>
        <AggregateChart />
      </Section>
      <Section id="basket">
        <H2>Basket share</H2>
        <BasketStatsContainer>
          <BasketStats />
        </BasketStatsContainer>
      </Section>
      <Section id="third-party">
        <H2>Other sources</H2>
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
