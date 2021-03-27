import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { MultiAPILink } from '@habx/apollo-multi-endpoint-link';
import fetch from 'cross-fetch';

export const getApolloClient = () => {
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

  const errorLink = onError(({ networkError, graphQLErrors }: any) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, ...error }: any) => {
        // eslint-disable-next-line no-console
        console.error(message, error);
      });
    }
    if (networkError) {
      throw new Error(networkError.toString());
    }
  });

  const apolloLink = ApolloLink.from([
    new MultiAPILink({
      endpoints: {
        ecosystem: process.env.REACT_APP_GRAPHQL_ENDPOINT_ECOSYSTEM as string,
        blocks: process.env.REACT_APP_GRAPHQL_ENDPOINT_BLOCKS as string,
      },
      httpSuffix: '', // By default, this library adds `/graphql` as a suffix
      createHttpLink: () => new HttpLink({ fetch }) as never,
    }),
    errorLink,
  ]);

  return new ApolloClient({
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
};
