import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';

import { useAvailableSaveApy } from '../../../../hooks/useAvailableSaveApy';
import { useSelectedSaveVersion } from '../../../../context/SelectedSaveVersionProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { MassetState } from '../../../../context/DataProvider/types';
import { useRewardStreams } from '../../../../context/RewardStreamsProvider';
import { useSelectedMassetPrice } from '../../../../hooks/usePrice';
import { FetchState, useFetchState } from '../../../../hooks/useFetchState';
import { BigDecimal } from '../../../../web3/BigDecimal';

import { CountUp } from '../../../core/CountUp';
import {
  TransitionCard,
  CardContainer as Container,
  CardButton as Button,
} from '../../../core/TransitionCard';
import { UserBoost } from '../../../rewards/UserBoost';
import { UserRewards } from '../../Pools/Detail/UserRewards';
import { ReactComponent as WarningBadge } from '../../../icons/badges/warning.svg';

import { SavePosition } from './SavePosition';
import { ApyInfo } from './ApyInfo';
import { OnboardingMessage } from './OnboardingMessage';

enum Selection {
  Balance = 'Balance',
  SaveAPY = 'SaveApy',
  VaultAPY = 'VaultApy',
  Rewards = 'Rewards',
}

const { Balance, SaveAPY, Rewards, VaultAPY } = Selection;

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

interface BoostedApy {
  base: number;
  userBoost?: number;
  maxBoost: number;
}

interface PoolsAPIResponse {
  pools: {
    name: string;
    apy: string;
    apyDetails:
      | {
          rewardsOnlyBase: string;
          rewardsOnlyMax: string;
          combinedBase: string;
          combinedMax: string;
          yieldOnly: string;
        }
      | {
          rewardsOnlyBase: string;
          rewardsOnlyMax: string;
        };
    pair: string[];
    pairLink: string;
    poolRewards: string[];
    totalStakedUSD: string;
    logo: string;
  }[];
}

// TODO this can be done without API
const useSaveVaultAPY = (symbol?: string): FetchState<BoostedApy> => {
  const [apy, setApy] = useFetchState<BoostedApy>();

  useEffect(() => {
    if (!symbol) return;

    setApy.fetching();
    fetch('https://api-dot-mstable.appspot.com/pools')
      .then(res =>
        res.json().then(({ pools }: PoolsAPIResponse) => {
          const pool = pools.find(p => p.pair[0] === symbol);
          if (pool) {
            setApy.value({
              base: parseFloat(pool.apyDetails.rewardsOnlyBase),
              maxBoost: parseFloat(pool.apyDetails.rewardsOnlyMax),
            });
          }
        }),
      )
      .catch(error => setApy.error(error.message));
  }, [setApy, symbol]);

  return apy;
};

const UserSaveBoost: FC = () => {
  const {
    savingsContracts: {
      v2: { token, boostedSavingsVault },
    },
  } = useSelectedMassetState() as MassetState;

  const apy = useSaveVaultAPY(token?.symbol);
  return boostedSavingsVault ? (
    <UserBoost vault={boostedSavingsVault} apy={apy} />
  ) : null;
};

const components: Record<string, ReactElement> = {
  [Balance]: <SavePosition />,
  [SaveAPY]: <ApyInfo />,
  [VaultAPY]: <UserSaveBoost />,
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
    <TransitionCard components={components} selection={selection}>
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
        <Button
          active={selection === SaveAPY}
          onClick={() => handleSelection(SaveAPY)}
        >
          <h3>Save APY*</h3>
          <CountUp end={saveApy.value ?? 0} suffix="%" />
        </Button>
        <Button
          active={selection === VaultAPY}
          onClick={() => handleSelection(VaultAPY)}
        >
          <h3>Rewards APY</h3>
          <div>&nbsp;</div>
        </Button>
        <Button
          active={selection === Rewards}
          onClick={() => handleSelection(Rewards)}
        >
          <h3>Rewards</h3>
          <CountUp end={totalEarned} /> MTA
        </Button>
      </Container>
    </TransitionCard>
  );
};
