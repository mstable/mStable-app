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
import useThrottleFn from 'react-use/lib/useThrottleFn';

import { useAddErrorNotification } from './NotificationsProvider';
import { ThemedSkeleton } from '../components/core/ThemedSkeleton';

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID;

const CACHE_KEY = `apollo-cache-persist.CHAIN_ID_${CHAIN_ID}.v3`;

const ENDPOINTS = {
  legacy: process.env.REACT_APP_GRAPHQL_ENDPOINT_LEGACY as string,
  protocol: process.env.REACT_APP_GRAPHQL_ENDPOINT_PROTOCOL as string,
  ecosystem: process.env.REACT_APP_GRAPHQL_ENDPOINT_ECOSYSTEM as string,
  balancer: process.env.REACT_APP_GRAPHQL_ENDPOINT_BALANCER as string,
  uniswap: process.env.REACT_APP_GRAPHQL_ENDPOINT_UNISWAP as string,
  blocks: process.env.REACT_APP_GRAPHQL_ENDPOINT_BLOCKS as string,
  mbtc: 'https://api.thegraph.com/subgraphs/name/jameslefrere/mbtc-deployment',
};

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
    'Query.tokens': {
      // Hack: sometimes tokens of the same ID are loaded across separate
      // subgraphs; `totalSupply` is an ID that will be unique
      keyFields: ['id', 'totalSupply'],
    },
    // Query: {
    //   fields: {
    //     tokens: {
    //       merge(existing: Reference[] = [], incoming: Reference[] = []) {
    //         const existingRefs = new Set(existing.map(item => item.__ref));
    //         return [
    //           ...existing,
    //           ...incoming.filter(item => !existingRefs.has(item.__ref)),
    //         ];
    //       },
    //     },
    //   },
    // },
  },
});

/**
 * Provider for accessing Apollo queries and subscriptions.
 */
export const ApolloProvider: FC<{}> = ({ children }) => {
  const addErrorNotification = useAddErrorNotification();
  const [persisted, setPersisted] = useState(false);
  const [error, setError] = useState<string>();

  useThrottleFn(
    () => {
      if (error) {
        addErrorNotification(error);
      }
    },
    5000,
    [error] as never,
  );

  const errorLink = onError(({ networkError, graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, ..._error }) => {
        // eslint-disable-next-line no-console
        console.error(message, _error);
      });
    }
    if (networkError) {
      setError(`TheGraph: ${networkError.message}`);
    }
  });

  const apolloLink = ApolloLink.from([
    errorLink,
    new MultiAPILink({
      endpoints: ENDPOINTS,
      httpSuffix: '', // By default, this library adds `/graphql` as a suffix
      createHttpLink: () => (new HttpLink() as unknown) as ApolloLink,
    }),
  ]);

  useEffect(() => {
    persistCache({
      cache: cache as never,
      storage: window.localStorage as never,
      key: CACHE_KEY,
    })
      // eslint-disable-next-line no-console
      .catch(_error => console.warn('Cache persist error', _error))
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
          fetchPolicy: 'cache-and-network' as never,
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
    <ThemedSkeleton />
  );
};
