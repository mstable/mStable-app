import React, { FC, useMemo, useRef } from 'react';
import styled from 'styled-components';
import { useToggle } from 'react-use';
import {
  addDays,
  format,
  formatDistance,
  getUnixTime,
  fromUnixTime,
  endOfDay,
} from 'date-fns';

import { BoostedSavingsVaultFactory } from '../../../../typechain/BoostedSavingsVaultFactory';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { usePropose } from '../../../../context/TransactionsProvider';
import { useSigner } from '../../../../context/OnboardProvider';
import { useMetaToken } from '../../../../context/TokensProvider';
import { useEmojisplosion } from '../../../../hooks/useEmojisplosion';
import { TransactionManifest } from '../../../../web3/TransactionManifest';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { Interfaces } from '../../../../types';

import { Button } from '../../../core/Button';
import { Tooltip } from '../../../core/ReactTooltip';
import { Widget } from '../../../core/Widget';
import { CountUp } from '../../../core/CountUp';

import { useRewards, useRewardsTimeTravel } from './RewardsProvider';
import { ToggleInput } from '../../../forms/ToggleInput';
import { ThemedSkeleton } from '../../../core/ThemedSkeleton';

const SkeleWrapper = styled.div`
  flex: 1;
  margin-left: 1.25rem;

  span {
    flex: 1;
    display: flex;
  }
`;

const PreviewCountUp = styled(CountUp)`
  color: ${({ theme }) => theme.color.green};
`;

const TimeTravelContainer = styled.div`
  padding: 0.75rem;
  background: ${({ theme }) => theme.color.backgroundAccent};
  border-radius: 0.75rem;

  > :first-child {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    padding-bottom: 0.5rem;

    > :first-child {
      font-weight: 600;
      display: flex;
      gap: 0.5rem;
      > :last-child {
        display: inline;
      }
    }
    > :last-child {
      word-break: keep-all;
      white-space: nowrap;
    }
  }

  input {
    width: 100%;
  }
`;

const RewardsTimeTravel: FC = () => {
  const [timeTravel, toggleTimeTravel, setTimeTravel] = useRewardsTimeTravel();
  const rewards = useRewards();
  return (
    <TimeTravelContainer>
      <div>
        <div>
          <ToggleInput
            onClick={toggleTimeTravel}
            checked={timeTravel}
            disabled={!rewards}
          />
          <Tooltip tip="Simulate your rewards in 6 months time. This assumes that the vault's rewards will be added a constant rate for this time.">
            Time Travel Rewards
          </Tooltip>
        </div>
        <div>
          {rewards?.currentTime &&
            timeTravel &&
            format(fromUnixTime(rewards.currentTime), 'yyyy-MM-dd')}
        </div>
      </div>
      <input
        type="range"
        min={0}
        step={1}
        disabled={!timeTravel}
        max={181}
        onChange={event => {
          setTimeTravel(
            getUnixTime(
              endOfDay(addDays(Date.now(), parseInt(event.target.value, 10))),
            ),
          );
        }}
      />
    </TimeTravelContainer>
  );
};

const Line = styled.div`
  background: ${({ theme }) => theme.color.accent};
  height: 2px;
  margin: 0 1.25rem;
  flex: 1;
  display: flex;
`;

const RowContainer = styled.div`
  > :first-child {
    display: flex;
    align-items: center;
    span {
      ${({ theme }) => theme.mixins.numeric}
    }
  }
  > :last-child {
    font-size: 0.8rem;
    text-align: right;
  }
`;

const Stats = styled.div`
  > div:not(:last-child) {
    margin-bottom: 0.75rem;
  }
`;

const Body = styled.div<{ isPreview?: boolean }>`
  display: flex;
  flex-direction: column;
`;

