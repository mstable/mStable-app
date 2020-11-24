import { subDays, getUnixTime, endOfDay, eachDayOfInterval } from 'date-fns';
import { useMemo, useEffect, useState } from 'react';
import { useMutex } from 'react-context-mutex';
import useInterval from '@use-it/interval';
import { BigNumber, parseUnits } from 'ethers/utils';
import { BigNumber as FractionalBigNumber } from 'bignumber.js';
import { useQuery, gql, DocumentNode } from '@apollo/client';
import { truncateAddress } from './strings';
import { SCALE } from './constants';
import { parseExactAmount, parseAmount } from './amounts';
import { ExchangeRate } from '../graphql/protocol';

interface ApyResults {
  __typename: string;
  dailyAPY: string;
}

interface TransformedData {
  timestamp: string;
  apyResults: ApyResults;
}

export const useTruncatedAddress = (address?: string | null): string | null =>
  useMemo(() => (address ? truncateAddress(address) : null), [address]);

type BlocksData = {
  [timestamp: string]: [{ number: number }];
};

type RateTimestamp = Pick<ExchangeRate, 'rate' | 'timestamp'>;

export const getBlockTimestampsDocument = (dates: Date[]): DocumentNode => {
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

export const getApysDocument = (data?: BlocksData): DocumentNode => {
  const current = `t${getUnixTime(Date.now())}: savingsContract(
            id: "0xcf3f73290803fc04425bee135a4caeb2bab2c2a1"
          ) {
            dailyAPY
          }`;

  if (!data) {
    return gql`
        query DailyApys @api(name: protocol) {
          ${current}
        }
      `;
  }

  return gql`query DailyApys @api(name: protocol) {
        ${current}
        ${Object.keys(data ?? {})
          .filter(key => {
            return !!data[key]?.[0]?.number;
          })
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

/**
 * Given a unique key and a promise, run the promise within a mutex
 * (via `react-context-mutex`) and unlock the mutex when the promise
 * resolves or rejects.
 *
 * @param mutexKey Unique key to lock the mutex
 * @param callback Async callback to await when the mutex is run
 */
export const useAsyncMutex = (
  mutexKey: string,
  callback: () => Promise<void>,
): void => {
  const MutexRunner = useMutex();

  useEffect(() => {
    const mutex = new MutexRunner(mutexKey);

    mutex.run(async () => {
      mutex.lock();
      try {
        await callback();
        mutex.unlock();
      } catch (error) {
        mutex.unlock();
        throw error;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mutexKey]);
};

// NB: Without milliseconds
const YEAR_SIMPLE = 365 * 24 * 60 * 60;
const YEAR_BN = parseUnits(YEAR_SIMPLE.toString());

export const calculateApy = (
  start: RateTimestamp,
  end: RateTimestamp,
): BigNumber => {
  const startRate = parseUnits(start.rate);
  const endRate = parseUnits(end.rate);

  const rateDiff = endRate
    .mul(SCALE)
    .div(startRate)
    .sub(SCALE);

  const timeDiff = parseUnits((end.timestamp - start.timestamp).toString());

  // new calc: (1+0.001)^365-1
  const portionOfYear = timeDiff.mul(SCALE).div(YEAR_BN);
  const portionsInYear = SCALE.div(portionOfYear);
  const rateDecimals = parseExactAmount(SCALE.add(rateDiff), 18);
  if (rateDecimals.simple) {
    const x = new FractionalBigNumber(rateDecimals.simple.toString());
    const diff = x
      .pow(new FractionalBigNumber(portionsInYear.toString()))
      .decimalPlaces(10);
    const parsed = parseAmount(diff.toString(), 18);
    return parsed.exact?.sub(SCALE) || new BigNumber(0);
  }
  return new BigNumber(0);
};

export const useIncreasingNumber = (
  value: number | null,
  increment: number,
  interval: number,
): number | null => {
  const [valueInc, setValueInc] = useState<typeof value>(null);

  useEffect(() => {
    setValueInc(value || 0);
  }, [value, setValueInc]);

  useInterval(() => {
    if (valueInc && value && value > 0.001) setValueInc(valueInc + increment);
  }, interval);

  return valueInc;
};

export const useDailApysForGivenTimestamps = (
  dates: Date[],
): TransformedData[] => {
  const blocksDoc = getBlockTimestampsDocument(dates);
  const queryResult = useQuery(blocksDoc);
  const apysDoc = useMemo(() => getApysDocument(queryResult.data), [
    queryResult.data,
  ]);
  const apysQuery = useQuery(apysDoc as DocumentNode);

  const transformedData =
    apysQuery.data &&
    Object.entries(apysQuery.data).map(([key, value]) => {
      const [, timestamp] = key.split('t');
      return {
        timestamp,
        apyResults: value as ApyResults,
      };
    });
  return transformedData;
};

const now = new Date();
export const timestampsForWeek = eachDayOfInterval({
  start: subDays(now, 6),
  end: subDays(now, 1),
})
  .map(endOfDay)
  .concat(now);

export const useAverageApyForPastWeek = (): number | undefined => {
  const dailyApys = useDailApysForGivenTimestamps(timestampsForWeek);
  return useMemo(() => {
    const filtered =
      dailyApys &&
      dailyApys
        .map(a =>
          // Cap numbers at 100
          a.apyResults.dailyAPY ? a.apyResults.dailyAPY : undefined,
        )
        .filter(Boolean);
    if (filtered && filtered.length < 2) {
      // Not enough data to sample an average
      return undefined;
    }

    return (
      filtered &&
      filtered.reduce(
        (_average, apy) => _average + parseInt(apy as string, 10),
        0,
      ) / filtered.length
    );
  }, [dailyApys]);
};

export const timestampsForMonth = eachDayOfInterval({
  start: subDays(now, 29),
  end: subDays(now, 1),
})
  .map(endOfDay)
  .concat(now);

export const useAverageApyForPastMonth = (): number | undefined => {
  const dailyApys = useDailApysForGivenTimestamps(timestampsForMonth);
  return useMemo(() => {
    const filtered =
      dailyApys &&
      dailyApys
        .map(a =>
          // Cap numbers at 100
          a.apyResults.dailyAPY ? a.apyResults.dailyAPY : undefined,
        )
        .filter(Boolean);
    if (filtered && filtered.length < 2) {
      // Not enough data to sample an average
      return undefined;
    }

    return (
      filtered &&
      filtered.reduce(
        (_average, apy) => _average + parseInt(apy as string, 10),
        0,
      ) / filtered.length
    );
  }, [dailyApys]);
};

export const annualiseSimple = (
  value: number,
  startSeconds: number,
  endSeconds = Math.floor(Date.now() / 1e3),
): number => {
  if (value <= 0) {
    return 0;
  }

  const timeDiff = endSeconds - startSeconds;
  const portionOfYear = timeDiff / YEAR_SIMPLE;
  return value / portionOfYear;
};

export const calculateGasMargin = (value: BigNumber): BigNumber => {
  const GAS_MARGIN = new BigNumber(1000);
  const offset = value.mul(GAS_MARGIN).div(new BigNumber(10000));
  return value.add(offset);
};
