import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { useTokensState } from '../../context/TokensProvider';
import {
  TokenDetailsFragment,
  useAllErc20TokensQuery,
} from '../../graphql/generated';
import { formatExactAmount } from '../../web3/amounts';
import { EtherscanLink } from '../core/EtherscanLink';
import { mapSizeToFontSize, Size } from '../../theme';

const BalancesList = styled.ul``;

const BalanceItem = styled.li<{ size?: Size }>`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: ${({ size = Size.m }) => mapSizeToFontSize(size)};
  border-top: 1px rgba(255, 255, 255, 0.3) solid;
  padding: 10px 0;
`;

const Symbol = styled.div``;

const Balance = styled.div<{ size?: Size }>`
  font-weight: bold;
  font-size: ${({ size = Size.l }) => mapSizeToFontSize(size)};
`;

type TokenWithBalance = TokenDetailsFragment & {
  balanceFormatted: string | null;
};

/**
 * Component to track and display the balances of tokens for the currently
 * selected mAsset, the mAsset itself, and MTA.
 */
export const Balances: FC<{}> = () => {
  const tokens = useTokensState();
  const tokensQuery = useAllErc20TokensQuery();
  const tokensData = tokensQuery.data?.tokens || [];

  const { mUSD, otherTokens } = useMemo(() => {
    const addBalance = (token: typeof tokensData[0]): TokenWithBalance => {
      const tokenBalance = tokens[token.address];
      return {
        ...token,
        ...tokenBalance,
        balanceFormatted: formatExactAmount(
          tokenBalance?.balance,
          token.decimals,
        ),
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
    <BalancesList>
      {mUSD ? (
        <BalanceItem size={Size.xl} key={mUSD.address}>
          <Symbol>
            <span>{mUSD.symbol}</span>
            <EtherscanLink data={mUSD.address} />
          </Symbol>
          <Balance size={Size.xl}>{mUSD.balanceFormatted}</Balance>
        </BalanceItem>
      ) : null}
      {otherTokens.map(({ symbol, address, balanceFormatted }) => (
        <BalanceItem key={address}>
          <Symbol>
            <span>{symbol}</span>
            <EtherscanLink data={address} />
          </Symbol>
          <Balance>{balanceFormatted}</Balance>
        </BalanceItem>
      ))}
    </BalancesList>
  );
};
