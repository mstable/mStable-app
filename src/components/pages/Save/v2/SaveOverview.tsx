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
import { Tooltip } from '../../../core/ReactTooltip';
import { DailyApys } from '../../../stats/DailyApys';
import { SavePosition } from './SavePosition';

enum Selection {
  Balance = 'balance',
  APY = 'apy',
  Rewards = 'rewards',
}

const { Balance, APY, Rewards } = Selection;

const UserAPYContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 12rem;

  > div:first-child {
    flex-basis: calc(60% - 0.5rem);
    padding-right: 2rem;
  }
  > div:last-child {
    flex-basis: calc(40% - 0.5rem);
  }
`;

const SaveAPY = styled(DailyApys)`
  position: relative;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 1rem;
  overflow: hidden;
`;

const UserAPY: FC = () => {
  return (
    <UserAPYContainer>
      <WeeklySaveAPY />
      <SaveAPY hideControls shimmerHeight={180} tick={false} />
    </UserAPYContainer>
  );
};

const components: Record<string, ReactElement> = {
  [Balance]: <SavePosition />,
  [APY]: <UserAPY />,
  [Rewards]: <UserRewards />,
};

const ApyTip = styled(Tooltip)`
  > span > span > span {
    font-size: 1.5rem;
    font-weight: normal;

    > span {
      font-size: 1rem;
    }
  }
`;

const OnboardingMessage = styled.div`
  display: flex;
  justify-content: space-between;
  height: 10rem;

  > div:first-child {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-basis: calc(65% - 0.5rem);
    width: 100%;
    border-radius: 1rem;
    padding: 0 2rem;
    border: 1px solid ${({ theme }) => theme.color.accent};

    &:before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: ${({ theme }) =>
        `linear-gradient(180deg, #d2aceb 0%, ${theme.color.background} 100%)`};
      border-radius: 1rem;
      opacity: 0.33;
    }

    > * {
      z-index: 1;
    }

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
  }

  > div:last-child {
    position: relative;
    flex-basis: calc(35% - 0.5rem);
    z-index: 1;

    > :last-child {
      position: absolute;
      top: 0;
      left: 0;
      padding: 1rem;
      font-size: 1.25rem;

      span {
        font-size: 1.25rem;
      }
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
      v2: {
        boostedSavingsVault,
        token: saveToken,
        latestExchangeRate: { rate: saveExchangeRate } = {},
      },
    },
  } = massetState as MassetState;

  const userBalance = useMemo(
    () =>
      boostedSavingsVault?.account?.rawBalance
        .add(saveToken?.balance ?? BigDecimal.ZERO)
        .mulTruncate(saveExchangeRate?.exact ?? BigDecimal.ONE.exact),
    [boostedSavingsVault, saveToken, saveExchangeRate],
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
        <SaveAPY
          hideControls
          shimmerHeight={160}
          tick={false}
          marginTop={48}
          color="#d2aceb"
        />
        <div>
          <ApyTip tip="7-day MA (Moving Average) APY">
            <CountUp end={saveApy?.value ?? 0} suffix="%" /> <span>APY</span>
          </ApyTip>
        </div>
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
          <h3>Save APY*</h3>
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
