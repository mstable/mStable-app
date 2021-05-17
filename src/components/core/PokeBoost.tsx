import React, { FC } from 'react'
import styled from 'styled-components'
import { ViewportWidth } from '../../theme'
import { Button } from './Button'

const Container = styled.div`
  display: flex;
  border: 1px dashed ${({ theme }) => theme.color.defaultBorder};
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  flex-direction: row;

  > *:not(:last-child) {
    margin-right: 2rem;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  div:first-child {
    /* flex-basis: 25%; */
    flex-shrink: 0;

    > *:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }

  *:not(:first-child):not(:last-child) {
    background: red;
  }

  div:last-child {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
    width: 100%;

    > *:not(:last-child) {
      margin-right: 0.5rem;
    }

    > *:last-child {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    div:last-child {
      flex-direction: row;
    }
  }
`

export const PokeBoost: FC = () => {
  return (
    <Container>
      <div>
        <h3>Boosted APY</h3>
        <p>23%!</p>
      </div>
      <div>
        <p>
          <b>Your boost is out of sync.</b> Poke the contract or claim rewards to earn a higher reward rate.
        </p>
        <div>
          <Button onClick={() => {}}>Claim Rewards</Button>
          <Button onClick={() => {}}>Poke</Button>
        </div>
      </div>
    </Container>
  )
}
