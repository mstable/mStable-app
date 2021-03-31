import React, { useMemo, useState } from 'react';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useToggle } from 'react-use';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import type { FeederPoolState } from '../../../../context/DataProvider/types';
import { useFeederPool } from '../../../../context/DataProvider/DataProvider';

import { ViewportWidth } from '../../../../theme';
import { TabCard } from '../../../core/Tabs';
import { Button, UnstyledButton } from '../../../core/Button';
import { PageHeader, PageAction } from '../../PageHeader';
import { AssetCard } from '../cards/AssetCard';

import { assetColorMapping } from '../constants';
import { LiquidityChart } from './LiquidityChart';
import { AssetDetails } from './AssetDetails';
import { PoolComposition } from './PoolComposition';
import { Deposit } from './Deposit';
import { Withdraw } from './Withdraw';
import {
  FeederPoolProvider,
  useSelectedFeederPoolState,
} from '../FeederPoolProvider';
import { RewardStreamsProvider } from './useRewardStreams';
import { Overview } from './Overview';
import { useSelectedMassetPrice } from '../../../../hooks/usePrice';
import { UserLookup } from './UserLookup';

const HeaderChartsContainer = styled.div`
  position: relative;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 1rem;
  overflow: hidden;

  > :last-child {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    padding: 1rem;
    justify-content: space-between;
    pointer-events: none;

    > h3 {
      font-weight: 600;
      font-size: 1.25rem;
    }

    > :last-child {
      pointer-events: auto;
      height: 2rem;
      width: 2rem;
      padding: 0;
      line-height: 2rem;
    }
  }
`;

const HeaderCharts: FC<{ color: string }> = ({ color }) => {
  const [isLiquidity, toggleIsLiquidity] = useToggle(true);
  return (
    <HeaderChartsContainer>
      <div>
        {isLiquidity ? <LiquidityChart color={color} /> : <PoolComposition />}
      </div>
      <div>
        <h3>{isLiquidity ? 'Liquidity' : 'Pool Composition'}</h3>
        <Button onClick={toggleIsLiquidity}>{isLiquidity ? '↩' : '↪'}</Button>
      </div>
    </HeaderChartsContainer>
  );
};

const HeaderCard = styled(AssetCard)`
  h2 {
    font-size: 1.75rem;
  }
`;

const HeaderContainer = styled.div`
  > div:last-child {
    display: none;
  }

  @media (min-width: ${ViewportWidth.m}) {
    > div:last-child {
      margin-top: 1rem;
      display: block;
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    display: flex;
    justify-content: space-between;
    flex-direction: row;

    > div {
      flex: 1;
    }

    > div:first-child {
      min-width: calc(65% - 2rem);
      margin-right: 1rem;
    }

    > div:last-child {
      margin-top: 0;
    }
  }
`;

// Pull out & make generic for message reuse
const Clippy = styled.div`
  border: 1px rgba(255, 179, 52, 0.2) solid;
  background: ${({ theme }) =>
    theme.isLight ? 'rgba(255, 253, 245, 0.3)' : 'none'};
  border-radius: 1rem;
  padding: 1rem;
  color: ${({ theme }) => theme.color.offYellow};

  > *:not(:last-child) {
    margin-bottom: 1rem;
  }

  h4 {
    font-weight: 600;
    font-size: 1rem;
  }

  p {
    font-size: 0.875rem;

    span {
      font-weight: 600;
    }

    > button {
      color: ${({ theme }) => theme.color.blue};
      font-weight: 600;
    }
  }
`;

const Exchange = styled.div`
  display: flex;
  flex-direction: column;

  > div:not(:last-child) {
    margin-bottom: 1rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    > div:not(:last-child) {
      margin-bottom: 0;
    }

    > div:first-child {
      flex-basis: calc(65% - 0.5rem);
    }
    > div:last-child {
      flex-basis: calc(35% - 0.5rem);
    }
  }
`;

const Container = styled.div`
  width: 100%;

  > div:not(:first-child):not(:last-child) {
    margin-bottom: 1.5rem;
  }
`;

const PoolDetailContent: FC = () => {
  const {
    address,
    title,
    liquidity,
  } = useSelectedFeederPoolState() as FeederPoolState;
  const massetPrice = useSelectedMassetPrice();

  const [readMore, setReadMore] = useToggle(false);

  const color = assetColorMapping[title];
  const isLowLiquidity = massetPrice
    ? liquidity.simple * massetPrice < 100000
    : false;

  const tabs = useMemo(
    () => ({
      Deposit: {
        title: 'Deposit',
        component: <Deposit exactOnly={isLowLiquidity} />,
      },
      Withdraw: {
        title: 'Withdraw',
        component: <Withdraw isLowLiquidity={isLowLiquidity} />,
      },
    }),
    [isLowLiquidity],
  );

  const [activeTab, setActiveTab] = useState<string>('Deposit');

  return (
    <Container>
      <PageHeader action={PageAction.Pools} subtitle={title} />
      <HeaderContainer>
        <HeaderCard poolAddress={address} isLarge color={color} />
        <HeaderCharts color={color} />
      </HeaderContainer>
      <AssetDetails />
      <Overview />
      <Exchange>
        <TabCard tabs={tabs} active={activeTab} onClick={setActiveTab} />
        <Clippy>
          <h4>Using mStable Feeder Pools</h4>
          <p>
            Feeder Pools offer a way to earn with your assets with{' '}
            <span>low impermanent loss risk.</span>
            {!readMore && (
              <UnstyledButton onClick={setReadMore}>Read more</UnstyledButton>
            )}
          </p>
          {readMore && (
            <>
              <p>
                Liquidity providers passively gain yield from swap fees and also
                earn MTA rewards.
              </p>
              <p>
                You can <span>multiply your rewards</span> in mStable pools by
                staking MTA.
              </p>
              <p>
                Claiming rewards will send 20% → 33% of the unclaimed amount to
                you immediately, with the rest safely locked in a stream vesting
                linearly and finishing 26 weeks from the time at which you
                claimed.
              </p>
              <p>
                When streams are unlocked, these rewards are sent to you in full
                along with unclaimed earnings.
              </p>
            </>
          )}
        </Clippy>
      </Exchange>
      <UserLookup />
    </Container>
  );
};

export const PoolDetail: FC = () => {
  const { poolAddress } = useParams<{
    poolAddress: string;
  }>();
  const feederPool = useFeederPool(poolAddress);
  return feederPool ? (
    <FeederPoolProvider poolAddress={poolAddress}>
      <RewardStreamsProvider>
        <PoolDetailContent />
      </RewardStreamsProvider>
    </FeederPoolProvider>
  ) : (
    <Skeleton height={300} />
  );
};
