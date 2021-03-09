import React, { FC } from 'react';
import styled from 'styled-components';
import { Button } from '../../../core/Button';

interface Props {
  title?: string;
  poolTotal?: number;
  userAmount?: number;
  userStakedAmount?: number;
  mtaRewards?: number;
}

const Card = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-radius: 1rem;
  padding: 1rem;

  > div {
    display: flex;
    flex-direction: column;

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
  justify-content: space-between;

  > div:first-child {
    flex-basis: calc(60% - 0.5rem);
  }
  > div:last-child {
    flex-basis: calc(40% - 0.5rem);
  }
`;

const GetLP = styled(Card)`
  background: ${({ theme }) => theme.color.backgroundAccent};
  align-items: center;
`;

const Container = styled.div`
  width: 100%;
  margin: 1rem 0;
`;

export const RewardsOverview: FC<Props> = props => {
  const { poolTotal, userAmount, userStakedAmount, mtaRewards, title } = props;

  const poolPercentage = 100 * ((userAmount ?? 0) / (poolTotal ?? 0));
  const showLiquidityMessage = !userAmount && !userStakedAmount && !mtaRewards;

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
          <Button>Add Liquidity</Button>
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
              {!mtaRewards ? (
                <span>
                  Provide liquidity and stake to earn rewards in addition to
                  trade fees
                </span>
              ) : (
                <Button>Claim {mtaRewards} MTA</Button>
              )}
            </div>
          </EarnInfo>
        </Stats>
      )}
    </Container>
  );
};
