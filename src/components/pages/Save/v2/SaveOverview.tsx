import React, { FC, ReactElement, useCallback, useMemo, useState } from 'react';

import styled from 'styled-components';
import { CountUp } from '../../../core/CountUp';
import { useAvailableSaveApy } from '../../../../hooks/useAvailableSaveApy';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { MassetState } from '../../../../context/DataProvider/types';
import { useSelectedMassetPrice } from '../../../../hooks/usePrice';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { UserRewards } from '../../Pools/Detail/UserRewards';
import { useRewardStreams } from '../../../../context/RewardStreamsProvider';
import {
  Overview,
  CardContainer as Container,
  CardButton as Button,
} from '../../../core/TransitionCard';
import { WeeklySaveAPY } from '../WeeklySaveAPY';

enum Selection {
  Balance = 'balance',
  APY = 'apy',
  Rewards = 'rewards',
}

const { Balance, APY, Rewards } = Selection;

const Blank: FC = () => <p>test</p>;

const UserAPY: FC = () => {
  return <WeeklySaveAPY />;
};

const components: Record<string, ReactElement> = {
  [Balance]: <Blank />,
  [APY]: <UserAPY />,
  [Rewards]: <UserRewards />,
};

const OnboardingMessage = styled.div`
  display: flex;
  justify-content: space-between;
  background: linear-gradient(
    177.69deg,
    #f1efff 1.94%,
    rgba(255, 255, 255, 0) 133.71%
  );
  width: 100%;
  border-radius: 1rem;
  padding: 1.5rem;

  h2 {
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.color.body};
  }

  h3 {
    font-size: 1rem;
    color: ${({ theme }) => theme.color.body};
    opacity: 0.675;
    margin-top: 0.625rem;
  }

  > div:last-child {
    padding: 1rem;
    font-size: 1.5rem;
    font-weight: normal;

    > span:last-child {
      font-size: 1rem;
    }
  }
`;

export const SaveOverview: FC = () => {
  const [selection, setSelection] = useState<Selection | undefined>();
  const massetState = useSelectedMassetState();
  const massetPrice = useSelectedMassetPrice();
  const rewardStreams = useRewardStreams();
  const saveApy = useAvailableSaveApy();

  const totalEarned = rewardStreams?.amounts.earned.total ?? 0;
  const showOnboardingMessage = true;

  const {
    savingsContracts: {
      v2: { boostedSavingsVault, token: saveToken },
    },
  } = massetState as MassetState;

  const userBalance = useMemo(
    () =>
      boostedSavingsVault?.account?.rawBalance.add(
        saveToken?.balance ?? BigDecimal.ZERO,
      ),
    [boostedSavingsVault, saveToken],
  );

  // enable collapse
  const handleSelection = useCallback(
    (newValue: Selection) =>
      setSelection(selection === newValue ? undefined : newValue),
    [selection],
  );

  return showOnboardingMessage ? (
    <OnboardingMessage>
      <div>
        <h2>The best passive savings account in DeFi.</h2>
        <h3>Secure, high yielding, dependable.</h3>
      </div>
      <div>
        <CountUp end={saveApy?.value ?? 0} suffix="%" /> <span>APY</span>
      </div>
    </OnboardingMessage>
  ) : (
    <Overview components={components} selection={selection}>
      <Container>
        <Button
          active={selection === Balance}
          onClick={() => handleSelection(Balance)}
        >
          <h3>Balance</h3>
          <CountUp
            end={(userBalance?.simple ?? 0) * (massetPrice ?? 0)}
            prefix="$"
          />
        </Button>
        <Button active={selection === APY} onClick={() => handleSelection(APY)}>
          <h3>Save APY</h3>
          <CountUp end={saveApy?.value ?? 0} suffix="%" />
        </Button>
        <Button
          active={selection === Rewards}
          onClick={() => handleSelection(Rewards)}
        >
          <h3>Rewards</h3>
          <CountUp end={totalEarned} /> MTA
        </Button>
      </Container>
    </Overview>
  );
};
