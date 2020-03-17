import React, { FC, useMemo } from 'react';
import { useTokensState } from '../context/TokensProvider';
import { useAllErc20TokensQuery } from '../graphql/generated';
import styles from './Balances.module.css';
import { formatDecimal } from '../web3/strings';

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
    <div className={styles.container}>
      <h3 className={styles.heading}>Balances</h3>
      <ul className={styles.list}>
        {tokensWithBalances.map(({ symbol, address, balanceFormatted }) => (
          <li key={address} className={styles.token}>
            <div className={styles.symbol}>{symbol}</div>
            <div className={styles.balance}>{balanceFormatted}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
