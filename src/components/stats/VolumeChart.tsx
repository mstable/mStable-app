import React, { FC, useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import { DocumentNode, gql, useQuery } from '@apollo/client';
import { format, getUnixTime } from 'date-fns';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Color } from '../../theme';
import { DateRange, Metrics, useDateFilter, useMetricsState } from './Metrics';
import { getKeyTimestamp, useBlockTimesForDates } from '../../web3/hooks';
import { periodFormatMapping, toK } from './utils';
import { RechartsContainer } from './RechartsContainer';
import { useSelectedMassetState } from '../../context/DataProvider/DataProvider';

export enum TransactionType {
  MassetMint = 'MASSET_MINT',
  MassetSwap = 'MASSET_SWAP',
  MassetRedeem = 'MASSET_REDEEM',
  MassetRedeemMasset = 'MASSET_REDEEM_MASSET',
  MassetPaidFee = 'MASSET_PAID_FEE',
  SavingsContractDeposit = 'SAVINGS_CONTRACT_DEPOSIT',
  SavingsContractWithdraw = 'SAVINGS_CONTRACT_WITHDRAW',
}

interface MetricsQueryResult {
  [timestamp: string]: {
    cumulativeMinted: {
      simple: string;
    };
    cumulativeSwapped: {
      simple: string;
    };
    cumulativeRedeemed: {
      simple: string;
    };
    cumulativeRedeemedMasset: {
      simple: string;
    };
    cumulativeFeesPaid: {
      simple: string;
    };
    savingsContracts: [
      {
        cumulativeDeposited: {
          simple: string;
        };
        cumulativeWithdrawn: {
          simple: string;
        };
      },
    ];
  };
}

const labels = {
  [TransactionType.MassetMint]: 'Mint',
  [TransactionType.MassetRedeem]: 'Redemption',
  [TransactionType.SavingsContractDeposit]: 'Deposit',
  [TransactionType.SavingsContractWithdraw]: 'Withdraw',
  [TransactionType.MassetSwap]: 'Swap',
  [TransactionType.MassetPaidFee]: 'Fees',
};

const colors = {
  [TransactionType.MassetMint]: Color.green,
  [TransactionType.MassetRedeem]: Color.red,
  [TransactionType.MassetRedeemMasset]: Color.red,
  [TransactionType.SavingsContractDeposit]: Color.blue,
  [TransactionType.SavingsContractWithdraw]: Color.orange,
  [TransactionType.MassetSwap]: Color.gold,
  [TransactionType.MassetPaidFee]: Color.offBlack,
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
  {
    type: TransactionType.MassetPaidFee,
    label: labels[TransactionType.MassetPaidFee],
    color: colors[TransactionType.MassetPaidFee],
  },
];

const nowUnix = getUnixTime(new Date());

