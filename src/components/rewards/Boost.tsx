import React, { FC, useMemo } from 'react';
import styled from 'styled-components';

import { ADDRESSES } from '../../constants';
import { useTokenSubscription } from '../../context/TokensProvider';
import { createToggleContext } from '../../hooks/createToggleContext';
import { ProgressBar } from '../core/ProgressBar';
import { Button } from '../core/Button';
import { Widget } from '../core/Widget';
import { ViewportWidth } from '../../theme';

import {
  calculateBoost,
  calculateBoostImusd,
  getCoeffs,
} from '../../utils/boost';
import { BoostCalculator } from './BoostCalculator';
import { BoostedSavingsVaultState } from '../../context/DataProvider/types';

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

const BoostBar: FC<{
  vault: BoostedSavingsVaultState;
  disableCalculator?: boolean;
  isImusd?: boolean;
}> = ({ vault, disableCalculator, isImusd }) => {
  const [, toggleShowCalculator] = useShowCalculatorCtx();
  const vMTA = useTokenSubscription(ADDRESSES.vMTA);
  const vMTABalance = vMTA?.balance;
  const stakingToken = useTokenSubscription(vault.stakingContract);
  const inputBalance = stakingToken?.balance;

  const boost = useMemo<number>(() => {
    const coeffs = getCoeffs(vault);
    return isImusd || !coeffs
      ? calculateBoostImusd(inputBalance, vMTABalance)
      : calculateBoost(...coeffs, vMTABalance);
  }, [inputBalance, isImusd, vMTABalance, vault]);

  return (
    <Widget
      title="Earning Power Multiplier"
      tooltip="Rewards are boosted by a multiplier (1x to 3x)"
      headerContent={
        disableCalculator ? null : (
          <Button scale={0.7} onClick={toggleShowCalculator}>
            Calculator
          </Button>
        )
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

const BoostContent: FC<{
  vault: BoostedSavingsVaultState;
  apy?: number;
  disableCalculator?: boolean;
  isImusd?: boolean;
}> = ({ children, apy, vault, isImusd, disableCalculator }) => {
  const [showCalculator, toggleShowCalculator] = useShowCalculatorCtx();

  return (
    <Container padding showCalculator={showCalculator}>
      {showCalculator && !disableCalculator ? (
        <BoostCalculator
          apy={apy}
          vault={vault}
          isImusd={isImusd}
          onClick={toggleShowCalculator}
        />
      ) : (
        <>
          <BoostBar
            vault={vault}
            isImusd={isImusd}
            disableCalculator={disableCalculator}
          />
          {children}
        </>
      )}
    </Container>
  );
};

export const Boost: FC<{
  vault: BoostedSavingsVaultState;
  apy?: number;
  disableCalculator?: boolean;
  isImusd?: boolean;
}> = ({ apy, children, vault, isImusd, disableCalculator }) => (
  <ShowCalculatorProvider>
    <BoostContent
      apy={apy}
      vault={vault}
      isImusd={isImusd}
      disableCalculator={disableCalculator}
    >
      {children}
    </BoostContent>
  </ShowCalculatorProvider>
);
