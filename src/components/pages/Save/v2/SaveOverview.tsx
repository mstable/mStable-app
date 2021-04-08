import React, { FC, ReactElement, useCallback, useMemo, useState } from 'react';

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

enum Selection {
  Balance = 'balance',
  APY = 'apy',
  Rewards = 'rewards',
}

const { Balance, APY, Rewards } = Selection;

const Blank: FC = () => <p>test</p>;

const components: Record<string, ReactElement> = {
  [Balance]: <Blank />,
  [APY]: <Blank />,
  [Rewards]: <UserRewards />,
};

export const SaveOverview: FC = () => {
  const [selection, setSelection] = useState<Selection | undefined>();
  const massetState = useSelectedMassetState();
  const massetPrice = useSelectedMassetPrice();
  const rewardStreams = useRewardStreams();
  const saveApy = useAvailableSaveApy();

  const totalEarned = rewardStreams?.amounts.earned.total ?? 0;

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

  return (
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
