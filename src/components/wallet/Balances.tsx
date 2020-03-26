import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { useTokensState } from '../../context/TokensProvider';
import { useAllErc20TokensQuery } from '../../graphql/generated';
import { formatDecimal } from '../../web3/strings';

const List = styled.ul``;

const Token = styled.li``;

const Symbol = styled.div``;

const Balance = styled.div``;

/**
 * Component to track and display the balances of tokens for the currently
 * selected mAsset, the mAsset itself, and MTA.
 */
export const Balances: FC<{}> = () => {
  const tokens = useTokensState();
  const tokensQuery = useAllErc20TokensQuery();
  const tokensData = tokensQuery.data?.tokens || [];

  const tokensWithBalances = useMemo(
    () =>
      tokensData.map(token => {
        const tokenBalance = tokens[token.address];
        const balanceFormatted = tokenBalance?.balance
          ? // Note that the decimals are not normalized for presentation;
            // might not be what is needed
            formatDecimal(tokenBalance.balance, token.decimals)
          : '';
        return { ...token, ...tokenBalance, balanceFormatted };
      }),
    [tokens, tokensData],
  );

  return (
    <List>
      {tokensWithBalances.map(({ symbol, address, balanceFormatted }) => (
        <Token key={address}>
          <Symbol>{symbol}</Symbol>
          <Balance>{balanceFormatted}</Balance>
        </Token>
      ))}
    </List>
  );
};
