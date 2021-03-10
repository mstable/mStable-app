import React, { FC, useMemo } from 'react';
import styled from 'styled-components';

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

import { useBlockTimesForDates } from '../../../../hooks/useBlockTimesForDates';
import { getKeyTimestamp } from '../../../../utils/getKeyTimestamp';
import { Color } from '../../../../theme';
import { useSelectedSavingsContractState } from '../../../../context/SelectedSaveVersionProvider';
import { ThemedSkeleton } from '../../../core/ThemedSkeleton';
import {
  useDateFilter,
  useMetricsState,
  Metrics,
  DateRange,
} from '../../../stats/Metrics';
import { RechartsContainer } from '../../../stats/RechartsContainer';
import { periodFormatMapping, toK } from '../../../stats/utils';

interface AggregateMetricsQueryResult {
  [timestamp: string]: {
    totalLiquidity: {
      simple: string;
    };
  };
}

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  position: absolute;
  top: 1rem;
  left: 1rem;
`;

const StyledSkeleton = styled(ThemedSkeleton)`
  border-radius: 1rem;
  line-height: inherit;
`;

const Container = styled(RechartsContainer)`
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 1rem;
  position: relative;
  height: 100%;
`;

const nowUnix = getUnixTime(new Date());

const useAggregateMetrics = (): {
  timestamp: number;
  totalLiquidity: number;
}[] => {
  const dateFilter = useDateFilter();
  const savingsContractState = useSelectedSavingsContractState();
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
        totalLiquidity: totalSupply {
          simple
        }
      }
      query AggregateMetrics @api(name: protocol) {
        ${current}
        ${blockMetrics}
      }
    `;
  }, [blockTimes, massetAddress]);

  const query = useQuery<AggregateMetricsQueryResult>(metricsDoc, {
    fetchPolicy: 'no-cache',
  });

  return useMemo(() => {
    const filtered = Object.entries(query.data ?? {})
      .filter(([, value]) => !!value?.totalLiquidity)
      .map(([key, value]) => [getKeyTimestamp(key), value]) as [
      number,
      AggregateMetricsQueryResult[string],
    ][];
    return filtered
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([timestamp, { totalLiquidity }]) => {
        return {
          timestamp,
          totalLiquidity: parseFloat(totalLiquidity.simple),
        };
      });
  }, [query.data]);
};

const Chart: FC<{
  aggregateMetrics: {
    type: string;
    enabled: boolean;
    label: string;
    color: string;
  }[];
}> = ({ aggregateMetrics }) => {
  const data = useAggregateMetrics();
  const dateFilter = useDateFilter();
  const { metrics } = useMetricsState();
  return (
    <Container>
      <Title> Liquidity </Title>
      {data && data.length ? (
        <ResponsiveContainer aspect={2}>
          <AreaChart
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
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
              height={0}
              tick={false}
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
              interval="preserveEnd"
              yAxisId={0}
              tick={false}
              width={0}
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
        <StyledSkeleton height={160} />
      )}
    </Container>
  );
};

export const LiquidityChart: FC<{ color?: string }> = ({ color }) => {
  const aggregateMetrics = useMemo(
    () => [
      {
        type: 'totalLiquidity',
        enabled: true,
        label: 'Liquidity',
        color: color ?? Color.blue,
      },
    ],
    [color],
  );

  return (
    <Metrics
      metrics={aggregateMetrics}
      defaultDateRange={DateRange.Days90}
      hideControls
    >
      <Chart aggregateMetrics={aggregateMetrics} />
    </Metrics>
  );
};
