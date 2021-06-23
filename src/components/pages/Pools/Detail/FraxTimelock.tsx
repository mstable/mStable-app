import React, { FC, useMemo, useState } from 'react'
import { intervalToDuration, formatDuration } from 'date-fns'
import { useToggle } from 'react-use'
import styled from 'styled-components'
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput'
import { Table, TableCell, TableRow } from '../../../core/Table'
import { AssetInput } from '../../../forms/AssetInput'
import { ToggleInput } from '../../../forms/ToggleInput'
import { Button } from '../../../core/Button'
import { Slider } from '../../../core/Slider'
import { CountdownBar } from '../../../core/CountdownBar'
import { useFraxStakingContract, useFraxStakingState } from '../../../../context/FraxStakingProvider'
import { CountUp } from '../../../core/CountUp'
import { Interfaces } from '../../../../types'
import { TransactionManifest } from '../../../../web3/TransactionManifest'
import { usePropose } from '../../../../context/TransactionsProvider'

const TABLE_CELL_WIDTHS = [30, 30, 30]
const DAY = 86400

const MOCK_BALANCE: { balance?: string } = {
  balance: '12000',
}

const Input = styled(AssetInput)`
  height: 2.5rem;
  border-radius: 0.5rem;
  padding: 0;
  border: none;

  button {
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
  }

  > div {
    margin-right: 0.5rem;
  }
`

const StyledRow = styled(TableRow)`
  background: ${({ theme }) => theme.color.background[0]};

  :hover {
    background: ${({ theme, onClick }) => onClick && theme.color.background[1]};
  }
`

const LockupRow = styled(TableRow)`
  display: flex;
  width: 100%;
  padding: 2rem;
  justify-content: flex-start;
  flex-direction: column;
  background: ${({ theme }) => theme.color.background[0]};

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  > div span {
    ${({ theme }) => theme.mixins.numeric};
    color: ${({ theme }) => theme.color.blue};
  }

  > div > span {
    border: 1px solid ${({ theme }) => theme.color.defaultBorder};
    padding: 0.25rem 0.75rem;
    margin-left: 1rem;
    border-radius: 0.5rem;
  }

  > div:first-child {
    margin-bottom: 1rem;
  }
`

const MultiplierCell = styled(TableCell)`
  span {
    color: ${({ theme }) => theme.color.body};
    ${({ theme }) => theme.mixins.numeric};
  }
`

const StyledTable = styled(Table)`
  background: ${({ theme }) => theme.color.background[1]};
  padding: 0.25rem 0.5rem 0.5rem;
  border-radius: 1rem;

  td h3 {
    color: ${({ theme }) => theme.color.bodyAccent};

    span {
      color: ${({ theme }) => theme.color.body};
    }
  }
`

const Container = styled.div`
  > *:not(:last-child) {
    margin-bottom: 1.5rem;
  }
`

