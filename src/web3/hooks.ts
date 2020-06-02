import { useMemo, createElement, DOMElement, useEffect, useState } from 'react';
import blockies from 'ethereum-blockies';
import { useMutex } from 'react-context-mutex';
import useInterval from '@use-it/interval';
import { BigNumber, parseUnits } from 'ethers/utils';
import { BigNumber as FractionalBigNumber } from 'bignumber.js';

import {
  ExchangeRate,
  useLastExchangeRateBeforeTimestampQuery,
} from '../graphql/generated';
import { useLatestExchangeRate } from '../context/DataProvider/DataProvider';
import { truncateAddress } from './strings';
import { theme } from '../theme';
import { SCALE } from './constants';
import { parseExactAmount, parseAmount } from './amounts';

type RateTimestamp = Pick<ExchangeRate, 'exchangeRate' | 'timestamp'>;

export const useTruncatedAddress = (address: string | null): string | null =>
  useMemo(() => (address ? truncateAddress(address) : null), [address]);

export const useBlockie = (
  address: string | null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): DOMElement<any, any> | null =>
  useMemo(() => {
    if (!address) return null;
    return createElement('canvas', {
      ref: (canvas: HTMLCanvasElement) => {
        if (canvas) {
          blockies.render(
            {
              seed: address,
              color: theme.color.green,
              bgcolor: theme.color.blue,
              size: 8,
              scale: 4,
              spotcolor: theme.color.gold,
            },
            canvas,
          );
        }
      },
    });
  }, [address]);

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
    if (valueInc) setValueInc(valueInc + increment);
  }, interval);

  return valueInc;
};

// NB: Without milliseconds
const YEAR = parseUnits((365 * 24 * 60 * 60).toString());

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
  const portionOfYear = timeDiff.mul(SCALE).div(YEAR);
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

export const useApy = (): BigNumber | null => {
  const latest = useLatestExchangeRate();
  const timestamp = latest?.timestamp;

  const previousQuery = useLastExchangeRateBeforeTimestampQuery({
    variables: { timestamp: (timestamp as number) - 24 * 60 * 60 },
    skip: !timestamp,
    fetchPolicy: 'cache-and-network',
  });
  const previous = previousQuery.data?.exchangeRates[0];

  return latest && previous && latest.timestamp > previous.timestamp
    ? calculateApy(previous, latest)
    : null;
};
