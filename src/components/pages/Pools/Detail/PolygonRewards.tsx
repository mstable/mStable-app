import React, { FC, useMemo, useState } from 'react'
import styled from 'styled-components'
import { formatDuration, intervalToDuration } from 'date-fns'

import { useToggle } from 'react-use'
import { useRewardStreams } from '../../../../context/RewardStreamsProvider'
import { useSelectedSaveVersion } from '../../../../context/SelectedSaveVersionProvider'
import { CountdownBar } from '../../../core/CountdownBar'
import { Slider } from '../../../core/Slider'
import { Table, TableCell, TableRow } from '../../../core/Table'
import { ToggleInput } from '../../../forms/ToggleInput'
import { Button } from '../../../core/Button'
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput'
import { AssetInput } from '../../../forms/AssetInput'

const TABLE_CELL_WIDTHS = [30, 30, 30]
const WEEK = 604800 * 1000
const YEAR = 365 * 86400 * 1000

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

const LockupRow = styled(TableRow)`
  display: flex;
  width: 100%;
  padding: 2rem;
  justify-content: flex-start;
  flex-direction: column;

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

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const Container = styled.div``

const MOCK_BALANCE = {
  balance: '12000',
}

const MOCK_DEPOSITS = [
  {
    balance: 1200,
    multiplier: 1.2,
    end: Date.now() + 1000 * 240 * 1000,
    token: 'mUSD/FRAX',
  },
  {
    balance: 1200000,
    multiplier: 1.0,
    end: Date.now() - 1000 * 240 * 1000,
    token: 'mUSD/FRAX',
  },
]

export const PolygonRewards: FC = () => {
  const sliderStart = Date.now()
  const sliderEnd = Date.now() + 3 * YEAR // 3 years
  const sliderStep = WEEK

  const rewardStreams = useRewardStreams()
  const [selectedSaveVersion] = useSelectedSaveVersion()
  const [value, setValue] = useState(sliderStart)
  const [boostToggled, setBoost] = useToggle(false)
  const [, inputFormValue, handleSetAmount] = useBigDecimalInput(MOCK_BALANCE.balance)

  const showGraph = (rewardStreams?.amounts.earned.total ?? 0) > 0 || (rewardStreams?.amounts.locked ?? 0) > 0

  const difference = useMemo(() => {
    const duration = intervalToDuration({ start: new Date(), end: value + 1000 }) // 1s off
    const nonzero = Object.entries(duration)
      .filter(([, v]) => v)
      .map(([unit]) => unit)

    if ((duration?.days ?? 0) < 1) return `0 days`

    return formatDuration(duration, {
      format: ['years', 'months', 'weeks', 'days'].filter(i => new Set(nonzero).has(i)).slice(0, 3),
      delimiter: ', ',
    })
  }, [value])

  // Assumes linear, will need to check
  const boostValue = useMemo(() => {
    const range = sliderEnd - sliderStart
    const scale = (value - sliderStart) / range
    return scale < 0 ? 1 : 2 * scale + 1
  }, [sliderEnd, sliderStart, value])

  const handleWithdraw = (end: number): void => {
    console.log(end)
  }

  const handleDeposit = (): void => {}

  const handleSetMax = (): void => {}

  return (
    <Container>
      <div>
        {showGraph ? (
          <div>
            <br />
            <Table headerTitles={['mUSD/FRAX', 'Boost Rewards', 'Time Remaining']} widths={TABLE_CELL_WIDTHS}>
              <TableRow buttonTitle="Deposit">
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
                    Deposit
                  </Button>
                </TableCell>
              </TableRow>
              {boostToggled && (
                <LockupRow>
                  <div>
                    <p>
                      You will lock <span>{inputFormValue}</span> mUSD/FRAX for <span>{difference}</span> and receive a boost of:
                    </p>
                    <span>{boostValue.toFixed(3)}x</span>
                  </div>
                  <Slider min={sliderStart} max={sliderEnd} step={sliderStep} value={value} onChange={setValue} />
                </LockupRow>
              )}
            </Table>
            <br />
            <br />
            <Table headerTitles={['Vault Balance', 'Rewards Multiplier', 'Time Remaining']} widths={TABLE_CELL_WIDTHS}>
              {MOCK_DEPOSITS.map(({ balance, end, multiplier, token }) => {
                const canWithdraw = end < Date.now()
                return (
                  <TableRow key={end} onClick={(canWithdraw && (() => handleWithdraw(end))) || undefined} buttonTitle="Withdraw">
                    <TableCell width={TABLE_CELL_WIDTHS[0]}>
                      <h3>
                        {balance} {token}
                      </h3>
                    </TableCell>
                    <TableCell width={TABLE_CELL_WIDTHS[1]}>{multiplier}x</TableCell>
                    <TableCell width={TABLE_CELL_WIDTHS[2]}>
                      {canWithdraw ? <span>Unlocked</span> : <CountdownBar percentage={50} end={end} />}
                    </TableCell>
                  </TableRow>
                )
              })}
            </Table>
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
