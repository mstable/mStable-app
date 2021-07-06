import React, { FC } from 'react'
import styled from 'styled-components'

import { Table, TableCell, TableRow } from '../../../core/Table'
import { Button } from '../../../core/Button'
import { TokenIcon } from '../../../icons/TokenIcon'
import { CountUp } from '../../../core/CountUp'
import { BigDecimal } from '../../../../web3/BigDecimal'
import { ThemedSkeleton } from '../../../core/ThemedSkeleton'

const TABLE_CELL_WIDTHS = [60, 40]

interface Props {
  rewards: {
    symbol?: string
    amount?: BigDecimal
  }[]
  onClaimRewards?: () => void
}

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

const Container = styled.div``

export const MultiRewards: FC<Props> = ({ rewards, onClaimRewards }) => {
  const headerTitles = ['Token', 'Earned'].map(t => ({ title: t }))
  const canClaim = !!rewards?.find(v => (v?.amount?.simple ?? 0) > 0)

  return (
    <Container>
      <Rewards>
        <Table headerTitles={headerTitles} widths={TABLE_CELL_WIDTHS}>
          {rewards.length ? (
            rewards.map(({ symbol, amount }) => {
              return (
                <TableRow key={symbol}>
                  <TableCell width={TABLE_CELL_WIDTHS[0]}>
                    <Token>
                      <TokenIcon symbol={symbol} hideNetwork />
                      <h3>{symbol}</h3>
                    </Token>
                  </TableCell>
                  <TableCell width={TABLE_CELL_WIDTHS[2]}>
                    <CountUp end={amount?.simple ?? 0} decimals={2} />
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <TableRow key="BLANK">
              <TableCell width={80}>
                <ThemedSkeleton width={96} height={32} />
              </TableCell>
              <TableCell width={20}>
                <ThemedSkeleton width={64} height={32} />
              </TableCell>
            </TableRow>
          )}
        </Table>
        {canClaim && (
          <Claim highlighted onClick={onClaimRewards}>
            Claim Rewards
          </Claim>
        )}
      </Rewards>
    </Container>
  )
}
