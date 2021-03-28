import React, { useMemo, useState } from 'react';
import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import type { FeederPoolState } from '../../../../context/DataProvider/types';
import { useFeederPool } from '../../../../context/DataProvider/DataProvider';

import { ViewportWidth } from '../../../../theme';
import { TabCard } from '../../../core/Tabs';
import { PageHeader, PageAction } from '../../PageHeader';
import { AssetCard } from '../cards/AssetCard';

import { assetColorMapping } from '../constants';
import { LiquidityChart } from './LiquidityChart';
import { UserPosition } from './UserPosition';
import { AssetDetails } from './AssetDetails';
import { UserLookup } from './UserLookup';
import { Deposit } from './Deposit';
import { Withdraw } from './Withdraw';
import {
  FeederPoolProvider,
  useSelectedFeederPoolState,
} from '../FeederPoolProvider';
import { RewardStreamsProvider } from './useRewardStreams';

const Divider = styled.div`
  height: 1px;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.color.accent};
  margin: 1.5rem 0;
`;

const HeaderCard = styled(AssetCard)`
  h2 {
    font-size: 1.75rem;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;

  > div {
    flex: 1;
  }

  > div:last-child {
    display: none;
  }

  @media (min-width: ${ViewportWidth.m}) {
    > div:last-child {
      display: block;
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    justify-content: space-between;
    flex-direction: row;

    > div:first-child {
      min-width: calc(65% - 2rem);
      margin-right: 1rem;
    }

    > div:last-child {
      > div {
        height: 100%;
      }
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
  color: ${({ theme }) =>
    theme.isLight ? 'rgba(102, 88, 72, 0.8)' : 'rgba(194, 174, 152, 1)'};

  > *:not(:last-child) {
    margin-bottom: 1rem;
  }

  h4 {
    font-weight: 600;
    font-size: 1rem;
  }

  p {
    span {
      font-weight: 600;
    }
  }
`;

const Exchange = styled.div`
  display: flex;

  > div:first-child {
    flex-basis: calc(60%);
    margin-right: 1rem;
  }
  > div:last-child {
    flex-basis: calc(40%);
  }
`;

const Row = styled.div`
  > * {
    margin-bottom: 1rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
  @media (min-width: ${ViewportWidth.l}) {
    display: flex;
    justify-content: space-between;
    > * {
      margin-bottom: 0;
      margin-right: 1rem;
      &:last-child {
        margin-right: 0;
      }
    }
  }
`;

const Container = styled.div`
  width: 100%;
`;

const PoolDetailContent: FC = () => {
  const { address, title } = useSelectedFeederPoolState() as FeederPoolState;

  const darkColor = assetColorMapping[title];

  const tabs = useMemo(
    () => ({
      Deposit: {
        title: 'Deposit',
        component: <Deposit />,
      },
      Withdraw: {
        title: 'Withdraw',
        component: <Withdraw />,
      },
    }),
    [],
  );

  const [activeTab, setActiveTab] = useState<string>('Deposit');

  return (
    <Container>
      <PageHeader action={PageAction.Pools} subtitle={title} />
      <HeaderContainer>
        <HeaderCard poolAddress={address} isLarge color={darkColor} />
        <LiquidityChart color={darkColor} />
      </HeaderContainer>
      <Row>
        <AssetDetails />
        <UserLookup />
      </Row>
      <Divider />
      <UserPosition />
      <Divider />
      <Exchange>
        <TabCard tabs={tabs} active={activeTab} onClick={setActiveTab} />
        <div>
          <Clippy>
            <h4>Using mStable Feeder Pools</h4>
            <p>
              Feeder Pools offer a way to earn with your assets{' '}
              <span>without exposure to impermanent loss.</span>
            </p>
            <p>
              Liquidity providers passively gain yield from swap fees and also
              earn MTA rewards.
            </p>
            <p>
              You can <span>multiply your rewards</span> across{' '}
              <span>all pools</span> (and Save) by staking MTA.
            </p>
            <p>
              Rewards are streamed to you at a constant rate, and can be claimed
              at any time.
            </p>
            <p>
              Claiming rewards will send 20% of the unclaimed amount to you
              immediately, with the rest safely locked in a future stream that
              starts 26 weeks afterwards.
            </p>
            <p>
              When streams are unlocked, these rewards are sent to you in full
              along with unclaimed earnings.
            </p>
          </Clippy>
        </div>
      </Exchange>
    </Container>
  );
};

// TODO support more than just feeders
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
