import React, { FC } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'
import { BoostedSavingsVault__factory, BoostedSavingsVault } from '@mstable/protocol/dist/types/generated'

import { format, fromUnixTime } from 'date-fns'
import { useToggle } from 'react-use'
import { StreamType, useRewardStreams } from '../../../../context/RewardStreamsProvider'
import { usePropose } from '../../../../context/TransactionsProvider'
import { useIsMasquerading, useSigner } from '../../../../context/AccountProvider'
import { useSelectedSaveVersion } from '../../../../context/SelectedSaveVersionProvider'
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider'

import { TransactionManifest } from '../../../../web3/TransactionManifest'
import { Interfaces } from '../../../../types'
import { SendButton } from '../../../forms/SendButton'
import { CountUp } from '../../../core/CountUp'
import { useSelectedFeederPoolVaultContract } from '../FeederPoolProvider'
import { rewardsColorMapping } from '../constants'
import { ClaimGraph } from './ClaimGraph'
import { Table, TableCell, TableRow } from '../../../core/Table'
import { Button } from '../../../core/Button'

const useSelectedSaveVaultContract = (): BoostedSavingsVault | undefined => {
  const signer = useSigner()
  const masset = useSelectedMassetState()
  const vaultAddress = masset?.savingsContracts?.v2?.boostedSavingsVault?.address
  if (!signer || !vaultAddress) return
  return BoostedSavingsVault__factory.connect(vaultAddress, signer)
}

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const RewardValues = styled.div`
  > div {
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.l}) {
    display: flex;
    > div {
      flex-basis: 33%;
      margin-bottom: 0;
      margin-right: 1rem;
      padding: 0.75rem 1.5rem;
      &:last-child {
        margin-right: 0;
      }
    }
  }
`

const RewardValueContainer = styled.div<{ streamType: StreamType }>`
  display: flex;
  flex-direction: column;
  transition: background-color 0.5s ease;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;

  > *:not(:last-child) {
    margin-bottom: 0.25rem;
  }

  > :first-child {
    display: flex;
    justify-content: space-between;

    span {
      transition: color 0.5s ease;
      font-size: 1.25rem;
    }
    > h4 {
      font-weight: 600;
    }

    transition: color 0.5s ease;
  }
  > :last-child {
    > div {
      margin-top: 0.5rem;
      color: ${({ theme }) => theme.color.bodyAccent};
      font-size: 0.85rem;
    }
    font-size: 0.85rem;
  }

  ${({ streamType, theme }) => `
  background: ${rewardsColorMapping[streamType].fill2};
  
  > :first-child {
    color: ${theme.isLight ? rewardsColorMapping[streamType].light : rewardsColorMapping[streamType].dark};
  }
  > :last-child span {
    color: ${rewardsColorMapping[streamType].point}};
  }
`}
`

const ClaimButton = styled(SendButton)<{ visible: boolean }>`
  transition-property: opacity, height, visibility;
  transition-duration: 0.5s, 0.5s, 0.5s;
  transition-timing-function: ease, ease, ease;
  ${({ visible }) => `
  visibility: ${visible ? 'visible' : 'hidden'};
  opacity: ${visible ? 1 : 0};
  height: ${visible ? 1 : 0};
  flex-basis: ${visible ? `flex-basis: calc(50% - 0.5rem)` : '0'};
`}
`

const ToggleViewButton = styled(Button)`
  border-radius: 0.75rem;
`

const ClaimContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;

  > * {
    height: 2.75rem;
  }

  > div {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  button {
    height: 2.75rem;
    min-width: 11rem;
    width: 100%;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.l}) {
    align-items: flex-end;
    flex-direction: row;

    > div {
      width: calc(33% - 0.5rem);
    }

    > div:not(:last-child) {
      margin-right: 1rem;
    }
  }
`

const GraphAndValues = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-bottom: 0;

  > div:first-child {
    display: none;
  }

  > *:not(:last-child) {
    margin-bottom: 1rem;
  }

  > * {
    min-width: 11rem;
    border-radius: 2rem;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    > div:first-child {
      display: inherit;
    }
  }
`

