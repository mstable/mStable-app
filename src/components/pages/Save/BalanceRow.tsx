import React, { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled, { css } from 'styled-components';

import { ViewportWidth } from '../../../theme';
import { BigDecimal } from '../../../web3/BigDecimal';
import { useAverageApyForPastWeek } from '../../../web3/hooks';
import { Widget, WidgetButton } from '../../core/Widget';
import { ReactComponent as WarningBadge } from '../../icons/badges/warning.svg';
import { ReactComponent as MUSDIcon } from '../../icons/tokens/mUSD.svg';
import { ReactComponent as IMUSDIcon } from '../../icons/tokens/imUSD.svg';
import { ReactComponent as IMUSDMTAIcon } from '../../icons/tokens/imusd-mta.svg';

export enum BalanceType {
  MUSD,
  MUSD_SAVE,
  IMUSD,
  IMUSD_VAULT,
}

interface Props {
  token: BalanceType;
  balance?: BigDecimal;
  warning?: boolean;
  onClick?: () => void;
}

interface RowProps {
  title: string;
  subtitle?: string;
  AssetIcon: FC;
}

export const ContainerSnippet = css`
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

const Number = styled.span`
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

const VaultContainer = styled.div`
  border: 1px ${({ theme }) => theme.color.accent} solid;
  border-radius: 0.75rem;

  > div {
    border-top: 1px solid ${({ theme }) => theme.color.accent};
  }
`;

const HeaderContainer = styled(Widget)`
  ${ContainerSnippet};

  padding: 0 1.25rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.color.grey};
`;

const DefaultContainer = styled(WidgetButton)`
  ${ContainerSnippet};

  width: 100%;

  h4 {
    font-size: 1.25rem;
    display: inline-flex;
  }
`;

const Tokens = new Map<number, RowProps>([
  [
    BalanceType.MUSD,
    {
      title: 'mUSD',
      subtitle: 'mStable USD',
      AssetIcon: MUSDIcon,
    },
  ],
  [
    BalanceType.MUSD_SAVE,
    {
      title: 'mUSD Save',
      subtitle: 'mStable USD in Save V1',
      AssetIcon: MUSDIcon,
    },
  ],
  [
    BalanceType.IMUSD,
    {
      title: 'imUSD',
      subtitle: 'Interest-bearing mUSD',
      AssetIcon: IMUSDIcon,
    },
  ],
  [
    BalanceType.IMUSD_VAULT,
    {
      title: 'imUSD Vault',
      subtitle: 'Vault with MTA rewards',
      AssetIcon: IMUSDMTAIcon,
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
  onClick,
  token,
  warning = false,
  hasChildren = false,
  balance,
}) => {
  const interestRate = useAverageApyForPastWeek();
  const tokenInfo = Tokens.get(token) as RowProps;

  const { title, subtitle, AssetIcon } = tokenInfo;
  const isIMUSDVault = token === BalanceType.IMUSD_VAULT;
  const hasBorder = !hasChildren;

  return (
    <DefaultContainer
      border={hasBorder}
      padding={hasChildren}
      onClick={onClick}
    >
      <div>
        <Asset>
          <AssetIcon />
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
          {interestRate ? (
            <>
              <Number>
                <h4>{`${interestRate?.toFixed(2) ?? `0.00`}%`}</h4>
              </Number>
              {isIMUSDVault && <span>+ MTA</span>}
            </>
          ) : interestRate === 0 ? (
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
    </DefaultContainer>
  );
};

export const BalanceRow: FC<Props> = ({
  onClick,
  token,
  warning,
  children,
  balance,
}) => {
  return children ? (
    <VaultContainer>
      <InternalBalanceRow
        onClick={onClick}
        token={token}
        hasChildren={!!children}
        warning={warning}
        balance={balance}
      />
      {children}
    </VaultContainer>
  ) : (
    <InternalBalanceRow
      onClick={onClick}
      token={token}
      warning={warning}
      balance={balance}
    />
  );
};
