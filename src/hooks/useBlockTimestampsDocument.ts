import { useMemo } from 'react'
import { getUnixTime } from 'date-fns'
import { DocumentNode, gql } from '@apollo/client'

export const useBlockTimestampsDocument = (dates: Date[]): DocumentNode =>
  useMemo(
    () => gql`query BlockTimestamps @api(name: blocks) {
      ${dates
        .map(getUnixTime)
        .map(
          ts =>
            `t${ts}: blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: {timestamp_gt: ${ts}, timestamp_lt: ${
              ts + 60000
            } }) { number }`,
        )
        .join('\n')}
  }`,
    [dates],
  )
