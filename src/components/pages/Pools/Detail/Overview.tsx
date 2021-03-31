import React, { FC, useCallback, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { useFeederPoolApy } from '../../../../hooks/useFeederPoolApy';
import { useSelectedMassetPrice } from '../../../../hooks/usePrice';

import { UnstyledButton } from '../../../core/Button';
import { CountUp } from '../../../core/CountUp';
import { useSelectedFeederPoolState } from '../FeederPoolProvider';
import { Position } from './Position';
import {
  ProvideLiquidityMessage,
  ShowEarningPower,
  useShowEarningPower,
} from './ProvideLiquidityMessage';
import { UserBoost } from './UserBoost';
import { useRewardStreams } from './useRewardStreams';
import { UserRewards } from './UserRewards';
import { ViewportWidth } from '../../../../theme';
import { BoostCalculator } from '../../../rewards/BoostCalculator';
import { BoostedSavingsVaultState } from '../../../../context/DataProvider/types';

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
    filter: blur(8px);
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
    filter: blur(8px);
    opacity: 0;
  }
`;

const Content = styled.div<{ open: boolean }>`
  padding: ${({ open }) => (open ? '1.75rem 1.5rem' : '0 1.5rem')};
  transition: padding 0.2s ease;
  > div {
    overflow: hidden;

    > div {
      overflow: hidden;
      transition: max-height 0.2s ease-in-out;
      max-height: 24rem;
      transform-origin: center top;

      &.item-enter {
        animation: ${slideIn} 0.5s cubic-bezier(0.19, 1, 0.22, 1) none;
      }

      &.item-exit,
      &.item-exit-active,
      &.item-exit-done {
        overflow: hidden;
        max-height: 0;
        transition: max-height 0.2s cubic-bezier(0, 1, 0, 1);
      }

      &.item-exit {
        animation: ${fadeOut} 0.8s cubic-bezier(0.19, 1, 0.22, 1) none;
      }
    }
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
  flex-direction: column;
  border-bottom: 1px solid
    ${({ theme, showBorder }) =>
      showBorder ? theme.color.accent : 'transparent'};
  padding: 0.5rem;

  > * {
    flex-basis: calc(33.3% - 0.5rem);
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const HeaderNoAccount = styled(Header)`
  > * {
    flex: 1;
  }
`;

const Container = styled.div`
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 1rem;
`;

const LiquidityMessageContent: FC<{ vault: BoostedSavingsVaultState }> = ({
  vault,
}) => {
  const [showEarningPower] = useShowEarningPower();
  return (
    <>
      <HeaderNoAccount showBorder>
        <ProvideLiquidityMessage />
      </HeaderNoAccount>
      {showEarningPower && (
        <Content open>
          <BoostCalculator vault={vault} noBackButton />
        </Content>
      )}
    </>
  );
};

export const Overview: FC = () => {
  const [selection, setSelection] = useState<Selection | undefined>(Stake);

  const rewardStreams = useRewardStreams();
  const feederPool = useSelectedFeederPoolState();
  const massetPrice = useSelectedMassetPrice() ?? 1;
  const apy = useFeederPoolApy(feederPool.address);

  const totalEarned = rewardStreams?.amounts.earned.total ?? 0;
  const { vault, token } = feederPool;
  const userAmount = token.balance?.simple ?? 0;
  const userStakedAmount = vault.account?.rawBalance.simple ?? 0;

  // enable collapse
  const handleSelection = useCallback(
    (newValue: Selection) =>
      setSelection(selection === newValue ? undefined : newValue),
    [selection],
  );

  const showLiquidityMessage = !userAmount && !userStakedAmount;

  return (
    <Container>
      {showLiquidityMessage ? (
        <ShowEarningPower>
          <LiquidityMessageContent vault={vault} />
        </ShowEarningPower>
      ) : (
        <>
          <Header showBorder={!!selection}>
            <Button
              active={selection === Stake}
              onClick={() => handleSelection(Stake)}
            >
              <h3>{userStakedAmount ? 'Staked' : 'Unstaked'} balance</h3>
              <CountUp
                end={(userStakedAmount || userAmount) * massetPrice}
                prefix="$"
              />
            </Button>
            <Button
              active={selection === Boost}
              onClick={() => handleSelection(Boost)}
            >
              <h3>Rewards APY</h3>
              <CountUp
                end={apy.value?.userBoost ?? apy.value?.base ?? 0}
                suffix="%"
              />
            </Button>
            <Button
              active={selection === Rewards}
              onClick={() => handleSelection(Rewards)}
            >
              <h3>Rewards Earned</h3>
              <CountUp end={totalEarned} /> MTA
            </Button>
          </Header>
          <Content open={!!selection}>
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
