import React, { FC, useCallback } from 'react'

import styled from 'styled-components'
import { Interfaces } from '../../../../types'
import { TransactionForm } from '../../../forms/TransactionForm'
import { H3, P } from '../../../core/Typography'
import {
  useCurrentStakingRewardsContractCtx,
  useCurrentStakingToken,
  useStakingRewardContractDispatch,
  useStakingRewardsContractState,
} from '../StakingRewardsContractProvider'
import { CountUp } from '../../../core/CountUp'
import { ExternalLink } from '../../../core/ExternalLink'
import { PLATFORM_METADATA } from '../constants'
import { Protip } from '../../../core/Protip'
import { Tabs } from '../types'
import { TransactionManifest } from '../../../../web3/TransactionManifest'
import { ThemedSkeleton } from '../../../core/ThemedSkeleton'
import { AssetInput } from '../../../forms/AssetInput'

const Row = styled.div`
  width: 100%;
  padding-bottom: 16px;
`

const ExitLink = styled.span`
  border-bottom: 1px black solid;
  cursor: pointer;
`

const Input: FC = () => {
  const {
    stake: { formValue, error, needsUnlock },
    stakingRewardsContract,
  } = useStakingRewardsContractState()
  const { setStakeAmount, setMaxStakeAmount } = useStakingRewardContractDispatch()

  const stakingToken = useCurrentStakingToken()

  const metadata = stakingRewardsContract ? PLATFORM_METADATA[stakingRewardsContract.pool.platform] : undefined

  if (!stakingRewardsContract) {
    return <ThemedSkeleton height={300} />
  }

  const { address } = stakingRewardsContract

  return (
    <Row>
      <H3>Deposit stake</H3>
      <div>
        <AssetInput
          formValue={formValue}
          error={error ? 'error' : undefined}
          spender={address}
          needsApprove={needsUnlock}
          handleSetAmount={setStakeAmount}
          handleSetMax={setMaxStakeAmount}
          address={stakingToken?.address as string}
          addressDisabled
        />
        {metadata && stakingToken?.balance.exact.lte(0) ? (
          <Protip title="Need tokens to stake?">
            <ExternalLink href={metadata.getPlatformLink(stakingRewardsContract)}>
              Get tokens to stake by contributing liquidity on {metadata.name}
            </ExternalLink>
          </Protip>
        ) : null}
      </div>
    </Row>
  )
}

const Confirm: FC = () => {
  const {
    stake: { amount },
  } = useStakingRewardsContractState()
  const stakingToken = useCurrentStakingToken()

  return amount && stakingToken ? (
    <div>
      You are depositing <CountUp end={amount?.simpleRounded} suffix={` ${stakingToken.symbol}`} /> into this staking rewards pool.
    </div>
  ) : null
}

export const Stake: FC = () => {
  const {
    stake: { amount, valid },
    stakingRewardsContract: { expired = false, title } = {},
  } = useStakingRewardsContractState()
  const { setActiveTab } = useStakingRewardContractDispatch()
  const contract = useCurrentStakingRewardsContractCtx()

  const createTransaction = useCallback(
    (formId: string): TransactionManifest<Interfaces.StakingRewards, 'stake(uint256)'> | void => {
      if (valid && amount && contract) {
        const body = `${amount.simple} in ${title}`
        return new TransactionManifest(
          contract,
          'stake(uint256)',
          [amount.exact],
          {
            present: `Staking ${body}`,
            past: `Staked ${body}`,
          },
          formId,
        )
      }
    },
    [valid, amount, contract, title],
  )

  return expired ? (
    <div>
      <H3>Pool expired</H3>
      <P>
        This pool has now expired; new stakes should not be deposited, and the pool should be{' '}
        <ExitLink
          onClick={() => {
            setActiveTab(Tabs.Exit)
          }}
        >
          exited
        </ExitLink>
        .
      </P>
    </div>
  ) : (
    <TransactionForm
      formId="stake"
      confirmLabel="Stake"
      confirm={<Confirm />}
      createTransaction={createTransaction}
      input={<Input />}
      valid={valid}
    />
  )
}
