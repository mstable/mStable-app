import React, { FC, useMemo } from 'react';
import styled from 'styled-components';

import { ADDRESSES } from '../../../../constants';
import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { useTokenSubscription } from '../../../../context/TokensProvider';
import { createToggleContext } from '../../../../hooks/createToggleContext';
import { ProgressBar } from '../../../core/ProgressBar';
import { Button } from '../../../core/Button';
import { Widget } from '../../../core/Widget';
import { ViewportWidth } from '../../../../theme';
import { VaultRewards } from './VaultRewards';
import { RewardsProvider } from './RewardsProvider';
import { calculateBoost } from './utils';
import { SaveCalculator } from './SaveCalculator';

const BoostBarLine = styled.div`
  width: 100%;
  height: 2px;
  margin-left: 16px;
  margin-right: 16px;
  background: ${({ theme }) => theme.color.accent};
`;

const BoostBarRange = styled.div`
  ${({ theme }) => theme.mixins.numeric};

  display: flex;
  justify-content: space-between;
  align-items: center;
  color: grey;
  padding: 0.5rem 0;
`;

const [useShowCalculatorCtx, ShowCalculatorProvider] = createToggleContext(
  false,
);

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
        <ProgressBar value={boost} min={1} max={3} decimals={1} showLabel />
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
    flex-direction: column;
    justify-content: space-between;
  }

  > div > * {
    flex: 1;
  }

  @media (min-width: ${ViewportWidth.l}) {
    > div {
      flex-direction: row;
      align-items: stretch;
    }

    > div > * {
      flex: ${({ showCalculator }) => !showCalculator && 0};
      flex-basis: ${({ showCalculator }) =>
        !showCalculator && `calc(47.5% - 0.75rem)`};
    }
  }
`;

const BoostContent: FC = () => {
  const [showCalculator, toggleShowCalculator] = useShowCalculatorCtx();

  return (
    <Container padding showCalculator={showCalculator}>
      {showCalculator ? (
        <SaveCalculator onClick={toggleShowCalculator} />
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
      <SaveCalculator onClick={onBackClick} />
    </RewardsProvider>
  </ShowCalculatorProvider>
);
