import React, { FC } from 'react'

import { useCurrentStakingRewardsContract } from '../StakingRewardsContractProvider'
import { ExternalLink } from '../../../core/ExternalLink'
import { Protip } from '../../../core/Protip'

export const ImpermanentLossWarning: FC<{}> = () => {
  const stakingRewards = useCurrentStakingRewardsContract()

  return stakingRewards?.pool.onlyStablecoins ? null : (
    <Protip emoji="⚠️" title="Volatile tokens">
      This pool contains volatile tokens which means it may suffer from impermanent losses - you can learn more about this{' '}
      <ExternalLink href="https://medium.com/dragonfly-research/what-explains-the-rise-of-amms-7d008af1c399">here</ExternalLink> and{' '}
      <ExternalLink href="https://cryptobriefing.com/how-to-yield-farm-uniswap-not-get-rekt/">here</ExternalLink>.
    </Protip>
  )
}
