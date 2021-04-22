import React, { FC } from 'react'
import styled from 'styled-components'

import { Button } from '../core/Button'
import { AmountInputButton } from './AmountInputButton'

interface Props {
  slippageFormValue?: string
  handleSetSlippage(formValue?: string): void
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;

  > :first-child {
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    align-items: center;
    flex-direction: row;

    > :first-child {
      margin-bottom: 0;
      margin-right: 1rem;
    }
  }

  > :last-child {
    > *:not(:last-child) {
      margin-right: 0.5rem;
    }

    > * {
      ${({ theme }) => theme.mixins.numeric}
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      padding: 0.25rem;

      > * {
        font-size: 0.875rem;
      }

      @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
        min-width: 4rem;
        margin-bottom: 0;
      }
    }
  }
`

export const SlippageInput: FC<Props> = ({ handleSetSlippage, slippageFormValue }) => (
  <Container>
    <div>Max slippage</div>
    <div>
      <Button
        highlighted={slippageFormValue === '0.1'}
        onClick={() => {
          handleSetSlippage('0.1')
        }}
      >
        0.1%
      </Button>
      <Button
        highlighted={slippageFormValue === '0.5'}
        onClick={() => {
          handleSetSlippage('0.5')
        }}
      >
        0.5%
      </Button>
      <Button
        highlighted={slippageFormValue === '1'}
        onClick={() => {
          handleSetSlippage('1')
        }}
      >
        1%
      </Button>
      <AmountInputButton onChange={handleSetSlippage} value={slippageFormValue} max="100" min="0" />
    </div>
  </Container>
)
