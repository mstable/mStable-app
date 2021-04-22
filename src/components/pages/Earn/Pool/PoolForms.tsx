import React, { FC } from 'react'
import styled from 'styled-components'

import { TabsContainer, TabBtn } from '../../../core/Tabs'
import { Tabs } from '../types'
import { useStakingRewardContractDispatch, useStakingRewardsContractState } from '../StakingRewardsContractProvider'
import { Stake } from './Stake'
import { Claim } from './Claim'
import { Exit } from './Exit'
import { CurveStake } from './CurveStake'
import { CurveClaim } from './CurveClaim'
import { CurveExit } from './CurveExit'
import { Protip } from '../../../core/Protip'
import { ExternalLink } from '../../../core/ExternalLink'
import { CurveAddLiquidity } from './CurveAddLiquidity'

const BoostProtip = styled(Protip)`
  margin-bottom: 16px;
`

const TAB_LABELS = {
  [Tabs.AddLiquidity]: 'Add liquidity',
  [Tabs.Stake]: 'Deposit stake',
  [Tabs.Claim]: 'Claim rewards',
  [Tabs.Exit]: 'Withdraw or exit',
}

const TabButton: FC<{ tab: Tabs }> = ({ tab }) => {
  const { activeTab } = useStakingRewardsContractState()
  const { setActiveTab } = useStakingRewardContractDispatch()
  return (
    <TabBtn
      type="button"
      onClick={() => {
        setActiveTab(tab)
      }}
      active={activeTab === tab}
    >
      {TAB_LABELS[tab]}
    </TabBtn>
  )
}

const Container = styled.div`
  border-radius: 0 0 2px 2px;
  padding: 1rem 0 2rem 0;
  text-align: left;

  > div:not(:last-child) {
    margin-bottom: 2rem;
  }
`

export const PoolForms: FC<{ address: string }> = () => {
  const { activeTab, stakingRewardsContract } = useStakingRewardsContractState()
  const isCurve = !!stakingRewardsContract?.curve
  return (
    <Container>
      <TabsContainer>
        {isCurve && <TabButton tab={Tabs.AddLiquidity} />}
        <TabButton tab={Tabs.Stake} />
        <TabButton tab={Tabs.Claim} />
        <TabButton tab={Tabs.Exit} />
      </TabsContainer>
      <div>
        {isCurve && (
          <BoostProtip emoji="🚀" title="Boost your CRV">
            Want to increase your CRV rewards?{' '}
            <ExternalLink href="https://dao.curve.fi/locker">Stake your CRV and get a boost.</ExternalLink>
          </BoostProtip>
        )}
        {activeTab === Tabs.Stake ? (
          isCurve ? (
            <CurveStake />
          ) : (
            <Stake />
          )
        ) : activeTab === Tabs.Claim ? (
          isCurve ? (
            <CurveClaim />
          ) : (
            <Claim />
          )
        ) : activeTab === Tabs.AddLiquidity ? (
          isCurve ? (
            <CurveAddLiquidity />
          ) : null
        ) : isCurve ? (
          <CurveExit />
        ) : (
          <Exit />
        )}
      </div>
    </Container>
  )
}
