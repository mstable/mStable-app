import React, { FC } from 'react'
import styled from 'styled-components'

import { useRewardStreams } from '../../../../context/RewardStreamsProvider'
import { useSelectedSaveVersion } from '../../../../context/SelectedSaveVersionProvider'

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const Container = styled.div``

export const PolygonRewards: FC = () => {
  const rewardStreams = useRewardStreams()
  const [selectedSaveVersion] = useSelectedSaveVersion()

  const showGraph = (rewardStreams?.amounts.earned.total ?? 0) > 0 || (rewardStreams?.amounts.locked ?? 0) > 0

  return (
    <Container>
      <div>
        {showGraph ? (
          <p>POLY</p>
        ) : (
          <EmptyState>
            <h3>No rewards to claim</h3>
            {selectedSaveVersion === 1 ? (
              <p>Migrate your balance and deposit to the Vault to earn MTA rewards.</p>
            ) : (
              <p>Deposit to the Vault to earn MTA rewards.</p>
            )}
          </EmptyState>
        )}
      </div>
    </Container>
  )
}
