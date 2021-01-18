import React, { FC, ReactElement } from 'react';
import styled, { css } from 'styled-components';

import { gradientShift, ViewportWidth } from '../../../theme';
import { BigDecimal } from '../../../web3/BigDecimal';
import { Widget, WidgetButton } from '../../core/Widget';
import { ThemedSkeleton } from '../../core/ThemedSkeleton';
import { useAccount } from '../../../context/UserProvider';
import { ReactComponent as ExternalLinkArrow } from '../../core/external-link-arrow.svg';
import { ReactComponent as WarningBadge } from '../../icons/badges/warning.svg';
import { ReactComponent as MUSDIcon } from '../../icons/tokens/mUSD.svg';
import { ReactComponent as IMUSDIcon } from '../../icons/tokens/imUSD.svg';
import { ReactComponent as IMUSDMTAIcon } from '../../icons/tokens/imusd-mta.svg';
import { ReactComponent as MTAIcon } from '../../icons/tokens/MTA.svg';
import { ReactComponent as VMTAIcon } from '../../icons/tokens/vMTA.svg';
import { CountUp } from '../../core/CountUp';

export enum BalanceType {
  Masset,
  SavingsContractV1,
  SavingsContractV2,
  BoostedSavingsVault,
  Meta,
  VMeta,
}

interface Props {
  token: BalanceType;
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
  AssetIcon: FC;
  hasApy?: boolean;
}

export const ContainerSnippet = css`
  border-top-left-radius: 0.75rem;
  border-top-right-radius: 0.75rem;

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

const Title = styled.div`
  display: flex;
  font-weight: 600;
  text-align: left;
  color: ${({ theme }) => theme.color.primary};

  div {
    position: relative;
  }
`;

const Subtitle = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.color.bodyAccent};
  text-align: left;
`;

const Interest = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  text-align: right;
  font-size: 1.2rem;

  div + div {
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

const BalanceValue = styled.div`
  flex-direction: column;
  justify-content: center !important;
  align-items: flex-end !important;
  gap: 0.5rem;

  ${Number} + ${Number} {
    font-size: 1rem;
  }
`;

const StyledExternalLinkArrow = styled(ExternalLinkArrow)`
  position: absolute;
  top: 1px;
  width: 1rem;
  height: 1rem;
  right: -3rem;

  * {
    fill: ${({ theme }) => theme.color.bodyAccent};
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

const Tokens = new Map<number, RowProps>([
  [
    BalanceType.Masset,
    {
      title: 'mUSD',
      subtitle: 'mStable USD',
      AssetIcon: MUSDIcon,
    },
  ],
  [
    BalanceType.SavingsContractV1,
    {
      title: 'mUSD Save',
      subtitle: 'mStable USD in Save V1',
      AssetIcon: MUSDIcon,
      hasApy: true,
    },
  ],
  [
    BalanceType.SavingsContractV2,
    {
      title: 'imUSD',
      subtitle: 'Interest-bearing mUSD',
      AssetIcon: IMUSDIcon,
      hasApy: true,
    },
  ],
  [
    BalanceType.BoostedSavingsVault,
    {
      title: 'imUSD Vault',
      subtitle: 'Vault with MTA rewards',
      AssetIcon: IMUSDMTAIcon,
      hasApy: true,
    },
  ],
  [
    BalanceType.Meta,
    {
      title: 'MTA',
      subtitle: 'mStable Meta',
      AssetIcon: MTAIcon,
    },
  ],
  [
    BalanceType.VMeta,
    {
      title: 'vMTA',
      subtitle: 'Voting escrow MTA',
      AssetIcon: VMTAIcon,
      hasApy: true,
    },
  ],
]);

export const BalanceHeader: FC = () => {
  return (
    <HeaderContainer>
      <div>Asset</div>
      <div>APY</div>
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
}) => {
  const account = useAccount();

  const tokenInfo = Tokens.get(token) as RowProps;

  const { title, subtitle, AssetIcon, hasApy } = tokenInfo;
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
          <AssetIcon />
          <div>
            <Title>
              <div>
                <h4>{title}</h4>
                {external && <StyledExternalLinkArrow />}
                {warning && <StyledWarningBadge />}
              </div>
            </Title>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
          </div>
        </Asset>
      </div>
      <div>
        <Interest>
          {!hasApy || apy === 0 ? (
            <Line />
          ) : apy ? (
            <>
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
        {account ? (
          balance ? (
            <>
              <Number end={balance.simple} decimals={6} />
              {dollarExchangeRate && (
                <Number
                  prefix="≈ $"
                  end={dollarExchangeRate * balance.simple}
                  decimals={6}
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
    />
  );
};
