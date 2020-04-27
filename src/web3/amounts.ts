import { BigNumber, commify, parseUnits, formatUnits } from 'ethers/utils';
import { Amount } from '../types';

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

export const parseAmount = (
  input: string | null,
  decimals: number | null,
): Amount => {
  if (!(input && decimals)) {
    return { exact: null, simple: null };
  }

  const exact = parseUnits(input.slice(0, decimals), decimals);
  const simple = parseFloat(formatUnits(exact, decimals));
  return {
    exact,
    simple,
  };
};
