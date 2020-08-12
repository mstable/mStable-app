const { ApolloClient, HttpLink, InMemoryCache } = require('@apollo/client');
const { onError } = require('apollo-link-error');
const { ApolloLink } = require('apollo-link');
const { MultiAPILink } = require('@habx/apollo-multi-endpoint-link');
const fetch = require('cross-fetch');

const getApolloClient = () => {
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

  const errorLink = onError(({ networkError, graphQLErrors }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, ...error }) => {
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
        mstable: process.env.REACT_APP_GRAPHQL_ENDPOINT_MSTABLE,
        balancer: process.env.REACT_APP_GRAPHQL_ENDPOINT_BALANCER,
        uniswap: process.env.REACT_APP_GRAPHQL_ENDPOINT_UNISWAP,
        blocks: process.env.REACT_APP_GRAPHQL_ENDPOINT_BLOCKS,
      },
      httpSuffix: '', // By default, this library adds `/graphql` as a suffix
      createHttpLink: () => new HttpLink({ fetch }),
    }),
    errorLink,
  ]);

  return new ApolloClient({
    cache,
    link: apolloLink,
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

module.exports = { getApolloClient };
