import { useEffect } from 'react';
import { useAllErc20TokensQuery } from '../graphql/mstable';
import { useTokensDispatch } from '../context/DataProvider/TokensProvider';

/**
 * Updater to one-time fetch all ERC20 tokens from the subgraph.
 */
export const TokenFetcher = (): null => {
  const { setFetched } = useTokensDispatch();

  const query = useAllErc20TokensQuery({
    fetchPolicy: 'network-only',
  });
  const fetched = query.data?.tokens || [];

  // Sub/unsub when the list of tokens changes from what's subscribed.
  useEffect(() => {
    if (fetched.length > 0) {
      setFetched(fetched);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setFetched, fetched.length]);

  return null;
};
