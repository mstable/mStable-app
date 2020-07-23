import React, { FC, useMemo } from 'react';
import { VictoryChart } from 'victory-chart';
import { VictoryLine } from 'victory-line';
import { VictoryAxis } from 'victory-axis';
import { VictoryTooltip } from 'victory-tooltip';
import { VictoryVoronoiContainer } from 'victory-voronoi-container';
import { addDays, fromUnixTime, getUnixTime } from 'date-fns';
import { commify } from 'ethers/lib/utils';
import Skeleton from 'react-loading-skeleton';

import { useVictoryTheme } from '../../context/ThemeProvider';
import { Color } from '../../theme';
import {
  AggregateMetricsOfTypeQuery,
  AggregateMetricsOfTypeQueryVariables,
  AggregateMetricType,
  useAggregateMetricsOfTypeQuery,
} from '../../graphql/generated';
import {
  DateRange,
  Metric,
  Metrics,
  useDateFilter,
  useMetrics,
} from './Metrics';
import {
  abbreviateNumber,
  useDateFilterTickFormat,
  useDateFilterTickValues,
} from './utils';

interface Datum {
  x: number;
  y: number;
  date: Date;
  type: AggregateMetricType;
}

type Data = Datum[];

interface Group {
  data: Data;
  loading: boolean;
  metric: Metric<AggregateMetricType>;
}

const colors = {
  [AggregateMetricType.TotalSupply]: Color.green,
  [AggregateMetricType.TotalSavings]: Color.blue,
};

const aggregateMetrics = [
  {
    type: AggregateMetricType.TotalSupply,
    enabled: true,
    label: 'Total supply',
    color: colors[AggregateMetricType.TotalSupply],
  },
  {
    type: AggregateMetricType.TotalSavings,
    enabled: true,
    label: 'Total savings',
    color: colors[AggregateMetricType.TotalSavings],
  },
];

const useGroup = (
  metric: Metric<AggregateMetricType>,
  variables: Omit<AggregateMetricsOfTypeQueryVariables, 'type'>,
): Group => {
  const query = useAggregateMetricsOfTypeQuery({
    variables: { ...variables, type: metric?.type },
    skip: !metric?.enabled,
    fetchPolicy: 'cache-and-network',
  });

  return useMemo(
    () => ({
      metric,
      loading: query.loading,
      data: ((query.data?.aggregateMetrics ||
        []) as AggregateMetricsOfTypeQuery['aggregateMetrics']).map<Datum>(
        ({ timestamp, value }) => {
          const date = fromUnixTime(timestamp);
          return {
            x: date.getTime(),
            y: parseFloat(parseFloat(value).toFixed(2)),
            date,
            type: metric.type,
          };
        },
      ),
    }),
    [query.data, query.loading, metric],
  );
};

const TOMORROW = addDays(new Date(), 1);

const Chart: FC<{}> = () => {
  const metrics = useMetrics<AggregateMetricType>();
  const dateFilter = useDateFilter();
  const tickValues = useDateFilterTickValues(dateFilter);
  const tickFormat = useDateFilterTickFormat(dateFilter);

  const vars = useMemo<Omit<AggregateMetricsOfTypeQueryVariables, 'type'>>(
    () => ({
      period: dateFilter.period,
      from: getUnixTime(dateFilter.from),
      to: getUnixTime(TOMORROW),
    }),
    [dateFilter],
  );

  const totalSupply = useGroup(metrics[AggregateMetricType.TotalSupply], vars);
  const totalSavings = useGroup(
    metrics[AggregateMetricType.TotalSavings],
    vars,
  );

  const groups = useMemo<Group[]>(
    () => [totalSupply, totalSavings].filter(g => g.metric.enabled),
    [totalSupply, totalSavings],
  );

  const loading = groups.some(g => g.loading);

  const victoryTheme = useVictoryTheme();

  return (
    <div>
      {loading ? (
        <Skeleton height={400} />
      ) : (
        <VictoryChart
          theme={victoryTheme}
          scale="sqrt"
          height={300}
          domainPadding={{ y: 50 }}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ datum }: { datum: Datum }) => commify(datum.y)}
              labelComponent={
                <VictoryTooltip
                  style={
                    {
                      fill: ({ datum }: { datum: Datum }) => colors[datum.type],
                    } as {}
                  }
                />
              }
            />
          }
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
            scale="time"
            tickValues={tickValues}
            tickFormat={tickFormat}
            fixLabelOverlap
            style={{
              grid: { stroke: 'none' },
              tickLabels: { padding: 6 },
            }}
          />
          {groups.map(({ metric: { type, color }, data }) => (
            <VictoryLine
              key={type}
              data={data}
              style={{
                data: {
                  stroke: color,
                },
              }}
            />
          ))}
        </VictoryChart>
      )}
    </div>
  );
};

export const AggregateChart: FC<{}> = () => (
  <Metrics metrics={aggregateMetrics} defaultDateRange={DateRange.Month}>
    <Chart />
  </Metrics>
);
