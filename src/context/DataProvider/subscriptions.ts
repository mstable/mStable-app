import { LazyQueryHookOptions, QueryTuple } from '@apollo/react-hooks'
import { QueryResult } from '@apollo/react-common'
import { useEffect } from 'react'

import { useBlockNow } from '../BlockProvider'
import { useNetwork } from '../NetworkProvider'

export const useBlockPollingSubscription = <TData, TVariables>(
  lazyQuery: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query: any,
    options?: LazyQueryHookOptions<TData, TVariables>,
  ) => QueryTuple<TData, TVariables>,
  baseOptions?: LazyQueryHookOptions<TData, TVariables>,
  skip?: boolean,
): QueryResult<TData, TVariables> => {
  const network = useNetwork()
  const blockNumber = useBlockNow()
  const hasBlock = !!blockNumber

  // We're using a long-polling query because subscriptions don't seem to be
  // re-run when derived or nested fields change.
  // See https://github.com/graphprotocol/graph-node/issues/1398
  const [run, query] = lazyQuery({
    fetchPolicy: 'cache-and-network',
    ...baseOptions,
  })

  // Long poll (15s interval) if the block number isn't available.
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (!skip && !hasBlock) {
      run()
      interval = setInterval(() => {
        run()
      }, network.blockTime)
    }

    return () => {
      clearInterval(interval)
    }
  }, [skip, hasBlock, run, network])

  // Run the query on every block when the block number is available.
  useEffect(() => {
    if (!skip && blockNumber) {
      run()
    }
  }, [skip, blockNumber, run, network])

  return query as never
}