const CustomTable = styled(Table)`
  tbody span {
    font-weight: normal !important;
    margin-left: 0.5rem;
  }
`

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 1rem;

  > button {
    width: 100%;
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.color.body};
    margin-bottom: 0.5rem;
  }
`

const RewardsCard = styled(Card)`
  display: block;

  > div {
    > :first-child {
      display: flex;
      justify-content: space-between;
      > div {
        font-size: 1.125rem; // 18px
        h4 {
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
        }
      }
    }
    > *:not(:last-child) {
      margin-bottom: 1rem;
    }
  }
`
const RewardValue: FC<{
  title: string
  value?: number
  streamType: StreamType
  label: string
}> = ({ title, value, streamType, label }) => (
  <RewardValueContainer streamType={streamType}>
    <div>
      <h4>{title}</h4>
      {typeof value === 'number' ? (
        <div>
          <CountUp end={value as number} />
        </div>
      ) : (
        <Skeleton height={20} />
      )}
    </div>
    <div>{label}</div>
  </RewardValueContainer>
)

export const UserRewards: FC = () => {
  const rewardStreams = useRewardStreams()
  const isMasquerading = useIsMasquerading()

  const feederVault = useSelectedFeederPoolVaultContract()
  const saveVault = useSelectedSaveVaultContract()
  const [selectedSaveVersion] = useSelectedSaveVersion()
  const [showLockTable, toggleLockTable] = useToggle(true)

  const propose = usePropose()
  const contract = feederVault ?? saveVault

  const showGraph = (rewardStreams?.amounts.earned.total ?? 0) > 0 || (rewardStreams?.amounts.locked ?? 0) > 0
  const canClaim = rewardStreams && rewardStreams.amounts.unclaimed > 0

  const headerTitles = ['Date unlocked', 'Amount'].map(t => ({ title: t }))

  return (
    <RewardsCard>
      <div>
        {showGraph ? (
          <>
            {showLockTable ? (
              <GraphAndValues>
                <ClaimGraph />
                <RewardValues>
                  <RewardValue
                    title="Unclaimed"
                    label="Sent to you now"
                    value={rewardStreams?.amounts.earned.unlocked}
                    streamType={StreamType.Earned}
                  />
                  <RewardValue
                    title="Unlocked"
                    label={(rewardStreams?.amounts.unlocked ?? 0) > 0 ? `Sent to you now` : `From previous claims`}
                    value={rewardStreams?.amounts.unlocked}
                    streamType={StreamType.Unlocked}
                  />
                  <RewardValue
                    title="Locked"
                    label="From previous earnings"
                    value={(rewardStreams?.amounts.previewLocked ?? 0) + (rewardStreams?.amounts.locked ?? 0)}
                    streamType={StreamType.Locked}
                  />
                </RewardValues>
              </GraphAndValues>
            ) : (
              <CustomTable headerTitles={headerTitles}>
                {rewardStreams?.lockedStreams?.map(stream => (
                  <TableRow key={stream.start} buttonTitle="View">
                    <TableCell width={75}>
                      {format(fromUnixTime(stream.finish), 'dd.MM.yy')}
                      <span>&nbsp;{format(fromUnixTime(stream.finish), 'HH:mm')}</span>
                    </TableCell>
                    <TableCell>
                      <p>{(stream.amount?.[2] ?? stream.amount?.[3])?.toFixed(2)} MTA</p>
                    </TableCell>
                  </TableRow>
                ))}
              </CustomTable>
            )}
            <ClaimContainer>
              <div>
                <ToggleViewButton onClick={toggleLockTable}>{showLockTable ? `View Table` : `View Chart`}</ToggleViewButton>
              </div>
              {!isMasquerading && (
                <ClaimButton
                  visible
                  valid={!!canClaim}
                  title="Claim Rewards"
                  handleSend={() => {
                    if (contract && rewardStreams) {
                      propose<Interfaces.BoostedSavingsVault, 'claimRewards(uint256,uint256)'>(
                        new TransactionManifest(contract, 'claimRewards(uint256,uint256)', rewardStreams.claimRange, {
                          present: 'Claiming rewards',
                          past: 'Claimed rewards',
                        }),
                      )
                    }
                  }}
                />
              )}
            </ClaimContainer>
          </>
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
    </RewardsCard>
  )
}
