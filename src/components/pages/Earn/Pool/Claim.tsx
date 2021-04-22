import React, { FC, useCallback } from 'react'
import styled from 'styled-components'

import { Interfaces } from '../../../../types'
import { useRewardsEarned, useCurrentRewardsToken, useCurrentStakingRewardsContractCtx } from '../StakingRewardsContractProvider'
import { CountUp } from '../../../core/CountUp'
import { H3, P } from '../../../core/Typography'
import { TransactionForm } from '../../../forms/TransactionForm'
import { TransactionManifest } from '../../../../web3/TransactionManifest'

const Row = styled.div`
  width: 100%;
  padding-bottom: 16px;
`

const Input: FC = () => {
  const { rewards } = useRewardsEarned()
  const rewardsToken = useCurrentRewardsToken()

  return (
    <Row>
      <H3>Claim rewards</H3>
      <div>
        {rewardsToken && rewards?.exact.gt(0) ? (
          <>
            Claim <CountUp end={rewards?.simpleRounded} decimals={6} suffix={` ${rewardsToken.symbol}`} />.
          </>
        ) : (
          'No rewards to claim.'
        )}
      </div>
    </Row>
  )
}

const Confirm: FC = () => {
  const { rewards } = useRewardsEarned()
  const rewardsToken = useCurrentRewardsToken()

  return rewardsToken && rewards?.exact.gt(0) ? (
    <>
      <P>
        <CountUp end={rewards.simpleRounded} decimals={6} suffix={` ${rewardsToken.symbol}`} /> will be claimed.
      </P>
      <P>You will continue to earn any available rewards with your staked balance.</P>
    </>
  ) : null
}

export const Claim: FC = () => {
  const { rewards } = useRewardsEarned()

  const contract = useCurrentStakingRewardsContractCtx()

  const valid = !!rewards?.exact.gt(0)

  const createTransaction = useCallback(
    (formId: string): TransactionManifest<Interfaces.StakingRewards, 'claimReward'> | void => {
      if (valid && contract) {
        return new TransactionManifest(
          contract,
          'claimReward',
          [],
          {
            present: 'Claiming rewards',
            past: 'Claimed rewards',
          },
          formId,
        )
      }
    },
    [valid, contract],
  )

  return (
    <TransactionForm
      formId="claim"
      confirmLabel="Claim"
      input={<Input />}
      confirm={<Confirm />}
      valid={valid}
      createTransaction={createTransaction}
    />
  )
}
