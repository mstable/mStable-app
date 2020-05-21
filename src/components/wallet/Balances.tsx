import React, { FC, useMemo, useContext } from 'react';
import styled, { ThemeContext, DefaultTheme } from 'styled-components';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { formatUnits } from 'ethers/utils';
import { useWallet } from 'use-wallet';
import { useTokensState } from '../../context/DataProvider/TokensProvider';
import {
  TokenDetailsFragment,
  useAllErc20TokensQuery,
} from '../../graphql/generated';
import { EtherscanLink } from '../core/EtherscanLink';
import { CountUp } from '../core/CountUp';
import { mapSizeToFontSize, Size } from '../../theme';
import { TokenIcon } from '../icons/TokenIcon';
import { List, ListItem } from '../core/List';
import { useSavingsBalance } from '../../web3/hooks';

const Symbol = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 36px;
    margin-right: 8px;
  }
`;

const Balance = styled(CountUp)<{ size?: Size }>`
  font-weight: bold;
  font-size: ${({ size = Size.l }) => mapSizeToFontSize(size)};
`;

// const StyledSkeleton = styled(Skeleton);

const BalanceSkeleton: FC<{ themeContext: DefaultTheme }> = ({
  themeContext: theme,
}) => (
  <SkeletonTheme
    color={theme.color.blueTransparent}
    highlightColor={theme.color.blue}
  >
    <Skeleton width={200} height={30} />
  </SkeletonTheme>
);

interface TokenWithBalance extends TokenDetailsFragment {
  balanceSimple: number | null;
}

/**
 * Component to track and display the balances of tokens for the currently
 * selected mAsset, the mAsset itself, and MTA.
 */
export const Balances: FC<{}> = () => {
  const { account } = useWallet();
  const tokens = useTokensState();
  const tokensQuery = useAllErc20TokensQuery();
  const tokensData = tokensQuery.data?.tokens || [];
  const savingsBalance = useSavingsBalance(account);
  const themeContext = useContext(ThemeContext);

  const { mUSD, otherTokens } = useMemo(() => {
    const addBalance = (token: typeof tokensData[0]): TokenWithBalance => {
      const tokenBalance = tokens[token.address];
      return {
        ...token,
        ...tokenBalance,
        balanceSimple: tokenBalance?.balance
          ? parseFloat(
              formatUnits(tokenBalance.balance.toString(), token.decimals),
            )
          : null,
      };
    };
    return tokensData.reduce<{
      mUSD: TokenWithBalance | null;
      otherTokens: TokenWithBalance[];
    }>(
      (_tokens, token) =>
        token.symbol === 'mUSD'
          ? { ..._tokens, mUSD: addBalance(token) }
          : {
              ..._tokens,
              otherTokens: [..._tokens.otherTokens, addBalance(token)],
            },
      { mUSD: null, otherTokens: [] },
    );
  }, [tokens, tokensData]);

  return (
    <List inverted>
      <ListItem size={Size.xl} key="mUsdBalance">
        {!mUSD ? (
          <Skeleton height={49} />
        ) : (
          <>
            <Symbol>
              <TokenIcon symbol={mUSD.symbol} />
              <span>{mUSD.symbol}</span>
              <EtherscanLink data={mUSD.address} />
            </Symbol>
            {mUSD.balanceSimple == null ? (
              <BalanceSkeleton themeContext={themeContext} />
            ) : (
              <Balance size={Size.xl} end={mUSD.balanceSimple} />
            )}
          </>
        )}
      </ListItem>

      <ListItem size={Size.xl} key="savingsBalance">
        <>
          <Symbol>
            <TokenIcon symbol="mUSD" />
            <span>mUSD Savings</span>
          </Symbol>
          {savingsBalance.simple == null ? (
            <BalanceSkeleton themeContext={themeContext} />
          ) : (
            <Balance size={Size.xl} end={savingsBalance.simple} />
          )}
        </>
      </ListItem>
      {otherTokens.map(({ symbol, address, balanceSimple }) => (
        <ListItem key={address}>
          <Symbol>
            <TokenIcon symbol={symbol} />
            <span>{symbol}</span>
            <EtherscanLink data={address} />
          </Symbol>
          {balanceSimple == null ? (
            <BalanceSkeleton themeContext={themeContext} />
          ) : (
            <Balance end={balanceSimple} />
          )}
        </ListItem>
      ))}
    </List>
  );
};
