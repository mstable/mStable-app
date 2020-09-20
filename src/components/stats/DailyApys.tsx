import React, { FC, useMemo } from 'react';
import { BigNumber, formatUnits } from 'ethers/utils';
import { VictoryLabel } from 'victory-core';
import { VictoryLine } from 'victory-line';
import { VictoryChart } from 'victory-chart';
import { VictoryAxis } from 'victory-axis';
import Skeleton from 'react-loading-skeleton';
import { endOfHour, fromUnixTime, subDays, closestTo } from 'date-fns';

import { useDailyApysForPastWeek } from '../../web3/hooks';
import { Color } from '../../theme';
import { useVictoryTheme } from '../../context/ThemeProvider';
import {
  abbreviateNumber,
  percentageFormat,
  useDateFilterTickValues,
  useDateFilterTickFormat,
} from './utils';
import { TimeMetricPeriod } from '../../graphql/mstable';
import { DateRange } from './Metrics';

const dateFilter = {
  dateRange: DateRange.Week,
  period: TimeMetricPeriod.Day,
  label: '7 day',
  from: subDays(new Date(), 6),
  end: endOfHour(new Date()),
};

export const DailyApys: FC<{}> = () => {
  const dailyApys = useDailyApysForPastWeek();
  const tickValues = useDateFilterTickValues(dateFilter);
  const tickFormat = useDateFilterTickFormat(dateFilter);
  const victoryTheme = useVictoryTheme();

  const data = useMemo<{ x: Date; y: number }[]>(
    () =>
      dailyApys
        .filter(a => a.value && a.end)
        .map(({ value, end }) => {
          const percentage = parseFloat(formatUnits(value as BigNumber, 16));
          const endTime = fromUnixTime(end as number);

          return {
            x: closestTo(endTime, tickValues),
            y: percentage,
            percentage,
          };
        }),

    [dailyApys, tickValues],
  );

  return (
    <div>
      {data.length ? (
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
