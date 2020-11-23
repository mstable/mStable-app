/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useMemo } from 'react';
import { BigNumber, formatUnits } from 'ethers/utils';
import { VictoryLabel } from 'victory-core';
import { VictoryLine } from 'victory-line';
import { VictoryChart } from 'victory-chart';
import { VictoryAxis } from 'victory-axis';
import Skeleton from 'react-loading-skeleton';
import {
  endOfDay,
  fromUnixTime,
  subDays,
  startOfDay,
  getUnixTime,
  eachDayOfInterval,
  eachHourOfInterval,
} from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useQuery, gql, DocumentNode } from '@apollo/client';
import { useDailyApysForPastWeek } from '../../web3/hooks';
import { Color } from '../../theme';
import { useVictoryTheme } from '../../context/ThemeProvider';
import {
  abbreviateNumber,
  percentageFormat,
  useDateFilterTickValues,
  useDateFilterTickFormat,
} from './utils';
import { TimeMetricPeriod } from '../../graphql/legacy';
import { DateRange } from './Metrics';
import { useGetCurrentAPY } from '../../context/DataProvider/DataProvider';

type BlocksData = {
  [timestamp: string]: [{ number: number }];
};

interface ApyResults {
  __typename: string;
  dailyAPY: string;
}

const getBlockTimestampsDocument = (dates: Date[]): DocumentNode => {
  return gql`query BlockTimestamps @api(name: blocks) {
      ${dates
        .map(getUnixTime)
        .map(
          ts =>
            `t${ts}: blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: {timestamp_gt: ${ts}, timestamp_lt: ${ts +
              60000} }) { number }`,
        )
        .join('\n')}
  }`;
};

const getApysDocument = (data?: BlocksData): DocumentNode => {
  if (!data) {
    return gql`
      query DailyApys @api(name: protocol) {
        current: savingsContract(
          id: "0xcf3f73290803fc04425bee135a4caeb2bab2c2a1"
        ) {
          dailyAPY
        }
      }
    `;
  }
  return gql`query DailyApys @api(name: protocol) {
          ${Object.keys(data ?? {})
            .map(
              key => `
                ${key}: savingsContract(id: "0xcf3f73290803fc04425bee135a4caeb2bab2c2a1", block:{number: ${
                (data as BlocksData)[key][0].number
              }}) {
                  dailyAPY
                } 

        `,
            )
            .join('\n')}
      }
  `;
};

const now = new Date();
const from = endOfDay(subDays(now, 7));
const dateFilter = {
  dateRange: DateRange.Week,
  period: TimeMetricPeriod.Day,
  label: '7 day',
  from,
  end: endOfDay(subDays(now, 1)),
};

const nowUtc = new Date(now.toUTCString().slice(0, -4));

const timestamps = eachDayOfInterval({
  start: subDays(now, 7),
  end: subDays(now, 1),
});

const transformedTimestamps = timestamps.map(timestamp => {
  return endOfDay(timestamp);
});

export const DailyApys: FC<{}> = () => {
  const dailyApys = useDailyApysForPastWeek(getUnixTime(from));
  const currentAPY = useGetCurrentAPY();
  const blocksDoc = getBlockTimestampsDocument(transformedTimestamps);
  const queryResult = useQuery(blocksDoc);
  const apysDoc = useMemo(() => getApysDocument(queryResult.data), [
    queryResult.data,
  ]);
  const apysQuery = useQuery(apysDoc as DocumentNode, {
    skip: !queryResult.data,
  });

  const transformedData =
    apysQuery.data &&
    Object.entries(apysQuery.data).map(([key, value]) => {
      const [, timestamp] = key.split('t');
      return {
        timestamp,
        apyResults: value as ApyResults,
      };
    });

  const tickValues = useDateFilterTickValues(dateFilter);
  const tickFormat = useDateFilterTickFormat(dateFilter);
  const victoryTheme = useVictoryTheme();
  const data = useMemo<{ x: Date; y: number }[]>(
    () =>
      transformedData &&
      transformedData
        .filter(a => a.timestamp && a.apyResults)
        .map(({ timestamp, apyResults }) => {
          const percentage = parseFloat(apyResults.dailyAPY);
          const startTime = fromUnixTime(parseInt(timestamp, 10));
          return {
            x: startOfDay(startTime),
            y: percentage,
            percentage,
          };
        }),

    [transformedData],
  );
  return (
    <div>
      {data && data.length ? (
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
