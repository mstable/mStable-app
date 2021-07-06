import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { StakingRewardsWithPlatformToken__factory } from '@mstable/protocol/dist/types/generated'

import { usePropose } from '../../../../context/TransactionsProvider'
import { useTokenAllowance } from '../../../../context/TokensProvider'
import { useSigner } from '../../../../context/AccountProvider'
import { TransactionManifest } from '../../../../web3/TransactionManifest'
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput'
import { Interfaces } from '../../../../types'

import { Table, TableRow, TableCell } from '../../../core/Table'
import { Button } from '../../../core/Button'
import { Tooltip } from '../../../core/ReactTooltip'
import { MultiRewards } from '../../Pools/Detail/MultiRewards'
import { AssetInput } from '../../../forms/AssetInput'

import { useRewardsEarned, useStakingRewards, RewardsEarnedProvider } from '../hooks'

const Input = styled(AssetInput)`
  height: 2.5rem;
  border-radius: 0.5rem;
  padding: 0;
  border: none;

  button {
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    height: 1.875rem;
  }

  .approve-button {
    border-radius: 0.75rem;
    height: 3rem;
    span {
      font-size: 0.875rem;
      color: ${({ theme }) => theme.color.white};
    }
  }

  > div {
    margin-right: 0.5rem;
  }
`

const StyledRow = styled(TableRow)`
  background: ${({ theme }) => theme.color.background[0]};

  td {
    padding: 0 0.75rem 0 0.5rem;
  }

  :hover {
    background: ${({ theme, onClick }) => onClick && theme.color.background[1]};
  }
`

const RewardContainer = styled.div`
  border: 1px dashed ${({ theme }) => theme.color.background[3]};
  border-radius: 1rem;
  padding: 1rem;
  align-items: center;
  text-align: center;

  p {
    line-height: 1.5rem;
  }

  p:first-child {
    margin-bottom: 0.75rem;
  }
`

const RewardAPY = styled.div`
  display: flex;
  font-size: 0.875rem;
  justify-content: center;

  div {
    background: ${({ theme }) => theme.color.green};
    color: ${({ theme }) => theme.color.white};
    margin-right: 1rem;
    border-radius: 0.75rem;
    padding: 0.25rem 0.5rem;
    align-items: center;
    display: flex;
  }

  div:first-child {
    background: ${({ theme }) => theme.color.greyTransparent};
  }

  div > span > span > span:first-child {
    ${({ theme }) => theme.mixins.numeric};
    margin-right: 0.3rem;
  }
`

const StyledTable = styled(Table)`
  background: ${({ theme }) => theme.color.background[1]};
  padding: 0.5rem;
  border-radius: 1rem;
  margin-bottom: 1rem;

  h3 {
    font-weight: 600;
    margin-left: 0.5rem;
    margin-bottom: 0.5rem;
  }
`

const Container = styled.div`
  width: 100%;
  > div {
    margin-bottom: 1.25rem;
  }
`

const RewardsEarned: FC = () => {
  const stakingRewards = useStakingRewards()
  const rewardsEarned = useRewardsEarned()
  const propose = usePropose()
  const signer = useSigner()

  const stakingRewardsAddress = stakingRewards.stakingRewardsContract?.address

  const contract = useMemo(
    () => (signer && stakingRewardsAddress ? StakingRewardsWithPlatformToken__factory.connect(stakingRewardsAddress, signer) : undefined),
    [stakingRewardsAddress, signer],
  )

  const handleRewardClaim = (): void => {
    if (!contract) return
    propose<Interfaces.StakingRewardsWithPlatformToken, 'claimReward'>(
      new TransactionManifest(contract, 'claimReward', [], {
        present: `Claiming rewards`,
        past: 'Claimed rewards',
      }),
    )
  }

  return <MultiRewards rewardsEarned={rewardsEarned} onClaimRewards={handleRewardClaim} />
}

