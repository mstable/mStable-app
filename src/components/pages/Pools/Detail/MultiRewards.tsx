import React, { FC } from 'react'
import styled from 'styled-components'

import { RewardsEarned } from '../../../../hooks/createRewardsEarnedContext'

import { Table, TableCell, TableRow } from '../../../core/Table'
import { Button } from '../../../core/Button'
import { CountUp } from '../../../core/CountUp'
import { ThemedSkeleton } from '../../../core/ThemedSkeleton'
import { TokenIcon } from '../../../icons/TokenIcon'

const TABLE_CELL_WIDTHS = [60, 40]

interface Props {
  rewardsEarned: RewardsEarned
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

const headerTitles = ['Token', 'Earned'].map(t => ({ title: t }))

export const MultiRewards: FC<Props> = ({ rewardsEarned, onClaimRewards }) => {
  return (
    <Container>
      <Rewards>
        <Table headerTitles={headerTitles} widths={TABLE_CELL_WIDTHS}>
          {rewardsEarned.rewards.length ? (
            rewardsEarned.rewards.map(({ token, earned }) => (
              <TableRow key={token}>
                <TableCell width={TABLE_CELL_WIDTHS[0]}>
                  <Token>
                    <TokenIcon symbol={token} hideNetwork />
                    <h3>{token}</h3>
                  </Token>
                </TableCell>
                <TableCell width={TABLE_CELL_WIDTHS[2]}>
                  <CountUp end={earned?.simple ?? 0} decimals={4} />
                </TableCell>
              </TableRow>
            ))
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
        {rewardsEarned.canClaim && (
          <Claim highlighted onClick={onClaimRewards}>
            Claim Rewards
          </Claim>
        )}
      </Rewards>
    </Container>
  )
}
