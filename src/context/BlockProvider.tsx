import React, { createContext, FC, useContext, useMemo, useState } from 'react'
import { useInterval } from 'react-use'
import { subDays, subHours } from 'date-fns'

import { useBlockTimesForDates } from '../hooks/useBlockTimesForDates'
import { useProvider, useIsIdle } from './AccountProvider'
import { useNetwork } from './NetworkProvider'

export type MaybeBlockNumber = number | undefined

interface BlockNumbers {
  blockNow?: number
  block24h?: number
  block7d?: number
}

const ctx = createContext<BlockNumbers>(null as never)

const date7d = subDays(Date.now(), 7)
const date24h = subHours(Date.now(), 24)

export const BlockProvider: FC = ({ children }) => {
  const [blockNow, setBlockNow] = useState<MaybeBlockNumber>()
  const network = useNetwork()

  const provider = useProvider()
  const idle = useIsIdle()

  const blockTimes = useBlockTimesForDates([date7d, date24h])

  useInterval(() => {
    if (!idle) {
      // Only set the new block number when the user is active
      // getBlockNumber apparently returns a string
      provider?.getBlockNumber().then(latest => {
        setBlockNow(latest ? parseInt((latest as unknown) as string, 10) : undefined)
      })
    }
  }, network.blockTime)

  return (
    <ctx.Provider
      value={useMemo(
        () => ({
          blockNow,
          block7d: blockTimes[0]?.number ? parseInt((blockTimes[0]?.number as unknown) as string) : undefined,
          block24h: blockTimes[1]?.number ? parseInt((blockTimes[1]?.number as unknown) as string) : undefined,
        }),
        [blockNow, blockTimes],
      )}
    >
      {children}
    </ctx.Provider>
  )
}

export const useBlockNow = (): MaybeBlockNumber => useContext(ctx).blockNow

export const useBlockNumbers = (): BlockNumbers => useContext(ctx)
