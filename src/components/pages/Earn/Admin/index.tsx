import React, { FC } from 'react'

import { CurveProvider } from '../../../../context/earn/CurveProvider'
import { EarnDataProvider } from '../../../../context/earn/EarnDataProvider'
import { H2 } from '../../../core/Typography'
import { StakingRewardContractsTable } from './StakingRewardContractsTable'
import { DistributeRewardsForm } from './DistributeRewardsForm'
import { EarnAdminProvider } from './EarnAdminProvider'

export const AdminPage: FC = () => (
  <CurveProvider>
    <EarnDataProvider>
      <EarnAdminProvider>
        <div>
          <H2>EARN Admin Dashboard</H2>
          <div>
            <StakingRewardContractsTable />
            <DistributeRewardsForm />
          </div>
        </div>
      </EarnAdminProvider>
    </EarnDataProvider>
  </CurveProvider>
)
