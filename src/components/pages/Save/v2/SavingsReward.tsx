import React, { FC, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';
import { ViewportWidth } from '../../../../theme';
import { BigDecimal } from '../../../../web3/BigDecimal';

import { BubbleButton as Button } from '../../../core/Button';
import { Tooltip } from '../../../core/ReactTooltip';
import { Widget } from '../../../core/Widget';

type SavingValues = {
  [key in 'claimable' | 'vesting' | 'wallet']: BigDecimal;
};

const SkeleWrapper = styled.div`
  flex: 1;
  margin-left: 1.25rem;

  span {
    flex: 1;
    display: flex;
  }
`;

const PreviewText = styled.span`
  color: ${({ theme }) => theme.color.green};
`;

const Line = styled.div`
  background: #eee;
  height: 2px;
  margin: 0 1.25rem;
  flex: 1;
  display: flex;
`;

const RowContainer = styled.div`
  display: flex;
  align-items: center;

  span {
    ${({ theme }) => theme.mixins.numeric}
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;

  > button {
    flex: 1;
  }

  @media (min-width: ${ViewportWidth.m}) {
    margin: 0;
    justify-content: flex-end;

    > button {
      flex: initial;
    }
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

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;

    > div:first-child {
      flex-basis: 65%;
    }
    > div:last-child {
      flex-basis: 35%;
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    > div:first-child {
      flex-basis: ${({ isPreview }) => (isPreview ? `70%` : `50%`)};
    }
    > div:last-child {
      flex-basis: ${({ isPreview }) => (isPreview ? `30%` : `50%`)};
    }
  }
`;

const simulateValues = (values: SavingValues): SavingValues => {
  const { claimable, vesting, wallet } = values;
  return {
    claimable: claimable?.add(new BigDecimal((1e18).toString())),
    vesting: vesting?.add(new BigDecimal((1e18).toString())),
    wallet: wallet?.add(new BigDecimal((1e18).toString())),
  };
};

const Row: FC<{
  title: string;
  tip?: string;
  value?: BigDecimal;
  preview?: BigDecimal;
}> = ({ title, tip, value, preview }) => {
  const formattedValue = value?.format(preview ? 2 : 4);
  const formattedPreview = preview?.format(2);
  return (
    <RowContainer>
      {title}
      {tip && <Tooltip tip={tip} />}
      {value ? (
        <>
          <Line />
          <span>{formattedValue}</span>
          {!!formattedPreview && (
            <span>
              &nbsp;→ <PreviewText>{`${formattedPreview}`}</PreviewText>
            </span>
          )}
        </>
      ) : (
        <SkeleWrapper>
          <Skeleton height={8} />
        </SkeleWrapper>
      )}
    </RowContainer>
  );
};

export const SavingsReward: FC = () => {
  const [simulatedValues, setSimulated] = useState<SavingValues | undefined>();
  const massetState = useSelectedMassetState();
  const massetToken = useTokenSubscription(massetState?.address);
  const walletBalance = massetToken?.balance;

  // expand to cover others
  const loading = !walletBalance;

  const values = useMemo((): SavingValues | undefined => {
    // TODO: - Add other values so it waits for all before loading
    if (!walletBalance) return;
    return {
      claimable: new BigDecimal((3e18).toString()),
      vesting: new BigDecimal((3e18).toString()),
      wallet: walletBalance,
    };
  }, [walletBalance]);

  const handleClick = (): void => {
    if (values === undefined) return;

    if (!simulatedValues) {
      const newValues = simulateValues(values);
      setSimulated(simulatedValues ? undefined : newValues);
      setTimeout(() => {
        setSimulated(undefined);
      }, 10000);
    }

    // TODO: - claim function call here
    // claimRewards();
  };

  const isButtonDisabled = loading || values?.claimable.exact.eq(0);

  return (
    <Widget title="Savings Rewards">
      <Body isPreview={!!simulatedValues}>
        <Stats>
          <Row
            title="Claimable"
            tip="Earned + Unlocked tokens"
            preview={simulatedValues?.claimable}
            value={values?.claimable}
          />
          <Row
            title="Vesting"
            tip="These tokens will unlock over time"
            preview={simulatedValues?.vesting}
            value={values?.vesting}
          />
          <Row
            title="Wallet"
            preview={simulatedValues?.wallet}
            value={values?.wallet}
          />
        </Stats>
        <ButtonContainer>
          <Button
            onClick={handleClick}
            disabled={isButtonDisabled}
            highlighted={!!simulatedValues}
          >
            {simulatedValues ? `Claim` : `Preview Claim`}
          </Button>
        </ButtonContainer>
      </Body>
    </Widget>
  );
};
