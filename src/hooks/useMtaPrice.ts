import { useState } from 'react';
import { useEffectOnce } from 'react-use';

import { fetchCoingeckoPrices } from '../utils/fetchCoingeckoPrices';
import { ADDRESSES_BY_NETWORK } from '../constants';

export const useMtaPrice = (): number | undefined => {
  const [mtaPrice, setMtaPrice] = useState<number>();

  useEffectOnce(() => {
    fetchCoingeckoPrices([ADDRESSES_BY_NETWORK[1].MTA]).then(result => {
      const price = result?.[ADDRESSES_BY_NETWORK[1].MTA]?.usd;
      if (price) {
        setMtaPrice(price);
      }
    });
  });

  return mtaPrice;
};
