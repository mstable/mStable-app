import {
  eachDayOfInterval,
  eachHourOfInterval,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
  lightFormat,
} from 'date-fns';

import { useMemo } from 'react';
import { TimeMetricPeriod } from '../../graphql/generated';
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
  [TimeMetricPeriod.Week]: 'W',
  [TimeMetricPeriod.Month]: 'MM',
  [TimeMetricPeriod.Quarter]: 'Q',
  [TimeMetricPeriod.Year]: 'YYYY',
};

export const abbreviateNumber = (value: number): string => {
  const valueStr = value.toFixed(0);

  if (value >= 1e3 && value < 1e6) {
    return `${valueStr.slice(0, valueStr.length - 3)}k`;
  }

  if (value >= 1e6 && value < 1e9) {
    return `${valueStr.slice(0, 1)}.${valueStr.slice(1, 3)}m`;
  }

  if (value >= 1e9) {
    return `${valueStr.slice(0, 1)}.${valueStr.slice(1, 3)}b`;
  }

  return value.toFixed(0);
};

export const percentageFormat = (value: number): string =>
  `${value.toFixed(2)}%`;

const timestampTickFormat = (
  period: TimeMetricPeriod,
): TickFormatFn => timestamp =>
  timestamp > 1 ? lightFormat(timestamp, periodFormatMapping[period]) : '';

export const useDateFilterTickFormat = ({ period }: DateFilter): TickFormatFn =>
  useMemo(() => timestampTickFormat(period), [period]);

export const useDateFilterTickValues = (dateFilter: DateFilter): number[] =>
  useMemo(() => {
    const { from, end, period } = dateFilter;
    const interval: Interval = { start: from, end };
    return periodIntervalMapping[period](interval).map(date => date.getTime());
  }, [dateFilter]);
