import React, { FC } from 'react';
import styled from 'styled-components';
import { ViewportWidth } from '../../../../theme';
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
