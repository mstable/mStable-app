import React, { FC, useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import { BigDecimal } from '../../../../web3/BigDecimal';

import { BubbleButton as Button } from '../../../core/Button';
import { Tooltip } from '../../../core/ReactTooltip';

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
  margin: 0.75rem 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Stats = styled.div``;

const Body = styled.div`
  display: flex;

  > div {
    flex-basis: 50%;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;

  h3 {
    font-weight: 600;
    font-size: 1.25rem;
    color: ${({ theme }) => theme.color.black};
  }

  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.grey};
  }
`;

const Container = styled.div`
  background: #ccc;
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
      {!!value ? (
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
  }, []);

  const handleClick = () => {
    if (values === undefined) return;

    const newValues = simulateValues(values);
    setSimulated(simulatedValues ? undefined : newValues);
  };

  return (
    <Container>
      <Header>
        <h3>Savings Rewards</h3>
      </Header>
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
    </Container>
  );
};
