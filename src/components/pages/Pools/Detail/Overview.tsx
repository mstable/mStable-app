import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { useFeederPoolApy } from '../../../../hooks/useFeederPoolApy';
import { useSelectedMassetPrice } from '../../../../hooks/usePrice';

import { UnstyledButton } from '../../../core/Button';
import { CountUp } from '../../../core/CountUp';
import { useSelectedFeederPoolState } from '../FeederPoolProvider';
import { Position } from './Position';
import { ProvideLiquidityMessage } from './ProvideLiquidityMessage';
import { UserBoost } from './UserBoost';
import { useRewardStreams } from './useRewardStreams';
import { UserRewards } from './UserRewards';

enum Selection {
  Stake = 'stake',
  Boost = 'boost',
  Rewards = 'rewards',
}

const { Stake, Boost, Rewards } = Selection;

const components = {
  [Stake]: Position,
  [Boost]: UserBoost,
  [Rewards]: UserRewards,
};

const slideIn = keyframes`
  0% {
    transform: translateY(-25%);
    filter: blur(10px);
    opacity: 0.5;
  }
  100% {
    transform: translateY(0);
    filter: blur(0);
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  0% {
    transform: translateY(0);
    filter: blur(0);
    opacity: 1;
  }
  100% {
    transform: translateY(25%);
    filter: blur(20px);
    opacity: 0;
  }
`;

const Content = styled.div`
  padding: 1.75rem 1.5rem;

  .item-enter {
    animation: ${slideIn} 0.5s cubic-bezier(0.19, 1, 0.22, 1) none;
  }

  .item-exit {
    animation: ${fadeOut} 0.8s cubic-bezier(0.19, 1, 0.22, 1) normal;
  }

  .item-exit {
    display: none;
  }
`;

const Button = styled(UnstyledButton)<{ active?: boolean }>`
  background: ${({ theme, active }) =>
    active ? theme.color.backgroundAccent : 'none'};
  border-radius: 1rem;
  padding: 1rem;

  h3 {
    color: ${({ theme }) => theme.color.blue};
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  span {
    ${({ theme }) => theme.mixins.numeric};
    font-size: 1.25rem;
  }

  :hover {
    background: ${({ theme }) => theme.color.backgroundAccent};
  }
`;

const Header = styled.div<{ showBorder?: boolean }>`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid
    ${({ theme, showBorder }) =>
      showBorder ? theme.color.accent : 'transparent'};
  padding: 0.5rem;

  > * {
    flex-basis: calc(33.3% - 0.5rem);
  }
`;

const Container = styled.div`
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 1rem;
`;

export const Overview: FC = () => {
  const [selection, setSelection] = useState<Selection>(Stake);

  const rewardStreams = useRewardStreams();
  const feederPool = useSelectedFeederPoolState();
  const massetPrice = useSelectedMassetPrice() ?? 1;
  const apy = useFeederPoolApy(feederPool.address);

  const totalEarned = rewardStreams?.amounts.earned.total ?? 0;
  const { vault, token } = feederPool;
  const userAmount = token.balance?.simple ?? 0;
  const userStakedAmount = vault.account?.rawBalance.simple ?? 0;

  const showLiquidityMessage = !userAmount && !userStakedAmount;

  return (
    <Container>
      {showLiquidityMessage ? (
        <ProvideLiquidityMessage />
      ) : (
        <>
          <Header showBorder={!!selection}>
            <Button
              active={selection === Stake}
              onClick={() => setSelection(Stake)}
            >
              <h3>{userStakedAmount ? 'Staked' : 'Unstaked'} balance</h3>
              <CountUp
                end={(userStakedAmount || userAmount) * massetPrice}
                prefix="$"
              />
            </Button>
            <Button
              active={selection === Boost}
              onClick={() => setSelection(Boost)}
            >
              <h3>Boosted APY</h3>
              <CountUp end={apy?.value?.base ?? 0} suffix="%" />
            </Button>
            <Button
              active={selection === Rewards}
              onClick={() => setSelection(Rewards)}
            >
              <h3>Rewards Earned</h3>
              <CountUp end={totalEarned} /> MTA
            </Button>
          </Header>
          <Content>
            <TransitionGroup>
              {[Stake, Boost, Rewards]
                .filter(type => type === selection)
                .map(type => {
                  const Comp = components[type];
                  return (
                    <CSSTransition
                      timeout={{ enter: 500, exit: 700 }}
                      classNames="item"
                      key={type}
                    >
                      <Comp />
                    </CSSTransition>
                  );
                })}
            </TransitionGroup>
          </Content>
        </>
      )}
    </Container>
  );
};
// {selection === Boost && <UserBoost key="boost" />}
// {selection === Rewards && <UserRewards key="rewards" />}
