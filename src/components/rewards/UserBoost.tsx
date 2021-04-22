import React, { FC } from 'react'
import styled from 'styled-components'

import { CountUp, DifferentialCountup } from '../core/CountUp'
import { Boost } from './Boost'
import { BoostedSavingsVaultState } from '../../context/DataProvider/types'
import { FetchState } from '../../hooks/useFetchState'
import { ThemedSkeleton } from '../core/ThemedSkeleton'
import { Tooltip } from '../core/ReactTooltip'
import { useSelectedMassetName } from '../../context/SelectedMassetNameProvider'

const Container = styled.div`
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.color.body};
  }

  > div {
    padding: 0;
    > div {
      display: flex;
      justify-content: space-between;
      > :last-child {
        padding-top: 0.25rem;
        > :last-child {
          display: flex;
          margin-top: 2rem;
          h4 {
            font-weight: 600;
          }
          > *:not(:last-child) {
            margin-right: 3rem;
          }
        }
      }
    }
  }
`

export const UserBoost: FC<{
  vault: BoostedSavingsVaultState
  apy: FetchState<{ base: number; maxBoost: number; userBoost?: number }>
}> = ({ vault, apy }) => {
  const massetName = useSelectedMassetName()
  return (
    <Container>
      <Boost vault={vault} apy={apy.value?.base}>
        <div>
          <Tooltip
            tip={`${
              massetName === 'musd' ? 20 : 33
            }% of earned MTA rewards are claimable immediately. Remaining rewards are streamed linearly for 26 weeks`}
          >
            <h3>Rewards</h3>
          </Tooltip>
          <div>
            <div>
              <h4>Base APY</h4>
              {apy.fetching ? <ThemedSkeleton height={24} width={64} /> : apy.value && <CountUp end={apy.value.base} suffix="%" />}
            </div>
            <div>
              <h4>Max APY</h4>
              {apy.fetching ? <ThemedSkeleton height={24} width={64} /> : apy.value && <CountUp end={apy.value.maxBoost} suffix="%" />}
            </div>
            {apy.value?.userBoost && (
              <div>
                <h4>My APY</h4>
                {apy.value && <DifferentialCountup prev={apy.value.base} end={apy.value.userBoost} suffix="%" />}
              </div>
            )}
          </div>
        </div>
      </Boost>
    </Container>
  )
}
