import React, { FC } from 'react'
import styled from 'styled-components'
import { createToggleContext } from '../../../../hooks/createToggleContext'

import { ViewportWidth } from '../../../../theme'
import { Button } from '../../../core/Button'
import { useSelectedFeederPoolState } from '../FeederPoolProvider'

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 1rem;
  padding: 1rem;

  > button {
    width: 100%;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.color.body};
    margin-bottom: 0.75rem;
  }
`

const Container = styled(Card)`
  background: ${({ theme }) => theme.color.background[2]};
  flex-direction: column;
  align-items: center;
  padding: 1rem;

  > div:last-child {
    display: flex;
    height: 100%;
    align-items: center;
    margin-top: 1rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    align-items: flex-start;

    > div {
      margin-bottom: 0;
    }

    > button {
      width: inherit;
    }

    > div:last-child {
      margin-top: 0;
    }
  }
`

export const [useShowEarningPower, ShowEarningPower] = createToggleContext(false)

export const ProvideLiquidityMessage: FC = () => {
  const feederPool = useSelectedFeederPoolState()
  const [, setShowEarningPower] = useShowEarningPower()
  return (
    <Container>
      <div>
        <h3>Need {feederPool.token.symbol} tokens to stake?</h3>
        <p>Provide liquidity by depositing below, and stake to earn rewards and trade fees</p>
      </div>
      <div>
        <Button highlighted onClick={setShowEarningPower}>
          Calculate Boost
        </Button>
      </div>
    </Container>
  )
}
