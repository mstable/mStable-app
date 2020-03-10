import React, { FC, useEffect, useMemo } from 'react';
import {
  TokenDetailsFragment,
  useCoreTokensQuery,
  useErc20TokensQuery,
  useMassetQuery,
} from '../graphql/generated';
import { convertExactToSimple } from '../web3/maths';
import { useTokensContext } from '../context/TokensProvider';
import styles from './Balances.module.css';

interface TokenWithBalance extends TokenDetailsFragment {
  balance?: string;
}

const useTokenBalances = (tokenAddresses: string[]): TokenWithBalance[] => {
  const [tokens, { subscribe, unsubscribe }] = useTokensContext();

  const query = useErc20TokensQuery({
    variables: { addresses: tokenAddresses },
  });
  const tokensData = query.data?.tokens || [];

  const toSubscribe = useMemo(
    () => tokensData.map(token => token.address) || [],
    [tokensData],
  );
  const subscribed = useMemo(
    () => Object.keys(tokens).filter(token => tokens[token].subscribed),
    [tokens],
  );

  // Sub/unsub when the list of tokens changes from what's subscribed.
  useEffect(() => {
    if (
      toSubscribe.length !== subscribed.length || // should cover most cases
      toSubscribe.some(token => !subscribed.includes(token)) ||
      subscribed.some(token => !toSubscribe.includes(token))
    ) {
      toSubscribe.forEach(token => subscribe?.(token));
      subscribed
        .filter(token => !toSubscribe.includes(token))
        .forEach(token => unsubscribe?.(token));
    }
  }, [toSubscribe, subscribed, subscribe, unsubscribe]);

  // Combine the token data with the balances.
  return useMemo(
    () =>
      tokensData.map(token => ({
        ...token,
        ...(tokens[token.address]?.balance
          ? {
              balance: convertExactToSimple(
                tokens[token.address].balance,
                token.decimals,
              ).toString(),
            }
          : null),
      })),
    [tokens, tokensData],
  );
};

/**
 * Component to track and display the balances of tokens for the currently
 * selected mAsset, the mAsset itself, and MTA.
 */
export const Balances: FC<{}> = () => {
  const { data: coreData } = useCoreTokensQuery();
  const mtaAddress = coreData?.mta[0]?.address;

  // TODO later: support more than mUSD
  const mUsdAddress = coreData?.mUSD[0]?.address;

  const { data: massetData } = useMassetQuery({
    variables: { id: mUsdAddress },
  });

  const tokenAddresses = useMemo(() => {
    const bassets =
      massetData?.masset?.basket.bassets.map(
        ({ token: { address } }) => address,
      ) || [];
    return [mtaAddress, mUsdAddress, ...bassets];
  }, [massetData, mUsdAddress, mtaAddress]);

  const balances = useTokenBalances(tokenAddresses);

  return (
    <div className={styles.container}>
      <h3 className={styles.heading}>Balances</h3>
      <ul className={styles.list}>
        {balances.map(({ symbol, balance, address }) => (
          <li key={address} className={styles.token}>
            <div className={styles.symbol}>{symbol}</div>
            <div className={styles.balance}>{balance}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};
