import { useMemo, createElement, DOMElement, useEffect } from 'react';
import blockies from 'ethereum-blockies';
import { useMutex } from 'react-context-mutex';
import { MassetNames, TokenQuantity } from '../types';
import {
  TokenDetailsFragment,
  useCoreTokensQuery,
  useCreditBalancesSubscription,
  useExchangeRatesRangeSubscription,
  useLatestExchangeRateQuery,
} from '../graphql/generated';
import { truncateAddress } from './strings';
import { theme } from '../theme';
import { BigNumber, formatUnits, parseUnits } from 'ethers/utils';
import { PERCENT_SCALE } from './constants';

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

export const useSavingsBalance = (
  account: string | null,
): Omit<TokenQuantity, 'formValue'> => {
  const latestExchangeRate = useLatestExchangeRateQuery();

  const creditBalances = useCreditBalancesSubscription({
    variables: { account: account ? account.toLowerCase() : '' },
    skip: !account,
  });

  const creditBalanceDecimal =
    creditBalances.data?.account?.creditBalances[0]?.amount || '0.00';

  return useMemo(() => {
    const token = { decimals: 18, address: null, symbol: null };
    const rate = latestExchangeRate.data?.exchangeRates[0];

    if (rate && creditBalanceDecimal) {
      const exchangeRate = parseUnits(rate.exchangeRate, 18);
      const creditBalance = parseUnits(creditBalanceDecimal, token.decimals);

      const exact = creditBalance.mul(exchangeRate).div(PERCENT_SCALE);
      const simple = parseFloat(formatUnits(exact, token.decimals));

      return { amount: { exact, simple }, token };
    }

    return { amount: { simple: null, exact: null }, token };
  }, [creditBalanceDecimal, latestExchangeRate]);
};

export const useAPY = (start: number, end: number): BigNumber => {
  // Get the exchange rates over the last 24 hours
  const rates = useExchangeRatesRangeSubscription({
    variables: { start, end },
  });

  // Get mean average rate
  const exchangeRates = rates.data?.exchangeRates || [];
  const averageRate =
    exchangeRates.length > 0
      ? exchangeRates
          .reduce(
            (_averageRate, { exchangeRate }) =>
              _averageRate.add(parseUnits(exchangeRate, 18)),
            new BigNumber(0),
          )
          .div(exchangeRates.length)
      : new BigNumber(0);

  // APY = (1 + r/n)n – 1
  // where:
  //   r - the interest rate
  //   n - the number of times the interest is compounded per year
  return new BigNumber(1)
    .add(averageRate.div(365))
    .mul(365)
    .sub(1)
};
