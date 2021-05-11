import type { FC, ReactElement } from 'react'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import Skeleton from 'react-loading-skeleton'

import type { FeederPoolState, MassetState } from '../../../context/DataProvider/types'
import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider'
import { useSelectedMassetConfig, MassetConfig, MASSET_CONFIG } from '../../../context/MassetProvider'
import { useNetwork } from '../../../context/NetworkProvider'

import { PageAction, PageHeader } from '../PageHeader'
import { Card } from './cards/Card'
import { OnboardingCard } from './cards/OnboardingCard'
import { AssetCard, CustomAssetCard } from './cards/AssetCard'
import { ViewportWidth } from '../../../theme'
import { PoolType } from './types'

interface CustomAssetCardProps {
  isCustomAssetCard: boolean
  key: string
  title: string
  url: string
  color: string
  component: ReactElement
}

const DEFAULT_ITEM_COUNT = 4

const EmptyCard = styled(Card)`
  min-height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed ${({ theme }) => theme.color.defaultBorder};
`

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
`

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
      margin-bottom: 1.25rem;
      flex-basis: calc(50% - 0.75rem);
    }
  }
`

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
`

const Section = styled.div``

const Container = styled.div`
  > ${Section}:not(:last-child) {
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }
`

const Title: Record<PoolType, string> = {
  [PoolType.User]: 'Your Pools',
  [PoolType.Active]: 'Active Pools',
  [PoolType.Deprecated]: 'Deprecated Pools',
}

const sections = [PoolType.User, PoolType.Active, PoolType.Deprecated]

const CustomContent = styled.div`
  font-size: 1rem;
  max-width: 30ch;
  text-align: left;
  line-height: 1.5rem;
`

const customEarnCard = (massetConfig: MassetConfig): CustomAssetCardProps => ({
  isCustomAssetCard: true,
  key: 'earn',
  title: 'Earn Pools',
  url: `https://earn.mstable.org/#/${massetConfig.massetName}/earn`,
  color: '#eba062',
  component: <CustomContent>Deprecated pools are available here</CustomContent>,
})

const customPoolCard = (massetConfig: MassetConfig): CustomAssetCardProps => {
  const reversedMasset = massetConfig.massetName === 'musd' ? 'mbtc' : 'musd'
  const formattedReverse = MASSET_CONFIG[reversedMasset].formattedName
  return {
    isCustomAssetCard: true,
    key: 'mpool',
    title: `${formattedReverse} Pools`,
    url: `/${massetConfig.massetName === 'musd' ? 'mbtc' : 'musd'}/pools`,
    color: '#eee',
    component: <CustomContent>More pools available for {formattedReverse}</CustomContent>,
  }
}

const customNoPoolsCard = (massetConfig: MassetConfig, protocolName: string): CustomAssetCardProps => ({
  isCustomAssetCard: true,
  key: 'noPools',
  title: 'No Pools Available',
  color: '#eee',
  url: '/',
  component: (
    <CustomContent>
      There are no pools available for {massetConfig.formattedName} on {protocolName} at this time
    </CustomContent>
  ),
})

const PoolsContent: FC = () => {
  const { feederPools, hasFeederPools } = useSelectedMassetState() as MassetState
  const network = useNetwork()
  const massetConfig = useSelectedMassetConfig()
  const pools = useMemo(
    () =>
      Object.values(feederPools).reduce<{
        active: (FeederPoolState | CustomAssetCardProps)[]
        user: FeederPoolState[]
        deprecated: FeederPoolState[]
      }>(
        (prev, current) => {
          if (current.token.balance?.exact.gt(0) || current.vault.account?.rawBalance.exact.gt(0)) {
            return { ...prev, user: [...prev.user, current] }
          }
          // TODO determine deprecated somehow
          return { ...prev, active: [current, ...prev.active] }
        },
        {
          user: [],
          active: hasFeederPools
            ? [customEarnCard(massetConfig), customPoolCard(massetConfig)]
            : [customNoPoolsCard(massetConfig, network.protocolName)],
          deprecated: [],
        },
      ),
    [feederPools, massetConfig, hasFeederPools, network.protocolName],
  )

  const [numPoolsVisible, setNumPoolsVisible] = useState({
    [PoolType.User]: DEFAULT_ITEM_COUNT,
    [PoolType.Active]: DEFAULT_ITEM_COUNT,
    [PoolType.Deprecated]: DEFAULT_ITEM_COUNT,
  })

  const showMorePools = useCallback(
    (type: PoolType) =>
      setNumPoolsVisible({
        ...numPoolsVisible,
        [type]: numPoolsVisible[type] + 3,
      }),
    [numPoolsVisible],
  )

  const showPoolSection = (type: PoolType): boolean =>
    (type === PoolType.Deprecated && pools[type]?.length > 0) || type !== PoolType.Deprecated

  return (
    <>
      {sections.map(
        type =>
          showPoolSection(type) && (
            <Section key={type}>
              <Row>
                <h2>{Title[type]}</h2>
              </Row>
              <Cards>
                <OnboardingCard type={type} />
                {pools[type]
                  .filter((_, i) => i < numPoolsVisible[type])
                  .map(poolOrCard =>
                    (poolOrCard as CustomAssetCardProps).isCustomAssetCard ? (
                      <CustomAssetCard
                        key={(poolOrCard as CustomAssetCardProps).key}
                        title={poolOrCard.title}
                        url={(poolOrCard as CustomAssetCardProps).url}
                        color={(poolOrCard as CustomAssetCardProps).color}
                      >
                        {(poolOrCard as CustomAssetCardProps).component}
                      </CustomAssetCard>
                    ) : (
                      <AssetCard
                        key={(poolOrCard as FeederPoolState).address}
                        poolAddress={(poolOrCard as FeederPoolState).address}
                        deprecated={type === PoolType.Deprecated}
                      />
                    ),
                  )}
                {type === PoolType.User && pools[type]?.length === 0 && (
                  <EmptyCard>
                    <p>No user pools found</p>
                  </EmptyCard>
                )}
                {pools[type].length > numPoolsVisible[type] && (
                  <LoadCard
                    onClick={() => {
                      showMorePools(type)
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
  )
}

export const Pools: FC = () => {
  const massetState = useSelectedMassetState()
  return (
    <Container>
      <PageHeader action={PageAction.Pools} subtitle="Earn fees and ecosystem rewards" />
      {massetState ? <PoolsContent /> : <Skeleton height={500} />}
    </Container>
  )
}
