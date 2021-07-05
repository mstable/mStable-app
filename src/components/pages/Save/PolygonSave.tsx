import React, { FC, useMemo, useState } from 'react'
import styled from 'styled-components'

import CountUp from 'react-countup'
import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider'

import { PageAction, PageHeader } from '../PageHeader'
import { OnboardingProvider } from './hooks'
import { ThemedSkeleton } from '../../core/ThemedSkeleton'
import { DailyApys } from '../../stats/DailyApys'
import { SaveStake } from './v2/SaveStake'
import { BigDecimal } from '../../../web3/BigDecimal'
import { useAvailableSaveApy } from '../../../hooks/useAvailableSaveApy'
import { Tooltip } from '../../core/ReactTooltip'
import { TabCard } from '../../core/Tabs'
import { SaveRedeem } from './v2/SaveRedeem'
import { SaveDeposit } from './v2/SaveDeposit'

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
  justify-content: space-between;
  align-items: center;
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  margin-bottom: 1.25rem;
  position: relative;

  h2 {
    font-size: 1rem;
    line-height: 1.5rem;
    margin-bottom: 0.5rem;
    color: ${({ theme }) => (theme.isLight ? `#643e7c` : `#f5cbff`)};
  }

  p {
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  span {
    ${({ theme }) => theme.mixins.numeric};
    margin: 0 0.25rem;
    color: ${({ theme }) => (theme.isLight ? `#643e7c` : `#f5cbff`)};
  }

  &:before {
    content: '';
    position: absolute;
    background: ${({ theme }) => (theme.isLight ? `#e0cbee` : `#b880dd`)};
    left: 0;
    top: 1rem;
    bottom: 1rem;
    width: 2px;
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

const StyledCard = styled(TabCard)`
  max-width: 34rem;
  width: 100%;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 34rem;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const PolygonSave: FC = () => {
  const massetState = useSelectedMassetState()
  const saveToken = massetState?.savingsContracts?.v2?.token
  const saveExchangeRate = massetState?.savingsContracts?.v2?.latestExchangeRate?.rate
  const saveApy = useAvailableSaveApy()
  const [activeTab, setActiveTab] = useState<string>(Tabs.Deposit as string)

  const saveBalance = useMemo(() => {
    const balance = saveToken?.balance.mulTruncate(saveExchangeRate?.exact ?? BigDecimal.ONE.exact)
    return balance ?? BigDecimal.ZERO
  }, [saveExchangeRate, saveToken])

  return (
    <OnboardingProvider>
      <PageHeader action={PageAction.Save} />
      {massetState ? (
        <Container>
          <Content>
            <Card>
              <div>
                <h2>The best passive savings account in DeFi.</h2>
                <p>
                  {saveBalance?.simple > 0 ? (
                    <>
                      <CountUp end={saveBalance?.simple} decimals={2} prefix="$" />
                      {` currently earning`}
                    </>
                  ) : (
                    `Deposit to begin earning `
                  )}
                  <Tooltip tip="This APY is derived from internal swap fees and lending markets, and is not reflective of future rates.">
                    <span>{saveApy?.value.toFixed(2)}%</span>
                  </Tooltip>
                </p>
              </div>
              <Tooltip tip="30-day historical APY chart" hideIcon>
                <APYChart hideControls shimmerHeight={80} tick={false} aspect={3} color="#b880dd" strokeWidth={2} hoverEnabled={false} />
              </Tooltip>
            </Card>
            <StyledCard tabs={tabs} active={activeTab} onClick={setActiveTab} />
          </Content>
        </Container>
      ) : (
        <ThemedSkeleton height={400} />
      )}
    </OnboardingProvider>
  )
}