const useVolumeMetrics = (): ({ timestamp: number } & Record<
  | TransactionType.MassetMint
  | TransactionType.SavingsContractDeposit
  | TransactionType.SavingsContractWithdraw
  | TransactionType.MassetSwap
  | TransactionType.MassetPaidFee
  | TransactionType.MassetRedeem,
  number
>)[] => {
  const dateFilter = useDateFilter();
  const massetState = useSelectedMassetState();
  const massetAddress = massetState?.address ?? '';

  const blockTimes = useBlockTimesForDates(dateFilter.dates);

  const metricsDoc = useMemo<DocumentNode>(() => {
    const current = `t${nowUnix}: masset(id: "${massetAddress}") { ...VolumeMetricsFields }`;

    const blockMetrics = blockTimes
      .map(
        ({ timestamp, number }) =>
          `t${timestamp}: masset(id: "${massetAddress}", block: { number: ${number} }) { ...VolumeMetricsFields }`,
      )
      .join('\n');

    return gql`
      fragment VolumeMetricsFields on Masset {
        cumulativeMinted {
          simple
        }
        cumulativeSwapped {
          simple
        }
        cumulativeRedeemed {
          simple
        }
        cumulativeRedeemedMasset {
          simple
        }
        cumulativeFeesPaid {
          simple
        }
        savingsContracts {
          cumulativeDeposited {
            simple
          }
          cumulativeWithdrawn {
            simple
          }
        }
      }
      query Metrics @api(name: protocol) {
        ${current}
        ${blockMetrics}
      }
    `;
  }, [blockTimes, massetAddress]);

  const query = useQuery<MetricsQueryResult>(metricsDoc, {
    fetchPolicy: 'no-cache',
  });

  return useMemo(() => {
    const filtered = Object.entries(query.data ?? {})
      .filter(([, value]) => !!value?.cumulativeMinted)
      .map(([key, value]) => [getKeyTimestamp(key), value]) as [
      number,
      MetricsQueryResult[string],
    ][];
    return (
      filtered
        .sort(([a], [b]) => (a > b ? 1 : -1))
        .map(([timestamp, values], index, arr) => {
          const {
            cumulativeMinted,
            cumulativeSwapped,
            cumulativeRedeemed,
            cumulativeRedeemedMasset,
            cumulativeFeesPaid,
            savingsContracts,
          } = values;

          let collectiveDeposited = savingsContracts.reduce(
            (_prev, { cumulativeDeposited }) =>
              _prev + parseFloat(cumulativeDeposited.simple),
            0,
          );
          let collectiveWithdrawn = savingsContracts.reduce(
            (_prev, { cumulativeWithdrawn }) =>
              _prev + parseFloat(cumulativeWithdrawn.simple),
            0,
          );
          let minted = parseFloat(cumulativeMinted.simple);
          let swapped = parseFloat(cumulativeSwapped.simple);
          let redeemed =
            parseFloat(cumulativeRedeemed.simple) +
            parseFloat(cumulativeRedeemedMasset.simple);
          let fees = parseFloat(cumulativeFeesPaid.simple);

          const prev = index > 0 ? arr[index - 1]?.[1] : undefined;
          if (prev) {
            // TODO too repetitive; shouldn't be doing this anyway;
            // the daily values should be on the subgraph
            minted -= parseFloat(prev.cumulativeMinted.simple);
            collectiveDeposited -= prev.savingsContracts.reduce(
              (_prev, { cumulativeDeposited }) =>
                _prev + parseFloat(cumulativeDeposited.simple),
              0,
            );
            collectiveWithdrawn -= prev.savingsContracts.reduce(
              (_prev, { cumulativeWithdrawn }) =>
                _prev + parseFloat(cumulativeWithdrawn.simple),
              0,
            );
            swapped -= parseFloat(prev.cumulativeSwapped.simple);
            redeemed -=
              parseFloat(prev.cumulativeRedeemed.simple) +
              parseFloat(prev.cumulativeRedeemedMasset.simple);
            fees -= parseFloat(prev.cumulativeFeesPaid.simple);
          }

          return {
            timestamp,
            [TransactionType.MassetMint]: minted,
            [TransactionType.SavingsContractDeposit]: collectiveDeposited,
            [TransactionType.SavingsContractWithdraw]: collectiveWithdrawn,
            [TransactionType.MassetSwap]: swapped,
            [TransactionType.MassetRedeem]: redeemed,
            [TransactionType.MassetPaidFee]: fees,
          };
        })
        // FIXME should not be needed
        .slice(1)
    );
  }, [query.data]);
};

const Chart: FC = () => {
  const dateFilter = useDateFilter();
  const data = useVolumeMetrics();
  const { metrics } = useMetricsState();

  return (
    <RechartsContainer>
      {data && data.length ? (
        <ResponsiveContainer aspect={2}>
          <AreaChart
            margin={{ top: 0, right: 16, bottom: 16, left: 16 }}
            barCategoryGap={1}
            data={data}
          >
            <defs>
              {volumeMetrics.map(({ type, color }) => (
                <linearGradient
                  id={type}
                  key={type}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <XAxis
              dataKey="timestamp"
              axisLine={false}
              xAxisId={0}
              tickSize={12}
              padding={{ left: 16 }}
              minTickGap={16}
              tickLine
              tickFormatter={timestamp =>
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
              tickFormatter={toK}
              axisLine={false}
              tickLine
              tickSize={12}
              padding={{ bottom: 16 }}
              interval="preserveEnd"
              minTickGap={8}
              yAxisId={0}
            />
            <YAxis
              type="number"
              hide={
                !metrics.find(
                  m => m.type === TransactionType.MassetPaidFee && m.enabled,
                )
              }
              orientation="right"
              tickFormatter={toK}
              axisLine={false}
              tickLine
              tickSize={12}
              name="Fees"
              padding={{ bottom: 16 }}
              interval="preserveEnd"
              minTickGap={8}
              yAxisId={1}
            />
            <Tooltip
              cursor
              labelFormatter={timestamp =>
                format((timestamp as number) * 1000, 'yyyy-MM-dd HH:mm')
              }
              formatter={toK}
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
            {metrics.map(({ color, type, label, enabled }) => (
              <Area
                isAnimationActive={false}
                key={type}
                type="monotone"
                hide={!enabled}
                dataKey={type}
                name={`${label} `}
                opacity={1}
                dot={false}
                yAxisId={type === TransactionType.MassetPaidFee ? 1 : 0}
                stroke={color}
                strokeWidth={2}
                fill={`url(#${type})`}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <Skeleton height={270} />
      )}
    </RechartsContainer>
  );
};

export const VolumeChart: FC = () => (
  <Metrics metrics={volumeMetrics} defaultDateRange={DateRange.Month}>
    <Chart />
  </Metrics>
);
