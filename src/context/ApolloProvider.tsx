import React, { FC, useEffect, useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { ApolloProvider as ApolloReactProvider } from '@apollo/react-hooks'
import { MultiAPILink } from '@habx/apollo-multi-endpoint-link'
import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from '@apollo/client'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { persistCache } from 'apollo-cache-persist'
import { useThrottleFn } from 'react-use'

import { useAddErrorNotification } from './NotificationsProvider'
import { useNetwork } from './NetworkProvider'

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
    // Sometimes tokens of the same ID are loaded across separate
    // subgraphs; avoid merging them in the cache
    Token: {
      keyFields: false,
    },
    Query: {
      fields: {
        tokens: {
          merge: false,
        },
      },
    },
  },
})

export const ApolloProvider: FC = ({ children }) => {
  const addErrorNotification = useAddErrorNotification()
  const [persisted, setPersisted] = useState(false)
  const [error, setError] = useState<string>()
  const network = useNetwork()

  useThrottleFn(
    () => {
      if (error) {
        addErrorNotification(error)
      }
    },
    5000,
    [error] as never,
  )

  useEffect(() => {
    persistCache({
      cache: cache as never,
      storage: window.localStorage as never,
      key: `apollo-cache-persist.v4.${network.chainId}`,
    })
      // eslint-disable-next-line no-console
      .catch(_error => console.warn('Cache persist error', _error))
      .finally(() => {
        setPersisted(true)
      })
  }, [setPersisted, network.chainId])

  const client = useMemo<ApolloClient<NormalizedCacheObject> | undefined>(() => {
    setPersisted(true)
    if (!persisted || !network) return undefined

    const errorLink = onError(({ networkError, graphQLErrors }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, ..._error }) => {
          // eslint-disable-next-line no-console
          console.error(message, _error)
        })
      }
      if (networkError) {
        setError(`TheGraph: ${networkError.message}`)
      }
    })

    const link = ApolloLink.from([
      errorLink,
      new MultiAPILink({
        endpoints: network.gqlEndpoints,
        httpSuffix: '', // By default, this library adds `/graphql` as a suffix
        createHttpLink: () => (new HttpLink() as unknown) as ApolloLink,
      }),
    ]) as never

    return new ApolloClient<NormalizedCacheObject>({
      cache,
      link,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'network-only',
          nextFetchPolicy: 'cache-and-network',
        },
        query: {
          fetchPolicy: 'cache-and-network' as never,
        },
      },
    })
  }, [persisted, network])

  return client ? <ApolloReactProvider client={client as never}>{children}</ApolloReactProvider> : <Skeleton />
}
