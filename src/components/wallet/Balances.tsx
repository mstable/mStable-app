import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { useTokensState } from '../../context/TokensProvider';
import {
  TokenDetailsFragment,
  useAllErc20TokensQuery,
} from '../../graphql/generated';
import { formatExactAmount } from '../../web3/amounts';
import { EtherscanLink } from '../core/EtherscanLink';
import { CountUp } from '../core/CountUp';
import { mapSizeToFontSize, Size } from '../../theme';
import { TokenIcon } from '../icons/TokenIcon';
import { formatUnits } from 'ethers/utils';

const BalancesList = styled.ul`
  background: rgba(255, 255, 255, 0.1);
`;

const BalanceItem = styled.li<{ size?: Size }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ size = Size.m }) => mapSizeToFontSize(size)};
  border-top: 1px rgba(255, 255, 255, 0.3) solid;
  padding: ${({ theme }) => `${theme.spacing.m} ${theme.spacing.s}`};
`;

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
  const tokens = useTokensState();
  const tokensQuery = useAllErc20TokensQuery();
  const tokensData = tokensQuery.data?.tokens || [];

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
    <BalancesList>
      {mUSD ? (
        <BalanceItem size={Size.xl} key={mUSD.address}>
          <Symbol>
            <TokenIcon symbol={mUSD.symbol} />
            <span>{mUSD.symbol}</span>
            <EtherscanLink data={mUSD.address} />
          </Symbol>
          <Balance size={Size.xl} end={mUSD.balanceSimple} />
        </BalanceItem>
      ) : null}
      {otherTokens.map(({ symbol, address, balanceSimple }) => (
        <BalanceItem key={address}>
          <Symbol>
            <TokenIcon symbol={symbol} />
            <span>{symbol}</span>
            <EtherscanLink data={address} />
          </Symbol>
          <Balance end={balanceSimple} />
        </BalanceItem>
      ))}
    </BalancesList>
  );
};
