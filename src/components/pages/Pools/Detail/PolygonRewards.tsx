import React, { FC } from 'react'
import styled from 'styled-components'

import { Table, TableCell, TableRow } from '../../../core/Table'
import { Button } from '../../../core/Button'
import { TokenIcon } from '../../../icons/TokenIcon'

const TABLE_CELL_WIDTHS = [30, 30, 30]

const Claim = styled(Button)`
  width: 12rem;
`

const Rewards = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`

const Token = styled.div`
  display: flex;
  align-items: center;

  h3 {
    margin: 0;
    font-weight: 600;
  }

  > *:first-child {
    height: 2rem;
    width: 2rem;
    margin-right: 0.5rem;
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const Container = styled.div``

const MOCK_REWARDS = [
  {
    token: 'FRAX',
    balance: 12.23,
    apy: 12.03,
  },
  {
    token: 'MATIC',
    balance: 1,
    apy: 3.03,
  },
  {
    token: 'MTA',
    balance: 120,
    apy: 15.03,
  },
]

export const PolygonRewards: FC = () => {
  const hasRewards = !!MOCK_REWARDS.length
  const handleClaim = (): void => {}
  const headerTitles = ['Token', 'APY', 'Earned'].map(t => ({ title: t }))

  return (
    <Container>
      {hasRewards ? (
        <Rewards>
          <Table headerTitles={headerTitles} widths={TABLE_CELL_WIDTHS}>
            {MOCK_REWARDS.map(({ balance, token, apy }) => {
              return (
                <TableRow key={token}>
                  <TableCell width={TABLE_CELL_WIDTHS[0]}>
                    <Token>
                      <TokenIcon symbol={token} />
                      <h3>{token}</h3>
                    </Token>
                  </TableCell>
                  <TableCell width={TABLE_CELL_WIDTHS[1]}>{apy}%</TableCell>
                  <TableCell width={TABLE_CELL_WIDTHS[2]}>{balance.toFixed(2)}</TableCell>
                </TableRow>
              )
            })}
          </Table>
          <Claim highlighted onClick={handleClaim}>
            Claim Rewards
          </Claim>
        </Rewards>
      ) : (
        <EmptyState>
          <h3>Stake your LP token balance to begin earning rewards</h3>
        </EmptyState>
      )}
    </Container>
  )
}
