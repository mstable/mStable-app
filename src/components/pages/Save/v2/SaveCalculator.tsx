import React, { FC, useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { ADDRESSES } from '../../../../constants';
import { useSaveV2Address } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';
import { ViewportWidth } from '../../../../theme';
import { Button } from '../../../core/Button';
import { DifferentialCountup } from '../../../core/CountUp';
import { InfoMessage } from '../../../core/InfoMessage';
import { Widget } from '../../../core/Widget';
import { AssetInput } from '../../../forms/AssetInput';
import { calculateBoost, calculateVMTAForMaxBoost } from './utils';
import ArrowsSvg from '../../../icons/double-arrow.svg';
import GovSvg from '../../../icons/governance-icon.svg';
import { BigDecimal } from '../../../../web3/BigDecimal';

const GOVERNANCE_URL = 'https://governance.mstable.org/#/stake';

const BoostCountup = styled(DifferentialCountup)`
  font-weight: normal;
  font-size: 1.5rem;
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  min-width: 11.25rem;
  width: 100%;

  svg {
    width: 1rem;
    margin-right: 0.5rem;
  }

  div {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  @media (min-width: ${ViewportWidth.l}) {
    width: auto;
  }
`;

const MultiplierBox = styled.div`
  border: 1px solid ${({ theme }) => theme.color.accent};
  display: flex;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  width: 100%;
  justify-content: space-between;

  > span:first-child {
    font-size: 1.125rem;
    font-weight: 600;
    color: ${({ theme }) => theme.color.body};
  }

  @media (min-width: ${ViewportWidth.m}) {
    > span:first-child {
      margin-right: 1rem;
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    max-width: 12.5rem;
    margin-right: 2rem;
    flex-direction: column;

    > span:first-child {
      margin-bottom: 1rem;
    }
  }
`;

const CalculatorInputs = styled.div`
  display: flex;
  justify-content: space-around;
  flex-direction: column;

  > div:first-child {
    margin-bottom: 0.5rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-basis: 55%;
  }

  @media (min-width: ${ViewportWidth.l}) {
    flex-basis: 45%;
  }
`;

const Equal = styled.div`
  display: none;

  @media (min-width: ${ViewportWidth.l}) {
    margin-right: 1rem;
    font-size: 1.25rem;
    color: ${({ theme }) => theme.color.bodyAccent};
    display: inherit;
  }
`;

const BoostAndActions = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;

  > *:first-child {
    margin-bottom: 0.5rem;
  }
`;

const MultiplierContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5rem;

  @media (min-width: ${ViewportWidth.l}) {
    margin-bottom: 0;
  }
`;

const CalculatorActions = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;

  @media (min-width: ${ViewportWidth.m}) {
    flex-basis: 45%;
  }

  @media (min-width: ${ViewportWidth.l}) {
    justify-content: flex-end;
    flex-direction: row;
    flex-basis: 55%;
  }
`;

const Container = styled(Widget)`
  gap: 1rem;

  > :last-child {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  > :last-child > div {
    gap: 2rem;
    display: flex;
    flex-direction: column;

    @media (min-width: ${ViewportWidth.m}) {
      flex-direction: row;
    }
  }
`;

export const SaveCalculator: FC<{ onClick?: () => void }> = ({ onClick }) => {
  const saveAddress = useSaveV2Address();
  const save = useTokenSubscription(saveAddress);
  const vMTA = useTokenSubscription(ADDRESSES.vMTA);

  const [vMTAValue, vMTAFormValue, setVmta] = useBigDecimalInput(vMTA?.balance);
  const [saveValue, saveFormValue, setSave] = useBigDecimalInput(
    save?.balance?.simpleRounded !== 0
      ? save?.balance
      : new BigDecimal((100e18).toString()),
  );

  const navigateToGovernance = (): void => {
    window?.open(GOVERNANCE_URL);
  };

  const boost = useMemo(() => {
    return {
      fromBalance: calculateBoost(save?.balance, vMTA?.balance),
      fromInputs: calculateBoost(saveValue, vMTAValue),
    };
  }, [saveValue, vMTAValue, vMTA, save]);

  const handlePreviewMax = useCallback(() => {
    if (saveValue) {
      const vMTARequired = calculateVMTAForMaxBoost(saveValue);
      setVmta(vMTARequired?.toFixed(2));
    }
  }, [saveValue, setVmta]);

  return (
    <Container
      title="Earning Power Calculator"
      tooltip="Calculate your optimal MTA rewards multiplier"
      headerContent={
        <Button scale={0.7} onClick={onClick}>
          Back
        </Button>
      }
    >
      <InfoMessage>
        <span>
          Use the calculator below to find your optimal MTA rewards multiplier
        </span>
      </InfoMessage>
      <div>
        <CalculatorInputs>
          <AssetInput
            address={vMTA?.address}
            addressDisabled
            formValue={vMTAFormValue}
            handleSetAmount={setVmta}
          />
          <AssetInput
            address={save?.address}
            addressDisabled
            formValue={saveFormValue}
            handleSetAmount={setSave}
          />
        </CalculatorInputs>
        <CalculatorActions>
          <MultiplierContainer>
            <Equal>=</Equal>
            <MultiplierBox>
              <span>Multiplier</span>
              <BoostCountup
                end={boost.fromInputs}
                prev={boost.fromBalance}
                suffix="x"
              />
            </MultiplierBox>
          </MultiplierContainer>
          <BoostAndActions>
            <StyledButton onClick={handlePreviewMax}>
              <div>
                <ArrowsSvg />
                Preview Max
              </div>
            </StyledButton>
            <StyledButton highlighted onClick={navigateToGovernance}>
              <div>
                <GovSvg />
                Get vMTA
              </div>
            </StyledButton>
          </BoostAndActions>
        </CalculatorActions>
      </div>
    </Container>
  );
};
