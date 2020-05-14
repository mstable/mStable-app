import { useMemo, createElement, DOMElement, useEffect, useState } from 'react';
import blockies from 'ethereum-blockies';
import { useMutex } from 'react-context-mutex';
import useInterval from '@use-it/interval';
import { BigNumber, formatUnits, parseUnits } from 'ethers/utils';
import { Amount, MassetNames } from '../types';
import {
  ExchangeRate,
  TokenDetailsFragment,
  useCoreTokensQuery,
  useCreditBalancesSubscription,
  useLastExchangeRateBeforeTimestampQuery,
  useLatestExchangeRateSubscription,
} from '../graphql/generated';
import { truncateAddress } from './strings';
import { theme } from '../theme';
import { SCALE } from './constants';

type RateTimestamp = Pick<ExchangeRate, 'exchangeRate' | 'timestamp'>;

export const useMassetToken = (
  massetName: MassetNames,
): TokenDetailsFragment | null => {
  const { data } = useCoreTokensQuery();
  return data?.[massetName]?.[0] || null;
};

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

export const useSavingsBalance = (account: string | null): Amount => {
  const latestSub = useLatestExchangeRateSubscription();
  const creditBalancesSub = useCreditBalancesSubscription({
    variables: { account: account ? account.toLowerCase() : '' },
    skip: !account,
  });

  const creditBalance =
    creditBalancesSub.data?.account?.creditBalances[0]?.amount;
  const latest = latestSub.data?.exchangeRates[0];

  return useMemo(() => {
    if (latest && creditBalance) {
      const rate = parseUnits(latest.exchangeRate);
      const balance = parseUnits(creditBalance);

      const exact = balance.mul(rate).div(SCALE);
      const simple = parseFloat(
        parseFloat(formatUnits(exact, 18))
          .toFixed(10)
          .toString(),
      );

      return { exact, simple };
    }

    return { exact: null, simple: null };
  }, [creditBalance, latest]);
};

export const useIncreasingNumber = (
  value: number | null,
  increment: number,
  interval: number,
): number | null => {
  const [valueInc, setValueInc] = useState<typeof value>(null);

  useEffect(() => {
    if (value) setValueInc(value);
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

  const portionOfYear = timeDiff.mul(SCALE).div(YEAR);

  return rateDiff.mul(SCALE).div(portionOfYear);
};

export const useApy = (): BigNumber | null => {
  const latestSub = useLatestExchangeRateSubscription();
  const latest = latestSub.data?.exchangeRates[0];
  const timestamp = latest?.timestamp;

  const previousQuery = useLastExchangeRateBeforeTimestampQuery({
    variables: { timestamp: (timestamp as number) - 24 * 60 * 60 },
    skip: !timestamp,
  });
  const previous = previousQuery.data?.exchangeRates[0];

  return latest && previous && latest.timestamp > previous.timestamp
    ? calculateApy(previous, latest)
    : null;
};
