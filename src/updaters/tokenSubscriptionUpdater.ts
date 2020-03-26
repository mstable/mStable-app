import { useEffect, useMemo } from 'react';
// import { useAllErc20TokensQuery } from '../graphql/generated';
import { TokenDetailsFragment } from '../graphql/generated';
import {
  useSubscribedTokens,
  useTokensDispatch,
} from '../context/TokensProvider';

/**
 * Updater to subscribe/unsubscribe to all ERC20 tokens from the subgraph.
 */
export const TokenSubscriptionUpdater = (): null => {
  const { subscribe, unsubscribe } = useTokensDispatch();
  const subscribedTokens = useSubscribedTokens();

  // TODO remove fake data
  // const query = useAllErc20TokensQuery();
  // const tokensData = query.data?.tokens || [];
  const tokensData: TokenDetailsFragment[] = [
    { address: '0x1', symbol: 'mUSD', decimals: 18, totalSupply: '0' },
  ];

  const toSubscribe = useMemo(
    () => tokensData.map(token => token.address) || [],
    [tokensData],
  );

  // Sub/unsub when the list of tokens changes from what's subscribed.
  useEffect(() => {
    if (
      toSubscribe.length !== subscribedTokens.length || // should cover most cases
      toSubscribe.some(token => !subscribedTokens.includes(token)) ||
      subscribedTokens.some(token => !toSubscribe.includes(token))
    ) {
      toSubscribe.forEach(subscribe);
      subscribedTokens
        .filter(token => !toSubscribe.includes(token))
        .forEach(unsubscribe);
    }
  }, [toSubscribe, subscribedTokens, subscribe, unsubscribe]);

  return null;
};
