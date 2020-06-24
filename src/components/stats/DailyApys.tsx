import React, { FC, useMemo } from 'react';
import { BigNumber, formatUnits } from 'ethers/utils';
import { VictoryLabel } from 'victory-core';
import { VictoryLine } from 'victory-line';
import { VictoryChart } from 'victory-chart';
import { VictoryAxis } from 'victory-axis';
import Skeleton from 'react-loading-skeleton';
import { endOfHour, fromUnixTime, subWeeks } from 'date-fns';

import { useDailyApysForPastWeek } from '../../web3/hooks';
import { Color } from '../../theme';
import {
  ResponsiveVictoryContainer,
  VictoryFilters,
  victoryTheme,
} from './VictoryTheme';
import {
  abbreviateNumber,
  percentageFormat,
  useDateFilterTickValues,
  useDateFilterTickFormat,
} from './utils';
import { TimeMetricPeriod } from '../../graphql/generated';
import { DateRange } from './Metrics';

const dateFilter = {
  dateRange: DateRange.Week,
  period: TimeMetricPeriod.Day,
  label: '7 day',
  from: subWeeks(new Date(), 1),
  end: endOfHour(new Date()),
};

export const DailyApys: FC<{}> = () => {
  const dailyApys = useDailyApysForPastWeek();
  const tickValues = useDateFilterTickValues(dateFilter);
  const tickFormat = useDateFilterTickFormat(dateFilter);

  const data = useMemo<{ x: Date; y: number }[]>(
    () =>
      dailyApys
        .filter(a => a.value && a.start)
        .map(({ value, start }) => ({
          x: fromUnixTime(start as number),
          y: parseFloat(formatUnits(value as BigNumber, 16)),
        })),

    [dailyApys],
  );

  return (
    <ResponsiveVictoryContainer>
      {data.length ? (
        <VictoryChart
          theme={victoryTheme}
          height={200}
          domainPadding={25}
          padding={{ left: 45, top: 0, right: 20, bottom: 40 }}
        >
          <VictoryFilters />
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
            labels={({ datum }) => percentageFormat(datum.y)}
            style={{
              data: {
                stroke: Color.gold,
                strokeWidth: 2,
              },
            }}
          />
        </VictoryChart>
      ) : (
        <Skeleton height={300} />
      )}
    </ResponsiveVictoryContainer>
  );
};
