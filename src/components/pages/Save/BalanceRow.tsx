import React, { FC, ReactElement } from 'react';
import styled, { css } from 'styled-components';

import { gradientShift, ViewportWidth } from '../../../theme';
import { BigDecimal } from '../../../web3/BigDecimal';
import { Widget, WidgetButton } from '../../core/Widget';
import { ThemedSkeleton } from '../../core/ThemedSkeleton';
import { useAccount } from '../../../context/UserProvider';
import { ReactComponent as ExternalLinkArrow } from '../../core/external-link-arrow.svg';
import { ReactComponent as WarningBadge } from '../../icons/badges/warning.svg';

import { CountUp } from '../../core/CountUp';
import { TokenIcon } from '../../icons/TokenIcon';
import { formatMassetName } from '../../../context/SelectedMassetNameProvider';
import { MassetName } from '../../../types';

export enum BalanceType {
  Masset,
  SavingsDeprecated,
  Savings,
  BoostedSavingsVault,
  Meta,
  VMeta,
}

interface Props {
  token: BalanceType;
  masset?: MassetName;
  balance?: BigDecimal;
  rewards?: ReactElement;
  dollarExchangeRate?: number;
  highlight?: boolean;
  apy?: number | string;
  warning?: boolean;
  external?: boolean;
  onClick?(): void;
}

interface RowProps {
  title: string;
  subtitle?: string;
  apyLabel?: string;
  info?: string | ReactElement;
  symbol: string;
}

export const ContainerSnippet = css`
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;

  > div {
    display: block;
    width: 100%;

    > div {
      display: flex;
      align-items: center;

      &:first-child {
        justify-content: flex-start;
        margin-bottom: 1rem;
      }
    }
  }

  @media (min-width: ${ViewportWidth.m}) {
    > div {
      display: flex;

      > div {
        justify-content: flex-end;
        width: 25%;

        &:first-child {
          width: 50%;
          margin-bottom: 0;
        }
      }
    }
  }
`;

const Number = styled(CountUp)`
  display: block;

  ${({ theme }) => theme.mixins.numeric};

  font-size: 1rem;

  @media (min-width: ${ViewportWidth.m}) {
    font-size: 1.25rem;
  }
`;

const Line = styled.div`
  background: ${({ theme }) => theme.color.accent};
  height: 2px;
  width: 4rem;
`;

const Label = styled.div`
  font-size: 0.8rem;
  font-weight: 600;

  @media (min-width: ${ViewportWidth.m}) {
    display: none;
  }
`;

const ApyLabel = styled(Label)`
  @media (min-width: ${ViewportWidth.m}) {
    display: block;
  }
`;

const Title = styled.div`
  display: flex;
  font-weight: 600;
  text-align: left;
  color: ${({ theme }) => theme.color.primary};

  div {
    position: relative;
  }
`;

