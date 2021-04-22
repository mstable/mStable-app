import React, { FC, ReactElement, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { useEffectOnce } from 'react-use';
import { useSelectedSaveVersion } from '../../../../context/SelectedSaveVersionProvider';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { MassetState } from '../../../../context/DataProvider/types';
import { useRewardStreams } from '../../../../context/RewardStreamsProvider';
import { useSelectedMassetPrice } from '../../../../hooks/usePrice';
import { FetchState } from '../../../../hooks/useFetchState';
import { useCalculateUserBoost } from '../../../../hooks/useCalculateUserBoost';
import { BigDecimal } from '../../../../web3/BigDecimal';

import { CountUp, DifferentialCountup } from '../../../core/CountUp';
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

// FIXME sir - change pattern
let cachedAPY: FetchState<BoostedApy> = { fetching: true };

// TODO this can be done without API
const useSaveVaultAPY = (
  symbol?: string,
  userBoost?: number,
): FetchState<BoostedApy> => {
  useEffectOnce(() => {
    if (!symbol) return;

    fetch('https://api-dot-mstable.appspot.com/pools')
      .then(res =>
        res.json().then(({ pools }: PoolsAPIResponse) => {
          const pool = pools.find(p => p.pair[0] === symbol);
          if (!pool) return;
          const base = parseFloat(pool?.apyDetails.rewardsOnlyBase);
          const maxBoost = parseFloat(pool?.apyDetails.rewardsOnlyMax);
          cachedAPY = {
            value: {
              base,
              maxBoost,
            },
          };
        }),
      )
      .catch(error => {
        cachedAPY = { error: error.message };
      });
  });

  const apy = useMemo(() => {
    if (!cachedAPY?.value) return cachedAPY;
    return {
      value: {
        base: cachedAPY.value.base,
        maxBoost: cachedAPY.value.maxBoost,
        userBoost: (userBoost ?? 1) * cachedAPY.value.base,
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userBoost, symbol, cachedAPY.value]);

  return apy;
};

const UserSaveBoost: FC = () => {
  const {
    savingsContracts: {
      v2: { token, boostedSavingsVault },
    },
  } = useSelectedMassetState() as MassetState;

  const userBoost = useCalculateUserBoost(boostedSavingsVault);
  const apy = useSaveVaultAPY(token?.symbol, userBoost);
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

  const userBoost = useCalculateUserBoost(boostedSavingsVault);
  const apy = useSaveVaultAPY(saveToken?.symbol, userBoost);
  const totalEarned = rewardStreams?.amounts.earned.total ?? 0;

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
          <Button active={selection === Balance} onClick={() => handleSelection(Balance)} disabled={!boostedSavingsVault}>
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
          {!isSaveV1 && !!boostedSavingsVault && (
            <Button
              active={selection === VaultAPY}
              onClick={() => handleSelection(VaultAPY)}
            >
              <h3>Rewards APY</h3>
              {apy?.fetching ? (
                <ThemedSkeleton height={20} width={64} />
              ) : (
                <div>
                  {userBoost > 1 && apy?.value?.userBoost ? (
                    <DifferentialCountup
                      prev={apy.value?.base}
                      end={apy.value.userBoost}
                      suffix="%"
                    />
                  ) : (
                    <>
                      <CountUp end={apy?.value?.base ?? 0} />
                      &nbsp;-&nbsp;
                      <CountUp end={apy?.value?.maxBoost ?? 0} suffix="%" />
                    </>
                  )}
                </div>
              )}
            </Button>
          )}
          {!!boostedSavingsVault && (
            <Button
            active={selection === Rewards}
            onClick={() => handleSelection(Rewards)}
          >
              <h3>Rewards</h3>
              <CountUp end={totalEarned} /> MTA
            </Button>
          )}
        </TransitionContainer>
      </TransitionCard>
    </Container>
  );
};
