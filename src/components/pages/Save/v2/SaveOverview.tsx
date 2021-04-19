import React, {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';

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
  CardContainer as TransitionContainer,
  CardButton as Button,
} from '../../../core/TransitionCard';
import { UserBoost } from '../../../rewards/UserBoost';
import { UserRewards } from '../../Pools/Detail/UserRewards';
import { ReactComponent as WarningBadge } from '../../../icons/badges/warning.svg';

import { SavePosition } from './SavePosition';
import { OnboardingBanner } from './OnboardingBanner';
import { ThemedSkeleton } from '../../../core/ThemedSkeleton';
import { Tooltip } from '../../../core/ReactTooltip';
import { useSelectedMassetName } from '../../../../context/SelectedMassetNameProvider';

enum Selection {
  Balance = 'Balance',
  SaveAPY = 'SaveApy',
  VaultAPY = 'VaultApy',
  Rewards = 'Rewards',
}

const { Balance, Rewards, VaultAPY } = Selection;

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

const Container = styled.div`
  > div {
    margin-bottom: 1.25rem;
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
  [VaultAPY]: <UserSaveBoost />,
  [Rewards]: <UserRewards />,
};

export const SaveOverview: FC = () => {
  const [selection, setSelection] = useState<Selection | undefined>();
  const massetState = useSelectedMassetState();
  const massetPrice = useSelectedMassetPrice();
  const massetName = useSelectedMassetName();
  const rewardStreams = useRewardStreams();
  const [selectedSaveVersion] = useSelectedSaveVersion();

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

  const vaultApy = useSaveVaultAPY(saveToken?.symbol);
  const totalEarned = rewardStreams?.amounts.earned.total ?? 0;

  const averageVaultApy = useMemo((): FetchState<number> => {
    if (vaultApy?.fetching) return { fetching: true };
    const { maxBoost, base } = vaultApy?.value ?? {};
    if (!maxBoost || !base) return { fetching: true };
    return { value: (maxBoost + base) / 2 };
  }, [vaultApy]);

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

  const isSaveV1 = selectedSaveVersion === 1;

  const handleSelection = useCallback(
    (newValue: Selection) =>
      setSelection(selection === newValue ? undefined : newValue),
    [selection],
  );

  return (
    <Container>
      <OnboardingBanner />
      <TransitionCard components={components} selection={selection}>
        <TransitionContainer>
          <Button
            active={selection === Balance}
            onClick={() => handleSelection(Balance)}
          >
            <BalanceHeading>
              <div>
                <h3>Balance</h3>
                {isSaveV1 && <StyledWarningBadge />}
              </div>
            </BalanceHeading>
            <CountUp
              end={(userBalance?.simple ?? 0) * (massetPrice ?? 0)}
              prefix="$"
            />
          </Button>
          {!isSaveV1 && (
            <Button
              active={selection === VaultAPY}
              onClick={() => handleSelection(VaultAPY)}
            >
              <h3>Rewards APY</h3>
              {averageVaultApy?.fetching ? (
                <ThemedSkeleton height={20} width={64} />
              ) : (
                <div>
                  <CountUp end={averageVaultApy?.value ?? 0} suffix="%" />
                  <Tooltip
                    tip={`${
                      massetName === 'musd' ? 20 : 33
                    }% of earned MTA rewards are claimable immediately. The remaining rewards are streamed linearly for 26 weeks`}
                  />
                </div>
              )}
            </Button>
          )}
          <Button
            active={selection === Rewards}
            onClick={() => handleSelection(Rewards)}
          >
            <h3>Rewards</h3>
            <CountUp end={totalEarned} /> MTA
          </Button>
        </TransitionContainer>
      </TransitionCard>
    </Container>
  );
};
