import { BigNumber, commify, parseUnits, formatUnits } from 'ethers/utils';
import { TokenQuantity } from '../types';

export const formatSimpleAmount = (
  simpleAmount: string | null,
  symbol?: string | null,
): string | null => {
  if (simpleAmount) {
    // Use two padded decimal places
    const [intAmount, decimals = ''] = simpleAmount.split('.');
    const paddedDecimals = decimals.slice(0, 2).padEnd(2, '0');
    return `${commify(`${intAmount}.${paddedDecimals}`)}${
      symbol ? ` ${symbol}` : ''
    }`;
  }
  return null;
};

export const formatExactAmount = (
  exactAmount?: BigNumber,
  decimals?: number,
  symbol?: string,
): string | null =>
  exactAmount && decimals
    ? formatSimpleAmount(formatUnits(exactAmount, decimals), symbol)
    : null;

export const parseSimpleAmount = (
  simple: string | null,
  decimals?: number | null,
): BigNumber | null => {
  if (!(simple && decimals)) return null;

  try {
    return parseUnits(simple.slice(0, decimals), decimals);
  } catch {
    return null;
  }
};

export const parseAmounts = ({
  amount: { simple },
  token: { decimals, symbol },
  amount,
  token,
}: TokenQuantity): TokenQuantity => ({
  amount: {
    ...amount,
    exact: parseSimpleAmount(simple, decimals),
    formatted: formatSimpleAmount(simple, symbol),
  },
  token,
});
