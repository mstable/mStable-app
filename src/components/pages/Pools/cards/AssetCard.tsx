import React, { FC } from 'react';
import styled from 'styled-components';

import { useTokens } from '../../../../context/TokensProvider';
import { SubscribedToken } from '../../../../types';
import { TokenIcon } from '../../../icons/TokenIcon';
import { Card } from './Card';

interface Props {
  className?: string;
  tokenAddresses: string[];
}

const StatsContainer = styled.div`
  flex: 1;

  > div:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  > div {
    display: flex;
    justify-content: space-between;

    p:first-child {
      font-weight: 600;
    }

    p:last-child > span {
      ${({ theme }) => theme.mixins.numeric};
    }
  }
`;

const TokenStats: FC = () => {
  // TODO: -
  // getPoolStats(tokenAddresses)
  return (
    <StatsContainer>
      <div>
        <p>Liquidity:</p>
        <p>
          <span>$112,000,000</span>
        </p>
      </div>
      <div>
        <p>Rewards:</p>
        <p>
          <span>14.75</span> MTA / week
        </p>
      </div>
    </StatsContainer>
  );
};

const IconContainer = styled.div`
  display: flex;

  img {
    height: 2rem;
    width: 2rem;
    border-radius: 1rem;
    background: ${({ theme }) => theme.color.white};
  }

  > img:last-child {
    margin-left: -1rem;
    z-index: 2;
  }
`;

const TokenPair: FC<{ tokens?: SubscribedToken[] }> = ({ tokens }) => {
  if (!tokens?.length) return null;
  if ((tokens?.length ?? 0) < 2) return null;
  // TODO: Add skeleton
  return (
    <IconContainer>
      <TokenIcon symbol={tokens?.[0].symbol} />
      <TokenIcon symbol={tokens?.[1].symbol} />
    </IconContainer>
  );
};

const Container = styled(Card)<{ gradientColor?: string }>`
  background: ${({ gradientColor }) =>
    gradientColor
      ? `linear-gradient(180deg, ${gradientColor} 0%, transparent 100%);`
      : `none`};

  h2 > div {
    display: flex;
    align-items: center;

    > *:first-child {
      margin-right: 0.5rem;
    }
  }
`;

export const AssetCard: FC<Props> = ({ className, tokenAddresses }) => {
  const subscribedTokens = useTokens(tokenAddresses);
  const title = subscribedTokens.map(t => t.symbol).join('/');

  // TODO: -
  // getPoolFromPair(tokenAddresses)
  // const poolInfo = getPoolFromPair(tokenAddresses)

  const handleClick = (): void => {
    // const address = poolInfo.address
    // history.push(/`${address}`);
  };

  return (
    <Container
      className={className}
      gradientColor="lightblue" // poolInfo.color
      title={
        <div>
          <TokenPair tokens={subscribedTokens} />
          {title}
        </div>
      }
      iconType="checkmark"
      onClick={handleClick}
    >
      <TokenStats />
    </Container>
  );
};
