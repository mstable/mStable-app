import { useMemo } from 'react'
import { useQuery } from '@apollo/client'

import { useBlockTimestampsDocument } from './useBlockTimestampsDocument'
import { getKeyTimestamp } from '../utils/getKeyTimestamp'

interface BlockTime {
  timestamp: number
  number: number
}

export const useBlockTimesForDates = (dates: Date[]): BlockTime[] => {
  const blocksDoc = useBlockTimestampsDocument(dates)

  const query = useQuery<{
    [timestamp: string]: [] | [{ number: number }]
  }>(blocksDoc, { fetchPolicy: 'cache-first' })

  return useMemo(() => {
    const filtered = Object.entries(query.data ?? {}).filter(([, value]) => !!value[0]?.number) as [string, [{ number: number }]][]

    return filtered
      .map(([key, [{ number }]]) => ({
        timestamp: getKeyTimestamp(key),
        number,
      }))
      .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
  }, [query.data])
}
