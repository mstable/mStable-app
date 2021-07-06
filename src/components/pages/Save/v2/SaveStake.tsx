import React, { FC } from 'react'
import styled from 'styled-components'

import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider'
import { MassetState } from '../../../../context/DataProvider/types'

import { MultiRewards } from '../../Pools/Detail/MultiRewards'
import { Table, TableRow, TableCell } from '../../../core/Table'
import { AssetInput } from '../../../forms/AssetInput'
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput'
import { Button } from '../../../core/Button'
import { Tooltip } from '../../../core/ReactTooltip'
import { useAvailableSaveApy } from '../../../../hooks/useAvailableSaveApy'
import { useStakingRewards } from '../hooks'

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
    margin-bottom: 0.75rem;
  }
`

const RewardAPY = styled.div`
  display: flex;
  font-size: 0.875rem;
  justify-content: center;

  div {
    background: ${({ theme }) => theme.color.green};
    color: ${({ theme }) => theme.color.white};
    margin-right: 1rem;
    border-radius: 0.75rem;
    padding: 0.25rem 0.5rem;
    align-items: center;
    display: flex;
  }

  div:first-child {
    background: ${({ theme }) => theme.color.greyTransparent};
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

export const SaveStake: FC = () => {
  const stakingRewards = useStakingRewards()
  const massetState = useSelectedMassetState()

  const {
    savingsContracts: {
      v2: { token: saveToken },
    },
  } = massetState as MassetState

  const saveApy = useAvailableSaveApy()

  const saveBalance = saveToken?.balance
  const stakedBalance = stakingRewards?.stakingBalance

  const [, saveFormValue, setSaveAmount] = useBigDecimalInput((saveBalance?.simple ?? 0).toString())
  const [, stakedFormValue, setStakedAmount] = useBigDecimalInput((stakedBalance?.simple ?? 0).toString())

  const handleStake = (): void => {}
  const handleUnstake = (): void => {}
  const handleRewardClaim = (): void => {}

  const rewardsData = stakingRewards
    ? [
        {
          symbol: stakingRewards.rewardsToken.symbol,
          amount: stakingRewards.stakingReward.amount,
        },
        {
          symbol: stakingRewards.platformRewards?.platformToken.symbol,
          amount: stakingRewards.platformRewards?.platformReward.amount,
        },
      ]
    : []

  return (
    <Container>
      <RewardContainer>
        {!stakedBalance?.simple && !!saveBalance?.simple ? (
          <p>Stake to earn rewards in addition to native yield</p>
        ) : (
          !saveBalance?.simple && !stakedBalance?.simple && <p>Deposit to get imUSD and then stake to earn rewards</p>
        )}
        <RewardAPY>
          <div>
            <Tooltip tip="Native imUSD base yield" hideIcon>
              <span>{saveApy?.value?.toFixed(2)}%</span>
            </Tooltip>
          </div>
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
      {!!stakedBalance?.simple && (
        <StyledTable headerTitles={[{ title: 'Staked Balance' }]}>
          <StyledRow buttonTitle="Stake">
            <TableCell width={70}>
              <Input
                handleSetAmount={setStakedAmount}
                handleSetMax={() => setStakedAmount(stakedBalance?.simple?.toString() ?? '0')}
                formValue={stakedFormValue}
              />
            </TableCell>
            <TableCell width={30}>
              <Button onClick={handleUnstake}>Unstake</Button>
            </TableCell>
          </StyledRow>
        </StyledTable>
      )}
      {!!saveBalance?.simple && (
        <>
          <StyledTable headerTitles={[{ title: 'Unstaked Balance' }]}>
            <StyledRow buttonTitle="Stake">
              <TableCell width={70}>
                <Input
                  handleSetAmount={setSaveAmount}
                  handleSetMax={() => setSaveAmount(saveBalance?.simple?.toString() ?? '0')}
                  formValue={saveFormValue}
                  // FIXME: - change for contract address
                  spender="0xf38522f63f40f9dd81abafd2b8efc2ec958a3016"
                />
              </TableCell>
              <TableCell width={20}>
                <Button highlighted onClick={handleStake}>
                  Stake
                </Button>
              </TableCell>
            </StyledRow>
          </StyledTable>
        </>
      )}
      <MultiRewards rewards={rewardsData} onClaimRewards={handleRewardClaim} />
    </Container>
  )
}
