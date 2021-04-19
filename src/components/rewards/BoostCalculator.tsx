import React, { FC, useMemo } from 'react';
import styled from 'styled-components';

import { ADDRESSES } from '../../constants';
import { useTokenSubscription } from '../../context/TokensProvider';
import { useBigDecimalInput } from '../../hooks/useBigDecimalInput';
import { ViewportWidth } from '../../theme';
import { Button } from '../core/Button';
import { DifferentialCountup } from '../core/CountUp';
import { InfoMessage } from '../core/InfoMessage';
import { Widget } from '../core/Widget';
import { AssetInput } from '../forms/AssetInput';
import {
  calculateBoost,
  calculateBoostImusd,
  calculateVMTAForMaxBoost,
  calculateVMTAForMaxBoostImusd,
  getCoeffs,
} from '../../utils/boost';
import { ReactComponent as ArrowsSvg } from '../icons/double-arrow.svg';
import { ReactComponent as GovSvg } from '../icons/governance-icon.svg';
import { BigDecimal } from '../../web3/BigDecimal';
import { BoostedSavingsVaultState } from '../../context/DataProvider/types';

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

  > .preview svg {
    path,
    rect {
      fill: ${({ theme }) => theme.color.body};
    }
  }

  > .gov svg {
    path,
    rect {
      fill: ${({ theme }) => theme.color.white};
    }
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
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  width: 100%;
  justify-content: space-between;

  > div {
    display: flex;

    &:not(:last-child) {
      margin-bottom: 1rem;
    }

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

export const BoostCalculator: FC<{
  vault: BoostedSavingsVaultState;
  apy?: number;
  onClick?: () => void;
  noBackButton?: boolean;
  isImusd?: boolean;
}> = ({ apy, noBackButton, onClick, vault, isImusd }) => {
  const inputAddress = vault.stakingToken;

  const inputToken = useTokenSubscription(inputAddress);
  const inputBalance = inputToken?.balance;
  const vMTA = useTokenSubscription(ADDRESSES.vMTA);
  const vMTABalance = vMTA?.balance;

  const defaultInputValue = isImusd
    ? BigDecimal.parse('100')
    : BigDecimal.parse('1');

  const [vMTAValue, vMTAFormValue, setVmta] = useBigDecimalInput(vMTABalance);
  const [inputValue, inputFormValue, setInput] = useBigDecimalInput(
    inputBalance?.simpleRounded !== 0 ? inputBalance : defaultInputValue,
  );

  const boost = useMemo(() => {
    const coeffs = getCoeffs(vault);
    return {
      fromBalance:
        isImusd || !coeffs
          ? calculateBoostImusd(inputBalance, vMTABalance)
          : calculateBoost(...coeffs, inputBalance, vMTABalance),
      fromInputs:
        isImusd || !coeffs
          ? calculateBoostImusd(inputValue, vMTAValue)
          : calculateBoost(...coeffs, inputValue, vMTAValue),
    };
  }, [isImusd, inputBalance, vMTABalance, vault, inputValue, vMTAValue]);

  return (
    <Container
      title="Earning Power Calculator"
      tooltip="Calculate your optimal MTA rewards multiplier"
      headerContent={
        noBackButton ? null : (
          <Button scale={0.7} onClick={onClick}>
            Back
          </Button>
        )
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
            address={inputAddress}
            addressDisabled
            formValue={inputFormValue}
            handleSetAmount={setInput}
          />
        </CalculatorInputs>
        <CalculatorActions>
          <MultiplierContainer>
            <Equal>=</Equal>
            <MultiplierBox>
              <div>
                <span>Multiplier</span>
                <BoostCountup
                  end={boost.fromInputs}
                  prev={boost.fromBalance}
                  suffix="x"
                />
              </div>
              {apy && (
                <div>
                  <span>APY</span>
                  <BoostCountup
                    end={apy * boost.fromInputs}
                    prev={apy * boost.fromBalance}
                    suffix="%"
                  />
                </div>
              )}
            </MultiplierBox>
          </MultiplierContainer>
          <BoostAndActions>
            <StyledButton
              onClick={() => {
                if (inputValue) {
                  const coeffs = getCoeffs(vault);
                  const vMTARequired =
                    isImusd || !coeffs
                      ? calculateVMTAForMaxBoostImusd(inputValue)
                      : calculateVMTAForMaxBoost(inputValue, ...coeffs);
                  setVmta(vMTARequired?.toFixed(2));
                }
              }}
            >
              <div className="preview">
                <ArrowsSvg />
                Preview Max
              </div>
            </StyledButton>
            <StyledButton
              highlighted
              onClick={() => {
                window.open(GOVERNANCE_URL);
              }}
            >
              <div className="gov">
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
