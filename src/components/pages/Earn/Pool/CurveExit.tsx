import React, { FC, useCallback } from 'react'

import styled from 'styled-components'
import { Interfaces } from '../../../../types'
import { TransactionForm } from '../../../forms/TransactionForm'
import { CountUp } from '../../../core/CountUp'
import { ThemedSkeleton } from '../../../core/ThemedSkeleton'
import {
  useCurrentRewardsToken,
  useCurrentStakingToken,
  useRewardsEarned,
  useStakingRewardContractDispatch,
  useStakingRewardsContractState,
} from '../StakingRewardsContractProvider'
import { H3, P } from '../../../core/Typography'
import { StakeAmountInput } from '../../../forms/StakeAmountInput'
import { useCurveContracts } from '../../../../context/earn/CurveProvider'
import { Button } from '../../../core/Button'
import { Tabs } from '../types'
import { TransactionManifest } from '../../../../web3/TransactionManifest'

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
  const { rewards, platformRewards } = useRewardsEarned()
  const rewardsToken = useCurrentRewardsToken()
  const stakingToken = useCurrentStakingToken()
  const { setActiveTab } = useStakingRewardContractDispatch()
  const {
    exit: { amount, isExiting },
  } = useStakingRewardsContractState()

  return (
    <div>
      {amount && rewardsToken && stakingToken && rewards ? (
        amount.exact.gt(0) ? (
          <>
            <P>
              This will return <CountUp end={amount.simple} decimals={2} suffix={` ${stakingToken.symbol}`} />
              {rewards.exact.gt(0) && (
                <>
                  {' '}
                  and claim rewards of <CountUp end={rewards.simple} decimals={6} suffix=" MTA" />
                </>
              )}
              .
            </P>
            {platformRewards?.exact.gt(0) && (
              <>
                <P>
                  <CountUp end={platformRewards.simple} decimals={6} suffix=" CRV" /> must be claimed separately.
                </P>
                <Button
                  onClick={() => {
                    setActiveTab(Tabs.Claim)
                  }}
                >
                  Claim CRV
                </Button>
              </>
            )}
            {isExiting ? (
              <P>No more rewards will be earned in this pool until another stake is deposited.</P>
            ) : (
              <P>You will continue to earn rewards with your remaining stake.</P>
            )}
          </>
        ) : (
          <P>No staking balance.</P>
        )
      ) : null}
    </div>
  )
}

export const CurveExit: FC = () => {
  const { musdGauge } = useCurveContracts()

  const {
    stakingRewardsContract: { title } = { title: 'gauge' },
    exit: { amount, valid },
  } = useStakingRewardsContractState()

  const createTransaction = useCallback(
    (formId: string): TransactionManifest<Interfaces.CurveGauge, 'withdraw(uint256)'> | void => {
      if (valid && amount && musdGauge) {
        const body = `stake of ${amount.format()} from ${title}`
        return new TransactionManifest(
          musdGauge,
          'withdraw(uint256)',
          [amount.exact],
          {
            present: `Withdrawing ${body}`,
            past: `Withdrew ${body}`,
          },
          formId,
        )
      }
    },
    [valid, amount, musdGauge, title],
  )

  return (
    <TransactionForm
      formId="curveExit"
      confirmLabel="Withdraw"
      confirm={<ExitFormConfirm />}
      createTransaction={createTransaction}
      input={<Input />}
      valid={valid}
    />
  )
}
