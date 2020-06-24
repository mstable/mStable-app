import React, { FC, useMemo } from 'react';
import { VictoryGroup } from 'victory-group';
import { VictoryTooltip } from 'victory-tooltip';
import { VictoryChart } from 'victory-chart';
import { VictoryAxis } from 'victory-axis';
import { VictoryBar } from 'victory-bar';
import { VictoryVoronoiContainer } from 'victory-voronoi-container';
import Skeleton from 'react-loading-skeleton';
import { fromUnixTime, getUnixTime } from 'date-fns';
import { commify } from 'ethers/utils';

import { Color } from '../../theme';
import {
  TransactionType,
  useVolumeMetricsOfTypeQuery,
  VolumeMetricsOfTypeQuery,
  VolumeMetricsOfTypeQueryVariables,
} from '../../graphql/generated';
import { DateRange, Metric, Metrics, useDateFilter, useMetrics } from './Metrics';
import { ResponsiveVictoryContainer, VictoryFilters, victoryTheme } from './VictoryTheme';
import { abbreviateNumber, useDateFilterTickFormat, useDateFilterTickValues } from './utils';

interface Datum {
  x: number;
  y: number;
  date: Date;
  type: TransactionType;
}

type Data = Datum[];

interface Group {
  metric: Metric<TransactionType>;
  data: Data;
  loading: boolean;
}

const labels = {
  [TransactionType.Mint]: 'Mint',
  [TransactionType.Redeem]: 'Redemption',
  [TransactionType.Save]: 'Deposit',
  [TransactionType.Withdraw]: 'Withdraw',
  [TransactionType.Swap]: 'Swap',
};

const colors = {
  [TransactionType.Mint]: Color.green,
  [TransactionType.Redeem]: Color.red,
  [TransactionType.Exit]: Color.red,
  [TransactionType.Save]: Color.blue,
  [TransactionType.Withdraw]: Color.orange,
  [TransactionType.Swap]: Color.gold,
  [TransactionType.Paidfee]: Color.offBlack,
};

const volumeMetrics = [
  {
    type: TransactionType.Mint,
    enabled: true,
    label: labels[TransactionType.Mint],
    color: colors[TransactionType.Mint],
  },
  {
    type: TransactionType.Save,
    label: labels[TransactionType.Save],
    color: colors[TransactionType.Save],
  },
  {
    type: TransactionType.Withdraw,
    label: labels[TransactionType.Withdraw],
    color: colors[TransactionType.Withdraw],
  },
  {
    type: TransactionType.Swap,
    enabled: true,
    label: labels[TransactionType.Swap],
    color: colors[TransactionType.Swap],
  },
  {
    type: TransactionType.Redeem,
    label: labels[TransactionType.Redeem],
    color: colors[TransactionType.Redeem],
  },
];

const useGroup = (
  metric: Metric<TransactionType>,
  variables: Omit<VolumeMetricsOfTypeQueryVariables, 'type'>,
): Group => {
  const query = useVolumeMetricsOfTypeQuery({
    variables: { ...variables, type: metric?.type },
    skip: !metric?.enabled,
  });

  return useMemo(
    () => ({
      loading: query.loading,
      metric,
      data: ((query.data?.volumeMetrics ||
        []) as VolumeMetricsOfTypeQuery['volumeMetrics']).map<Datum>(
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
    [query.loading, query.data, metric],
  );
};

const useGroups = (): Group[] => {
  const metrics = useMetrics<TransactionType>();
  const dateFilter = useDateFilter();

  const vars = useMemo<Omit<VolumeMetricsOfTypeQueryVariables, 'type'>>(
    () => ({
      period: dateFilter.period,
      from: getUnixTime(dateFilter.from),
      to: getUnixTime(dateFilter.end),
    }),
    [dateFilter],
  );

  const mint = useGroup(metrics[TransactionType.Mint], vars);
  const redeem = useGroup(metrics[TransactionType.Redeem], vars);
  const exit = useGroup(metrics[TransactionType.Exit], vars);
  const swap = useGroup(metrics[TransactionType.Swap], vars);
  const deposit = useGroup(metrics[TransactionType.Save], vars);
  const withdraw = useGroup(metrics[TransactionType.Withdraw], vars);

  return useMemo<Group[]>(
    () =>
      [
        mint,
        // Redeem and Exit (`redeemMasset`) are treated as one
        { ...redeem, data: redeem.data.concat(exit.data) },
        swap,
        deposit,
        withdraw,
      ].filter(g => g.metric.enabled),
    [mint, redeem, swap, deposit, withdraw, exit],
  );
};

const Chart: FC<{}> = () => {
  const groups = useGroups();
  const loading = groups.some(g => g.loading);
  const dateFilter = useDateFilter();
  const tickValues = useDateFilterTickValues(dateFilter);
  const tickFormat = useDateFilterTickFormat(dateFilter);
  const barWidth = dateFilter.dateRange === DateRange.Week ? 8 : 2;

  return (
    <ResponsiveVictoryContainer>
      {loading ? (
        <Skeleton height={250} />
      ) : (
        <VictoryChart
          theme={victoryTheme}
          height={250}
          padding={{ left: 45, top: 10, right: 20, bottom: 40 }}
          scale="sqrt"
          domainPadding={{ x: 20 }}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              labels={({ datum }: { datum: Datum }) => commify(datum.y)}
              labelComponent={
                <VictoryTooltip
                  constrainToVisibleArea
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
          <VictoryFilters />
          <VictoryAxis
            dependentAxis
            tickFormat={abbreviateNumber}
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
            }}
          />
          <VictoryGroup offset={barWidth}>
            {groups.map(({ data, metric }: Group) => (
              <VictoryBar
                alignment="start"
                key={metric.type}
                data={data}
                barWidth={barWidth}
                style={{
                  data: {
                    fill: metric.color,
                    opacity: ({ active }: { active: boolean }) =>
                      active ? '1' : '0.6',
                  },
                }}
              />
            ))}
          </VictoryGroup>
        </VictoryChart>
      )}
    </ResponsiveVictoryContainer>
  );
};

export const VolumeChart: FC<{}> = () => (
  <Metrics metrics={volumeMetrics}>
    <Chart />
  </Metrics>
);
