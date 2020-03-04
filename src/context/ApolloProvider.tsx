import React, { FC } from 'react';
import { ApolloProvider as ApolloReactProvider } from '@apollo/react-hooks';
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { getMainDefinition } from 'apollo-utilities';
import { WebSocketLink } from '@apollo/link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { ApolloLink, split } from 'apollo-link';

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

const httpLink = (new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
}) as unknown) as ApolloLink;

const wsClient = new SubscriptionClient(
  process.env.REACT_APP_GRAPHQL_ENDPOINT_WS,
  { reconnect: true },
);

const wsLink = (new WebSocketLink(wsClient) as unknown) as ApolloLink;

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore Can't be helped
  link,
});

/**
 * Provider for accessing Apollo queries and subscriptions.
 */
export const ApolloProvider: FC<{}> = ({ children }) => (
  <ApolloReactProvider client={client}>{children}</ApolloReactProvider>
);
