import { BigNumber, parseUnits, formatUnits } from 'ethers/utils';
import { Amount } from '../types';

export const formatSimpleAmount = (
  simpleAmount: number | null,
  symbol?: string | null,
): string | null => {
  if (typeof simpleAmount === 'number') {
    // Use two padded decimal places
    const [intAmount, decimals = ''] = simpleAmount.toString().split('.');
    const paddedDecimals = decimals.slice(0, 2).padEnd(2, '0');
    return `${intAmount}.${paddedDecimals}${symbol ? ` ${symbol}` : ''}`;
  }
  return null;
};

export const formatExactAmount = (
  exactAmount?: BigNumber,
  decimals?: number,
  symbol?: string,
): string | null =>
  exactAmount && decimals
    ? formatSimpleAmount(parseFloat(formatUnits(exactAmount, decimals)), symbol)
    : null;

export const parseAmount = (
  simpleAmount: string | null,
  decimals: number | null,
): Amount => {
  if (!(simpleAmount && decimals)) {
    return { exact: null, simple: null };
  }

  const exact = parseUnits(simpleAmount.slice(0, decimals), decimals);
  const simple = parseFloat(formatUnits(exact, decimals));
  return {
    exact,
    simple,
  };
};
