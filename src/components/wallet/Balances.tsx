import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { useTokensState } from '../../context/TokensProvider';
import { useAllErc20TokensQuery } from '../../graphql/generated';
import { formatExactAmount } from '../../web3/amounts';
import { EtherscanLink } from '../core/EtherscanLink';

const BalancesList = styled.ul``;

const BalanceItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.m};
`;

const Symbol = styled.div`
  font-weight: bold;
  font-size: ${({ theme }) => theme.fontSize.l};
  > * {
    display: inline-block;
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
`;

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
        return {
          ...token,
          ...tokenBalance,
          balanceFormatted: formatExactAmount(
            tokenBalance?.balance,
            token.decimals,
            token.symbol,
          ),
        };
      }),
    [tokens, tokensData],
  );

  return (
    <BalancesList>
      {tokensWithBalances.map(({ symbol, address, balanceFormatted }) => (
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
