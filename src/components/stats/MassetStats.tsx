import React, { FC } from 'react'
import styled from 'styled-components'

import { useSelectedMassetState } from '../../context/DataProvider/DataProvider'
import { H3, H2 } from '../core/Typography'
import { CountUp } from '../core/CountUp'
import { BasketStats } from './BasketStats'
import { StatsLink } from '../pages/Stats/legacy/StatsLink'

const StatsGraphic = styled.div`
  width: 100%;
  padding-bottom: 20px;
`

const StatsContainer = styled.div`
  padding-top: 60px;
`

const StatsRow = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    flex-direction: row;
    justify-content: space-between;

    > div {
      flex-basis: calc(50% - 5%);
    }
  }
`

export const MassetStats: FC = () => {
  const masset = useSelectedMassetState()
  return masset ? (
    <StatsContainer>
      <H2>Basket Stats</H2>
      <StatsRow>
        <StatsGraphic>
          <H3>{masset.token.symbol} basket share</H3>
          <BasketStats />
        </StatsGraphic>
        <StatsGraphic>
          <H3>Total {masset.token.symbol} supply</H3>
          <CountUp end={masset.token.totalSupply.simple} />
        </StatsGraphic>
      </StatsRow>
      <StatsLink />
    </StatsContainer>
  ) : null
}
