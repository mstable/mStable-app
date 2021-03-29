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
import {
  useDateFilter,
  useMetricsState,
  Metrics,
  DateRange,
} from '../../../stats/Metrics';
import { RechartsContainer } from '../../../stats/RechartsContainer';
import { periodFormatMapping, toK } from '../../../stats/utils';
import { useSelectedFeederPoolAddress } from '../FeederPoolProvider';

interface AggregateMetricsQueryResult {
  [timestamp: string]: {
    simple: string;
  };
}

const NoData = styled.div`
  user-select: none;
  position: absolute;
  height: 100%;
  opacity: 0.5;
  padding: 1rem;
  width: 100%;
  text-align: center;
`;

const nowUnix = getUnixTime(new Date());

const useTotalLiquidity = (
  poolAddress: string,
): {
  timestamp: number;
  totalLiquidity: number;
}[] => {
  const dateFilter = useDateFilter();

  const blockTimes = useBlockTimesForDates(dateFilter.dates);

  const metricsDoc = useMemo<DocumentNode>(() => {
    const current = `t${nowUnix}: metric(id: "${poolAddress}.token.totalSupply") { simple }`;
    const blockMetrics = blockTimes
      .map(
        ({ timestamp, number }) =>
          `t${timestamp}: metric(id: "${poolAddress}.token.totalSupply", block: { number: ${number} }) { simple }`,
      )
      .join('\n');

    return gql`
      query AggregateMetrics @api(name: feeders) {
        ${current}
        ${blockMetrics}
      }
    `;
  }, [blockTimes, poolAddress]);

  const query = useQuery<AggregateMetricsQueryResult>(metricsDoc, {
    fetchPolicy: 'no-cache',
  });

  return useMemo(() => {
    const filtered = Object.entries(query.data ?? {})
      .filter(([, value]) => !!value?.simple)
      .map(([key, value]) => [getKeyTimestamp(key), value]) as [
      number,
      AggregateMetricsQueryResult[string],
    ][];
    return filtered
      .sort(([a], [b]) => (a > b ? 1 : -1))
      .map(([timestamp, { simple }]) => {
        return {
          timestamp,
          totalLiquidity: parseFloat(simple),
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
  const poolAddress = useSelectedFeederPoolAddress();
  const data = useTotalLiquidity(poolAddress);
  const dateFilter = useDateFilter();
  const { metrics } = useMetricsState();
  return (
    <RechartsContainer>
      {data.length < 1 && <NoData>No data yet</NoData>}
      <ResponsiveContainer aspect={2}>
        <AreaChart
          margin={{ top: 40, right: 0, bottom: 0, left: 0 }}
          barCategoryGap={1}
          data={data}
        >
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
    </RechartsContainer>
  );
};

export const LiquidityChart: FC<{ color?: string }> = ({
  color = Color.blue,
}) => {
  const aggregateMetrics = useMemo(
    () => [
      {
        type: 'totalLiquidity',
        enabled: true,
        label: 'Liquidity',
        color,
      },
    ],
    [color],
  );

  return (
    <Metrics
      metrics={aggregateMetrics}
      defaultDateRange={DateRange.Week}
      hideControls
    >
      <Chart aggregateMetrics={aggregateMetrics} />
    </Metrics>
  );
};
