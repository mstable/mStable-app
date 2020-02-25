import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { getMainDefinition } from 'apollo-utilities';
import { ApolloLink, split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';

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

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT_WS,
  options: {
    reconnect: true,
  },
});

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

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore Can't be helped
  link,
});
