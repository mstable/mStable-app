import {
  eachDayOfInterval,
  eachHourOfInterval,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  format,
} from 'date-fns';

import { useMemo } from 'react';
import { TimeMetricPeriod } from '../../graphql/mstable';
import { DateFilter } from './Metrics';

type TickFormatFn = (timestamp: number) => string;

const periodIntervalMapping: Record<
  TimeMetricPeriod,
  (interval: Interval) => Date[]
> = {
  [TimeMetricPeriod.Hour]: eachHourOfInterval,
  [TimeMetricPeriod.Day]: eachDayOfInterval,
  [TimeMetricPeriod.Week]: eachWeekOfInterval,
  [TimeMetricPeriod.Month]: eachMonthOfInterval,
  [TimeMetricPeriod.Quarter]: eachQuarterOfInterval,
  [TimeMetricPeriod.Year]: eachYearOfInterval,
};

const periodFormatMapping: Record<TimeMetricPeriod, string> = {
  [TimeMetricPeriod.Hour]: 'HH',
  [TimeMetricPeriod.Day]: 'dd-MM',
  [TimeMetricPeriod.Week]: 'w',
  [TimeMetricPeriod.Month]: 'MMM',
  [TimeMetricPeriod.Quarter]: 'Q',
  [TimeMetricPeriod.Year]: 'YYYY',
};

export const abbreviateNumber = (value: number): string => {
  if (value >= 1e3 && value < 1e6) {
    return `${(value / 1e3).toFixed(0)}k`;
  }

  if (value >= 1e6 && value < 1e9) {
    return `${(value / 1e6).toFixed(2)}m`;
  }

  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}b`;
  }

  return value.toFixed(0);
};

export const percentageFormat = (value: number): string =>
  `${value.toFixed(2)}%`;

const timestampTickFormat = (
  period: TimeMetricPeriod,
): TickFormatFn => timestamp =>
  timestamp > 1 ? format(timestamp, periodFormatMapping[period]) : '';

export const useDateFilterTickFormat = ({ period }: DateFilter): TickFormatFn =>
  useMemo(() => timestampTickFormat(period), [period]);

export const useDateFilterTickValues = (dateFilter: DateFilter): number[] =>
  useMemo(() => {
    const { from, end, period } = dateFilter;
    const interval: Interval = { start: from, end };
    return periodIntervalMapping[period](interval).map(date => date.getTime());
  }, [dateFilter]);
