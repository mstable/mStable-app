import React, { FC } from 'react';
import { useToggle } from 'react-use';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

import { CountUp } from '../../../core/CountUp';
import { useSelectedFeederPoolVaultContract } from '../FeederPoolProvider';
import { ClaimGraph } from './ClaimGraph';
import {
  StreamType,
  useRewardStreams,
} from '../../../../context/RewardStreamsProvider';
import { Button } from '../../../core/Button';
import { rewardsColorMapping } from '../constants';
import { SendButton } from '../../../forms/SendButton';
import { usePropose } from '../../../../context/TransactionsProvider';
import { Interfaces } from '../../../../types';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { useIsMasquerading } from '../../../../context/UserProvider';
import { useSelectedSaveVaultContract } from '../../../../context/DataProvider/DataProvider';
import { useSelectedSaveVersion } from '../../../../context/SelectedSaveVersionProvider';

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

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
`;

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

  ${({ streamType }) => `
  background: ${rewardsColorMapping[streamType].fill2};
  
  > :first-child {
    color: ${rewardsColorMapping[streamType].dark}};
  }
  > :last-child span {
    color: ${rewardsColorMapping[streamType].point}};
  }
`}
`;

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
`;

const ClaimContainer = styled.div<{ isClaiming?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  > * {
    flex-basis: calc(50% - 0.5rem);
    height: 2.75rem;
  }

  > div {
    width: 100%;
  }

  button {
    height: 2.75rem;
    min-width: 11rem;
    margin-bottom: 0.5rem;
    width: 100%;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
    flex-direction: ${({ isClaiming }) => (isClaiming ? 'row-reverse' : 'row')};

    button {
      margin-bottom: 0;
    }
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.l}) {
    justify-content: ${({ isClaiming }) =>
      isClaiming ? 'flex-start' : 'flex-end'};

    > * {
      flex-basis: calc(33% - 0.5rem);
    }
    > *:first-child {
      margin-right: ${({ isClaiming }) => (isClaiming ? '0' : '1rem')};
      margin-left: ${({ isClaiming }) => (isClaiming ? '1rem' : '0')};
    }
  }
`;

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
`;

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
`;

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
`;
const RewardValue: FC<{
  title: string;
  value?: number;
  previewValue?: number;
  previewLabel?: string;
  showPreview?: boolean;
  streamType: StreamType;
  label: string;
}> = ({
  title,
  value,
  streamType,
  label,
  previewLabel,
  previewValue,
  showPreview,
}) => (
  <RewardValueContainer streamType={streamType}>
    <div>
      <h4>{title}</h4>
      {typeof value === 'number' || typeof previewValue === 'number' ? (
        <div>
          <CountUp
            end={showPreview ? (previewValue as number) : (value as number)}
          />
        </div>
      ) : (
        <Skeleton height={20} />
      )}
    </div>
    <div>{showPreview ? previewLabel : label}</div>
  </RewardValueContainer>
);

export const UserRewards: FC = () => {
  const rewardStreams = useRewardStreams();
  const isMasquerading = useIsMasquerading();
  const [isClaiming, toggleIsClaiming] = useToggle(false);

  const feederVault = useSelectedFeederPoolVaultContract();
  const saveVault = useSelectedSaveVaultContract();
  const [selectedSaveVersion] = useSelectedSaveVersion();

  const propose = usePropose();
  const contract = feederVault ?? saveVault;

  const totalEarned = rewardStreams?.amounts.earned.total ?? 0;
  const canClaim = rewardStreams && rewardStreams.amounts.unclaimed > 0;

  return (
    <RewardsCard>
      <div>
        {totalEarned > 0 ? (
          <GraphAndValues>
            <ClaimGraph showPreview={isClaiming} />
            <RewardValues>
              <RewardValue
                title="Unclaimed"
                label="Current earnings"
                previewLabel="Sent to you now"
                value={rewardStreams?.amounts.earned.total}
                previewValue={rewardStreams?.amounts.earned.unlocked}
                streamType={StreamType.Earned}
                showPreview={isClaiming}
              />
              <RewardValue
                title="Unlocked"
                label="From previous claims"
                previewLabel="Sent to you now"
                value={rewardStreams?.amounts.unlocked}
                previewValue={rewardStreams?.amounts.unlocked}
                streamType={StreamType.Unlocked}
                showPreview={isClaiming}
              />
              <RewardValue
                title="Locked"
                label="From previous earnings"
                previewLabel="Added to a new lockup"
                value={rewardStreams?.amounts.locked}
                previewValue={rewardStreams?.amounts.previewLocked}
                streamType={StreamType.Locked}
                showPreview={isClaiming}
              />
            </RewardValues>
            {!isMasquerading && (
              <ClaimContainer isClaiming={isClaiming}>
                <ClaimButton
                  visible={isClaiming}
                  valid={isClaiming}
                  title="Claim Rewards"
                  handleSend={() => {
                    if (contract && rewardStreams) {
                      propose<
                        Interfaces.BoostedSavingsVault,
                        'claimRewards(uint256,uint256)'
                      >(
                        new TransactionManifest(
                          contract,
                          'claimRewards(uint256,uint256)',
                          rewardStreams.claimRange,
                          {
                            present: 'Claiming rewards',
                            past: 'Claimed rewards',
                          },
                        ),
                      );
                    }
                  }}
                />
                {canClaim && (
                  <Button onClick={toggleIsClaiming}>
                    {isClaiming ? 'Cancel' : 'Preview Claim'}
                  </Button>
                )}
              </ClaimContainer>
            )}
          </GraphAndValues>
        ) : (
          <EmptyState>
            <h3>No rewards to claim</h3>
            {selectedSaveVersion === 1 ? (
              <p>
                Migrate your balance and deposit to the Vault to earn MTA
                rewards.
              </p>
            ) : (
              <p>Deposit to the Vault to earn MTA rewards.</p>
            )}
          </EmptyState>
        )}
      </div>
    </RewardsCard>
  );
};
