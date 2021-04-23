import React, { FC, ReactElement, useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { useFeederPoolApy } from '../../../../hooks/useFeederPoolApy';
import { useSelectedMassetPrice } from '../../../../hooks/usePrice';

import { CountUp, DifferentialCountup } from '../../../core/CountUp';
import { useSelectedFeederPoolState } from '../FeederPoolProvider';
import { Position } from './Position';
import {
  ProvideLiquidityMessage,
  ShowEarningPower,
  useShowEarningPower,
} from './ProvideLiquidityMessage';
import { UserBoost } from '../../../rewards/UserBoost';
import { useRewardStreams } from '../../../../context/RewardStreamsProvider';
import { UserRewards } from './UserRewards';
import { BoostCalculator } from '../../../rewards/BoostCalculator';
import { BoostedSavingsVaultState } from '../../../../context/DataProvider/types';
import {
  TransitionCard,
  CardContainer as Container,
  CardButton as Button,
} from '../../../core/TransitionCard';
import { useMinimumOutput } from '../../../../hooks/useOutput';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { useEstimatedOutput } from '../../../../hooks/useEstimatedOutput';
import { BigDecimalInputValue } from '../../../../hooks/useBigDecimalInputs';
import { UnstyledButton } from '../../../core/Button';
import { useToggle } from 'react-use';
import { ThemedSkeleton } from '../../../core/ThemedSkeleton';

enum Selection {
  Stake = 'stake',
  Boost = 'boost',
  Rewards = 'rewards',
}

const { Stake, Boost, Rewards } = Selection;

const SwitchButton = styled(UnstyledButton)`
  position: absolute;
  display: block;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  color: ${({ theme }) => theme.color.body};
  border-radius: 1rem;
  right: -2.5rem;
  height: 1.75rem;
  width: 1.75rem;
  transition: 0.25s;

  :hover {
    background: ${({ theme }) => theme.color.gold};
    color: ${({ theme }) => theme.color.white};
  }
`;

const BalanceContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserVaultBoost: FC = () => {
  const feederPool = useSelectedFeederPoolState();
  const apy = useFeederPoolApy(feederPool.address);
  return <UserBoost vault={feederPool.vault} apy={apy} />;
};

const components: Record<string, ReactElement> = {
  [Stake]: <Position />,
  [Boost]: <UserVaultBoost />,
  [Rewards]: <UserRewards />,
};

const LiquidityMessageContent: FC<{
  vault: BoostedSavingsVaultState;
  apy?: number;
}> = ({ vault, apy }) => {
  const [showEarningPower] = useShowEarningPower();
  return (
    <TransitionCard
      selection={showEarningPower ? 'boost' : undefined}
      components={{
        boost: <BoostCalculator vault={vault} noBackButton apy={apy} />,
      }}
    >
      <Container>
        <ProvideLiquidityMessage />
      </Container>
    </TransitionCard>
  );
};

export const PoolOverview: FC = () => {
  const [selection, setSelection] = useState<Selection | undefined>();

  const rewardStreams = useRewardStreams();
  const feederPool = useSelectedFeederPoolState();
  const apy = useFeederPoolApy(feederPool.address);
  const massetPrice = useSelectedMassetPrice() ?? 1;
  const [showMassetBalance, toggleMassetBalance] = useToggle(false);

  const {
    vault,
    token,
    masset: { token: massetToken },
  } = feederPool;
  const userAmount = token.balance?.simple ?? 0;
  const userStakedAmount = vault.account?.rawBalance.simple ?? 0;

  const totalEarned = rewardStreams?.amounts.earned.total ?? 0;
  const totalLocked = rewardStreams?.amounts.locked ?? 0;
  const showLiquidityMessage = totalEarned === 0 && totalLocked === 0;

  const handleSelection = useCallback(
    (newValue?: Selection) =>
      setSelection(selection === newValue ? undefined : newValue),
    [selection],
  );

  const totalUserBalance = useMemo(
    () =>
      token.balance?.add(vault?.account?.rawBalance ?? BigDecimal.ZERO) ??
      BigDecimal.ZERO,
    [userAmount, userStakedAmount],
  );

  const { estimatedOutputAmount } = useEstimatedOutput(
    {
      ...token,
      amount: totalUserBalance,
    } as BigDecimalInputValue,
    {
      ...massetToken,
    } as BigDecimalInputValue,
    false,
  );

  const handleBalanceSwitch = (e: any) => {
    e?.stopPropagation();
    e?.preventDefault();
    toggleMassetBalance();
  };

  return showLiquidityMessage ? (
    <ShowEarningPower>
      <LiquidityMessageContent vault={vault} apy={apy.value?.base} />
    </ShowEarningPower>
  ) : (
    <TransitionCard components={components} selection={selection}>
      <Container>
        <Button
          active={selection === Stake}
          onClick={() => handleSelection(Stake)}
        >
          <h3>
            {showMassetBalance ? `${massetToken?.symbol} Balance` : `Balance`}
          </h3>
          <div>
            <BalanceContainer>
              <SwitchButton onClick={handleBalanceSwitch}>⇄</SwitchButton>
              {showMassetBalance ? (
                estimatedOutputAmount?.fetching ? (
                  <ThemedSkeleton height={20} width={100} />
                ) : estimatedOutputAmount?.value?.simple === 0 ? (
                  '–'
                ) : (
                  <CountUp
                    end={estimatedOutputAmount?.value?.simple ?? 0}
                    prefix={'≈'}
                    decimals={massetToken?.decimals > 2 ? 4 : 2}
                  />
                )
              ) : (
                <CountUp
                  end={totalUserBalance?.simple * massetPrice}
                  prefix="$"
                  decimals={2}
                />
              )}
            </BalanceContainer>
          </div>
        </Button>
        <Button
          active={selection === Boost}
          onClick={() => handleSelection(Boost)}
        >
          <h3>Rewards APY</h3>
          {apy.value?.userBoost ? (
            <DifferentialCountup
              prev={apy.value.base}
              end={apy.value.userBoost}
              suffix="%"
            />
          ) : (
            <CountUp end={apy.value?.base ?? 0} suffix="%" />
          )}
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
