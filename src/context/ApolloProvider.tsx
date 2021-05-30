import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { ApolloProvider as ApolloReactProvider } from '@apollo/react-hooks'
import { MultiAPILink } from '@habx/apollo-multi-endpoint-link'
import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from '@apollo/client'
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { persistCache } from 'apollo-cache-persist'

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
  const network = useNetwork()

  // Serialized array of failed endpoints to be excluded from the client
  const [failedEndpoints, setFailedEndpoints] = useState<string>('')

  const handleError = useCallback(
    (message: string, error?: unknown): void => {
      console.error(message, error)

      // Not significant at the moment; falls back to the hosted service
      if (message.includes('Exhausted list of indexers')) return

      let sanitizedError: string = message
      if (message.includes('Failed to query subgraph deployment')) {
        sanitizedError = `The Graph: ${message.split(': ')[1] ?? message}`
      }
      addErrorNotification(sanitizedError)
    },
    [addErrorNotification],
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

    const _failedEndpoints = failedEndpoints.split(',')

    const errorLink = onError(({ networkError, graphQLErrors, operation }) => {
      const ctx = operation.getContext()

      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, ..._error }) => {
          if (_failedEndpoints.includes(ctx.uri)) return

          handleError(message, _error)

          // On any GraphQL error, mark the endpoint as failed; this may be
          // excessive, but failed endpoints are merely deprioritised rather than
          // excluded completely.
          _failedEndpoints.push(ctx.uri)
        })
      }

      if (networkError) {
        handleError(networkError.message)
      }
      setFailedEndpoints(_failedEndpoints.join(','))
    })

    // Create new link by filtering out previously failed endpoints
    const endpoints = Object.fromEntries(
      Object.entries(network.gqlEndpoints).map(([name, _endpoints]) => {
        const preferred = _endpoints.filter(endpoint => !failedEndpoints.split(',').includes(endpoint))[0]
        const fallback = _endpoints[0] // There is always a fallback, even if it failed
        return [name, preferred ?? fallback]
      }),
    )
    const multiApiLink = new MultiAPILink({
      endpoints,
      httpSuffix: '', // By default, this library adds `/graphql` as a suffix
      createHttpLink: () => (new HttpLink() as unknown) as ApolloLink,
    })

    const link = ApolloLink.from([errorLink, multiApiLink]) as never

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
  }, [persisted, network, handleError, failedEndpoints])

  return client ? <ApolloReactProvider client={client as never}>{children}</ApolloReactProvider> : <Skeleton />
}