const Row: FC<{
  title: string;
  tip?: string;
  fetching?: boolean;
  value?: BigDecimal;
  preview?: BigDecimal;
}> = ({ children, title, tip, value, preview, fetching }) => {
  return (
    <RowContainer>
      <div>
        {title}
        {tip && <Tooltip tip={tip} />}
        {fetching ? (
          <SkeleWrapper>
            <ThemedSkeleton height={8} />
          </SkeleWrapper>
        ) : (
          <>
            <Line />
            {value && <CountUp end={value.simple} decimals={3} />}
            {!!preview && (
              <span>
                &nbsp;→ <PreviewCountUp end={preview.simple} decimals={3} />
              </span>
            )}
          </>
        )}
      </div>
      <div>{children}</div>
    </RowContainer>
  );
};

const explodeSettings = { emojis: ['💰', '💸', '💵'], emojiCount: 8 };

export const VaultRewards: FC = () => {
  const explodeRef = useRef<HTMLElement>();
  const explode = useEmojisplosion(explodeRef, explodeSettings);

  const signer = useSigner();
  const propose = usePropose();
  const metaToken = useMetaToken();
  const massetState = useSelectedMassetState();
  const rewards = useRewards();
  const [showSimulated, toggleShowSimulated] = useToggle(false);

  const vaultAddress =
    massetState?.savingsContracts.v2?.boostedSavingsVault?.address;

  const previewedBalance = useMemo(
    () =>
      showSimulated && metaToken && rewards
        ? metaToken.balance.add(rewards.afterClaim.transferred)
        : undefined,
    [metaToken, rewards, showSimulated],
  );

  const fetching = !(metaToken && massetState);

  const isButtonDisabled = !!(
    fetching ||
    !rewards ||
    rewards?.now.earned.unlocked.exact.eq(0)
  );

  return (
    <Widget
      title="Rewards"
      headerContent={
        <Button
          ref={explodeRef as never}
          disabled={isButtonDisabled}
          onClick={(): void => {
            if (!rewards) return;

            if (!showSimulated) {
              toggleShowSimulated(true);
              setTimeout(() => {
                toggleShowSimulated(false);
              }, 10000);
              return;
            }

            explode();

            if (
              signer &&
              vaultAddress &&
              rewards.now.earned.unlocked.exact.gt(0)
            ) {
              propose<
                Interfaces.BoostedSavingsVault,
                'claimRewards(uint256,uint256)'
              >(
                new TransactionManifest(
                  BoostedSavingsVaultFactory.connect(vaultAddress, signer),
                  'claimRewards(uint256,uint256)',
                  [rewards.first, rewards.last],
                  {
                    present: 'Claiming rewards',
                    past: 'Claimed rewards',
                  },
                ),
              );
            }
          }}
          highlighted={showSimulated}
          scale={0.7}
        >
          {showSimulated ? 'Claim MTA' : 'Preview Claim'}
        </Button>
      }
    >
      <Body isPreview={showSimulated}>
        <Stats>
          <Row
            title="Unclaimed"
            tip="Rewards earned but not yet claimed. The next claim will send 20% of these rewards to you now, and 80% to your 'Vesting' amount."
            preview={showSimulated ? BigDecimal.ZERO : undefined}
            value={rewards?.now.earned.total}
            fetching={fetching}
          />
          <Row
            title="Vested"
            tip="Rewards from previous claims that have vested. The next claim will send 100% of these rewards to you."
            preview={showSimulated ? BigDecimal.ZERO : undefined}
            value={rewards?.now.vesting.unlocked}
            fetching={fetching}
          />
          <Row
            title="Vesting"
            tip="Rewards from previous claims that are vesting. When a new vesting period starts, these rewards will gradually move to your 'Vested' amount."
            preview={
              showSimulated ? rewards?.afterClaim.vesting.locked : undefined
            }
            value={rewards?.now.vesting.locked}
            fetching={fetching}
          >
            {rewards?.nextUnlock &&
              rewards.currentTime < rewards.nextUnlock && (
                <div>
                  Next vesting period starts in{' '}
                  {formatDistance(
                    fromUnixTime(rewards.currentTime),
                    fromUnixTime(rewards.nextUnlock),
                  )}
                </div>
              )}
          </Row>
          <Row
            title="Wallet"
            preview={showSimulated ? previewedBalance : undefined}
            value={metaToken?.balance}
          />
          <RewardsTimeTravel />
        </Stats>
      </Body>
    </Widget>
  );
};
