import { subDays, getUnixTime, endOfDay, eachDayOfInterval } from 'date-fns';
import { useMemo } from 'react';
import { BigNumber } from 'ethers/utils';
import { useQuery, gql, DocumentNode } from '@apollo/client';

import { truncateAddress } from './strings';

interface BlockTime {
  timestamp: number;
  number: number;
}

export const useTruncatedAddress = (address?: string | null): string | null =>
  useMemo(() => (address ? truncateAddress(address) : null), [address]);

export const useBlockTimestampsDocument = (dates: Date[]): DocumentNode =>
  useMemo(
    () => gql`query BlockTimestamps @api(name: blocks) {
    ${dates
      .map(getUnixTime)
      .map(
        ts =>
          `t${ts}: blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: {timestamp_gt: ${ts}, timestamp_lt: ${ts +
            60000} }) { number }`,
      )
      .join('\n')}
}`,
    [dates],
  );

export const getKeyTimestamp = (key: string): number => {
  const [, splitKey] = key.split('t');
  return parseInt(splitKey, 10);
};

export const useBlockTimesForDates = (dates: Date[]): BlockTime[] => {
  const blocksDoc = useBlockTimestampsDocument(dates);

  const query = useQuery<{
    [timestamp: string]: [] | [{ number: number }];
  }>(blocksDoc, { fetchPolicy: 'cache-first' });

  return useMemo(() => {
    const filtered = Object.entries(query.data ?? {}).filter(
      ([, value]) => !!value[0]?.number,
    ) as [string, [{ number: number }]][];

    return filtered
      .map(([key, [{ number }]]) => ({
        timestamp: getKeyTimestamp(key),
        number,
      }))
      .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
  }, [query.data]);
};

const nowUnix = getUnixTime(Date.now());

export const useDailyApysDocument = (blockTimes: BlockTime[]): DocumentNode =>
  useMemo(() => {
    const id = process.env.REACT_APP_MUSD_SAVINGS_ADDRESS;
    const currentApy = `t${nowUnix}: savingsContract(id: "${id}") { ...F }`;
    const blockApys = blockTimes
      .map(
        ({ timestamp, number }) => `
              t${timestamp}: savingsContract(id: "${id}", block: { number: ${number} }) {
                ...F
              }`,
      )
      .join('\n');

    return gql`
      fragment F on SavingsContract {
        dailyAPY
        utilisationRate {
          simple
        }
      }
      query DailyApys @api(name: protocol) {
        ${currentApy}
        ${blockApys}
      }
    `;
  }, [blockTimes]);

export const useDailyApysForBlockTimes = (
  blockTimes: BlockTime[],
): { timestamp: number; dailyAPY: number; utilisationRate: number }[] => {
  const apysDoc = useDailyApysDocument(blockTimes);

  const apysQuery = useQuery<{
    [timestamp: string]: {
      dailyAPY: string;
      utilisationRate: { simple: string };
    };
  }>(apysDoc, { fetchPolicy: 'cache-first', nextFetchPolicy: 'cache-only' });

  return Object.entries(apysQuery.data || {})
    .filter(([, value]) => !!value?.dailyAPY)
    .map(([key, { dailyAPY, utilisationRate }]) => ({
      timestamp: getKeyTimestamp(key),
      dailyAPY: parseFloat(parseFloat(dailyAPY).toFixed(2)),
      utilisationRate: parseFloat(
        parseFloat(utilisationRate.simple).toFixed(2),
      ),
    }))
    .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
};

const now = new Date();
export const timestampsForWeek = eachDayOfInterval({
  start: subDays(now, 6),
  end: subDays(now, 1),
})
  .map(endOfDay)
  .concat(now);

export const useAverageApyForPastWeek = (): number | undefined => {
  const blockTimes = useBlockTimesForDates(timestampsForWeek);
  const dailyApys = useDailyApysForBlockTimes(blockTimes);
  return useMemo(() => {
    if (dailyApys.length < 2) {
      // Not enough data to sample an average
      return undefined;
    }

    return (
      dailyApys.reduce((prev, { dailyAPY }) => prev + dailyAPY, 0) /
      dailyApys.length
    );
  }, [dailyApys]);
};

export const calculateGasMargin = (value: BigNumber): BigNumber => {
  const GAS_MARGIN = new BigNumber(1000);
  const offset = value.mul(GAS_MARGIN).div(new BigNumber(10000));
  return value.add(offset);
};
