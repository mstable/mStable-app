import React, { FC, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import type {
  FeederPoolState,
  MassetState,
} from '../../../context/DataProvider/types';

import { Button } from '../../core/Button';
import { PageAction, PageHeader } from '../PageHeader';
import { Card } from './cards/Card';
import { OnboardingCard } from './cards/OnboardingCard';
import { AssetCard } from './cards/AssetCard';
import { ViewportWidth } from '../../../theme';
import { useModalComponent } from '../../../hooks/useModalComponent';
import { RewardsModal } from './RewardsModal';
import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';
import { PoolType } from './types';

const DEFAULT_ITEM_COUNT = 3;

const LoadCard = styled(Card)`
  align-items: center;
  justify-content: center;

  h3 {
    font-size: 1.25rem;
    color: ${({ theme }) => theme.color.bodyAccent};
    font-weight: 600;
    text-align: center;
    flex: 1;
  }
`;

const Cards = styled.div`
  display: flex;
  flex-direction: column;

  > * {
    flex: 1;
    margin-bottom: 1rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;

    > * {
      flex: 0;
      margin-bottom: 1rem;
      flex-basis: calc(50% - 0.75rem);
    }
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  > div {
    margin-top: 1rem;

    button:not(:last-child) {
      margin-right: 1rem;
    }
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    > div {
      margin-top: 0;
    }
  }
`;

const Section = styled.div``;

const Container = styled.div`
  > ${Section}:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.color.accent};
    padding-bottom: 3rem;
    margin-bottom: 3rem;
  }
`;

const Title: Record<PoolType, string> = {
  [PoolType.User]: 'Your Pools',
  [PoolType.Active]: 'Active Pools',
  [PoolType.Deprecated]: 'Deprecated Pools',
};

const sections = [PoolType.User, PoolType.Active, PoolType.Deprecated];

const PoolsContent: FC = () => {
  const { feederPools } = useSelectedMassetState() as MassetState;
  const pools = useMemo(
    () =>
      Object.values(feederPools).reduce<{
        active: FeederPoolState[];
        user: FeederPoolState[];
        deprecated: FeederPoolState[];
      }>(
        (prev, current) => {
          if (current.token.balance?.exact.gt(0)) {
            return { ...prev, user: [...prev.user, current] };
          }
          // TODO determine deprecated somehow
          return { ...prev, active: [...prev.active, current] };
        },
        {
          user: [],
          active: [],
          deprecated: [],
        },
      ),
    [feederPools],
  );

  const [numPoolsVisible, setNumPoolsVisible] = useState({
    [PoolType.User]: DEFAULT_ITEM_COUNT,
    [PoolType.Active]: DEFAULT_ITEM_COUNT,
    [PoolType.Deprecated]: DEFAULT_ITEM_COUNT,
  });

  const [showRewardsModal] = useModalComponent({
    title: 'Rewards',
    children: <RewardsModal />,
  });

  const showMorePools = useCallback(
    (type: PoolType) =>
      setNumPoolsVisible({
        ...numPoolsVisible,
        [type]: numPoolsVisible[type] + 3,
      }),
    [numPoolsVisible],
  );

  const showPoolSection = (type: PoolType): boolean =>
    (type === PoolType.Deprecated && pools[type]?.length > 0) ||
    type !== PoolType.Deprecated;

  return (
    <>
      {sections.map(
        (type, index) =>
          showPoolSection(type) && (
            <Section key={type + index}>
              <Row>
                <h2>{Title[type]}</h2>
                {type === PoolType.User && (
                  <div>
                    {/* Probably move Rewards to top of screen / leave out */}
                    <Button onClick={showRewardsModal}>Rewards</Button>
                  </div>
                )}
              </Row>
              <Cards>
                <OnboardingCard type={type} />
                {pools[type]
                  .filter((_, i) => i < numPoolsVisible[type])
                  .map(({ address, masset, fasset }) => (
                    <AssetCard
                      key={address}
                      address={address}
                      deprecated={type === PoolType.Deprecated}
                    />
                  ))}
                {type === PoolType.User && pools[type]?.length === 0 && (
                  <Card>
                    <p>get yer self in a pool sonny</p>
                  </Card>
                )}
                {pools[type].length > numPoolsVisible[type] && (
                  <LoadCard
                    onClick={() => {
                      showMorePools(type);
                    }}
                  >
                    <div>Load more</div>
                  </LoadCard>
                )}
              </Cards>
            </Section>
          ),
      )}
    </>
  );
};

export const Pools: FC = () => {
  const massetState = useSelectedMassetState();
  return (
    <Container>
      <PageHeader
        action={PageAction.Pools}
        subtitle="Earn fees and ecosystem rewards"
      />
      {massetState ? <PoolsContent /> : <Skeleton height={500} />}
    </Container>
  );
};
