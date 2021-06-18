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

const TABLE_CELL_WIDTHS = [30, 30, 30]
const WEEK = 604800 * 1000
const YEAR = 365 * 86400 * 1000

const MOCK_BALANCE: { balance?: string } = {
  balance: '12000',
}

const MOCK_DEPOSITS: {
  balance: number
  multiplier: number
  end: number
  token: string
}[] = [
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

const Container = styled.div`
  background: ${({ theme }) => theme.color.background[1]};
  padding: 1rem;
  border-radius: 1rem;

  > *:not(:last-child) {
    margin-bottom: 1.5rem;
  }
`

export const StakingTimelock: FC = () => {
  const sliderStart = Date.now()
  const sliderEnd = Date.now() + 3 * YEAR // 3 years
  const sliderStep = WEEK

  const [value, setValue] = useState(sliderStart)
  const [boostToggled, setBoost] = useToggle(false)
  const [, inputFormValue, handleSetAmount] = useBigDecimalInput(MOCK_BALANCE?.balance)

  const showDeposit = !!MOCK_BALANCE?.balance
  const showWithdraw = !!MOCK_DEPOSITS.length

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

  // Assumes linear, need to check
  const boostValue = useMemo(() => {
    const range = sliderEnd - sliderStart
    const scale = (value - sliderStart) / range
    return scale < 0 ? 1 : 2 * scale + 1
  }, [sliderEnd, sliderStart, value])

  const handleWithdraw = (): void => {}

  const handleDeposit = (): void => {}

  const handleSetMax = (): void => {}

  if (!showDeposit && !showWithdraw) return null

  const depositHeaderTitles = ['Wallet', 'Boost Rewards', ''].map((t, i) =>
    i === 1 ? { title: t, tooltip: 'Lock up your tokens for a period of time to earn a boosted reward multiplier' } : { title: t },
  )
  const withdrawHeaderTitles = ['Vault', 'Rewards Multiplier', 'Time Remaining'].map(t => ({ title: t }))

  return (
    <Container>
      {showDeposit && (
        <Table headerTitles={depositHeaderTitles} widths={TABLE_CELL_WIDTHS}>
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
                  You will lock <span>{inputFormValue}</span> mUSD/FRAX for <span>{difference}</span> and receive a boost of:
                </p>
                <span>{boostValue.toFixed(3)}x</span>
              </div>
              <Slider min={sliderStart} max={sliderEnd} step={sliderStep} value={value} onChange={setValue} />
            </LockupRow>
          )}
        </Table>
      )}
      {showWithdraw && (
        <Table headerTitles={withdrawHeaderTitles} widths={TABLE_CELL_WIDTHS}>
          {MOCK_DEPOSITS.map(({ balance, end, multiplier, token }) => {
            const canWithdraw = end < Date.now()
            return (
              <StyledRow key={end} onClick={(canWithdraw && handleWithdraw) || undefined} buttonTitle="Withdraw">
                <TableCell width={TABLE_CELL_WIDTHS[0]}>
                  <h3>
                    {balance} {token}
                  </h3>
                </TableCell>
                <TableCell width={TABLE_CELL_WIDTHS[1]}>{multiplier}x</TableCell>
                <TableCell width={TABLE_CELL_WIDTHS[2]}>
                  {canWithdraw ? <span>Unlocked</span> : <CountdownBar percentage={50} end={end} />}
                </TableCell>
              </StyledRow>
            )
          })}
        </Table>
      )}
    </Container>
  )
}
