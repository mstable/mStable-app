import { useState } from 'react';
import { useEffectOnce } from 'react-use';

import { fetchCoingeckoPrices } from '../utils/fetchCoingeckoPrices';
import { ADDRESSES_BY_NETWORK } from '../constants';

const { MTA, WBTC } = ADDRESSES_BY_NETWORK[1];

const usePrices = (tokens: string[]): number[] | undefined => {
  const [prices, setPrices] = useState<number[]>();

  useEffectOnce(() => {
    if (!tokens.length) return;
    fetchCoingeckoPrices(tokens).then(result => {
      const _prices = result && tokens.map(address => result?.[address]?.usd);
      if (_prices.length) {
        setPrices(_prices);
      }
    });
  });

  return prices;
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
