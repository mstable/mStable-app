import React, { FC, useState } from 'react'
import styled from 'styled-components'
import CountUp from 'react-countup'

import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider'

import { DailyApys } from '../../stats/DailyApys'
import { ViewportWidth } from '../../../theme'
import { ThemedSkeleton } from '../../core/ThemedSkeleton'
import { Tooltip } from '../../core/ReactTooltip'
import { TabCard } from '../../core/Tabs'
import { PageAction, PageHeader } from '../PageHeader'

import { SaveRedeem } from './v2/SaveRedeem'
import { SaveDeposit } from './v2/SaveDeposit'
import { SaveStake } from './v2/SaveStake'
import { OnboardingProvider, useStakingRewards, StakingRewardsProvider } from './hooks'

enum Tabs {
  Deposit = 'Deposit',
  Redeem = 'Redeem',
  Stake = 'Stake',
}

const tabs = {
  [Tabs.Deposit]: {
    title: `Deposit`,
    component: <SaveDeposit />,
  },
  [Tabs.Redeem]: {
    title: `Redeem`,
    component: <SaveRedeem />,
  },
  [Tabs.Stake]: {
    title: `Stake`,
    component: <SaveStake />,
  },
}

const Card = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 1rem;
  padding: 1rem 0.5rem;
  margin-bottom: 1.25rem;
  position: relative;
  text-align: center;

  div:first-child {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h2 {
    font-size: 1.125rem;
    max-width: 20ch;
    line-height: 1.75rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => (theme.isLight ? `#643e7c` : `#f5cbff`)};
  }

  p {
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  span {
    color: ${({ theme }) => (theme.isLight ? `#643e7c` : `#f5cbff`)};
    &.numeric {
      ${({ theme }) => theme.mixins.numeric};
    }
  }

  > span:last-child {
    display: none;
  }

  @media (min-width: ${ViewportWidth.m}) {
    padding: 1rem 0.5rem 1rem 1.25rem;
    text-align: left;
    justify-content: space-between;

    div:first-child {
      align-items: flex-start;
    }

    h2 {
      font-size: 1rem;
      max-width: inherit;
      margin-bottom: 0.25rem;
    }

    &:before {
      content: '';
      position: absolute;
      background: ${({ theme }) => (theme.isLight ? `#e0cbee` : `#b880dd`)};
      left: 0;
      top: 1.25rem;
      bottom: 1.25rem;
      width: 2px;
    }

    > span:last-child {
      display: inherit;
    }
  }
`

const APYChart = styled(DailyApys)`
  position: relative;
  overflow: hidden;
  width: 8rem;
  border-radius: 0.5rem;
  padding: 0.5rem;
  transition: 0.5s;

  :hover {
    background: ${({ theme }) => theme.color.background[1]};
    cursor: pointer;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 34rem;
  width: 100%;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const InfoText = styled.p<{ large?: boolean }>`
  font-size: ${({ large }) => (large ? `1.125rem` : `1rem`)} !important;
  line-height: ${({ large }) => (large ? `2rem` : `1.5rem`)} !important;
`

const SaveBalance: FC = () => {
  const stakingRewards = useStakingRewards()

  const isNewUser = !stakingRewards.hasStakedBalance && !stakingRewards.hasUnstakedBalance

  return (
    <div>
      {isNewUser && <h2>The best passive savings account in DeFi.</h2>}
      {stakingRewards.rewards
        ?.filter(rewards => rewards.priority)
        .map(({ balance, apy, apyTip, stakeLabel, name }) => (
          <InfoText key={name}>
            {balance.exact.gt(0) ? 'Earning ' : `${stakeLabel} to earn `}
            <Tooltip tip={apyTip}>
              <span className="numeric">{apy.toFixed(2)}%</span> APY
            </Tooltip>
            &nbsp;{name}&nbsp;
            {balance.exact.gt(0) && (
              <>
                on <CountUp className="numeric" end={balance.simple} decimals={2} prefix="$" />
              </>
            )}
          </InfoText>
        ))}
    </div>
  )
}

export const PolygonSave: FC = () => {
  const massetState = useSelectedMassetState()

  const saveToken = massetState?.savingsContracts.v2.token
  const [activeTab, setActiveTab] = useState<string>(Tabs.Deposit as string)

  return (
    <OnboardingProvider>
      <StakingRewardsProvider stakingTokenAddress={saveToken?.address}>
        <PageHeader action={PageAction.Save} />
        {massetState ? (
          <Container>
            <Content>
              <Card>
                <SaveBalance />
                <Tooltip tip="30-day yield APY chart" hideIcon>
                  <APYChart hideControls shimmerHeight={80} tick={false} aspect={3} color="#b880dd" strokeWidth={1} hoverEnabled={false} />
                </Tooltip>
              </Card>
              <TabCard tabs={tabs} active={activeTab} onClick={setActiveTab} />
            </Content>
          </Container>
        ) : (
          <ThemedSkeleton height={400} />
        )}
      </StakingRewardsProvider>
    </OnboardingProvider>
  )
}
