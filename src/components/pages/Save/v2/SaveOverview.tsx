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
import { SavePosition } from './SavePosition';
import { useSelectedSaveVersion } from '../../../../context/SelectedSaveVersionProvider';
import { ReactComponent as WarningBadge } from '../../../icons/badges/warning.svg';
import { OnboardingMessage } from './OnboardingMessage';
import { ApyInfo } from './ApyInfo';

enum Selection {
  Balance = 'balance',
  APY = 'apy',
  Rewards = 'rewards',
}

const { Balance, APY, Rewards } = Selection;

const StyledWarningBadge = styled(WarningBadge)`
  position: absolute;
  top: 0;
  width: 1.25rem;
  height: 1.25rem;
  right: -1.5rem;
`;

const BalanceHeading = styled.div`
  display: flex;
  justify-content: center;

  > div:first-child {
    display: flex;
    justify-content: center;
    position: relative;
  }
`;

const components: Record<string, ReactElement> = {
  [Balance]: <SavePosition />,
  [APY]: <ApyInfo />,
  [Rewards]: <UserRewards />,
};

export const SaveOverview: FC = () => {
  const [selection, setSelection] = useState<Selection | undefined>();
  const massetState = useSelectedMassetState();
  const massetPrice = useSelectedMassetPrice();
  const rewardStreams = useRewardStreams();
  const saveApy = useAvailableSaveApy();
  const [selectedSaveVersion] = useSelectedSaveVersion();

  const totalEarned = rewardStreams?.amounts.earned.total ?? 0;

  const {
    savingsContracts: {
      v1: { savingsBalance: saveV1Balance } = {},
      v2: {
        boostedSavingsVault,
        token: saveToken,
        latestExchangeRate: { rate: saveExchangeRate } = {},
      },
    },
  } = massetState as MassetState;

  const userBalance = useMemo(() => {
    if (selectedSaveVersion === 1) return saveV1Balance?.balance;

    return (
      boostedSavingsVault?.account?.rawBalance
        .add(saveToken?.balance ?? BigDecimal.ZERO)
        .mulTruncate(saveExchangeRate?.exact ?? BigDecimal.ONE.exact) ??
      BigDecimal.ZERO
    );
  }, [
    boostedSavingsVault,
    saveToken,
    saveExchangeRate,
    selectedSaveVersion,
    saveV1Balance,
  ]);

  const showOnboardingMessage = userBalance?.exact.eq(0);

  // enable collapse
  const handleSelection = useCallback(
    (newValue: Selection) =>
      setSelection(selection === newValue ? undefined : newValue),
    [selection],
  );

  return showOnboardingMessage ? (
    <OnboardingMessage />
  ) : (
    <Overview components={components} selection={selection}>
      <Container>
        <Button
          active={selection === Balance}
          onClick={() => handleSelection(Balance)}
        >
          <BalanceHeading>
            <div>
              <h3>Balance</h3>
              {selectedSaveVersion === 1 && <StyledWarningBadge />}
            </div>
          </BalanceHeading>
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
