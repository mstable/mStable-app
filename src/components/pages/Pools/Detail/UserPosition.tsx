import React, { FC, useMemo } from 'react';
import { useToggle } from 'react-use';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';

import { ViewportWidth } from '../../../../theme';
import { CountUp, CountUpUSD } from '../../../core/CountUp';
import { useSelectedMassetPrice } from '../../../../hooks/usePrice';
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
import { useIsMasquerading } from '../../../../context/UserProvider';
import { Tooltip } from '../../../core/ReactTooltip';

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 1rem;
  padding: 1rem;

  > button {
    width: 100%;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.color.body};
    margin-bottom: 0.75rem;
  }
`;

const PositionContainer = styled(Card)`
  border: 1px ${({ theme }) => theme.color.bodyTransparent} solid;
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    h4 {
      font-weight: 600;
    }

    > div:not(:last-child) {
      margin-bottom: 1rem;
    }
  }

  @media (min-width: ${ViewportWidth.s}) {
    > div {
      flex-direction: row;
      flex-wrap: wrap;

      > div {
        flex-basis: calc(50% - 0.5rem);
      }

      > div:nth-child(even) {
        text-align: right;
      }
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    > div {
      > div {
        flex-basis: 0;
        flex: 1;
      }

      > div:nth-child(even) {
        text-align: left;
      }
    }
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

const Position: FC = () => {
  const {
    totalSupply,
    vault,
    token,
    title,
    account,
    price: currentPrice,
  } = useSelectedFeederPoolState();
  const massetPrice = useSelectedMassetPrice() ?? 1;

  const userAmount = token.balance?.simple ?? 0;
  const userStakedAmount = vault.account?.rawBalance.simple ?? 0;

  const poolTotal = totalSupply.simple;
  const poolPercentage = 100 * ((userAmount + userStakedAmount) / poolTotal);

  const feesEarned = useMemo<[number, number]>(() => {
    if (account) {
      const {
        balanceVault,
        balance,
        cumulativeEarned,
        cumulativeEarnedVault,
        price,
        priceVault,
      } = account;

      const currentEarned =
        price.simple < currentPrice.simple
          ? balance.simple * currentPrice.simple - balance.simple * price.simple
          : cumulativeEarned.simple;

      const currentEarnedVault =
        priceVault.simple < currentPrice.simple
          ? balanceVault.simple * currentPrice.simple -
            balanceVault.simple * priceVault.simple
          : cumulativeEarnedVault.simple;

      return [currentEarned, currentEarnedVault];
    }

    return [0, 0];
  }, [account, currentPrice]);

  return (
    <PositionContainer>
      <div>
        <h3>My Position</h3>
        <div>
          <div>
            <h4>Pool Share</h4>
            <CountUp end={poolPercentage} decimals={4} suffix="%" />
          </div>
          <div>
            <Tooltip
              tip={`${token.symbol} $${feesEarned[0].toFixed(10)}, ${
                token.symbol
              } Vault $${feesEarned[1].toFixed(10)}`}
            >
              <h4>Fees earned</h4>
            </Tooltip>
            <CountUpUSD
              end={feesEarned[0] + feesEarned[1]}
              decimals={10}
              price={massetPrice}
            />
          </div>
          <div>
            <h4>{title} Staked</h4>
            <CountUpUSD end={userStakedAmount} price={massetPrice} />
          </div>
          <div>
            <h4>{title} Balance</h4>
            <CountUpUSD end={userAmount} price={massetPrice} />
          </div>
        </div>
      </div>
    </PositionContainer>
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
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  transition: background-color 0.5s ease;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;

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
  const isMasquerading = useIsMasquerading();
  const [isClaiming, toggleIsClaiming] = useToggle(false);
  const canClaim = rewardStreams && rewardStreams.amounts.unclaimed > 0;

  const propose = usePropose();
  const contract = useSelectedFeederPoolVaultContract();

  const totalEarned = rewardStreams?.amounts.earned.total ?? 0;

  return (
    <RewardsCard>
      <div>
        <div>
          <h3>My Rewards</h3>
          <div>
            <h4>Total earnings</h4>
            <div>
              <CountUp end={totalEarned} /> MTA
            </div>
          </div>
        </div>
        {totalEarned > 0 && (
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
        )}
      </div>
    </RewardsCard>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 1rem 0;
  display: flex;
  flex-direction: column;

  > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`;

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
          <Position />
          <Rewards />
        </>
      )}
    </Container>
  );
};
