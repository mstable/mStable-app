import React, { FC } from 'react';
import styled from 'styled-components';

import { MUSDIconTransparent } from '../../icons/TokenIcon';
import { ReactComponent as WarningBadge } from '../../icons/badges/warning.svg';
import {
  SaveVersion,
  useSelectedSavingsContractState,
} from '../../../context/SelectedSaveVersionProvider';
import { SaveMigration } from './SaveMigration';
import { Widget } from '../../core/Widget';
import { BigDecimal } from '../../../web3/BigDecimal';
import { useAverageApyForPastWeek } from '../../../web3/hooks';

const Title = styled.div`
  display: flex;
`;

const Subtitle = styled.div`
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const StyledWarningBadge = styled(WarningBadge)`
  width: 1.25rem;
  height: 1.25rem;
  position: absolute;
  right: -2rem;
  top: 0;
`;

const Migration = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledWidget = styled(Widget)`
  h4 {
    font-size: 1.25rem;
    display: inline-flex;
  }
  img {
    height: 1.125rem;
    margin-right: 0.25rem;
  }
  span {
    ${({ theme }) => theme.mixins.numeric};
  }
`;

const Container = styled.div`
  > div:not(:last-child) {
    margin-bottom: 0.75rem;
  }
  div {
    position: relative;
  }
`;

const Row: FC<{
  title: string;
  balance?: BigDecimal;
  interest?: number;
  boosted?: boolean;
  warning?: boolean;
}> = ({ title, balance, interest, boosted = false, warning = false }) => {
  if (!balance || balance?.simple === 0) return null;

  return (
    <StyledWidget border>
      <div>
        <Subtitle>Account:</Subtitle>
        <Title>
          <div>
            <h4>{title}</h4>
            {warning && <StyledWarningBadge />}
          </div>
        </Title>
      </div>
      <div>
        <Subtitle>Interest:</Subtitle>
        <h4>
          <span>{`${interest?.toFixed(2) ?? `0.00`}%`}</span>&nbsp;
          {boosted && `+ MTA`}
        </h4>
      </div>
      <div>
        <Subtitle>Balance</Subtitle>
        <h4>
          <MUSDIconTransparent />
          <span>{balance?.format(8)}</span>
        </h4>
      </div>
    </StyledWidget>
  );
};

export const SaveInfo: FC = () => {
  const interestRate = useAverageApyForPastWeek();
  const savingsContractState = useSelectedSavingsContractState();

  const isV1SelectedAndDeprecated =
    savingsContractState?.version === SaveVersion.V1 &&
    !savingsContractState.current;

  // TODO: - Balance should be wallet balance for imUSD
  // Should also split between v1 & v2 state for determing balance, eg from SC vs wallet for v2
  const balance = undefined; // new BigDecimal((1e18).toString());
  const stakedBalance = savingsContractState?.savingsBalance?.balance;

  return (
    // TODO: - Move to menu?
    // <AnalyticsLink section="save" />
    <Container>
      {!isV1SelectedAndDeprecated && (
        <Row
          title="Staked Savings"
          balance={stakedBalance}
          interest={interestRate}
          boosted
        />
      )}
      <Row
        title="Savings"
        balance={balance}
        interest={interestRate}
        warning={isV1SelectedAndDeprecated}
      />
      <div>
        {isV1SelectedAndDeprecated && (
          <Migration>
            <SaveMigration />
          </Migration>
        )}
      </div>
    </Container>
  );
};
