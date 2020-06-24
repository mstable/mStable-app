import React, { FC, useEffect, useMemo, useState } from 'react';
import { ApolloProvider as ApolloReactProvider } from '@apollo/react-hooks';
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { ApolloLink, concat } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { persistCache } from 'apollo-cache-persist';
import Skeleton from 'react-loading-skeleton';

import { useAddErrorNotification } from '../NotificationsProvider';

if (!process.env.REACT_APP_GRAPHQL_ENDPOINT) {
  throw new Error(
    'REACT_APP_GRAPHQL_ENDPOINT environment variable not defined',
  );
}

if (!process.env.REACT_APP_GRAPHQL_ENDPOINT_WS) {
  throw new Error(
    'REACT_APP_GRAPHQL_ENDPOINT_WS environment variable not defined',
  );
}

const cache = new InMemoryCache({
  resultCaching: true,
});

const httpLink = (new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
}) as unknown) as ApolloLink;

/**
 * Provider for accessing Apollo queries and subscriptions.
 */
export const ApolloProvider: FC<{}> = ({ children }) => {
  const addErrorNotification = useAddErrorNotification();
  const [persisted, setPersisted] = useState(false);

  useEffect(() => {
    persistCache({
      cache: cache as never,
      storage: window.localStorage as never,
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

    const errorLink = onError(({ networkError, graphQLErrors }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, ...error }) => {
          // eslint-disable-next-line no-console
          console.error(message, error);
        });
      }
      if (networkError)
        addErrorNotification(`Network error: ${networkError.message}`);
    });

    const link = concat(errorLink, httpLink);

    return new ApolloClient<NormalizedCacheObject>({
      cache,
      link: link as never,
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
