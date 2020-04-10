import { BigNumber, commify, parseUnits, formatUnits } from 'ethers/utils';
import { TokenQuantity } from '../types';

export const formatSimpleAmount = (
  simpleAmount: string | null,
  symbol?: string | null,
): string | null =>
  simpleAmount ? `${commify(simpleAmount)}${symbol ? ` ${symbol}` : ''}` : null;

export const formatExactAmount = (
  exactAmount?: BigNumber,
  decimals?: number,
  symbol?: string,
): string | null =>
  exactAmount && decimals && symbol
    ? formatSimpleAmount(formatUnits(exactAmount, decimals), symbol)
    : null;

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
    formatted: formatSimpleAmount(simple, symbol),
  },
  token,
});
