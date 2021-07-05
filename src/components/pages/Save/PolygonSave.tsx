import React, { FC, useMemo, useState } from 'react'
import styled from 'styled-components'
import CountUp from 'react-countup'

import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider'
import { useNetworkPrices } from '../../../context/NetworkProvider'
import { useMtaPrice } from '../../../hooks/usePrice'
import { createStakingRewardsContext } from '../../../hooks/createStakingRewardsContext'

import { PageAction, PageHeader } from '../PageHeader'
import { OnboardingProvider } from './hooks'
import { ThemedSkeleton } from '../../core/ThemedSkeleton'
import { DailyApys } from '../../stats/DailyApys'
import { SaveStake } from './v2/SaveStake'
import { BigDecimal } from '../../../web3/BigDecimal'
import { useAvailableSaveApy } from '../../../hooks/useAvailableSaveApy'
import { calculateApy } from '../../../utils/calculateApy'

import { Tooltip } from '../../core/ReactTooltip'
import { TabCard } from '../../core/Tabs'
import { SaveRedeem } from './v2/SaveRedeem'
import { SaveDeposit } from './v2/SaveDeposit'
import { ViewportWidth } from '../../../theme'

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

const [useStakingRewards, StakingRewardsProvider] = createStakingRewardsContext()

const SaveBalance: FC = () => {
  const stakingRewards = useStakingRewards()
  const massetState = useSelectedMassetState()
  const saveApy = useAvailableSaveApy()

  // TODO get these from the rewardToken/platformToken in a generic way
  const mtaPrice = useMtaPrice()
  const networkPrice = useNetworkPrices()

  const balances = useMemo(() => {
    if (
      !stakingRewards ||
      !massetState ||
      !massetState.savingsContracts.v2.latestExchangeRate ||
      !massetState.savingsContracts.v2.token ||
      !mtaPrice ||
      !networkPrice.value
    )
      return []

    const rawBalance = massetState.savingsContracts.v2.token.balance ?? BigDecimal.ZERO
    const stakingBalance = stakingRewards.stakingBalance ?? BigDecimal.ZERO

    const exchangeRate = massetState.savingsContracts.v2.latestExchangeRate.rate
    const stakingTokenPrice = 1 / exchangeRate.simple
    // const totalSupply = stakingRewards.totalSupply
    const totalSupply = BigDecimal.parse('10000000000000000000')
    const rewardsApy = calculateApy(stakingTokenPrice, mtaPrice, stakingRewards.rewardRate, totalSupply) ?? 0
    const platformApy =
      calculateApy(stakingTokenPrice, networkPrice.value.nativeToken, stakingRewards.platformRewards?.platformRewardRate, totalSupply) ?? 0

    return [
      {
        name: 'yield',
        apy: saveApy.value,
        apyTip: 'This APY is derived from internal swap fees and lending markets, and is not reflective of future rates.',
        stakeLabel: 'Deposit stablecoins',
        balance: rawBalance.mulTruncate(exchangeRate.exact),
      },
      {
        name: 'rewards',
        apy: rewardsApy + platformApy,
        apyTip: 'This APY is derived from currently available staking rewards, and is not reflective of future rates.',
        stakeLabel: 'Stake imUSD',
        balance: stakingBalance.mulTruncate(exchangeRate.exact),
      },
    ]
  }, [massetState, stakingRewards, mtaPrice, networkPrice, saveApy])

  return (
    <div>
      {balances.map(({ balance, apy, apyTip, stakeLabel, name }) => (
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

  // const isNewUser = !hasUserDeposited && !hasUserStaked
  const isNewUser = true

  return (
    <OnboardingProvider>
      <StakingRewardsProvider stakingTokenAddress={saveToken?.address}>
        <PageHeader action={PageAction.Save} />
        {massetState ? (
          <Container>
            <Content>
              <Card>
                <div>
                  {isNewUser && <h2>The best passive savings account in DeFi.</h2>}
                  <SaveBalance />
                </div>
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
