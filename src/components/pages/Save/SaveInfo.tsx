import React, { FC, ReactElement } from 'react';
import styled, { css } from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { ReactComponent as MUSD } from '../../icons/tokens/mUSD.svg';
import { ReactComponent as IMUSD } from '../../icons/tokens/imUSD.svg';
import { ReactComponent as IMUSDMTA } from '../../icons/tokens/imusd-mta.svg';
import { ReactComponent as WarningBadge } from '../../icons/badges/warning.svg';
import {
  SaveVersion,
  useSelectedSavingsContractState,
} from '../../../context/SelectedSaveVersionProvider';
import { SaveMigration } from './SaveMigration';
import { Widget, WidgetButton } from '../../core/Widget';
import { BigDecimal } from '../../../web3/BigDecimal';
import { useAverageApyForPastWeek } from '../../../web3/hooks';
import { ViewportWidth } from '../../../theme';
import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';

const ContainerSnippet = css`
  > div > div {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    svg {
      margin-right: 1.25rem;
    }
  }

  > div > div:first-child {
    justify-content: flex-start;
  }

  > div > div:nth-child(2) {
    display: none;
  }

  @media (min-width: ${ViewportWidth.m}) {
    > div > div:nth-child(2) {
      display: inherit;
    }
  }
`;

const Title = styled.div`
  display: flex;
  font-weight: 600;
  text-align: left;
`;

const HeaderTitle = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.grey};
`;

const Subtitle = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.grey};
  text-align: left;
`;

const Interest = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-align: right;

  span {
    font-size: 0.75rem;
  }
`;

const Asset = styled.div`
  flex: 1;
  display: flex;
  align-items: center;

  > svg {
    height: 2rem;
    width: 2rem;
  }
`;

const StyledWarningBadge = styled(WarningBadge)`
  width: 1.25rem;
  height: 1.25rem;
  position: absolute;
  right: -3rem;
  top: 0;
`;

const Migration = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledWidget = styled(Widget)`
  ${ContainerSnippet};
`;

const StyledWidgetButton = styled(WidgetButton)`
  ${ContainerSnippet};

  margin-bottom: 0.5rem;

  h4 {
    font-size: 1.25rem;
    display: inline-flex;
  }
`;

const Number = styled.span`
  ${({ theme }) => theme.mixins.numeric};

  font-size: 1rem;

  @media (min-width: ${ViewportWidth.m}) {
    font-size: 1.25rem;
  }
`;

const Container = styled.div`
  > div:not(:last-child) {
    margin-bottom: 0.75rem;
  }

  div {
    position: relative;
  }

  padding: 1.5rem 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-bottom: 1.5rem;
`;

const Line = styled.div`
  background: #eee;
  height: 2px;
  width: 4rem;
`;

const Row: FC<{
  title: string;
  subtitle?: string;
  balance?: BigDecimal;
  interest?: number;
  boosted?: boolean;
  warning?: boolean;
  AssetIcon: ReactElement;
}> = props => {
  const {
    title,
    subtitle,
    balance,
    interest,
    boosted = false,
    warning = false,
    AssetIcon,
  } = props;
  return (
    <StyledWidgetButton border>
      <div>
        <Asset>
          {AssetIcon}
          <div>
            <Title>
              <div>
                <h4>{title}</h4>
                {warning && <StyledWarningBadge />}
              </div>
            </Title>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
          </div>
        </Asset>
      </div>
      <div>
        <Interest>
          {interest ? (
            <>
              <Number>
                <h4>{`${interest?.toFixed(2) ?? `0.00`}%`}</h4>
              </Number>
              {boosted && <span>+ MTA</span>}
            </>
          ) : interest === 0 ? (
            <Line />
          ) : (
            <Skeleton height={24} width={100} />
          )}
        </Interest>
      </div>
      <div>
        {balance ? (
          <h4>
            <Number>{balance?.format(6)}</Number>
          </h4>
        ) : (
          <Skeleton height={24} width={100} />
        )}
      </div>
    </StyledWidgetButton>
  );
};

export const SaveInfo: FC = () => {
  const interestRate = useAverageApyForPastWeek();
  const savingsContractState = useSelectedSavingsContractState();
  const massetState = useSelectedMassetState();

  const isV1SelectedAndDeprecated =
    savingsContractState?.version === SaveVersion.V1 &&
    !savingsContractState.current;

  // TODO: - Balance should be wallet balance for imUSD
  // Should also split between v1 & v2 state for determing balance, eg from SC vs wallet for v2
  // Needs imusd
  const mUSD = massetState?.token;
  const imUSD = undefined;

  return (
    <Container>
      <StyledWidget padding>
        <HeaderTitle>Asset</HeaderTitle>
        <HeaderTitle>APY</HeaderTitle>
        <HeaderTitle>Balance</HeaderTitle>
      </StyledWidget>
      <Row
        title="mUSD"
        subtitle="mStable USD"
        balance={mUSD?.balance}
        interest={0}
        warning={isV1SelectedAndDeprecated}
        AssetIcon={<MUSD />}
      />
      <Row
        title="imUSD"
        subtitle="Interest-bearing mUSD"
        balance={imUSD}
        interest={1.2}
        AssetIcon={<IMUSD />}
      />
      <Row
        title="imUSD Vault"
        subtitle="Vault with MTA rewards"
        balance={undefined}
        interest={interestRate}
        boosted
        AssetIcon={<IMUSDMTA />}
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
