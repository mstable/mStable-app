import React, { FC, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton/lib';

import { ADDRESSES } from '../../../../constants';
import { useSaveV2Address } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';
import { createToggleContext } from '../../../../hooks/createToggleContext';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';
import { ReactComponent as ArrowsSvg } from '../../../icons/double-arrow.svg';
import { ReactComponent as GovSvg } from '../../../icons/governance-icon.svg';
import { DifferentialCountup } from '../../../core/CountUp';
import { ProgressBar } from '../../../core/ProgressBar';
import { Button, UnstyledButton } from '../../../core/Button';
import { Widget } from '../../../core/Widget';
import { ViewportWidth } from '../../../../theme';
import { BigDecimal } from '../../../../web3/BigDecimal';
import { AssetTokenInput } from './AssetTokenInput';
import { SavingsReward } from './SavingsReward';

const MAX_BOOST = 1.5;
const MIN_BOOST = 0.5;
const COEFFICIENT = 3.2;
const SAVE_EXPONENT = 0.875;

const BoostCountup = styled(DifferentialCountup)``;

const StyledButton = styled(UnstyledButton)`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 1.5rem;
  background: #eee;
  color: rgba(121, 121, 121, 1);
  border-radius: 1.5rem;
  font-size: 0.9rem;
  white-space: nowrap;
  cursor: pointer;
  transition: 0.2s ease;

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
  height: 2px;
  margin-left: 16px;
  margin-right: 16px;
  background: #eee;
`;

const BoostBarRange = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: grey;
  padding: 0.5rem 0;
  ${({ theme }) => theme.mixins.numeric}
`;

const CalculatorInputs = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  flex-direction: column;
`;

const BoostValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #eee;
  border-radius: 1rem;

  ${BoostCountup} {
    font-size: 1.5rem;
  }
`;

const BoostAndActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
  flex: 0;

  > * {
    width: 100%;
  }
`;

const [useShowCalculatorCtx, ShowCalculatorProvider] = createToggleContext(
  false,
);

const calculateBoost = (
  saveBalance?: BigDecimal,
  vMTABalance?: BigDecimal,
): number => {
  if (
    vMTABalance &&
    saveBalance &&
    vMTABalance.simple > 0 &&
    saveBalance.simple > 0
  ) {
    const boost =
      MIN_BOOST +
      (COEFFICIENT * vMTABalance.simple) / saveBalance.simple ** SAVE_EXPONENT;
    return Math.min(MAX_BOOST, boost);
  }
  return MIN_BOOST;
};

const calculateVMTAForMaxBoost = (saveBalance: BigDecimal): number => {
  return (
    ((MAX_BOOST - MIN_BOOST) / COEFFICIENT) *
    saveBalance.simple ** SAVE_EXPONENT
  );
};

const CalculatorWidget = styled(Widget)`
  > :last-child {
    flex-direction: column;

    @media (min-width: ${ViewportWidth.m}) {
      flex-direction: row;
    }
  }
`;

export const Calculator: FC = () => {
  const [, toggleShowCalculator] = useShowCalculatorCtx();

  const saveAddress = useSaveV2Address();
  const save = useTokenSubscription(saveAddress);
  const vMTA = useTokenSubscription(ADDRESSES.vMTA);

  const [vMTAValue, vMTAFormValue, setVmta] = useBigDecimalInput();
  const [saveValue, saveFormValue, setSave] = useBigDecimalInput(save?.balance);

  const boost = useMemo(() => {
    return {
      fromBalance: calculateBoost(save?.balance, vMTA?.balance),
      fromInputs: calculateBoost(saveValue, vMTAValue),
    };
  }, [saveValue, vMTAValue, vMTA, save]);

  const handlePreviewMax = useCallback(() => {
    if (saveValue) {
      const vMTARequired = calculateVMTAForMaxBoost(saveValue);
      setVmta(vMTARequired.toFixed(2));
    }
  }, [saveValue, setVmta]);

  return (
    <CalculatorWidget
      title="Savings Boost Calculator"
      tooltip="Find out how to get the optimal boost"
      headerContent={
        <Button scale={0.7} onClick={toggleShowCalculator}>
          Back
        </Button>
      }
    >
      <CalculatorInputs>
        <div>
          {vMTA ? (
            <AssetTokenInput
              token={{
                address: vMTA.address,
                disabled: true,
              }}
              amount={{
                value: vMTAValue,
                formValue: vMTAFormValue,
                handleChange: setVmta,
              }}
            />
          ) : (
            <Skeleton />
          )}
        </div>
        <div>
          {save ? (
            <AssetTokenInput
              token={{
                address: save.address,
                disabled: true,
              }}
              amount={{
                value: saveValue,
                formValue: saveFormValue,
                handleChange: setSave,
              }}
            />
          ) : (
            <Skeleton />
          )}
        </div>
      </CalculatorInputs>
      <BoostAndActions>
        <BoostValue>
          <span>Boost</span>
          <BoostCountup
            end={boost.fromInputs}
            prev={boost.fromBalance}
            suffix="x"
          />
        </BoostValue>
        <StyledButton onClick={handlePreviewMax}>
          <ArrowsSvg />
          Preview Max
        </StyledButton>
        <a
          href="https://governance.mstable.org/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <StyledButton>
            <GovSvg />
            Stake MTA
          </StyledButton>
        </a>
      </BoostAndActions>
    </CalculatorWidget>
  );
};

const BoostBar: FC = () => {
  const [, toggleShowCalculator] = useShowCalculatorCtx();
  const saveAddress = useSaveV2Address();
  const save = useTokenSubscription(saveAddress);
  const vMTA = useTokenSubscription(ADDRESSES.vMTA);

  const boost = useMemo<number>(
    () => calculateBoost(save?.balance, vMTA?.balance),
    [save, vMTA],
  );

  return (
    <Widget
      title="Savings Boost"
      tooltip="Save rewards are boosted by a multiplier (from 0.5 to 1.5)"
      headerContent={
        <Button scale={0.7} onClick={toggleShowCalculator}>
          Calculator
        </Button>
      }
    >
      <div>
        <ProgressBar
          color="#67C73A"
          highlight="#77D16F"
          value={boost}
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

const Container = styled(Widget)<{ showCalculator?: boolean }>`
  margin-bottom: 0.75rem;

  > div {
    display: flex;
    gap: 2rem;
    justify-content: space-between;
    flex-direction: column;
  }

  > div > * {
    flex: 1;
  }

  @media (min-width: ${ViewportWidth.l}) {
    > div {
      flex-direction: row;
      align-items: stretch;
      justify-content: space-between;
    }

    > div > * {
      flex: ${({ showCalculator }) => !showCalculator && 0};
      flex-basis: ${({ showCalculator }) =>
        !showCalculator && `calc(47.5% - 0.75rem)`};
    }
  }
`;

const BoostContent: FC = () => {
  const [showCalculator] = useShowCalculatorCtx();
  return (
    <Container border showCalculator={showCalculator}>
      {showCalculator ? (
        <Calculator />
      ) : (
        <>
          <BoostBar />
          <SavingsReward />
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
