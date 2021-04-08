import React, { FC, useMemo } from 'react';
import { format, fromUnixTime } from 'date-fns';
import {
  Area,
  AreaChart,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import styled from 'styled-components';

import { RechartsContainer as RechartsContainerBase } from '../../../stats/RechartsContainer';
import { toK } from '../../../stats/utils';
import { Color, ViewportWidth } from '../../../../theme';
import {
  StreamType,
  useRewardStreams,
} from '../../../../context/RewardStreamsProvider';
import { rewardsColorMapping } from '../constants';

const green = {
  point: 'rgb(82,204,147)',
  fill1: 'rgb(133,231,185)',
  fill2: 'rgba(133,231,185,0.2)',
};

const dataTypes: Record<
  StreamType,
  {
    subTypes?: StreamType[];
    label: string;
  }
> = {
  [StreamType.LockedPreview]: {
    label: 'Locked (new)',
  },
  [StreamType.Locked]: {
    label: 'Locked',
  },
  [StreamType.Unlocked]: {
    label: 'Unlocked',
    ...green,
  },
  [StreamType.Earned]: {
    label: 'Earned',
  },
  [StreamType.Unclaimed]: {
    subTypes: [StreamType.Earned, StreamType.Unlocked],
    label: 'Unclaimed',
  },
};

const timeFormatter = (dateFormat: string) => (timestamp: unknown): string => {
  if (typeof timestamp === 'number' && Number.isFinite(timestamp)) {
    return format(fromUnixTime(timestamp), dateFormat);
  }
  return '';
};

const xAxisFormatter = timeFormatter('dd.MM.yy');
const tooltipFormatter = timeFormatter('yyyy.MM.dd HH:mm');

const ChartContainer = styled(RechartsContainerBase)`
  @media (min-width: ${ViewportWidth.m}) {
    display: flex;
    justify-content: space-between;
  }
`;

type ChartDatum = { t: number; [amount: number]: number | undefined };

interface Chart {
  maxY: number;
  groups: {
    data: ChartDatum[];
    range: [number, number];
    types: StreamType[];
  }[];
}

export const ClaimGraph: FC<{ showPreview?: boolean }> = ({ showPreview }) => {
  const rewardStreams = useRewardStreams();

  const chart = useMemo<Chart>(() => {
    if (!rewardStreams) return { maxY: 0, groups: [] };

    // Filter for selected types
    const filtered = showPreview
      ? rewardStreams.chartData
      : rewardStreams.chartData.filter(
          datum => !datum[StreamType.LockedPreview],
        );

    // Group into ranges
    const ranges = filtered
      .map(({ t }) => t)
      .reduce<[number, number][]>((prev, x, idx) => {
        if (idx === 0) return [[x, x]];

        const last = prev[prev.length - 1];

        // More than 2 months? Too much of a gap, make a new group
        // Otherwise the chart is hard to read
        if (x - last[1] > 5184000) {
          return [...prev, [x, x]];
        }

        return [...prev.slice(0, -1), [last[0], x]];
      }, []);

    // Find the max Y value to use a common scale
    const maxY = filtered.reduce(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (prev, { t, ...datum }) =>
        Math.max(prev, ...(Object.values(datum) as number[])),
      0,
    );

    return {
      maxY,
      groups: ranges
        .map(range => {
          const data = filtered.filter(
            datum => datum.t >= range[0] && datum.t <= range[1],
          );
          const types = Array.from(
            new Set(
              data.reduce<StreamType[]>(
                (prev, datum) => [
                  ...prev,
                  ...Object.entries(datum)
                    .filter(([k, v]) => k !== 't' && v)
                    .map(([k]) => (k as unknown) as StreamType),
                ],
                [],
              ),
            ),
          );
          return {
            range,
            data,
            types,
          };
        })
        .filter(group => group.data.length > 1),
    };
  }, [rewardStreams, showPreview]);

  return rewardStreams ? (
    <ChartContainer key={chart.groups.length}>
      {chart.groups.map(({ data, types, range }) => (
        <ResponsiveContainer maxHeight={200} aspect={3} key={range[0]}>
          <AreaChart
            data={data}
            margin={{ top: 20, left: 0, right: 0, bottom: 0 }}
          >
            <defs>
              {Object.keys(dataTypes).map(streamType => (
                <linearGradient
                  id={`type-${streamType}`}
                  key={streamType}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={
                      rewardsColorMapping[(streamType as unknown) as StreamType]
                        .fill1
                    }
                  />
                  <stop
                    offset="95%"
                    stopColor={
                      rewardsColorMapping[(streamType as unknown) as StreamType]
                        .fill2
                    }
                  />
                </linearGradient>
              ))}
            </defs>
            <Tooltip
              cursor
              labelFormatter={tooltipFormatter}
              formatter={toK as never}
              separator=" "
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
            <XAxis
              scale="time"
              interval="preserveStartEnd"
              domain={[range[0], 'auto']}
              type="number"
              dataKey="t"
              tickFormatter={xAxisFormatter}
              stroke={Color.greyTransparent}
              padding={{ left: 40, right: 80 }}
            />
            <YAxis
              type="number"
              domain={[0, chart.maxY]}
              orientation="left"
              tickFormatter={toK}
              axisLine={false}
              interval={100}
              // interval="preserveEnd"
              tick={false}
            />
            <ReferenceLine
              x={rewardStreams?.currentTime}
              stroke={Color.greyTransparent}
            >
              <Label
                position="insideTopRight"
                value="Unclaimed"
                fontSize={14}
                dx={6}
                dy={-20}
              />
            </ReferenceLine>
            {rewardStreams?.nextUnlock && (
              <ReferenceLine
                x={rewardStreams.nextUnlock}
                stroke={Color.greyTransparent}
              >
                <Label
                  position="insideTopLeft"
                  value="Next unlock"
                  fontSize={14}
                  dy={-20}
                  dx={-6}
                />
              </ReferenceLine>
            )}
            {rewardStreams && showPreview && (
              <ReferenceLine
                x={rewardStreams.previewStream.start}
                stroke={Color.greyTransparent}
              >
                <Label
                  position="insideTopLeft"
                  value="New unlock"
                  fontSize={14}
                />
              </ReferenceLine>
            )}
            {types.flatMap(streamType =>
              (dataTypes[streamType].subTypes ?? [streamType]).map(subType => (
                <Area
                  key={subType}
                  dataKey={subType}
                  name={dataTypes[subType].label}
                  dot={false}
                  strokeWidth={0}
                  stroke={rewardsColorMapping[subType].point}
                  stackId={1}
                  fill={`url(#type-${subType})`}
                  fillOpacity={1}
                />
              )),
            )}
          </AreaChart>
        </ResponsiveContainer>
      ))}
    </ChartContainer>
  ) : null;
};
