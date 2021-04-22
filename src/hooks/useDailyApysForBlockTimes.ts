import { useMemo } from 'react'
import { getUnixTime } from 'date-fns'
import { useQuery, gql, DocumentNode } from '@apollo/client'

import { getKeyTimestamp } from '../utils/getKeyTimestamp'

interface BlockTime {
  timestamp: number
  number: number
}

const nowUnix = getUnixTime(Date.now())

const useDailyApysDocument = (savingsContractAddress: string | undefined, blockTimes: BlockTime[]): DocumentNode =>
  useMemo(() => {
    const withId = `where: { id: "${savingsContractAddress}" }`
    const currentApy = `t${nowUnix}: savingsContracts(${withId}) { ...DailySaveAPY }`
    const blockApys = blockTimes
      .map(
        ({ timestamp, number }) => `
              t${timestamp}: savingsContracts(${withId}, block: { number: ${number} }) {
                ...DailySaveAPY
              }`,
      )
      .join('\n')

    return gql`
      fragment DailySaveAPY on SavingsContract {
          dailyAPY
          utilisationRate {
              simple
          }
          latestExchangeRate {
              rate
          }
      }
      query DailyApys @api(name: protocol) {
          ${currentApy}
          ${blockApys}
      }
  `
  }, [savingsContractAddress, blockTimes])

export const useDailyApysForBlockTimes = (
  savingsContractAddress: string | undefined,
  blockTimes: BlockTime[],
): { timestamp: number; dailyAPY: number; utilisationRate: number }[] => {
  const apysDoc = useDailyApysDocument(savingsContractAddress, blockTimes)

  const apysQuery = useQuery<{
    [timestamp: string]: [
      {
        dailyAPY: string
        utilisationRate: { simple: string }
        latestExchangeRate?: { rate: string }
      },
    ]
  }>(apysDoc, { fetchPolicy: 'network-only' })

  return Object.entries(apysQuery.data || {})
    .filter(([, value]) => !!value?.[0]?.dailyAPY)
    .map(([key, [{ dailyAPY: _dailyAPY, utilisationRate: _utilisationRate, latestExchangeRate }]]) => {
      const rate = latestExchangeRate?.rate ?? '0.1'
      // FIXME revert this once the subgraph sets utilisationRate properly
      const baseUtilisationRate = parseFloat(_utilisationRate.simple)
      const multiplier =
        baseUtilisationRate < 100 || savingsContractAddress === '0xcf3f73290803fc04425bee135a4caeb2bab2c2a1' ? 1 : parseFloat(rate)

      const utilisationRate = parseFloat((baseUtilisationRate * multiplier).toFixed(2))

      const dailyAPY = parseFloat(parseFloat(_dailyAPY).toFixed(2))

      return {
        timestamp: getKeyTimestamp(key),
        dailyAPY,
        utilisationRate,
      }
    })
    .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
}
