import React, { FC, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
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
  margin-bottom: 0.75rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Stats = styled.div``;

const Body = styled.div`
  display: flex;
  padding-bottom: 1rem;

  > div {
    flex-basis: 50%;
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
}> = ({ title, tip, value }) => {
  const formattedValue = value?.format(4);
  return (
    <RowContainer>
      <span>{title}</span>
      {tip && <Tooltip tip={tip} />}
      {value ? (
        <>
          <Line />
          <span>{formattedValue}</span>
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
  // temporary
  const loading = false;

  const [simulatedValues, setSimulated] = useState<SavingValues | undefined>();

  const values = useMemo((): SavingValues | undefined => {
    // wait for all values
    if (loading) return;
    return {
      claimable: new BigDecimal((3e18).toString()),
      vesting: new BigDecimal((3e18).toString()),
      wallet: new BigDecimal((3e18).toString()),
    };
  }, [loading]);

  const handleClick = (): void => {
    if (values === undefined) return;

    const newValues = simulateValues(values);
    setSimulated(simulatedValues ? undefined : newValues);
  };

  return (
    <Widget title="Savings Rewards">
      <Body>
        <Stats>
          <Row
            title="Claimable"
            tip="Tooltip title"
            value={values?.claimable}
          />
          <Row title="Vesting" tip="Tooltip title" value={values?.vesting} />
          <Row title="Wallet" value={values?.wallet} />
        </Stats>
        <ButtonContainer>
          <Button
            onClick={handleClick}
            disabled={loading}
            highlighted={!!simulatedValues}
          >
            {simulatedValues ? `Claim` : `Claim Preview`}
          </Button>
        </ButtonContainer>
      </Body>
    </Widget>
  );
};
