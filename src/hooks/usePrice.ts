import { useEffectOnce } from 'react-use';

import { fetchCoingeckoPrices } from '../utils/fetchCoingeckoPrices';
import { ADDRESSES_BY_NETWORK } from '../constants';
import { useMemo, useState } from 'react';

const { MTA, WBTC } = ADDRESSES_BY_NETWORK[1];

interface PricesMap {
  [address: string]: number;
}

// Quick and dirty, not a good pattern
let priceCache: PricesMap = {};

const usePrices = (tokens: string[]): number[] | undefined => {
  const [priceMap, setPriceMap] = useState<PricesMap>(priceCache);

  useEffectOnce(() => {
    if (!tokens.length) return;

    const missing = tokens.filter(token => !priceMap[token]);

    if (missing.length) {
      fetchCoingeckoPrices(missing).then(result => {
        const fetchedPrices = missing
          .map(token => [token, result?.[token]?.usd])
          .filter(([, price]) => price) as [string, number][];

        const updatedPrices = fetchedPrices.reduce(
          (prev, [token, price]) => ({ ...prev, [token]: price }),
          priceMap,
        );

        priceCache = { ...priceCache, ...updatedPrices };

        setPriceMap(updatedPrices);
      });
    }
  });

  return useMemo(() => {
    const prices = tokens.map(token => priceMap[token] ?? priceCache[token]);
    // All or nothing
    return prices.length === tokens.length ? prices : undefined;
  }, [tokens, priceMap]);
};

export const useSavePrices = (): number[] | undefined => {
  return usePrices([MTA, WBTC]);
};

export const useWBTCPrice = (): number | undefined => {
  return usePrices([WBTC])?.[0];
};

export const useMtaPrice = (): number | undefined => {
  return usePrices([MTA])?.[0];
};
