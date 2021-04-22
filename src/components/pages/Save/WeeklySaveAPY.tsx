import React, { FC } from 'react'
import styled from 'styled-components'
import CountUp from 'react-countup'

import { useAvailableSaveApy } from '../../../hooks/useAvailableSaveApy'
import { ThemedSkeleton } from '../../core/ThemedSkeleton'
import { useSelectedMassetName } from '../../../context/SelectedMassetNameProvider'

const InfoAPY = styled.div`
  font-size: 0.875rem;
  margin-top: 0.5rem;
  padding-right: 1rem;

  > :first-child {
    max-width: 60ch;
    color: ${({ theme }) => theme.color.body};

    > :first-child {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
  }

  a {
    border: none;
    font-size: 0.875rem;

    :hover {
      color: ${({ theme }) => theme.color.gold};
    }
  }
`

const InfoMsg = styled.div`
  font-size: 1.125rem;
  max-width: 25ch;
  color: ${({ theme }) => theme.color.bodyAccent};

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    max-width: 20ch;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    max-width: inherit;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    margin: 0;
  }
`

export const WeeklySaveAPY: FC = () => {
  const apy = useAvailableSaveApy()
  const massetName = useSelectedMassetName()
  return (
    <Container>
      {apy.type === 'fetching' ? (
        <ThemedSkeleton height={42} width={100} />
      ) : apy.type === 'inactive' ? (
        <InfoMsg>Not receiving interest</InfoMsg>
      ) : apy.type === 'bootstrapping' || apy.value === 0 ? (
        <div>
          <InfoMsg>APY not available yet.</InfoMsg>
          <InfoMsg>
            Save V1 APY: <CountUp end={apy.v1Apy} suffix="%" decimals={2} />
          </InfoMsg>
        </div>
      ) : (
        <>
          <InfoAPY>
            {' '}
            <div>
              <p>{apy.type === 'average' ? '7-day MA (Moving Average) APY' : 'Live APY (unstable)'}</p>
              <p>
                {massetName === 'mbtc'
                  ? 'This APY is purely derived from internal swap fees, and thus does not expose mBTC holders to external protocol risk.'
                  : 'This rate depends on activity such as fees accrued on mStable and lending markets, and is not reflective of future rates.'}
              </p>
            </div>
            <a
              href="https://docs.mstable.org/mstable-assets/massets/native-interest-rate#how-is-the-24h-apy-calculated"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn about how this is calculated
            </a>
          </InfoAPY>
        </>
      )}
    </Container>
  )
}
