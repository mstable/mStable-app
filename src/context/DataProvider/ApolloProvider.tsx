import React, { FC, useEffect, useMemo, useState } from 'react';
import { ApolloProvider as ApolloReactProvider } from '@apollo/react-hooks';
import { MultiAPILink } from '@habx/apollo-multi-endpoint-link';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { ApolloLink } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { persistCache } from 'apollo-cache-persist';
import Skeleton from 'react-loading-skeleton';

import { useAddErrorNotification } from '../NotificationsProvider';

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

const CACHE_KEY = `apollo-cache-persist.CHAIN_ID_${CHAIN_ID}`;

const cache = new InMemoryCache({
  resultCaching: true,
  typePolicies: {
    Pair: {
      keyFields: false,
    },
    Pool: {
      keyFields: false,
    },
    StakingRewardsContract: {
      keyFields: false,
    },
  },
});

/**
 * Provider for accessing Apollo queries and subscriptions.
 */
export const ApolloProvider: FC<{}> = ({ children }) => {
  const addErrorNotification = useAddErrorNotification();
  const [persisted, setPersisted] = useState(false);

  const errorLink = onError(({ networkError, graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, ...error }) => {
        // eslint-disable-next-line no-console
        console.error(message, error);
      });
    }
    if (networkError) {
      addErrorNotification(`Network error: ${networkError.message}`);
    }
  });

  const apolloLink = ApolloLink.from([
    new MultiAPILink({
      endpoints: {
        mstable: process.env.REACT_APP_GRAPHQL_ENDPOINT_MSTABLE as string,
        balancer: process.env.REACT_APP_GRAPHQL_ENDPOINT_BALANCER as string,
        uniswap: process.env.REACT_APP_GRAPHQL_ENDPOINT_UNISWAP as string,
        blocks: process.env.REACT_APP_GRAPHQL_ENDPOINT_BLOCKS as string,
      },
      httpSuffix: '', // By default, this library adds `/graphql` as a suffix
      createHttpLink: () => (new HttpLink() as unknown) as ApolloLink,
    }),
    errorLink,
  ]);

  useEffect(() => {
    persistCache({
      cache: cache as never,
      storage: window.localStorage as never,
      key: CACHE_KEY,
    })
      // eslint-disable-next-line no-console
      .catch(error => console.warn('Cache persist error', error))
      .finally(() => {
        setPersisted(true);
      });
  }, [setPersisted]);

  const client = useMemo<
    ApolloClient<NormalizedCacheObject> | undefined
  >(() => {
    if (!persisted) return undefined;

    return new ApolloClient<NormalizedCacheObject>({
      cache,
      link: apolloLink as never,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'network-only',
          nextFetchPolicy: 'cache-and-network',
        },
        query: {
          fetchPolicy: 'cache-first',
        },
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persisted]);

  return client ? (
    <ApolloReactProvider client={client as never}>
      {children}
    </ApolloReactProvider>
  ) : (
    <Skeleton />
  );
};
