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

import { useVictoryTheme } from '../../context/ThemeProvider';
import { Color } from '../../theme';
import {
  TransactionType,
  useVolumeMetricsOfTypeQuery,
  VolumeMetricsOfTypeQuery,
  VolumeMetricsOfTypeQueryVariables,
} from '../../graphql/legacy';
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
  type: TransactionType;
}

type Data = Datum[];

interface Group {
  metric: Metric<TransactionType>;
  data: Data;
  loading: boolean;
}

const labels = {
  [TransactionType.MassetMint]: 'Mint',
  [TransactionType.MassetRedeem]: 'Redemption',
  [TransactionType.SavingsContractDeposit]: 'Deposit',
  [TransactionType.SavingsContractWithdraw]: 'Withdraw',
  [TransactionType.MassetSwap]: 'Swap',
};

const colors = {
  [TransactionType.MassetMint]: Color.green,
  [TransactionType.MassetRedeem]: Color.red,
  [TransactionType.MassetRedeemMasset]: Color.red,
  [TransactionType.SavingsContractDeposit]: Color.blue,
  [TransactionType.SavingsContractWithdraw]: Color.orange,
  [TransactionType.MassetSwap]: Color.gold,
  [TransactionType.MassetPaidFee]: Color.offBlack,
  // TODO: set colours when these are used
  [TransactionType.StakingRewardsContractClaimReward]: 'gray',
  [TransactionType.StakingRewardsContractExit]: 'gray',
  [TransactionType.StakingRewardsContractStake]: 'gray',
  [TransactionType.StakingRewardsContractWithdraw]: 'gray',
};

const volumeMetrics = [
  {
    type: TransactionType.MassetMint,
    enabled: true,
    label: labels[TransactionType.MassetMint],
    color: colors[TransactionType.MassetMint],
  },
  {
    type: TransactionType.SavingsContractDeposit,
    label: labels[TransactionType.SavingsContractDeposit],
    color: colors[TransactionType.SavingsContractDeposit],
  },
  {
    type: TransactionType.SavingsContractWithdraw,
    label: labels[TransactionType.SavingsContractWithdraw],
    color: colors[TransactionType.SavingsContractWithdraw],
  },
  {
    type: TransactionType.MassetSwap,
    enabled: true,
    label: labels[TransactionType.MassetSwap],
    color: colors[TransactionType.MassetSwap],
  },
  {
    type: TransactionType.MassetRedeem,
    label: labels[TransactionType.MassetRedeem],
    color: colors[TransactionType.MassetRedeem],
  },
];

const useGroup = (
  metric: Metric<TransactionType>,
  variables: Omit<VolumeMetricsOfTypeQueryVariables, 'type'>,
): Group => {
  const query = useVolumeMetricsOfTypeQuery({
    variables: { ...variables, type: metric?.type },
    skip: !metric?.enabled,
    fetchPolicy: 'cache-and-network',
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

  const mint = useGroup(metrics[TransactionType.MassetMint], vars);
  const redeem = useGroup(metrics[TransactionType.MassetRedeem], vars);
  const exit = useGroup(metrics[TransactionType.MassetRedeemMasset], vars);
  const swap = useGroup(metrics[TransactionType.MassetSwap], vars);
  const deposit = useGroup(
    metrics[TransactionType.SavingsContractDeposit],
    vars,
  );
  const withdraw = useGroup(
    metrics[TransactionType.SavingsContractWithdraw],
    vars,
  );

  return useMemo<Group[]>(
    () =>
      [
        mint,
        deposit,
        withdraw,
        swap,
        // Redeem and Exit (`redeemMasset`) are treated as one
        { ...redeem, data: redeem.data.concat(exit.data) },
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
  const victoryTheme = useVictoryTheme();

  return (
    <div>
      {loading ? (
        <Skeleton height={300} />
      ) : (
        <VictoryChart
          theme={victoryTheme}
          height={250}
          padding={{ left: 45, top: 10, right: 20, bottom: 40 }}
          scale="linear"
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
              tickLabels: { padding: 6 },
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
    </div>
  );
};

export const VolumeChart: FC<{}> = () => (
  <Metrics metrics={volumeMetrics}>
    <Chart />
  </Metrics>
);
