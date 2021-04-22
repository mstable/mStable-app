import React, { FC, useCallback } from 'react'
import styled from 'styled-components'

import { Interfaces } from '../../../../types'
import { TransactionForm } from '../../../forms/TransactionForm'
import { CountUp } from '../../../core/CountUp'
import { TransactionManifest } from '../../../../web3/TransactionManifest'
import {
  useCurrentRewardsToken,
  useCurrentStakingToken,
  useCurrentStakingRewardsContractCtx,
  useRewardsEarned,
  useStakingRewardsContractState,
} from '../StakingRewardsContractProvider'
import { H3, P } from '../../../core/Typography'
import { StakeAmountInput } from '../../../forms/StakeAmountInput'
import { ThemedSkeleton } from '../../../core/ThemedSkeleton'

const Row = styled.div`
  width: 100%;
  padding-bottom: 16px;
`

const Input: FC = () => {
  const { stakingRewardsContract } = useStakingRewardsContractState()

  if (!stakingRewardsContract) {
    return <ThemedSkeleton height={300} />
  }

  return (
    <Row>
      <H3>Withdraw stake or exit</H3>
      <StakeAmountInput />
    </Row>
  )
}

const ExitFormConfirm: FC = () => {
  const { rewards } = useRewardsEarned()
  const rewardsToken = useCurrentRewardsToken()
  const stakingToken = useCurrentStakingToken()
  const {
    exit: { amount, isExiting },
  } = useStakingRewardsContractState()

  return (
    <div>
      {amount && rewardsToken && stakingToken && rewards ? (
        amount.exact.gt(0) ? (
          <>
            <P>
              This will return <CountUp end={amount.simpleRounded} decimals={2} suffix={` ${stakingToken.symbol}`} />
              {isExiting && rewards.exact.gt(0) ? (
                <>
                  {' '}
                  and claim rewards of <CountUp end={rewards.simpleRounded} decimals={6} suffix={` ${rewardsToken.symbol}`} />
                </>
              ) : null}
              .
            </P>
            {isExiting ? (
              <P>No more rewards will be earned in this pool until another stake is deposited.</P>
            ) : (
              <P>You will continue to earn rewards with your remaining stake.</P>
            )}
          </>
        ) : (
          <P>No staking balance.</P>
        )
      ) : (
        <ThemedSkeleton />
      )}
    </div>
  )
}

export const Exit: FC = () => {
  const contract = useCurrentStakingRewardsContractCtx()

  const {
    stakingRewardsContract: { title } = { title: 'pool' },
    exit: { amount, valid, isExiting },
  } = useStakingRewardsContractState()

  const createTransaction = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (formId: string): TransactionManifest<any, any> | void => {
      if (valid && contract && amount) {
        if (isExiting) {
          return new TransactionManifest<Interfaces.StakingRewards, 'exit'>(
            contract,
            'exit',
            [],
            {
              present: `Exiting ${title}`,
              past: `Exited ${title}`,
            },
            formId,
          )
        }

        const body = `stake of ${amount.format()} from ${title}`
        return new TransactionManifest<Interfaces.StakingRewards, 'withdraw'>(
          contract,
          'withdraw',
          [amount.exact],
          {
            present: `Withdrawing ${body}`,
            past: `Withdrew ${body}`,
          },
          formId,
        )
      }
    },
    [valid, contract, amount, isExiting, title],
  )

  return (
    <TransactionForm
      formId="exit"
      confirmLabel={isExiting ? 'Exit' : 'Withdraw'}
      confirm={<ExitFormConfirm />}
      createTransaction={createTransaction}
      input={<Input />}
      valid={valid}
    />
  )
}
