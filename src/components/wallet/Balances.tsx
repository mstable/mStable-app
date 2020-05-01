import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { formatUnits } from 'ethers/utils';
import { useWallet } from 'use-wallet';
import { useTokensState } from '../../context/TokensProvider';
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

interface TokenWithBalance extends TokenDetailsFragment {
  balanceSimple: number;
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

  const { mUSD, otherTokens } = useMemo(() => {
    const addBalance = (token: typeof tokensData[0]): TokenWithBalance => {
      const tokenBalance = tokens[token.address];
      return {
        ...token,
        ...tokenBalance,
        balanceSimple: parseFloat(
          formatUnits(tokenBalance?.balance?.toString() || '0', token.decimals),
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
    <List inverted>
      {mUSD ? (
        <ListItem size={Size.xl} key={mUSD.address}>
          <Symbol>
            <TokenIcon symbol={mUSD.symbol} />
            <span>{mUSD.symbol}</span>
            <EtherscanLink data={mUSD.address} />
          </Symbol>
          <Balance size={Size.xl} end={mUSD.balanceSimple} />
        </ListItem>
      ) : null}
      {savingsBalance.simple ? (
        <ListItem size={Size.xl} key="savingsBalance">
          <Symbol>
            <TokenIcon symbol="mUSD" />
            <span>mUSD Savings</span>
          </Symbol>
          <Balance size={Size.xl} end={savingsBalance.simple} />
        </ListItem>
      ) : null}
      {otherTokens.map(({ symbol, address, balanceSimple }) => (
        <ListItem key={address}>
          <Symbol>
            <TokenIcon symbol={symbol} />
            <span>{symbol}</span>
            <EtherscanLink data={address} />
          </Symbol>
          <Balance end={balanceSimple} />
        </ListItem>
      ))}
    </List>
  );
};
