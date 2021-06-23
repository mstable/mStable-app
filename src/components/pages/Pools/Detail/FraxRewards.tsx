import React, { FC } from 'react'
import styled from 'styled-components'

import { Table, TableCell, TableRow } from '../../../core/Table'
import { Button } from '../../../core/Button'
import { TokenIcon } from '../../../icons/TokenIcon'
import { useFraxStakingContract, useFraxStakingState } from '../../../../context/FraxStakingProvider'
import { CountUp } from '../../../core/CountUp'
import { useTokens } from '../../../../context/TokensProvider'
import { usePropose } from '../../../../context/TransactionsProvider'
import { TransactionManifest } from '../../../../web3/TransactionManifest'
import { Interfaces } from '../../../../types'

const TABLE_CELL_WIDTHS = [60, 40]

// TODO: - replace with subscribedtoken when available
const MOCK_TOKENS: Record<string, string> = {
  '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0': 'MTA',
  '0x579cea1889991f68acc35ff5c3dd0621ff29b0c9': 'FXS',
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

export const FraxRewards: FC = () => {
  const { subscribed: fraxAccountData } = useFraxStakingState() ?? {}
  const contract = useFraxStakingContract()
  const propose = usePropose()

  const accountData = fraxAccountData?.value?.accountData
  const hasRewards = !!accountData?.earned.length
  const headerTitles = ['Token', 'Earned'].map(t => ({ title: t }))

  const handleClaim = (): void => {
    if (!contract) return
    propose<Interfaces.FraxStakingRewardsDual, 'getReward'>(
      new TransactionManifest(contract, 'getReward', [], {
        present: 'Claiming rewards',
        past: 'Claimed rewards',
      }),
    )
  }

  const tokens = useTokens(accountData?.earned?.map(v => v.address) ?? [])

  return (
    <Container>
      {hasRewards ? (
        <Rewards>
          <Table headerTitles={headerTitles} widths={TABLE_CELL_WIDTHS} width={48}>
            {accountData?.earned.map(({ address, amount }) => {
              const token = tokens.find(v => v.address === address)
              return (
                <TableRow key={address}>
                  <TableCell width={TABLE_CELL_WIDTHS[0]}>
                    <Token>
                      <TokenIcon symbol={token?.symbol ?? MOCK_TOKENS[address]} />
                      <h3>{token?.symbol ?? MOCK_TOKENS[address]}</h3>
                    </Token>
                  </TableCell>
                  <TableCell width={TABLE_CELL_WIDTHS[2]}>
                    <CountUp end={amount?.simple} decimals={2} />
                  </TableCell>
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
