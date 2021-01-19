import React, { FC, useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { ADDRESSES } from '../../../../constants';
import {
  useSaveV2Address,
  useSelectedMassetState,
} from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';
import { createToggleContext } from '../../../../hooks/createToggleContext';
import { useBigDecimalInput } from '../../../../hooks/useBigDecimalInput';
import { ReactComponent as ArrowsSvg } from '../../../icons/double-arrow.svg';
import { ReactComponent as GovSvg } from '../../../icons/governance-icon.svg';
import { DifferentialCountup } from '../../../core/CountUp';
import { ProgressBar } from '../../../core/ProgressBar';
import { Button } from '../../../core/Button';
import { Widget } from '../../../core/Widget';
import { ViewportWidth } from '../../../../theme';
import { VaultRewards } from './VaultRewards';
import { AssetInput } from '../../../forms/AssetInput';
import { RewardsProvider } from './RewardsProvider';
import { ThemedSkeleton } from '../../../core/ThemedSkeleton';
import { calculateBoost, calculateVMTAForMaxBoost } from './utils';

const BoostCountup = styled(DifferentialCountup)`
  font-weight: normal;
  margin-left: 0.25rem;
`;

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;

  svg {
    width: 1rem;
    margin-right: 0.5rem;
  }
`;

const BoostBarLine = styled.div`
  width: 100%;
  height: 2px;
  margin-left: 16px;
  margin-right: 16px;
  background: ${({ theme }) => theme.color.accent};
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
  width: 100%;
`;

const BoostAndActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  flex-basis: 40%;
`;

const [useShowCalculatorCtx, ShowCalculatorProvider] = createToggleContext(
  false,
);

const CalculatorWidget = styled(Widget)`
  > :last-child {
    flex-direction: column;

    @media (min-width: ${ViewportWidth.m}) {
      flex-direction: row;
    }
  }
`;

const Calculator: FC<{ onBackClick?: () => void }> = ({ onBackClick }) => {
  const [, toggleShowCalculator] = useShowCalculatorCtx();

  const saveAddress = useSaveV2Address();
  const save = useTokenSubscription(saveAddress);
  const vMTA = useTokenSubscription(ADDRESSES.vMTA);

  const [vMTAValue, vMTAFormValue, setVmta] = useBigDecimalInput(vMTA?.balance);
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
      title="Earning Power Calculator"
      tooltip="Find out how to get the optimal boost"
      headerContent={
        <Button scale={0.7} onClick={onBackClick ?? toggleShowCalculator}>
          Back
        </Button>
      }
    >
      <CalculatorInputs>
        {vMTA ? (
          <AssetInput
            address={vMTA.address}
            addressDisabled
            formValue={vMTAFormValue}
            handleSetAmount={setVmta}
          />
        ) : (
          <ThemedSkeleton />
        )}
        {save ? (
          <AssetInput
            address={save.address}
            addressDisabled
            formValue={saveFormValue}
            handleSetAmount={setSave}
          />
        ) : (
          <ThemedSkeleton />
        )}
      </CalculatorInputs>
      <BoostAndActions>
        <StyledButton>
          <span>Multiplier</span>&nbsp;
          <BoostCountup
            end={boost.fromInputs}
            prev={boost.fromBalance}
            suffix="x"
          />
        </StyledButton>
        <StyledButton onClick={handlePreviewMax}>
          <ArrowsSvg />
          Preview Max
        </StyledButton>
        <a
          href="https://governance.mstable.org/"
          target="_blank"
          rel="noreferrer noopener"
        >
          <StyledButton highlighted>
            <GovSvg />
            Governance
          </StyledButton>
        </a>
      </BoostAndActions>
    </CalculatorWidget>
  );
};

const BoostBar: FC = () => {
  const [, toggleShowCalculator] = useShowCalculatorCtx();
  const massetState = useSelectedMassetState();
  const vMTA = useTokenSubscription(ADDRESSES.vMTA);
  const vaultBalance =
    massetState?.savingsContracts.v2?.boostedSavingsVault?.account?.rawBalance;
  const vMTABalance = vMTA?.balance;

  const boost = useMemo<number>(
    () => calculateBoost(vaultBalance, vMTABalance),
    [vaultBalance, vMTABalance],
  );

  return (
    <Widget
      title="Earning Power Multiplier"
      tooltip="Save rewards are boosted by a multiplier (1x to 3x)"
      headerContent={
        <Button scale={0.7} onClick={toggleShowCalculator}>
          Calculator
        </Button>
      }
    >
      <div>
        <ProgressBar value={boost} min={1} max={3} />
        <BoostBarRange>
          <div>1x</div>
          <BoostBarLine />
          <div>3x</div>
        </BoostBarRange>
      </div>
    </Widget>
  );
};

const Container = styled(Widget)<{ showCalculator?: boolean }>`
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
    <Container padding showCalculator={showCalculator}>
      {showCalculator ? (
        <Calculator />
      ) : (
        <>
          <BoostBar />
          <VaultRewards />
        </>
      )}
    </Container>
  );
};

export const Boost: FC = () => (
  <ShowCalculatorProvider>
    <RewardsProvider>
      <BoostContent />
    </RewardsProvider>
  </ShowCalculatorProvider>
);

export const BoostCalculator: FC<{ onBackClick?: () => void }> = ({
  onBackClick,
}) => (
  <ShowCalculatorProvider>
    <RewardsProvider>
      <Calculator onBackClick={onBackClick} />
    </RewardsProvider>
  </ShowCalculatorProvider>
);
