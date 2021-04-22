import { useEffect } from 'react'
import { QueryHookOptions } from '@apollo/client'
import { AllTokensQuery, AllTokensQueryVariables, useAllTokensQuery as useAllTokensProtocolQuery } from '../graphql/protocol'
import {
  AllErc20TokensQuery,
  AllErc20TokensQueryVariables,
  useAllErc20TokensQuery as useAllTokensEcosystemQuery,
} from '../graphql/ecosystem'
import { useFeederTokensQuery, FeederTokensQuery, FeederTokensQueryVariables } from '../graphql/feeders'

import { useTokensDispatch } from '../context/TokensProvider'

const options = {
  fetchPolicy: 'network-only',
} as QueryHookOptions

/**
 * Updater to one-time fetch all ERC20 tokens from the subgraph.
 */
export const TokenFetcher = (): null => {
  const { setFetched } = useTokensDispatch()

  const protocolQuery = useAllTokensProtocolQuery(options as QueryHookOptions<AllTokensQuery, AllTokensQueryVariables>)
  const ecosystemQuery = useAllTokensEcosystemQuery(options as QueryHookOptions<AllErc20TokensQuery, AllErc20TokensQueryVariables>)
  const feedersQuery = useFeederTokensQuery(options as QueryHookOptions<FeederTokensQuery, FeederTokensQueryVariables>)

  const protocolFetched = protocolQuery.data?.tokens ?? []
  const ecosystemFetched = ecosystemQuery.data?.tokens ?? []
  const feedersFetched = feedersQuery.data?.feederPools ?? []

  // Sub/unsub when the list of tokens changes from what's subscribed.
  useEffect(() => {
    if (protocolFetched.length > 0) {
      setFetched(protocolFetched)
    }
    if (ecosystemFetched.length > 0) {
      setFetched(ecosystemFetched)
    }
    if (feedersFetched.length > 0) {
      setFetched(feedersFetched.flatMap(fp => [fp.token, fp.fasset]))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [protocolFetched.length, ecosystemFetched.length, feedersFetched.length])

  return null
}
