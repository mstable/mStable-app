import { commify, parseUnits } from 'ethers/utils';
import { TokenQuantity } from '../types';

export const parseAmounts = ({
  amount: { simple },
  token: { decimals, symbol },
  amount,
  token,
}: TokenQuantity): TokenQuantity => ({
  amount: {
    ...amount,
    exact: (() => {
      if (!(simple && decimals)) return null;

      try {
        return parseUnits(simple, decimals);
      } catch {
        return null;
      }
    })(),
    formatted: simple && symbol ? `${commify(simple)} ${symbol}` : null,
  },
  token,
});
