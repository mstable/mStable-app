import Numeral from 'numeral'
import {
  eachDayOfInterval,
  eachHourOfInterval,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  eachWeekOfInterval,
  eachYearOfInterval,
} from 'date-fns'

export enum TimeMetricPeriod {
  Hour = 'HOUR',
  Day = 'DAY',
  Week = 'WEEK',
  Month = 'MONTH',
  Quarter = 'QUARTER',
  Year = 'YEAR',
}

export const periodIntervalMapping: Record<TimeMetricPeriod, (interval: Interval) => Date[]> = {
  [TimeMetricPeriod.Hour]: eachHourOfInterval,
  [TimeMetricPeriod.Day]: eachDayOfInterval,
  [TimeMetricPeriod.Week]: eachWeekOfInterval,
  [TimeMetricPeriod.Month]: eachMonthOfInterval,
  [TimeMetricPeriod.Quarter]: eachQuarterOfInterval,
  [TimeMetricPeriod.Year]: eachYearOfInterval,
}

export const periodFormatMapping: Record<TimeMetricPeriod, string> = {
  [TimeMetricPeriod.Hour]: 'HH',
  [TimeMetricPeriod.Day]: 'dd-MM',
  [TimeMetricPeriod.Week]: 'w',
  [TimeMetricPeriod.Month]: 'MM',
  [TimeMetricPeriod.Quarter]: 'Q',
  [TimeMetricPeriod.Year]: 'YYYY',
}

export const toK = (value: number): string => Numeral(value).format('0.[00]a')

export const percentageFormat = (value: number): string => `${value.toFixed(2)}%`
