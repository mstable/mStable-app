import React, { FC, ReactElement, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'

import { useEffectOnce } from 'react-use'
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider'
import { MassetState } from '../../../../context/DataProvider/types'
import { useRewardStreams } from '../../../../context/RewardStreamsProvider'
import { useSelectedMassetPrice } from '../../../../hooks/usePrice'
import { FetchState } from '../../../../hooks/useFetchState'
import { BigDecimal } from '../../../../web3/BigDecimal'

import { SavePosition } from './SavePosition'
import { useAvailableSaveApy } from '../../../../hooks/useAvailableSaveApy'
import { MultiRewards } from '../../Pools/Detail/MultiRewards'
import { FraxTimelock } from '../../Pools/Detail/FraxTimelock'
import { Table, TableRow, TableCell } from '../../../core/Table'
import { AssetInput } from '../../../forms/AssetInput'
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput'
import { Button } from '../../../core/Button'
import { Tooltip } from '../../../core/ReactTooltip'
import { CountUp } from '../../../core/CountUp'

// TODO: - replace with subscribedtoken when available

const MOCK_REWARDS = [
  {
    address: '0x0000000000000000000000000000000000000000',
    amount: BigDecimal.ONE,
  },
  {
    address: '0x273bc479e5c21caa15aa8538decbf310981d14c0',
    amount: BigDecimal.ZERO,
  },
]

enum Selection {
  Balance = 'Balance',
  Rewards = 'Rewards',
}

const { Balance, Rewards } = Selection

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

  td {
    padding: 0 0.75rem 0 0.5rem;
  }

  :hover {
    background: ${({ theme, onClick }) => onClick && theme.color.background[1]};
  }
`

const RewardContainer = styled.div`
  border: 1px dashed ${({ theme }) => theme.color.background[3]};
  border-radius: 1rem;
  padding: 1rem;
  align-items: center;
  text-align: center;

  p {
    line-height: 1.5rem;
  }

  p:first-child {
    margin-bottom: 0.5rem;
  }
`

const RewardAPY = styled.div`
  display: flex;
  font-size: 0.875rem;
  justify-content: center;

  div {
    background: ${({ theme }) => theme.color.primary};
    color: ${({ theme }) => theme.color.white};
    margin-right: 1rem;
    border-radius: 0.75rem;
    padding: 0.25rem 0.5rem;
  }

  span {
    ${({ theme }) => theme.mixins.numeric};
  }
`

const StyledTable = styled(Table)`
  background: ${({ theme }) => theme.color.background[1]};
  padding: 0.5rem;
  border-radius: 1rem;
  margin-bottom: 1rem;

  h3 {
    font-weight: 600;
    margin-left: 0.5rem;
    margin-bottom: 0.5rem;
  }
`

const Container = styled.div`
  width: 100%;
  > div {
    margin-bottom: 1.25rem;
  }
`

interface BoostedApy {
  base: number
  userBoost?: number
  maxBoost: number
}

interface PoolsAPIResponse {
  pools: {
    name: string
    apy: string
    apyDetails:
      | {
          rewardsOnlyBase: string
          rewardsOnlyMax: string
          combinedBase: string
          combinedMax: string
          yieldOnly: string
        }
      | {
          rewardsOnlyBase: string
          rewardsOnlyMax: string
        }
    pair: string[]
    pairLink: string
    poolRewards: string[]
    totalStakedUSD: string
    logo: string
  }[]
}

// FIXME sir - change pattern
let cachedAPY: FetchState<BoostedApy> = { fetching: true }

// TODO this can be done without API
const useSaveVaultAPY = (symbol?: string, userBoost?: number): FetchState<BoostedApy> => {
  useEffectOnce(() => {
    if (!symbol) return

    fetch('https://api-dot-mstable.appspot.com/pools')
      .then(res =>
        res.json().then(({ pools }: PoolsAPIResponse) => {
          const pool = pools.find(p => p.pair[0] === symbol)
          if (!pool) return
          const base = parseFloat(pool?.apyDetails.rewardsOnlyBase)
          const maxBoost = parseFloat(pool?.apyDetails.rewardsOnlyMax)
          cachedAPY = {
            value: {
              base,
              maxBoost,
            },
          }
        }),
      )
      .catch(error => {
        cachedAPY = { error: error.message }
      })
  })

  const apy = useMemo(() => {
    if (!cachedAPY?.value) return cachedAPY
    return {
      value: {
        base: cachedAPY.value.base,
        maxBoost: cachedAPY.value.maxBoost,
        userBoost: (userBoost ?? 1) * cachedAPY.value.base,
      },
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userBoost, symbol, cachedAPY])

  return apy
}

const components: Record<string, ReactElement> = {
  [Balance]: <SavePosition />,
  // [Rewards]: <FraxRewards />,
}

export const SaveStake: FC = () => {
  const [selection, setSelection] = useState<Selection | undefined>()
  const massetState = useSelectedMassetState()

  const {
    savingsContracts: {
      v2: { token: saveToken, latestExchangeRate: { rate: saveExchangeRate } = {} },
    },
  } = massetState as MassetState

  const saveBalance = useMemo(() => {
    const balance = saveToken?.balance
    return balance ?? BigDecimal.ZERO
  }, [saveToken])

  const saveBalanceUSD = useMemo(() => {
    return saveBalance.mulTruncate(saveExchangeRate?.exact ?? BigDecimal.ONE.exact)
  }, [saveBalance, saveExchangeRate])

  const apy = useAvailableSaveApy()

  const handleSelection = useCallback((newValue: Selection) => setSelection(selection === newValue ? undefined : newValue), [selection])

  const stakedBalance = new BigDecimal((1e18).toString()) // change to use data

  const [saveValue, saveFormValue, setSaveAmount] = useBigDecimalInput((saveBalance?.simple ?? 0).toString())
  const [stakedValue, stakedFormValue, setStakedAmount] = useBigDecimalInput((stakedBalance?.simple ?? 0).toString())

  return (
    <Container>
      <RewardContainer>
        {!stakedBalance?.simple && saveBalance?.simple > 0 ? (
          <p>Stake to earn rewards in addition to native yield</p>
        ) : (
          !saveBalance?.simple &&
          !stakedBalance?.simple && <p>Deposit to get imUSD and stake to earn rewards in addition to native yield</p>
        )}
        <RewardAPY>
          <div>
            <Tooltip tip="Reward rate annualized" hideIcon>
              <span>+3.07%</span> WMATIC
            </Tooltip>
          </div>
          <div>
            <Tooltip tip="Reward rate annualized" hideIcon>
              <span>+4.02%</span> MTA
            </Tooltip>
          </div>
        </RewardAPY>
      </RewardContainer>
      {stakedBalance?.simple > 0 && (
        <StyledTable headerTitles={[{ title: 'Staked Balance' }]}>
          <StyledRow buttonTitle="Stake">
            <TableCell width={70}>
              <Input
                handleSetAmount={setStakedAmount}
                handleSetMax={() => setStakedAmount(stakedBalance?.simple?.toString() ?? '0')}
                formValue={stakedFormValue}
              />
            </TableCell>
            <TableCell width={20}>
              <Button onClick={() => console.log(saveBalance?.simple)}>Unstake</Button>
            </TableCell>
          </StyledRow>
        </StyledTable>
      )}
      {saveBalance?.simple > 0 && (
        <>
          <StyledTable headerTitles={[{ title: 'Unstaked Balance' }]}>
            <StyledRow buttonTitle="Stake">
              <TableCell width={70}>
                <Input
                  handleSetAmount={setSaveAmount}
                  handleSetMax={() => setSaveAmount(saveBalance?.simple?.toString() ?? '0')}
                  formValue={saveFormValue}
                  spender="0xf38522f63f40f9dd81abafd2b8efc2ec958a3016"
                />
              </TableCell>
              <TableCell width={20}>
                <Button onClick={() => console.log(saveBalance?.simple)}>Stake</Button>
              </TableCell>
            </StyledRow>
          </StyledTable>
        </>
      )}
      <MultiRewards rewards={MOCK_REWARDS} canClaim={!!MOCK_REWARDS?.find(v => (v?.amount?.simple ?? 0) > 0) ?? [].length} />
    </Container>
  )
}
