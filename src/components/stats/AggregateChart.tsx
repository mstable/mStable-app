import React, { FC, useMemo } from 'react'
import { DocumentNode, gql, useQuery } from '@apollo/client'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { format, getUnixTime } from 'date-fns'

import { useBlockTimesForDates } from '../../hooks/useBlockTimesForDates'
import { getKeyTimestamp } from '../../utils/getKeyTimestamp'
import { Color } from '../../theme'
import { DateRange, Metrics, useDateFilter, useMetricsState } from './Metrics'
import { periodFormatMapping, toK } from './utils'
import { RechartsContainer } from './RechartsContainer'
import { useSelectedMassetName } from '../../context/SelectedMassetNameProvider'
import { useSelectedSavingsContractState } from '../../context/SelectedSaveVersionProvider'
import { ThemedSkeleton } from '../core/ThemedSkeleton'

interface AggregateMetricsQueryResult {
  [timestamp: string]: {
    totalSupply: {
      simple: string
    }
    savingsContracts: {
      version: number
      latestExchangeRate: {
        rate: number
      }
      totalSavings: {
        simple: string
      }
    }[]
  }
}

const colors = {
  totalSupply: Color.green,
  totalSavingsV1: Color.grey,
  totalSavingsV2: Color.blue,
}

const nowUnix = getUnixTime(new Date())

const useAggregateMetrics = (): {
  timestamp: number
  totalSupply: number
  totalSavingsV1: number
  totalSavingsV2: number
}[] => {
  const dateFilter = useDateFilter()
  const savingsContractState = useSelectedSavingsContractState()
  const massetAddress = savingsContractState?.massetAddress

  const blockTimes = useBlockTimesForDates(dateFilter.dates)

  const metricsDoc = useMemo<DocumentNode>(() => {
    const current = `t${nowUnix}: masset(id: "${massetAddress}") { ...AggregateMetricsFields }`
    const blockMetrics = blockTimes
      .map(
        ({ timestamp, number }) =>
          `t${timestamp}: masset(id: "${massetAddress}", block: { number: ${number} }) { ...AggregateMetricsFields }`,
      )
      .join('\n')

    return gql`
      fragment AggregateMetricsFields on Masset {
        totalSupply {
          simple
        }
        savingsContracts(orderBy: version, orderDirection: asc) {
          version
          latestExchangeRate {
            rate
          }
          totalSavings {
            simple
          }
        }
      }
      query AggregateMetrics @api(name: protocol) {
        ${current}
        ${blockMetrics}
      }
    `
  }, [blockTimes, massetAddress])

  const query = useQuery<AggregateMetricsQueryResult>(metricsDoc, {
    fetchPolicy: 'no-cache',
  })

  return useMemo(() => {
    const filtered = Object.entries(query.data ?? {})
      .filter(([, value]) => !!value?.totalSupply)
      .map(([key, value]) => [getKeyTimestamp(key), value]) as [number, AggregateMetricsQueryResult[string]][]
    return filtered
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([timestamp, { totalSupply, savingsContracts }]) => {
        const v1 = savingsContracts.find(sc => sc.version === 1)
        const v2 = savingsContracts.find(sc => sc.version === 2)
        const totalSavingsV1 = parseFloat(v1 ? v1.totalSavings.simple : '0')
        const totalSavingsV2 = parseFloat(v2 ? v2.totalSavings.simple : '0') * (v2?.latestExchangeRate?.rate ?? 0.1)
        return {
          timestamp,
          totalSupply: parseFloat(totalSupply.simple),
          totalSavingsV1,
          totalSavingsV2,
        }
      })
  }, [query.data])
}

const Chart: FC<{
  aggregateMetrics: {
    type: string
    enabled: boolean
    label: string
    color: string
  }[]
}> = ({ aggregateMetrics }) => {
  const data = useAggregateMetrics()
  const dateFilter = useDateFilter()
  const { metrics } = useMetricsState()
  return (
    <RechartsContainer>
      {data && data.length ? (
        <ResponsiveContainer aspect={2}>
          <AreaChart margin={{ top: 0, right: 16, bottom: 16, left: 16 }} barCategoryGap={1} data={data}>
            <defs>
              {aggregateMetrics.map(({ type, color }) => (
                <linearGradient id={type} key={type} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <XAxis
              dataKey="timestamp"
              axisLine={false}
              xAxisId={0}
              tickSize={12}
              padding={{ left: 16 }}
              minTickGap={16}
              tickLine
              tickFormatter={timestamp => (timestamp ? format(timestamp * 1000, periodFormatMapping[dateFilter.period]) : '')}
            />
            <YAxis
              type="number"
              orientation="left"
              tickFormatter={toK}
              axisLine={false}
              tickLine
              tickSize={12}
              padding={{ bottom: 16 }}
              interval="preserveEnd"
              minTickGap={8}
              yAxisId={0}
            />
            <Tooltip
              cursor
              labelFormatter={timestamp => format((timestamp as number) * 1000, 'yyyy-MM-dd HH:mm')}
              formatter={toK as never}
              separator=""
              contentStyle={{
                fontSize: '14px',
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.8)',
                textAlign: 'right',
                border: 'none',
                borderRadius: '4px',
                color: Color.black,
              }}
              wrapperStyle={{
                top: 0,
                left: 0,
              }}
            />
            {metrics.map(({ color, type, label, enabled }) => (
              <Area
                isAnimationActive={false}
                key={type}
                type="monotone"
                hide={!enabled}
                dataKey={type}
                name={`${label} `}
                opacity={1}
                dot={false}
                yAxisId={0}
                stroke={color}
                strokeWidth={2}
                fill={`url(#${type})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <ThemedSkeleton height={270} />
      )}
    </RechartsContainer>
  )
}

export const AggregateChart: FC = () => {
  const massetName = useSelectedMassetName()
  const aggregateMetrics = useMemo(
    () => [
      {
        type: 'totalSupply',
        enabled: true,
        label: 'Total supply',
        color: colors.totalSupply,
      },
      ...(massetName === 'musd'
        ? [
            {
              type: 'totalSavingsV1',
              enabled: true,
              label: 'Total savings (V1)',
              color: colors.totalSavingsV1,
            },
            {
              type: 'totalSavingsV2',
              enabled: true,
              label: 'Total savings (V2)',
              color: colors.totalSavingsV2,
            },
          ]
        : [
            {
              type: 'totalSavingsV2',
              enabled: true,
              label: 'Total savings',
              color: colors.totalSavingsV2,
            },
          ]),
    ],
    [massetName],
  )

  return (
    <Metrics metrics={aggregateMetrics} defaultDateRange={DateRange.Month}>
      <Chart aggregateMetrics={aggregateMetrics} />
    </Metrics>
  )
}
