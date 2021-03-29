import React, { FC, useCallback, useState } from 'react';
import styled from 'styled-components';
import { useFeederPoolApy } from '../../../../hooks/useFeederPoolApy';
import { useSelectedMassetPrice } from '../../../../hooks/usePrice';

import { UnstyledButton } from '../../../core/Button';
import { CountUp, CountUpUSD } from '../../../core/CountUp';
import { useSelectedFeederPoolState } from '../FeederPoolProvider';
import { Position } from './Position';
import { ProvideLiquidityMessage } from './ProvideLiquidityMessage';
import { UserBoost } from './UserBoost';
import { useRewardStreams } from './useRewardStreams';
import { UserRewards } from './UserRewards';

enum Selection {
  Fees = 'fees',
  Boost = 'boost',
  Rewards = 'rewards',
}

const { Fees, Boost, Rewards } = Selection;

const Content = styled.div`
  padding: 1.75rem 1.5rem;
`;

const Button = styled(UnstyledButton)<{ active?: boolean }>`
  background: ${({ theme, active }) =>
    active ? theme.color.backgroundAccent : 'none'};
  border-radius: 1rem;
  padding: 1rem;
  transition: 0.25s all;

  h3 {
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
  const [selection, setSelection] = useState<Selection | undefined>();

  const rewardStreams = useRewardStreams();
  const feederPool = useSelectedFeederPoolState();
  const massetPrice = useSelectedMassetPrice() ?? 1;
  const apy = useFeederPoolApy(feederPool.address);

  const totalEarned = rewardStreams?.amounts.earned.total ?? 0;
  const { vault, token } = feederPool;
  const userAmount = token.balance?.simple ?? 0;
  const userStakedAmount = vault.account?.rawBalance.simple ?? 0;

  const showLiquidityMessage = !userAmount && !userStakedAmount;

  const handleSelection = useCallback(
    (type: Selection) => setSelection(type !== selection ? type : undefined),
    [selection],
  );

  return (
    <Container>
      {showLiquidityMessage ? (
        <ProvideLiquidityMessage />
      ) : (
        <>
          <Header showBorder={!!selection}>
            <Button
              active={selection === Fees}
              onClick={() => handleSelection(Fees)}
            >
              <h3>{userStakedAmount ? 'Staked' : 'Unstaked'} balance</h3>
              <CountUp end={(userStakedAmount || userAmount) * massetPrice} />
            </Button>
            <Button
              active={selection === Boost}
              onClick={() => handleSelection(Boost)}
            >
              <h3>Boosted APY</h3>
              <CountUp end={apy?.value?.base ?? 0} suffix="%" />
            </Button>
            <Button
              active={selection === Rewards}
              onClick={() => handleSelection(Rewards)}
            >
              <h3>Rewards Earned</h3>
              <CountUp end={totalEarned} /> MTA
            </Button>
          </Header>
          {!!selection && (
            <Content>
              {selection === Fees && <Position />}
              {selection === Boost && <UserBoost />}
              {selection === Rewards && <UserRewards />}
            </Content>
          )}
        </>
      )}
    </Container>
  );
};
