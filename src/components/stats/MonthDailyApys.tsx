/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useMemo } from 'react';
import { BigNumber, formatUnits } from 'ethers/utils';
import { VictoryLabel } from 'victory-core';
import { VictoryLine } from 'victory-line';
import { VictoryChart } from 'victory-chart';
import { VictoryAxis } from 'victory-axis';
import Skeleton from 'react-loading-skeleton';
import {
  endOfDay,
  fromUnixTime,
  subDays,
  startOfDay,
  getUnixTime,
  eachDayOfInterval,
  eachHourOfInterval,
} from 'date-fns';
import { useDailApysForGivenTimestamps } from '../../web3/hooks';
import { Color } from '../../theme';
import { useVictoryTheme } from '../../context/ThemeProvider';
import {
  abbreviateNumber,
  percentageFormat,
  useDateFilterTickValues,
  useDateFilterTickFormat,
} from './utils';
import { TimeMetricPeriod } from '../../graphql/legacy';
import { DateRange } from './Metrics';

const now = new Date();

const timestamps = eachDayOfInterval({
  start: subDays(now, 29),
  end: subDays(now, 1),
})
  .map(endOfDay)
  .concat(now);

const dateFilter = {
  dateRange: DateRange.Month,
  period: TimeMetricPeriod.Day,
  label: '30 day',
  from: timestamps[0],
  end: timestamps[timestamps.length - 1],
};

export const MonthDailyApys: FC<{}> = () => {
  const dailyApys = useDailApysForGivenTimestamps(timestamps);
  const tickValues = useDateFilterTickValues(dateFilter);
  const tickFormat = useDateFilterTickFormat(dateFilter);
  const victoryTheme = useVictoryTheme();
  const data = useMemo<{ x: Date; y: number }[]>(
    () =>
      dailyApys &&
      dailyApys
        .filter(a => a.timestamp && a.apyResults)
        .map(({ timestamp, apyResults }) => {
          const percentage = parseFloat(apyResults.dailyAPY);
          const startTime = fromUnixTime(parseInt(timestamp, 10));
          return {
            x: startOfDay(startTime),
            y: percentage,
            percentage,
          };
        }),

    [dailyApys],
  );
  return (
    <div>
      {data && data.length ? (
        <VictoryChart
          theme={victoryTheme}
          height={200}
          domainPadding={25}
          padding={{ left: 45, top: 0, right: 20, bottom: 40 }}
        >
          <VictoryAxis
            dependentAxis
            tickFormat={abbreviateNumber}
            fixLabelOverlap
            style={{
              ticks: { stroke: 'none' },
            }}
          />
          <VictoryAxis
            tickValues={tickValues}
            tickFormat={tickFormat}
            style={{
              grid: { stroke: 'none' },
            }}
          />
          <VictoryLine
            data={data}
            labelComponent={<VictoryLabel />}
            labels={({
              datum: { percentage },
            }: {
              datum: { y: number; percentage: number };
            }) =>
              percentage > 100
                ? `${percentageFormat(percentage)} 🔥`
                : percentageFormat(percentage)
            }
            style={{
              data: {
                stroke: Color.gold,
                strokeWidth: 2,
              },
            }}
          />
        </VictoryChart>
      ) : (
        <Skeleton height={270} />
      )}
    </div>
  );
};
