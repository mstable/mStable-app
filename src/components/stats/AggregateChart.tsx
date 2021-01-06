import React, { FC, useMemo } from 'react';
import { DocumentNode, gql, useQuery } from '@apollo/client';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format, getUnixTime } from 'date-fns';
import Skeleton from 'react-loading-skeleton/lib';

import { getKeyTimestamp, useBlockTimesForDates } from '../../web3/hooks';
import { Color } from '../../theme';
import { DateRange, Metrics, useDateFilter, useMetricsState } from './Metrics';
import { periodFormatMapping, toK } from './utils';
import { RechartsContainer } from './RechartsContainer';
import { useSelectedSavingsContractState } from '../../context/SelectedSaveVersionProvider';

interface AggregateMetricsQueryResult {
  [timestamp: string]: {
    totalSupply: {
      simple: string;
    };
    savingsContracts: [
      {
        totalSavings: {
          simple: string;
        };
      },
    ];
  };
}

const colors = {
  totalSupply: Color.green,
  totalSavings: Color.blue,
};

const aggregateMetrics = [
  {
    type: 'totalSupply',
    enabled: true,
    label: 'Total supply',
    color: colors.totalSupply,
  },
  {
    type: 'totalSavings',
    enabled: true,
    label: 'Total savings',
    color: colors.totalSavings,
  },
];

const nowUnix = getUnixTime(new Date());

const useAggregateMetrics = (): {
  timestamp: number;
  totalSupply: number;
  totalSavings: number;
}[] => {
  const dateFilter = useDateFilter();
  const savingsContractState = useSelectedSavingsContractState();
  const version = savingsContractState?.version;
  const massetAddress = savingsContractState?.massetAddress;

  const blockTimes = useBlockTimesForDates(dateFilter.dates);

  const metricsDoc = useMemo<DocumentNode>(() => {
    const current = `t${nowUnix}: masset(id: "${massetAddress}") { ...AggregateMetricsFields }`;
    const blockMetrics = blockTimes
      .map(
        ({ timestamp, number }) =>
          `t${timestamp}: masset(id: "${massetAddress}", block: { number: ${number} }) { ...AggregateMetricsFields }`,
      )
      .join('\n');

    return gql`
      fragment AggregateMetricsFields on Masset {
        totalSupply {
          simple
        }
        #first deposited version of save-v2
        savingsContracts(where: {version: $version, id_not: "0x478e379d5f3e2f949a94f1ccfb7217fb35916615"}) {
          totalSavings {
            simple
          }
        }
      }
      query AggregateMetrics($version: Int!) @api(name: protocol) {
        ${current}
        ${blockMetrics}
      }
    `;
  }, [blockTimes, massetAddress]);

  const query = useQuery<AggregateMetricsQueryResult>(metricsDoc, {
    fetchPolicy: 'no-cache',
    variables: { version },
  });

  return useMemo(() => {
    const filtered = Object.entries(query.data ?? {})
      .filter(([, value]) => !!value?.totalSupply)
      .map(([key, value]) => [getKeyTimestamp(key), value]) as [
      number,
      AggregateMetricsQueryResult[string],
    ][];
    return filtered
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([timestamp, { totalSupply, savingsContracts }]) => {
        return {
          timestamp,
          totalSupply: parseFloat(totalSupply.simple),
          totalSavings: parseFloat(
            savingsContracts[0] ? savingsContracts[0].totalSavings.simple : '0',
          ),
        };
      });
  }, [query.data]);
};

const Chart: FC = () => {
  const data = useAggregateMetrics();
  const dateFilter = useDateFilter();
  const { metrics } = useMetricsState();
  return (
    <RechartsContainer>
      {data && data.length ? (
        <ResponsiveContainer aspect={2}>
          <AreaChart
            margin={{ top: 0, right: 16, bottom: 16, left: 16 }}
            barCategoryGap={1}
            data={data}
          >
            <defs>
              {aggregateMetrics.map(({ type, color }) => (
                <linearGradient
                  id={type}
                  key={type}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
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
              tickFormatter={timestamp =>
                timestamp
                  ? format(
                      timestamp * 1000,
                      periodFormatMapping[dateFilter.period],
                    )
                  : ''
              }
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
              labelFormatter={timestamp =>
                format((timestamp as number) * 1000, 'yyyy-MM-dd HH:mm')
              }
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
        <Skeleton height={270} />
      )}
    </RechartsContainer>
  );
};

export const AggregateChart: FC = () => (
  <Metrics metrics={aggregateMetrics} defaultDateRange={DateRange.Month}>
    <Chart />
  </Metrics>
);
