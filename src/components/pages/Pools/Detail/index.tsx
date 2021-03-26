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

import { assetColorMapping, assetDarkColorMapping } from '../utils';
import { LiquidityChart } from './LiquidityChart';
import { RewardsOverview } from './RewardsOverview';
import { AssetDetails } from './AssetDetails';
import { UserLookup } from './UserLookup';
import { Mint } from './Mint';
import { Redeem } from './Redeem';
import {
  FeederPoolProvider,
  useSelectedFeederPoolState,
} from '../FeederPoolProvider';

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

  > div {
    flex: 1;
  }

  > div:last-child {
    overflow: hidden;
    display: none;
  }

  @media (min-width: ${ViewportWidth.l}) {
    justify-content: space-between;
    flex-direction: row;

    > div {
      flex: 0;
    }

    > div:first-child {
      flex-basis: calc(65% - 0.5rem);
    }

    > div:last-child {
      display: inherit;
      flex-basis: calc(35% - 0.5rem);

      > div {
        height: 100%;
      }
    }
  }
`;

// Pull out & make generic for message reuse
const Clippy = styled.div`
  border: 1px solid ${({ theme }) => theme.color.gold};
  padding: 1rem;
`;

const Aside = styled.div`
  padding: 0 1rem;
`;

const Exchange = styled.div`
  display: flex;

  > div:first-child {
    flex-basis: calc(60% - 0.5rem);
  }
  > div:last-child {
    flex-basis: calc(40% - 0.5rem);
  }
`;

const Container = styled.div`
  width: 100%;
`;

const PoolDetailContent: FC = () => {
  const { address, title } = useSelectedFeederPoolState() as FeederPoolState;

  const color = assetColorMapping[title];
  const darkColor = assetDarkColorMapping[title];

  const tabs = useMemo(
    () => ({
      Mint: {
        title: 'Mint',
        component: <Mint />,
      },
      Redeem: {
        title: 'Redeem',
        component: <Redeem />,
      },
    }),
    [],
  );

  const [activeTab, setActiveTab] = useState<string>('Mint');

  return (
    <Container>
      <PageHeader action={PageAction.Pools} subtitle={title} />
      <HeaderContainer>
        <HeaderCard poolAddress={address} isLarge color={color} />
        <LiquidityChart color={darkColor} />
      </HeaderContainer>
      <AssetDetails />
      <Divider />
      <UserLookup />
      <RewardsOverview />
      <Divider />
      <Exchange>
        <TabCard tabs={tabs} active={activeTab} onClick={setActiveTab} />
        <Aside>
          <Clippy>Hello, world</Clippy>
        </Aside>
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
      <PoolDetailContent />
    </FeederPoolProvider>
  ) : (
    <Skeleton height={300} />
  );
};
