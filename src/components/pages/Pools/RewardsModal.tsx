import React, { FC } from 'react'
import styled from 'styled-components'
import { ViewportWidth } from '../../../theme'

import { Button } from '../../core/Button'

const Message = styled.div`
  padding: 1rem;
  border-radius: 1rem;
  font-size: 1rem;
  color: ${({ theme }) => theme.color.bodyAccent};
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  text-align: center;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;

  > button {
    margin-top: 1rem;
    height: 3rem;
  }

  > div:first-child {
    margin-bottom: 1rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    padding: 2rem;
  }
`

export const RewardsModal: FC = () => {
  // TODO real value
  return (
    <Container>
      <Message>When you provide liquidity to pools you earn MTA rewards.</Message>
      <Button
        highlighted
        onClick={() => {
          // TODO
          // eslint-disable-next-line no-alert
          alert('TODO claim')
        }}
      >
        Claim <span>12</span> MTA
      </Button>
    </Container>
  )
}
