import React, { FC } from 'react'
import styled from 'styled-components'

import { Table, TableCell, TableRow } from '../../../core/Table'
import { Button } from '../../../core/Button'
import { TokenIcon } from '../../../icons/TokenIcon'
import { CountUp } from '../../../core/CountUp'
import { useTokens } from '../../../../context/TokensProvider'
import { BigDecimal } from '../../../../web3/BigDecimal'

const TABLE_CELL_WIDTHS = [60, 40]

interface Props {
  canClaim?: boolean
  rewards?: {
    address: string
    amount: BigDecimal
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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const Container = styled.div``

export const MultiRewards: FC<Props> = ({ rewards, onClaimRewards, canClaim }) => {
  const headerTitles = ['Token', 'Earned'].map(t => ({ title: t }))
  // FIXME - replace with address
  const tokens = useTokens(['0x0000000000000000000000000000000000000000'])

  return (
    <Container>
      {rewards?.length ? (
        <Rewards>
          <Table headerTitles={headerTitles} widths={TABLE_CELL_WIDTHS} width={30}>
            {rewards.map(({ amount, address }) => {
              const token = tokens.find(v => v.address === address)
              return (
                <TableRow key={address}>
                  <TableCell width={TABLE_CELL_WIDTHS[0]}>
                    <Token>
                      <TokenIcon symbol={token?.symbol} hideNetwork />
                      <h3>{token?.symbol}</h3>
                    </Token>
                  </TableCell>
                  <TableCell width={TABLE_CELL_WIDTHS[2]}>
                    <CountUp end={amount?.simple} decimals={2} />
                  </TableCell>
                </TableRow>
              )
            })}
          </Table>
          {canClaim && (
            <Claim highlighted onClick={onClaimRewards}>
              Claim Rewards
            </Claim>
          )}
        </Rewards>
      ) : (
        <EmptyState>
          <h3>Stake your LP token balance to begin earning rewards</h3>
        </EmptyState>
      )}
    </Container>
  )
}
