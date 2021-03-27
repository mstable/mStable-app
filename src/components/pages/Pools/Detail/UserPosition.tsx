import React, { FC } from 'react';
import { useToggle } from 'react-use';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

import { ViewportWidth } from '../../../../theme';
import { CountUp } from '../../../core/CountUp';
import {
  useSelectedFeederPoolState,
  useSelectedFeederPoolVaultContract,
} from '../FeederPoolProvider';
import { ClaimGraph } from './ClaimGraph';
import { StreamType, useRewardStreams } from './useRewardStreams';
import { Button } from '../../../core/Button';
import { rewardsColorMapping } from '../constants';
import { SendButton } from '../../../forms/SendButton';
import { usePropose } from '../../../../context/TransactionsProvider';
import { Interfaces } from '../../../../types';
import { TransactionManifest } from '../../../../web3/TransactionManifest';

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 1rem;
  padding: 1rem;

  > button {
    width: 100%;
  }

  > div {
    display: flex;
    flex-direction: column;

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: ${({ theme }) => theme.color.body};
      margin-bottom: 0.75rem;
    }
  }
`;

const PoolShareContainer = styled(Card)`
  background: ${({ theme }) => theme.color.backgroundAccent};

  > div:last-child {
    text-align: right;
  }

  span {
    ${({ theme }) => theme.mixins.numeric};
    font-size: 1.125rem;
  }
`;

const GetLPCard = styled(Card)`
  background: ${({ theme }) => theme.color.backgroundAccent};
  flex-direction: column;
  align-items: center;

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    align-items: flex-start;

    > div {
      margin-bottom: 0;
    }

    > button {
      width: inherit;
    }
  }
`;

const Container = styled.div`
  width: 100%;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;

  > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

const PoolShare: FC = () => {
  const { totalSupply, vault, token, title } = useSelectedFeederPoolState();

  const userAmount = token.balance?.simple ?? 0;
  const userStakedAmount = vault.account?.rawBalance.simple ?? 0;

  const poolTotal = totalSupply.simple;
  const poolPercentage = 100 * ((userAmount + userStakedAmount) / poolTotal);

  // TODO show unstaked amount (i.e. regular balance)

  return (
    <PoolShareContainer>
      <div>
        <h3>My Pool Share</h3>
        <span>{poolPercentage.toFixed(4)}%</span>
      </div>
      <div>
        <h3>Staked</h3>
        <span>{`${userStakedAmount?.toFixed(2) ?? '–'} ${
          (!!userStakedAmount && title) || ''
        }`}</span>
      </div>
    </PoolShareContainer>
  );
};

const GetLP: FC = () => {
  const feederPool = useSelectedFeederPoolState();
  return (
    <GetLPCard>
      <div>
        <h3>Need {feederPool.token.symbol} tokens to stake?</h3>
        <p>
          Provide liquidity by depositing below, and stake to earn rewards in
          addition to trade fees
        </p>
      </div>
    </GetLPCard>
  );
};

const RewardValues = styled.div`
  > div {
    margin-bottom: 0.5rem;
    &:last-child {
      margin-bottom: 0;
    }
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.m}) {
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

const ClaimContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  button {
    height: 2.75rem;
  }
`;

const GraphAndValues = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-bottom: 0;

  > *:not(:last-child) {
    margin-bottom: 1rem;
  }

  > * {
    min-width: 11rem;
    border-radius: 2rem;
  }
`;

const RewardsCard = styled(Card)`
  display: block;
  border: 1px ${({ theme }) => theme.color.bodyTransparent} solid;

  > div {
    > :first-child {
      display: flex;
      justify-content: space-between;
      > div {
        text-align: right;
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

const RewardValueContainer = styled.div<{ streamType: StreamType }>`
  @media (min-width: ${ViewportWidth.s}) {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    transition: background-color 0.5s ease;
    padding: 0.25rem 0.5rem;
    border-radius: 0.75rem;
    min-height: 5.5rem;

    > :first-child {
      > h4 {
        font-weight: 600;
      }
      > div {
        font-size: 0.85rem;
      }
      transition: color 0.5s ease;
    }
    > :last-child {
      text-align: right;
      span {
        transition: color 0.5s ease;
        font-size: 1.25rem;
      }
      > div {
        margin-top: 0.5rem;
        color: ${({ theme }) => theme.color.bodyAccent};
        font-size: 0.85rem;
      }
    }
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
  transition: all 1s ease;
  ${({ visible }) => `
  visibility: ${visible ? 'visible' : 'hidden'};
  opacity: ${visible ? 1 : 0};
`}
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
      <div>{showPreview ? previewLabel : label}</div>
    </div>
    {typeof value === 'number' || typeof previewValue === 'number' ? (
      <div>
        <CountUp
          end={showPreview ? (previewValue as number) : (value as number)}
        />
      </div>
    ) : (
      <Skeleton height={20} />
    )}
  </RewardValueContainer>
);

const Rewards: FC = () => {
  const rewardStreams = useRewardStreams();
  const [isClaiming, toggleIsClaiming] = useToggle(false);
  const canClaim = rewardStreams && rewardStreams.amounts.unclaimed > 0;

  const propose = usePropose();
  const contract = useSelectedFeederPoolVaultContract();

  const isZeroState = (rewardStreams?.amounts.earned.cumulative ?? 0) > 0;

  return (
    <RewardsCard>
      <div>
        <div>
          <h3>My Rewards</h3>
          <div>
            <h4>Total earnings</h4>
            <div>
              <CountUp end={rewardStreams?.amounts.earned.cumulative ?? 0} />{' '}
              MTA
            </div>
          </div>
        </div>
        {isZeroState && (
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
            <ClaimContainer>
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
          </GraphAndValues>
        )}
      </div>
    </RewardsCard>
  );
};

export const UserPosition: FC = () => {
  const { token, vault } = useSelectedFeederPoolState();

  const userAmount = token.balance?.simple ?? 0;
  const userStakedAmount = vault.account?.rawBalance.simple ?? 0;

  const showLiquidityMessage = !userAmount && !userStakedAmount;

  return (
    <Container>
      {showLiquidityMessage ? (
        <GetLP />
      ) : (
        <>
          <PoolShare />
          <Rewards />
        </>
      )}
    </Container>
  );
};
