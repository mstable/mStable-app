import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { useInterval } from 'react-use';

import { createToggleContext } from '../../../../hooks/createToggleContext';
import { ReactComponent as ArrowsSvg } from '../../../icons/double-arrow.svg';
import { ReactComponent as GovSvg } from '../../../icons/governance-icon.svg';
import { Input } from '../../../forms/AmountInput';
import { ProgressBar } from '../../../core/ProgressBar';
import { Button, UnstyledButton } from '../../../core/Button';
import { Widget } from '../../../core/Widget';
import { CountUp } from '../../../core/CountUp';

const [useShowCalculatorCtx, ShowCalculatorProvider] = createToggleContext(
  false,
);

const StyledCountup = styled(CountUp)``;

const StyledButton = styled(UnstyledButton)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1.5rem;
  margin-bottom: 0.5rem;
  background: #eee;
  color: rgba(121, 121, 121, 1);
  border-radius: 1.5rem;
  font-size: 0.9rem;
  white-space: nowrap;

  svg {
    width: 1.5rem;
    height: 1.5rem;
    * {
      fill: rgba(121, 121, 121, 1);
    }
  }

  &:hover {
    background: #176ede;
    color: white;
    svg * {
      fill: white;
    }
  }
`;

const BoostBarLine = styled.div`
  width: 100%;
  height: 1px;
  margin-left: 16px;
  margin-right: 16px;
  background: #e0e0e0;
`;

const BoostBarRange = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: grey;
  padding: 0.5rem 0;

  ${({ theme }) => theme.mixins.numeric}
`;

const CalculatorBoost = styled.div`
  background: #eee;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;

  ${StyledCountup} {
    font-size: 1.5rem;
  }
`;

const CalculatorInputs = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;

  > * {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const CalculatorActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
  width: auto;
`;

export const Calculator: FC = () => {
  // TODO use boost value
  // TODO define tooltip
  // TODO use token icons

  const [, toggleShowCalculator] = useShowCalculatorCtx();

  return (
    <Widget
      title="Savings Boost Calculator"
      tooltip="TODO define tooltip"
      headerContent={<Button onClick={toggleShowCalculator}>Back</Button>}
    >
      <CalculatorInputs>
        <div>
          <div>vMTA</div>
          <Input />
        </div>
        <div>
          <div>imUSD</div>
          <Input />
        </div>
      </CalculatorInputs>
      <CalculatorBoost>
        <div>Boost</div>
        <StyledCountup end={0.75} suffix="x" />
      </CalculatorBoost>
      <CalculatorActions>
        <StyledButton>
          <ArrowsSvg />
          Preview Max
        </StyledButton>
        <StyledButton>
          <GovSvg />
          Stake MTA
        </StyledButton>
      </CalculatorActions>
    </Widget>
  );
};

const BoostBar: FC = () => {
  const [, toggleShowCalculator] = useShowCalculatorCtx();

  // TODO define tooltip content
  // TODO actually set the boost and get values
  const [value, setValue] = useState(0);
  useInterval(() => {
    setValue(Math.random() + 0.5);
  }, 10000);

  return (
    <Widget
      title="Savings Boost"
      tooltip="TODO define tooltip"
      headerContent={<Button onClick={toggleShowCalculator}>Calculator</Button>}
    >
      <div>
        <ProgressBar
          color="#67C73A"
          highlight="#77D16F"
          value={value}
          min={0.5}
          max={1.5}
        />
        <BoostBarRange>
          <div>0.5x</div>
          <BoostBarLine />
          <div>1.5x</div>
        </BoostBarRange>
      </div>
    </Widget>
  );
};

const Rewards: FC = () => (
  <Widget title="Savings Rewards">TODO add rewards</Widget>
);

const Container = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: space-between;

  > * {
    flex: 1;
  }
`;

const BoostContent: FC = () => {
  const [showCalculator] = useShowCalculatorCtx();
  return (
    <Container>
      {showCalculator ? (
        <Calculator />
      ) : (
        <>
          <BoostBar />
          <Rewards />
        </>
      )}
    </Container>
  );
};

export const Boost: FC = () => (
  <ShowCalculatorProvider>
    <BoostContent />
  </ShowCalculatorProvider>
);
