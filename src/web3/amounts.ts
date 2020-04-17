import { BigNumber, commify, parseUnits, formatUnits } from 'ethers/utils';
import { padLeft } from 'web3-utils';
import { TokenQuantity } from '../types';

export const formatSimpleAmount = (
  simpleAmount: string | null,
  symbol?: string | null,
): string | null => {
  if (simpleAmount) {
    // Use two padded decimal places
    const [intAmount, decimals] = simpleAmount.split('.');
    return `${commify(
      `${intAmount}.${padLeft((decimals || '0').slice(0, 2), 2)}`,
    )}${symbol ? ` ${symbol}` : ''}`;
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
