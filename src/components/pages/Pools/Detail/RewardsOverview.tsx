import React, { FC } from 'react';
import styled from 'styled-components';

import { ViewportWidth } from '../../../../theme';
import { Button } from '../../../core/Button';
import { useRewards } from '../../Save/v2/RewardsProvider';
import { CountUp } from '../../../core/CountUp';
import { useSelectedFeederPoolState } from '../FeederPoolProvider';

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
    margin-bottom: 1rem;

    h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: ${({ theme }) => theme.color.body};
      margin-bottom: 0.75rem;
    }

    p,
    span {
      color: ${({ theme }) => theme.color.body};
    }
  }
`;

const PoolInfo = styled(Card)`
  background: ${({ theme }) => theme.color.backgroundAccent};

  > div:last-child {
    text-align: right;
  }
`;

const EarnInfo = styled(Card)`
  border: 1px solid ${({ theme }) => theme.color.accent};
`;

const Stats = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    flex: 1;
    margin-bottom: 1rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    justify-content: space-between;
    flex-direction: row;

    > div {
      flex: 0;
      margin-bottom: 0;
    }

    > div:first-child {
      flex-basis: calc(60% - 0.5rem);
    }
    > div:last-child {
      flex-basis: calc(40% - 0.5rem);
    }
  }
`;

const GetLP = styled(Card)`
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
`;

// TODO wrap this so that we can supply a feeder pool or earn pool or whatever
export const RewardsOverview: FC = () => {
  const { token, totalSupply, vault, title } = useSelectedFeederPoolState();

  const poolTotal = totalSupply.simple;
  const userAmount = token.balance?.simple ?? 0;
  const userStakedAmount = vault.account?.rawBalance.simple ?? 0;

  const rewards = useRewards();
  const unclaimedAmount = rewards?.now.claimable;

  // TODO consider just using staked amount?
  const poolPercentage = 100 * ((userAmount + userStakedAmount) / poolTotal);

  const showLiquidityMessage = !userAmount && !userStakedAmount;

  return (
    <Container>
      {showLiquidityMessage ? (
        <GetLP>
          <div>
            <h3>Need LP tokens to stake?</h3>
            <p>
              Provide liquidity and stake to earn rewards in addition to trade
              fees
            </p>
          </div>
          <Button
            onClick={() => {
              // TODO
              // eslint-disable-next-line no-alert
              alert('TODO add liquidity');
            }}
          >
            Add Liquidity
          </Button>
        </GetLP>
      ) : (
        <Stats>
          <PoolInfo>
            <div>
              <h3>Pool Share</h3>
              <span>{poolPercentage.toFixed(4)}%</span>
            </div>
            <div>
              <h3>Staked</h3>
              <span>{`${userStakedAmount?.toFixed(2) ?? '–'} ${
                (!!userStakedAmount && title) || ''
              }`}</span>
            </div>
          </PoolInfo>
          <EarnInfo>
            <div>
              <h3>Earn Rewards</h3>
              {!unclaimedAmount ? (
                <span>
                  Provide liquidity and stake to earn rewards in addition to
                  trade fees
                </span>
              ) : (
                <Button
                  onClick={() => {
                    // TODO
                    // eslint-disable-next-line no-alert
                    alert('TODO claim');
                  }}
                >
                  Claim <CountUp end={unclaimedAmount.simple} decimals={4} />{' '}
                  MTA
                </Button>
              )}
            </div>
          </EarnInfo>
        </Stats>
      )}
    </Container>
  );
};
