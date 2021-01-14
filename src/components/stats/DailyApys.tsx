import React, { FC } from 'react';
import {
  Area,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import {
  useDailyApysForBlockTimes,
  useBlockTimesForDates,
} from '../../web3/hooks';
import { Color } from '../../theme';
import { percentageFormat, periodFormatMapping } from './utils';
import { DateRange, Metrics, useDateFilter, useMetrics } from './Metrics';
import { RechartsContainer } from './RechartsContainer';
import { useSelectedSavingsContractState } from '../../context/SelectedSaveVersionProvider';
import { ThemedSkeleton } from '../core/ThemedSkeleton';

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

const DailyApysChart: FC = () => {
  const dateFilter = useDateFilter();
  const { DailyApy, UtilisationRate } = useMetrics<MetricTypes>();
  const blockTimes = useBlockTimesForDates(dateFilter.dates);

  const savingsContractState = useSelectedSavingsContractState();
  const dailyApys = useDailyApysForBlockTimes(
    savingsContractState?.address,
    blockTimes,
  );

  return (
    <RechartsContainer>
      {dailyApys && dailyApys.length ? (
        <ResponsiveContainer aspect={2}>
          <AreaChart
            margin={{ top: 0, right: 16, bottom: 16, left: 16 }}
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
                <stop offset="5%" stopColor={Color.gold} stopOpacity={0.5} />
                <stop offset="95%" stopColor={Color.gold} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              axisLine={false}
              xAxisId={0}
              tickSize={12}
              padding={{ left: 16 }}
              minTickGap={16}
              tickLine
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
              stroke={DailyApy.color}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <ThemedSkeleton height={270} />
      )}
    </RechartsContainer>
  );
};

export const DailyApys: FC = () => (
  <Metrics defaultDateRange={DateRange.Month} metrics={dailyApyMetrics}>
    <DailyApysChart />
  </Metrics>
);
