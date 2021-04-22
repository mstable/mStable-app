import React, { FC } from 'react'
import styled from 'styled-components'

import { H3, P } from '../../../core/Typography'
import { useStakingRewardContractDispatch } from '../StakingRewardsContractProvider'
import { Tabs } from '../types'

const ExitLink = styled.span`
  border-bottom: 1px black solid;
  cursor: pointer;
`

export const CurveStake: FC = () => {
  const { setActiveTab } = useStakingRewardContractDispatch()

  return (
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
  )
}
