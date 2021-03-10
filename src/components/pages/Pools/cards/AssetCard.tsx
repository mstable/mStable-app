import React, { FC } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { useTokens } from '../../../../context/TokensProvider';
import { SubscribedToken } from '../../../../types';
import { TokenIcon } from '../../../icons/TokenIcon';
import { Card } from './Card';
import { useSelectedMassetName } from '../../../../context/SelectedMassetNameProvider';
import { assetColorMapping } from '../utils';
import { ViewportWidth } from '../../../../theme';

interface Props {
  className?: string;
  address?: string;
  tokenPair?: string[];
  deprecated?: boolean;
  isLarge?: boolean;
  color?: string;
}

const StatsContainer = styled.div<{ isLarge?: boolean }>`
  display: flex;
  flex-direction: column;
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

    @media (min-width: ${ViewportWidth.m}) {
      flex-direction: row;
      flex: 0;
      justify-content: space-between;

      flex-basis: ${({ isLarge }) => isLarge && `calc(50% - 5%)`};
    }
  }

  @media (min-width: ${ViewportWidth.m}) {
    ${({ isLarge }) =>
      isLarge && {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
  }
`;

const TokenStats: FC<{ isLarge?: boolean }> = ({ isLarge = false }) => {
  // TODO: -
  // getPoolStats(tokenAddresses)
  return (
    <StatsContainer isLarge={isLarge}>
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
      {isLarge && (
        <>
          <div>
            <p>Volume:</p>
            <p>
              <span>$24,000</span>
            </p>
          </div>
          <div>
            <p>Assets:</p>
            <p>
              <span>3.43m</span> – <span>6.43m</span>
            </p>
          </div>
        </>
      )}
    </StatsContainer>
  );
};

const IconContainer = styled.div<{ isLarge: boolean }>`
  display: flex;

  img {
    height: ${({ isLarge }) => (isLarge ? `2.5rem` : `2rem`)};
    width: ${({ isLarge }) => (isLarge ? `2.5rem` : `2rem`)};
    border-radius: ${({ isLarge }) => (isLarge ? `1.25rem` : `1rem`)};
    background: ${({ theme }) => theme.color.white};
  }

  > img:last-child {
    margin-left: -1rem;
    z-index: 2;
  }
`;

const TokenPair: FC<{ tokens?: SubscribedToken[]; isLarge?: boolean }> = ({
  tokens,
  isLarge = false,
}) => {
  if (!tokens?.length) return null;
  if ((tokens?.length ?? 0) < 2) return null;
  // TODO: Add skeleton
  return (
    <IconContainer isLarge={isLarge}>
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

  > div {
    width: 100%;
  }
`;

export const AssetCard: FC<Props> = ({
  className,
  tokenPair,
  address,
  deprecated = false,
  isLarge = false,
  color,
}) => {
  const subscribedTokens = useTokens(tokenPair ?? []);
  const massetName = useSelectedMassetName();
  const history = useHistory();

  const title = subscribedTokens.map(t => t.symbol).join('/');
  const gradientColor = color ?? assetColorMapping[title];

  const handleClick = (): void => {
    history.push(`/${massetName}/pools/${address}`);
  };

  return (
    <Container
      className={className}
      gradientColor={!deprecated ? gradientColor : undefined}
      title={
        <div>
          <TokenPair tokens={subscribedTokens} isLarge={isLarge} />
          {title}
        </div>
      }
      iconType={(!isLarge && 'chevron') || undefined}
      onClick={(!isLarge && handleClick) || undefined}
    >
      {!deprecated && <TokenStats isLarge={isLarge} />}
    </Container>
  );
};
