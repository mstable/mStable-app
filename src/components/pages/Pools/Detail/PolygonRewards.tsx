import React, { FC, useMemo, useState } from 'react'
import styled from 'styled-components'
import { formatDuration, intervalToDuration } from 'date-fns'

import { useRewardStreams } from '../../../../context/RewardStreamsProvider'
import { useSelectedSaveVersion } from '../../../../context/SelectedSaveVersionProvider'
import { CountdownBar } from '../../../core/CountdownBar'
import { Slider } from '../../../core/Slider'

const WEEK = 604800 * 1000
const YEAR = 365 * 86400 * 1000

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const Container = styled.div``

export const PolygonRewards: FC = () => {
  const start = Date.now() + WEEK // 7 days
  const end = Date.now() + 3 * YEAR // 3 years

  const rewardStreams = useRewardStreams()
  const [selectedSaveVersion] = useSelectedSaveVersion()
  const [value, setValue] = useState(start)

  const showGraph = (rewardStreams?.amounts.earned.total ?? 0) > 0 || (rewardStreams?.amounts.locked ?? 0) > 0

  const difference = useMemo(() => {
    const duration = intervalToDuration({ start: new Date(), end: value + 1000 }) // 1s off
    const units = ['years', 'months', 'weeks', 'days']
    const nonzero = Object.entries(duration)
      .filter(([, v]) => v)
      .map(([unit]) => unit)

    return formatDuration(duration, {
      format: units.filter(i => new Set(nonzero).has(i)).slice(0, 3),
      delimiter: ', ',
    })
  }, [value])

  return (
    <Container>
      <div>
        {showGraph ? (
          <div>
            <p>POLY</p>
            <CountdownBar percentage={50} end={Date.now() + 1000 * 240 * 1000} />
            <Slider min={start} max={end} step={86400 * 1000 * 7} value={value} onChange={setValue} />
            <p>Locked for: {difference}</p>
          </div>
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