export const SaveStake: FC = () => {
  const stakingRewards = useStakingRewards()
  const signer = useSigner()
  const propose = usePropose()

  const stakingRewardsAddress = stakingRewards.stakingRewardsContract?.address
  const stakingTokenAddress = stakingRewards.stakingRewardsContract?.stakingToken.address

  const contract = useMemo(
    () => (signer && stakingRewardsAddress ? StakingRewardsWithPlatformToken__factory.connect(stakingRewardsAddress, signer) : undefined),
    [stakingRewardsAddress, signer],
  )

  const unstakedBalance = stakingRewards?.unstakedBalance
  const stakedBalance = stakingRewards?.stakedBalance

  const [amountToStake, saveFormValue, setSaveAmount] = useBigDecimalInput((unstakedBalance?.simple ?? 0).toString())
  const [amountToWithdraw, stakedFormValue, setStakedAmount] = useBigDecimalInput((stakedBalance?.simple ?? 0).toString())

  const allowance = useTokenAllowance(stakingTokenAddress, stakingRewardsAddress)
  const needsApprove = !amountToStake || !allowance || (amountToStake && allowance?.exact.lt(amountToStake.exact))

  const handleStake = (): void => {
    if (!contract || !amountToStake?.exact) return
    propose<Interfaces.StakingRewardsWithPlatformToken, 'stake(uint256)'>(
      new TransactionManifest(contract, 'stake(uint256)', [amountToStake.exact], {
        present: `Staking ${amountToStake?.simple.toFixed(0)} imUSD`,
        past: 'Staked imUSD',
      }),
    )
  }

  const handleUnstake = (): void => {
    if (!contract || !amountToWithdraw?.exact) return
    propose<Interfaces.StakingRewardsWithPlatformToken, 'withdraw'>(
      new TransactionManifest(contract, 'withdraw', [amountToWithdraw.exact], {
        present: `Withdrawing ${amountToWithdraw?.simple.toFixed(0)} imUSD`,
        past: 'Withdrew imUSD',
      }),
    )
  }

  return (
    <Container>
      <RewardContainer>
        {!stakingRewards.hasStakedBalance && stakingRewards.hasUnstakedBalance ? (
          <p>Stake to earn rewards in addition to native yield</p>
        ) : (
          !stakingRewards.hasUnstakedBalance &&
          !stakingRewards.hasStakedBalance && <p>Deposit to get imUSD and then stake to earn rewards</p>
        )}
        <RewardAPY>
          {stakingRewards.rewards
            ?.filter(reward => reward.tokens.length < 2)
            .map(({ apy, apyTip, tokens, name, id }) => (
              <div key={id}>
                <Tooltip tip={apyTip} hideIcon>
                  <span>
                    {id === 'yieldRewards' ? '' : '+'}
                    {apy.toFixed(2)}%
                  </span>
                  <span>{tokens.length ? tokens[0] : name}</span>
                </Tooltip>
              </div>
            ))}
        </RewardAPY>
      </RewardContainer>
      {stakingRewards.hasStakedBalance && (
        <StyledTable headerTitles={[{ title: 'Staked Balance' }]}>
          <StyledRow buttonTitle="Stake">
            <TableCell width={70}>
              <Input
                handleSetAmount={setStakedAmount}
                handleSetMax={() => setStakedAmount(stakingRewards.stakedBalance?.string ?? '0')}
                formValue={stakedFormValue}
              />
            </TableCell>
            <TableCell width={30}>
              <Button onClick={handleUnstake}>Unstake</Button>
            </TableCell>
          </StyledRow>
        </StyledTable>
      )}
      {stakingRewards.hasUnstakedBalance && (
        <StyledTable headerTitles={[{ title: 'Unstaked Balance' }]}>
          <StyledRow buttonTitle="Stake">
            <TableCell width={70}>
              <Input
                handleSetAmount={setSaveAmount}
                handleSetMax={() => setSaveAmount(stakingRewards.unstakedBalance?.string ?? '0')}
                formValue={saveFormValue}
                address={stakingTokenAddress}
                spender={stakingRewardsAddress}
                hideToken
              />
            </TableCell>
            <TableCell width={20}>
              <Button disabled={needsApprove} highlighted={!needsApprove} onClick={handleStake}>
                Stake
              </Button>
            </TableCell>
          </StyledRow>
        </StyledTable>
      )}
      <RewardsEarnedProvider>
        <RewardsEarned />
      </RewardsEarnedProvider>
    </Container>
  )
}
