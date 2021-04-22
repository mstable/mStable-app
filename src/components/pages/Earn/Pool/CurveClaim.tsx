import React, { FC, useCallback } from 'react'
import styled from 'styled-components'

import { useCurveContracts } from '../../../../context/earn/CurveProvider'
import { Interfaces } from '../../../../types'
import { TransactionForm } from '../../../forms/TransactionForm'
import { useRewardsEarned } from '../StakingRewardsContractProvider'
import { CountUp } from '../../../core/CountUp'
import { H3, P } from '../../../core/Typography'
import { TransactionManifest } from '../../../../web3/TransactionManifest'

const Row = styled.div`
  width: 100%;
  padding-bottom: 16px;
`

const Input: FC<{ symbol: 'MTA' | 'CRV' }> = ({ symbol }) => {
  const { rewards, platformRewards } = useRewardsEarned()
  const selectedRewards = symbol === 'CRV' ? platformRewards : rewards

  return (
    <div>
      {selectedRewards?.exact.gt(0) ? (
        <P>
          Claim <CountUp end={selectedRewards?.simple} decimals={6} suffix={` ${symbol}`} />.
        </P>
      ) : (
        'No rewards to claim.'
      )}
    </div>
  )
}

const ClaimMTA: FC = () => {
  const { rewards } = useRewardsEarned()
  const { musdGauge } = useCurveContracts()

  const valid = !!rewards?.exact.gt(0)

  const createTransaction = useCallback(
    (formId: string): TransactionManifest<Interfaces.CurveGauge, 'claim_rewards()'> | void => {
      if (valid && musdGauge) {
        return new TransactionManifest(
          musdGauge,
          'claim_rewards()',
          [],
          {
            present: 'Claiming MTA rewards',
            past: 'Claimed MTA rewards',
          },
          formId,
        )
      }
    },
    [valid, musdGauge],
  )

  return (
    <TransactionForm
      formId="claimMTA"
      compact
      confirmLabel="Claim MTA"
      createTransaction={createTransaction}
      input={<Input symbol="MTA" />}
      valid={valid}
    />
  )
}

const ClaimCRV: FC = () => {
  const { platformRewards } = useRewardsEarned()
  const { tokenMinter } = useCurveContracts()

  const valid = !!platformRewards?.exact.gt(0)

  const createTransaction = useCallback(
    (formId: string): TransactionManifest<Interfaces.CurveTokenMinter, 'mint'> | void => {
      if (valid && tokenMinter) {
        return new TransactionManifest(
          tokenMinter,
          'mint',
          ['0x5f626c30ec1215f4edcc9982265e8b1f411d1352'], // Curve mUSD Gauge
          {
            present: 'Claiming CRV rewards',
            past: 'Claimed CRV rewards',
          },
          formId,
        )
      }
    },
    [valid, tokenMinter],
  )

  return (
    <TransactionForm
      formId="claimCRV"
      compact
      confirmLabel="Claim CRV"
      createTransaction={createTransaction}
      input={<Input symbol="CRV" />}
      valid={valid}
    />
  )
}

const ClaimButtons = styled.div`
  display: flex;
  justify-content: space-between;

  > * {
    width: 100%;
  }

  > :first-child {
    margin-right: 8px;
  }

  > :last-child {
    margin-left: 8px;
  }
`

export const CurveClaim: FC = () => {
  return (
    <Row>
      <H3>Claim rewards</H3>
      <ClaimButtons>
        <ClaimMTA />
        <ClaimCRV />
      </ClaimButtons>
      <P>You will continue to earn any available rewards with your staked balance.</P>
    </Row>
  )
}
