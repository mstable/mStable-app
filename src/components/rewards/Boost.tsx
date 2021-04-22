import React, { FC, useMemo } from 'react'
import styled from 'styled-components'

import { useTokenSubscription } from '../../context/TokensProvider'
import { createToggleContext } from '../../hooks/createToggleContext'
import { ProgressBar } from '../core/ProgressBar'
import { Button } from '../core/Button'
import { Widget } from '../core/Widget'
import { ViewportWidth } from '../../theme'

import { calculateBoost, calculateBoostImusd, getCoeffs } from '../../utils/boost'
import { BoostCalculator } from './BoostCalculator'
import { BoostedSavingsVaultState } from '../../context/DataProvider/types'
import { useNetworkAddresses } from '../../context/NetworkProvider'

const BoostBarLine = styled.div`
  width: 100%;
  height: 2px;
  margin-left: 16px;
  margin-right: 16px;
  background: ${({ theme }) => theme.color.backgroundAccent};
`

const BoostBarRange = styled.div`
  ${({ theme }) => theme.mixins.numeric};

  display: flex;
  justify-content: space-between;
  align-items: center;
  color: grey;
  padding: 0.5rem 0;
`

const [useShowCalculatorCtx, ShowCalculatorProvider] = createToggleContext(false)

const BoostBar: FC<{
  vault: BoostedSavingsVaultState
  isImusd?: boolean
}> = ({ vault, isImusd }) => {
  const networkAddresses = useNetworkAddresses()
  const [, toggleShowCalculator] = useShowCalculatorCtx()
  const vMTA = useTokenSubscription(networkAddresses?.vMTA)
  const vMTABalance = vMTA?.balance
  const rawBalance = vault.account?.rawBalance

  const boost = useMemo<number>(() => {
    const coeffs = getCoeffs(vault)
    return isImusd || !coeffs ? calculateBoostImusd(rawBalance, vMTABalance) : calculateBoost(...coeffs, rawBalance, vMTABalance)
  }, [rawBalance, isImusd, vMTABalance, vault])

  return (
    <Widget
      title="Earning Power Multiplier"
      tooltip="Rewards are boosted by a multiplier (1x to 3x)"
      headerContent={
        <Button scale={0.7} onClick={toggleShowCalculator}>
          Calculator
        </Button>
      }
    >
      <div>
        <ProgressBar value={boost} min={1} max={3} />
        <BoostBarRange>
          <div>1x</div>
          <BoostBarLine />
          <div>3x</div>
        </BoostBarRange>
      </div>
    </Widget>
  )
}

const Container = styled(Widget)<{ showCalculator?: boolean }>`
  > div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  > div > * {
    flex: 1;
  }

  @media (min-width: ${ViewportWidth.l}) {
    > div {
      flex-direction: row;
      align-items: stretch;
    }

    > div > *:first-child {
      flex: ${({ showCalculator }) => !showCalculator && 0};
      flex-basis: ${({ showCalculator }) => !showCalculator && `50%`};
    }
    > div > *:last-child {
      flex: ${({ showCalculator }) => !showCalculator && 0};
      flex-basis: ${({ showCalculator }) => !showCalculator && `40%`};
    }
  }
`

const BoostContent: FC<{
  vault: BoostedSavingsVaultState
  apy?: number
  isImusd?: boolean
}> = ({ children, apy, vault, isImusd }) => {
  const [showCalculator, toggleShowCalculator] = useShowCalculatorCtx()

  return (
    <Container padding showCalculator={showCalculator}>
      {showCalculator ? (
        <BoostCalculator apy={apy} vault={vault} isImusd={isImusd} onClick={toggleShowCalculator} />
      ) : (
        <>
          <BoostBar vault={vault} isImusd={isImusd} />
          {children}
        </>
      )}
    </Container>
  )
}

export const Boost: FC<{
  vault: BoostedSavingsVaultState
  apy?: number
  isImusd?: boolean
}> = ({ apy, children, vault, isImusd }) => (
  <ShowCalculatorProvider>
    <BoostContent apy={apy} vault={vault} isImusd={isImusd}>
      {children}
    </BoostContent>
  </ShowCalculatorProvider>
)
