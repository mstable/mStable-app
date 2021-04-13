import React, { FC } from 'react';
import {
  Area,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  ResponsiveContainer,
} from 'recharts';
import styled from 'styled-components';
import { format } from 'date-fns';
import { Color } from '../../theme';
import { percentageFormat, periodFormatMapping } from './utils';
import { DateRange, Metrics, useDateFilter, useMetrics } from './Metrics';
import { RechartsContainer } from './RechartsContainer';
import { useSelectedSavingsContractState } from '../../context/SelectedSaveVersionProvider';
import { ThemedSkeleton } from '../core/ThemedSkeleton';
import { useBlockTimesForDates } from '../../hooks/useBlockTimesForDates';
import { useDailyApysForBlockTimes } from '../../hooks/useDailyApysForBlockTimes';

const NoData = styled.div`
  display: flex;
  height: 16rem;
  justify-content: center;
  align-items: center;
`;

enum MetricTypes {
  DailyApy = 'DailyApy',
  UtilisationRate = 'UtilisationRate',
}

const dailyApyMetrics = [
  {
    type: MetricTypes.DailyApy,
    label: 'Daily APY',
    color: Color.gold,
    enabled: true,
  },
  {
    type: MetricTypes.UtilisationRate,
    label: 'SAVE Utilisation',
    color: Color.black,
  },
];

const formatApy = (percentage: number): string =>
  percentage > 100
    ? `${percentageFormat(percentage as number)} 🔥`
    : percentageFormat(percentage as number);

const DailyApysChart: FC<{
  shimmerHeight?: number;
  tick?: boolean;
  marginTop?: number;
  className?: string;
  color?: string;
}> = ({ shimmerHeight = 270, tick, className, marginTop, color }) => {
  const dateFilter = useDateFilter();
  const { DailyApy, UtilisationRate } = useMetrics<MetricTypes>();
  const blockTimes = useBlockTimesForDates(dateFilter.dates);

  const savingsContractState = useSelectedSavingsContractState();
  const dailyApys = useDailyApysForBlockTimes(
    savingsContractState?.address,
    blockTimes,
  );

  if (dailyApys.some(value => value.dailyAPY === 0 || value.dailyAPY > 1000)) {
    return <NoData>No data available yet</NoData>;
  }

  return (
    <RechartsContainer className={className}>
      {dailyApys && dailyApys.length ? (
        <ResponsiveContainer aspect={2}>
          <AreaChart
            margin={
              tick
                ? { top: marginTop, right: 16, bottom: 16, left: 16 }
                : { top: marginTop, right: 0, bottom: 0, left: 0 }
            }
            barCategoryGap={1}
            data={dailyApys}
          >
            <defs>
              <linearGradient id="utilisationRate" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={Color.blackTransparent}
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor={Color.blackTransparent}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="dailyAPY" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={color ?? Color.gold}
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor={color ?? Color.gold}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              axisLine={false}
              tick={tick}
              xAxisId={0}
              tickSize={12}
              padding={tick ? { left: 16 } : { left: 0 }}
              minTickGap={16}
              tickLine
              height={!tick ? 0 : undefined}
              tickFormatter={(timestamp: number) =>
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
              tickFormatter={formatApy}
              axisLine={false}
              tick={tick}
              tickLine
              tickSize={12}
              padding={tick ? { bottom: 16 } : { bottom: 0 }}
              interval="preserveEnd"
              minTickGap={8}
              yAxisId={0}
              width={!tick ? 0 : undefined}
            />
            <Tooltip
              cursor
              labelFormatter={timestamp =>
                format((timestamp as number) * 1000, 'yyyy-MM-dd HH:mm')
              }
              formatter={formatApy as never}
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
            <Area
              hide={!UtilisationRate.enabled}
              strokeWidth={2}
              type="monotone"
              dataKey="utilisationRate"
              name="SAVE Utilisation "
              opacity={1}
              fill="url(#utilisationRate)"
              yAxisId={0}
              stroke={Color.blackTransparent}
            />
            <Area
              hide={!DailyApy.enabled}
              strokeWidth={2}
              type="monotone"
              dataKey="dailyAPY"
              name="Daily APY "
              opacity={1}
              yAxisId={0}
              fill="url(#dailyAPY)"
              stroke={color ?? DailyApy.color}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <ThemedSkeleton height={shimmerHeight} />
      )}
    </RechartsContainer>
  );
};

export const DailyApys: FC<{
  hideControls?: boolean;
  shimmerHeight?: number;
  tick?: boolean;
  marginTop?: number;
  className?: string;
  color?: string;
}> = ({
  hideControls = false,
  shimmerHeight,
  tick = true,
  className,
  marginTop,
  color,
}) => (
  <Metrics
    defaultDateRange={DateRange.Month}
    metrics={dailyApyMetrics}
    hideControls={hideControls}
  >
    <DailyApysChart
      shimmerHeight={shimmerHeight}
      tick={tick}
      marginTop={marginTop}
      className={className}
      color={color}
    />
  </Metrics>
);
