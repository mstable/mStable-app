import React, { FC, ReactElement, useCallback, useState } from 'react'

import { useFeederPoolApy } from '../../../../hooks/useFeederPoolApy'
import { useSelectedMassetPrice } from '../../../../hooks/usePrice'

import { CountUp, DifferentialCountup } from '../../../core/CountUp'
import { useSelectedFeederPoolState } from '../FeederPoolProvider'
import { Position } from './Position'
import { ProvideLiquidityMessage, ShowEarningPower, useShowEarningPower } from './ProvideLiquidityMessage'
import { UserBoost } from '../../../rewards/UserBoost'
import { useRewardStreams } from '../../../../context/RewardStreamsProvider'
import { UserRewards } from './UserRewards'
import { BoostCalculator } from '../../../rewards/BoostCalculator'
import { BoostedSavingsVaultState } from '../../../../context/DataProvider/types'
import { TransitionCard, CardContainer as Container, CardButton as Button } from '../../../core/TransitionCard'

enum Selection {
  Stake = 'stake',
  Boost = 'boost',
  Rewards = 'rewards',
}

const { Stake, Boost, Rewards } = Selection

const UserVaultBoost: FC = () => {
  const feederPool = useSelectedFeederPoolState()
  const apy = useFeederPoolApy(feederPool.address)
  return <UserBoost vault={feederPool.vault} apy={apy} />
}

const components: Record<string, ReactElement> = {
  [Stake]: <Position />,
  [Boost]: <UserVaultBoost />,
  [Rewards]: <UserRewards />,
}

const LiquidityMessageContent: FC<{
  vault: BoostedSavingsVaultState
  apy?: number
}> = ({ vault, apy }) => {
  const [showEarningPower] = useShowEarningPower()
  return (
    <TransitionCard
      selection={showEarningPower ? 'boost' : undefined}
      components={{
        boost: <BoostCalculator vault={vault} noBackButton apy={apy} />,
      }}
    >
      <Container>
        <ProvideLiquidityMessage />
      </Container>
    </TransitionCard>
  )
}

export const PoolOverview: FC = () => {
  const [selection, setSelection] = useState<Selection | undefined>()

  const rewardStreams = useRewardStreams()
  const feederPool = useSelectedFeederPoolState()
  const apy = useFeederPoolApy(feederPool.address)
  const massetPrice = useSelectedMassetPrice() ?? 1

  const { vault, token, price } = feederPool
  const fpTokenPrice = price.simple * massetPrice
  const userAmount = token.balance?.simple ?? 0
  const userStakedAmount = vault.account?.rawBalance.simple ?? 0

  const totalEarned = rewardStreams?.amounts.earned.total ?? 0
  const totalLocked = rewardStreams?.amounts.locked ?? 0
  const showLiquidityMessage = totalEarned === 0 && totalLocked === 0

  const handleSelection = useCallback((newValue?: Selection) => setSelection(selection === newValue ? undefined : newValue), [selection])

  const totalUserBalance = (userStakedAmount + userAmount) * fpTokenPrice

  return showLiquidityMessage ? (
    <ShowEarningPower>
      <LiquidityMessageContent vault={vault} apy={apy.value?.base} />
    </ShowEarningPower>
  ) : (
    <TransitionCard components={components} selection={selection}>
      <Container>
        <Button active={selection === Stake} onClick={() => handleSelection(Stake)}>
          <h3>Balance</h3>
          <CountUp end={totalUserBalance} prefix="$" />
        </Button>
        <Button active={selection === Boost} onClick={() => handleSelection(Boost)}>
          <h3>Rewards APY</h3>
          {apy.value?.userBoost ? (
            <DifferentialCountup prev={apy.value.base} end={apy.value.userBoost} suffix="%" />
          ) : (
            <CountUp end={apy.value?.base ?? 0} suffix="%" />
          )}
        </Button>
        <Button active={selection === Rewards} onClick={() => handleSelection(Rewards)}>
          <h3>Rewards</h3>
          <CountUp end={totalEarned} /> MTA
        </Button>
      </Container>
    </TransitionCard>
  )
}
