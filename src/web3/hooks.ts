import { subDays, getUnixTime, endOfDay } from 'date-fns';
import { useMemo, useEffect, useState } from 'react';
import { useMutex } from 'react-context-mutex';
import useInterval from '@use-it/interval';
import { BigNumber, parseUnits } from 'ethers/utils';
import { BigNumber as FractionalBigNumber } from 'bignumber.js';

import {
  ExchangeRate,
  useLastExchangeRateBeforeTimestampQuery,
  useWeeklyExchangeRatesQuery,
  WeeklyExchangeRatesQueryVariables,
} from '../graphql/mstable';
import { useLatestExchangeRate } from '../context/DataProvider/DataProvider';
import { truncateAddress } from './strings';
import { SCALE } from './constants';
import { parseExactAmount, parseAmount } from './amounts';

interface Apy {
  value?: BigNumber;
  start?: number;
  end?: number;
}

type DailyApysForWeek = [Apy, Apy, Apy, Apy, Apy, Apy, Apy];

type RateTimestamp = Pick<ExchangeRate, 'exchangeRate' | 'timestamp'>;

export const useTruncatedAddress = (address?: string | null): string | null =>
  useMemo(() => (address ? truncateAddress(address) : null), [address]);

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

// NB: Without milliseconds
const YEAR_SIMPLE = 365 * 24 * 60 * 60;
const YEAR_BN = parseUnits(YEAR_SIMPLE.toString());

export const calculateApy = (
  start: RateTimestamp,
  end: RateTimestamp,
): BigNumber => {
  const startRate = parseUnits(start.exchangeRate);
  const endRate = parseUnits(end.exchangeRate);

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

const useLastExchangeRateBeforeTimestamp = (
  timestamp?: number,
): Pick<ExchangeRate, 'timestamp' | 'exchangeRate'> | undefined => {
  const previousQuery = useLastExchangeRateBeforeTimestampQuery({
    variables: { timestamp: timestamp as number },
    skip: !timestamp,
    fetchPolicy: 'cache-and-network',
  });
  return previousQuery.data?.exchangeRates[0];
};

export const useApyForPast24h = (): BigNumber | undefined => {
  const latest = useLatestExchangeRate();
  const timestamp = latest?.timestamp;

  const before = useLastExchangeRateBeforeTimestamp(
    timestamp ? timestamp - 24 * 60 * 60 : undefined,
  );

  return latest && before && latest.timestamp > before.timestamp
    ? calculateApy(before, {
        // Normalize the type to RateTimestamp
        timestamp: latest.timestamp,
        exchangeRate: latest.exchangeRate.string,
      })
    : undefined;
};

const DAYS_OF_WEEK = [0, 1, 2, 3, 4, 5, 6];

export const useDailyApysForPastWeek = (start: number): DailyApysForWeek => {
  const latest = useLatestExchangeRate();

  const variables = useMemo<
    WeeklyExchangeRatesQueryVariables | undefined
  >(() => {
    return DAYS_OF_WEEK.reduce(
      (_variables, index) => ({
        ..._variables,
        [`day${index}`]: start + index * 24 * 60 * 60,
      }),
      {} as WeeklyExchangeRatesQueryVariables,
    );
  }, [start]);

  const query = useWeeklyExchangeRatesQuery({
    variables,
    skip: !variables,
    fetchPolicy: 'cache-and-network',
  });

  return useMemo<DailyApysForWeek>(
    () =>
      DAYS_OF_WEEK.map<Apy>(index => {
        if (!query.data) return {};

        const { [`day${index}` as 'day0']: [startRate] = [] } = query.data;

        // For the last day of the week, use the latest APY as the end rate;
        // otherwise, use the next day's start APY
        const endRate =
          index === 6 && latest
            ? {
                // Normalize the type to RateTimestamp
                timestamp: latest.timestamp,
                exchangeRate: latest.exchangeRate.string,
              }
            : query.data[`day${index + 1}` as 'day0']?.[0];

        const value =
          startRate && endRate && endRate.timestamp > startRate.timestamp
            ? calculateApy(startRate, endRate)
            : undefined;

        const apy: Apy = {
          value,
          start: startRate?.timestamp,
          end: endRate?.timestamp,
        };
        return apy;
      }) as DailyApysForWeek,
    [query, latest],
  );
};

export const useAverageApyForPastWeek = (): BigNumber | undefined => {
  const now = new Date();
  const dailyApys = useDailyApysForPastWeek(
    getUnixTime(endOfDay(subDays(now, 7))),
  );

  return useMemo(() => {
    const filtered = dailyApys
      .map(a =>
        // Cap numbers at 100
        a.value ? a.value : undefined,
      )
      .filter(Boolean) as BigNumber[];

    if (filtered.length < 2) {
      // Not enough data to sample an average
      return undefined;
    }

    return filtered
      .reduce((_average, apy) => _average.add(apy), new BigNumber(0))
      .div(filtered.length);
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