const Info = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.bodyAccent};
  text-align: left;
  p {
    margin-bottom: 0.25rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const Subtitle = styled(Info)`
  font-weight: 600;
  margin-bottom: 0.25rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Interest = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;

  div + div {
    font-size: 0.75rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    align-items: flex-end;
    text-align: right;
    font-size: 1.2rem;
    margin-bottom: 0;
  }
`;

const AssetIcon = styled(TokenIcon)`
  align-self: flex-start;
  flex-shrink: 0;
  width: 2.5rem;
  height: auto;
  margin-right: 1.25rem;
`;

const Asset = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const ExchangeRate = styled(Number)`
  color: ${({ theme }) => theme.color.bodyAccent};
`;

const BalanceValue = styled.div`
  flex-direction: column;
  justify-content: center !important;

  ${Number} + ${Number} {
    font-size: 1rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    gap: 0.5rem;
    align-items: flex-end !important;
  }
`;

const StyledExternalLinkArrow = styled(ExternalLinkArrow)`
  position: absolute;
  top: 1px;
  width: 1rem;
  height: 1rem;
  right: -3rem;

  * {
    fill: ${({ theme }) => theme.color.primary};
  }
`;

const StyledWarningBadge = styled(WarningBadge)`
  position: absolute;
  top: 0;
  width: 1.25rem;
  height: 1.25rem;
  right: -3rem;
`;

const VaultContainer = styled.div<{ highlight?: boolean }>`
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 0.75rem;

  > div {
    border-top: 1px solid ${({ theme }) => theme.color.accent};
  }

  ${({ highlight }) => (highlight ? gradientShift : '')}
`;

const HeaderContainer = styled(Widget)`
  ${ContainerSnippet};

  padding: 0 1.25rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.grey};

  display: none;

  @media (min-width: ${ViewportWidth.m}) {
    display: flex;
  }
`;

const DefaultContainer = styled(WidgetButton)<{ highlight?: boolean }>`
  ${ContainerSnippet};
  ${({ highlight }) => (highlight ? gradientShift : '')}

  width: 100%;

  h4 {
    font-size: 1.25rem;
    display: inline-flex;
  }
`;

const getRow = (masset: MassetName): Record<BalanceType, RowProps> => {
  const formattedMasset = formatMassetName(masset);
  return {
    [BalanceType.Masset]: {
      title: `${formattedMasset}`,
      subtitle: `mStable ${formattedMasset}`,
      info: <p>A meta-stablecoin with a native interest rate.</p>,
      symbol: masset,
    },
    [BalanceType.SavingsDeprecated]: {
      title: `${formattedMasset} Save`,
      subtitle: `mStable ${formattedMasset} in Save V1`,
      symbol: masset,
    },
    [BalanceType.Savings]: {
      title: `i${formattedMasset}`,
      subtitle: `Interest-bearing ${formattedMasset}`,
      info: (
        <>
          <p>
            {`i${formattedMasset}`} is a token that is redeemable for{' '}
            {formattedMasset}.
          </p>
          <p>
            It passively gains interest while holding it, such that it is
            redeemable for a greater amount of {formattedMasset} as interest
            accrues over time.
          </p>
        </>
      ),
      symbol: `i${masset}`,
    },
    [BalanceType.BoostedSavingsVault]: {
      title: `i${formattedMasset} Vault`,
      subtitle: 'Interest and MTA rewards',
      apyLabel: `APY (i${formattedMasset} only)`,
      info: (
        <>
          <p>
            Optionally, deposit {`i${formattedMasset}`} and get MTA rewards on
            top of {`i${formattedMasset}`}'s interest rate.
          </p>
          <p>The rewards earned can be multiplied by staking MTA.</p>
          <p>
            {`i${formattedMasset}`} can be withdrawn at any time, and claimed
            MTA rewards are streamed after a lockup time.
          </p>
        </>
      ),
      symbol: `i${masset}mta`,
    },
    [BalanceType.Meta]: {
      title: 'MTA',
      subtitle: 'mStable Meta',
      info: (
        <p>
          The token used to govern mStable, incentivise contributors, and to
          secure the protocol.
        </p>
      ),
      symbol: 'mta',
    },
    [BalanceType.VMeta]: {
      title: 'vMTA',
      subtitle: 'Voting escrow MTA',
      info: (
        <>
          <p>Locking up MTA to create a stake creates vMTA.</p>
          <p>
            vMTA confers power to vote on proposals, earn staking rewards, and
            get multiplied rewards (e.g. via the imUSD Vault).
          </p>
        </>
      ),
      symbol: 'vmta',
    },
  };
};

export const BalanceHeader: FC = () => {
  return (
    <HeaderContainer>
      <div>Asset</div>
      <div>APY/Rewards</div>
      <div>Balance</div>
    </HeaderContainer>
  );
};

const InternalBalanceRow: FC<Props & { hasChildren?: boolean }> = ({
  apy,
  balance,
  dollarExchangeRate,
  external,
  hasChildren = false,
  highlight,
  onClick,
  rewards,
  token,
  warning = false,
  masset = 'musd',
}) => {
  const account = useAccount();

  const tokenInfo = getRow(masset)[token] as RowProps;

  const { title, subtitle, info, symbol, apyLabel } = tokenInfo;
  const hasBorder = !hasChildren;

  return (
    <DefaultContainer
      border={hasBorder}
      padding={hasChildren}
      onClick={onClick}
      highlight={highlight}
    >
      <div>
        <Asset>
          <AssetIcon symbol={symbol} />
          <div>
            <Title>
              <div>
                <h4>{title}</h4>
                {external && <StyledExternalLinkArrow />}
                {warning && <StyledWarningBadge />}
              </div>
            </Title>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
            {info && <Info>{info}</Info>}
          </div>
        </Asset>
      </div>
      <div>
        <Interest>
          {!apy || apy === 0 ? (
            <Line />
          ) : apy ? (
            <>
              <ApyLabel>{apyLabel ?? 'APY'}</ApyLabel>
              <div>
                {typeof apy === 'string' ? (
                  apy
                ) : (
                  <Number end={apy} suffix="%" />
                )}
              </div>
            </>
          ) : (
            <ThemedSkeleton height={24} width={100} />
          )}
          {rewards}
        </Interest>
      </div>
      <BalanceValue>
        <Label>Balance</Label>
        {account ? (
          balance ? (
            <>
              <Number end={balance.simple} decimals={6} />
              {balance.simple !== 0 && dollarExchangeRate && (
                <ExchangeRate
                  prefix="≈ $"
                  end={dollarExchangeRate * balance.simple}
                  decimals={4}
                />
              )}
            </>
          ) : (
            <ThemedSkeleton height={24} width={100} />
          )
        ) : (
          <Line />
        )}
      </BalanceValue>
    </DefaultContainer>
  );
};

export const BalanceRow: FC<Props> = ({
  apy,
  balance,
  children,
  dollarExchangeRate,
  external,
  highlight,
  onClick,
  rewards,
  token,
  warning,
  masset,
}) => {
  return children ? (
    <VaultContainer highlight={highlight}>
      <InternalBalanceRow
        apy={apy}
        balance={balance}
        dollarExchangeRate={dollarExchangeRate}
        external={external}
        hasChildren={!!children}
        onClick={onClick}
        rewards={rewards}
        token={token}
        warning={warning}
        masset={masset}
      />
      {children}
    </VaultContainer>
  ) : (
    <InternalBalanceRow
      apy={apy}
      balance={balance}
      dollarExchangeRate={dollarExchangeRate}
      external={external}
      highlight={highlight}
      onClick={onClick}
      rewards={rewards}
      token={token}
      warning={warning}
      masset={masset}
    />
  );
};