export const FraxTimelock: FC = () => {
  const { subscribed: userData, static: staticData } = useFraxStakingState() ?? {}
  const contract = useFraxStakingContract()
  const propose = usePropose()

  const sliderStart = staticData?.value?.lockTimeMin ?? 0
  const sliderEnd = staticData?.value?.lockTimeMax ?? 0
  const maxMultiplier = staticData?.value?.lockMaxMultiplier ?? 1
  const lockTimeMax = staticData?.value?.lockTimeMax

  const [seconds, setValue] = useState(sliderStart)
  const [boostToggled, setBoost] = useToggle(false)
  const [inputValue, inputFormValue, handleSetAmount] = useBigDecimalInput(MOCK_BALANCE?.balance)

  const lockedStakes = userData?.value?.accountData?.lockedStakes

  const showDeposit = !!MOCK_BALANCE?.balance
  const showWithdraw = lockedStakes?.length

  const timeDifference = useMemo(() => {
    const start = Date.now()
    const duration = intervalToDuration({ start, end: start + seconds * 1000 })

    const nonzero = Object.entries(duration)
      .filter(([, v]) => v)
      .map(([unit]) => unit)

    if ((duration?.days ?? 0) < 1) return `0 days`

    return formatDuration(duration, {
      format: ['years', 'months', 'weeks', 'days'].filter(i => new Set(nonzero).has(i)).slice(0, 3),
      delimiter: ', ',
    })
  }, [seconds])

  const boostMultiplier = useMemo(() => {
    if (!lockTimeMax) return 1
    const secs = Math.ceil(seconds)
    return 1 + (secs * (maxMultiplier - 1)) / lockTimeMax
  }, [maxMultiplier, lockTimeMax, seconds])

  const handleWithdraw = (kekId: string): void => {
    if (!contract || !inputValue?.exact || !seconds) return
    propose<Interfaces.FraxStakingRewardsDual, 'withdrawLocked'>(
      new TransactionManifest(contract, 'withdrawLocked', [kekId], {
        present: 'Withdrawing LP token',
        past: 'Withdrew LP token',
      }),
    )
  }

  const handleDeposit = (): void => {
    if (!contract || !inputValue?.exact || !seconds) return
    if (boostToggled && seconds >= DAY) {
      propose<Interfaces.FraxStakingRewardsDual, 'stakeLocked'>(
        new TransactionManifest(contract, 'stakeLocked', [inputValue.exact, seconds], {
          present: 'Staking LP token',
          past: 'Staked LP token',
        }),
      )
    }
    // TODO: stake() - not available on V3 contract
    // propose<Interfaces.FraxStakingRewardsDual, 'stake'>(
    // new TransactionManifest(contract, 'stakeLocked', [inputValue.exact], {
    //   present: 'Staking LP token',
    //   past: 'Staked LP token',
    // }),
    // )
  }

  // TODO: - Subscribe to LP token balance
  const handleSetMax = (): void => {}

  if (!showDeposit && !showWithdraw) return null

  const depositHeaderTitles = ['Wallet', 'Boost Rewards', ''].map((t, i) =>
    i === 1 ? { title: t, tooltip: 'Lock up your tokens for a period of time to earn a boosted reward multiplier' } : { title: t },
  )
  const withdrawHeaderTitles = ['Vault', 'Rewards Multiplier', 'Time Remaining'].map(t => ({ title: t }))

  return (
    <Container>
      {showDeposit && (
        <StyledTable headerTitles={depositHeaderTitles} widths={TABLE_CELL_WIDTHS}>
          <StyledRow buttonTitle="Stake">
            <TableCell width={TABLE_CELL_WIDTHS[0]}>
              <Input
                handleSetAmount={handleSetAmount}
                handleSetMax={handleSetMax}
                formValue={inputFormValue}
                // error="error"
                spender="0xf38522f63f40f9dd81abafd2b8efc2ec958a3016"
              />
            </TableCell>
            <TableCell width={TABLE_CELL_WIDTHS[1]}>
              <ToggleInput checked={boostToggled} onClick={setBoost} />
            </TableCell>
            <TableCell width={TABLE_CELL_WIDTHS[2]}>
              <Button highlighted onClick={handleDeposit}>
                Stake
              </Button>
            </TableCell>
          </StyledRow>
          {boostToggled && (
            <LockupRow>
              <div>
                <p>
                  You will lock <span>{inputFormValue}</span> mUSD/FRAX for <span>{timeDifference}</span> and receive a boost of:
                </p>
                <span>{boostMultiplier.toFixed(3)}x</span>
              </div>
              <Slider min={sliderStart} max={sliderEnd} step={DAY} value={seconds} onChange={setValue} />
            </LockupRow>
          )}
        </StyledTable>
      )}
      {showWithdraw && (
        <StyledTable headerTitles={withdrawHeaderTitles} widths={TABLE_CELL_WIDTHS} width={48}>
          {lockedStakes?.map(({ liquidity, lockMultiplier, endTime, startTime, kekId }) => {
            const dateRange = endTime - startTime
            const unlocked = endTime < Date.now()
            const percentage = 100 * ((endTime - Date.now()) / dateRange)
            const token = 'FRAX/mUSD' // TODO: - Pull out to provider
            return (
              <StyledRow key={kekId} onClick={unlocked ? () => handleWithdraw(kekId) : undefined} buttonTitle="Withdraw">
                <TableCell width={TABLE_CELL_WIDTHS[0]}>
                  <h3>
                    <CountUp end={liquidity?.simple} decimals={2} />
                    {` ${token}`}
                  </h3>
                </TableCell>
                <MultiplierCell width={TABLE_CELL_WIDTHS[1]}>
                  <span>{lockMultiplier?.simple.toFixed(3)}x</span>
                </MultiplierCell>
                <TableCell width={TABLE_CELL_WIDTHS[2]}>
                  {unlocked ? <span>Unlocked</span> : <CountdownBar percentage={percentage} end={endTime} />}
                </TableCell>
              </StyledRow>
            )
          })}
        </StyledTable>
      )}
    </Container>
  )
}
