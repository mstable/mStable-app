import { BigNumber, utils } from 'ethers';
import { Amount } from '../types';

const { parseUnits, formatUnits } = utils;

/**
 * @deprecated
 */
export const formatSimpleAmount = (
  simpleAmount: number | null,
  symbol?: string | null,
  decimalPlaces?: number,
): string | null => {
  if (typeof simpleAmount === 'number') {
    // Use two padded decimal places
    const [intAmount, decimals = ''] = simpleAmount.toString().split('.');
    const paddedDecimals = decimals
      .slice(0, decimalPlaces || 2)
      .padEnd(decimalPlaces || 2, '0');
    return `${intAmount}.${paddedDecimals}${symbol ? ` ${symbol}` : ''}`;
  }
  return null;
};

/**
 * @deprecated
 */
export const formatExactAmount = (
  exactAmount?: BigNumber | string,
  decimals?: number,
  symbol?: string,
  commas = false,
  decimalPlaces?: number,
): string | null => {
  if (exactAmount && decimals) {
    const parsedFloat = parseFloat(formatUnits(exactAmount, decimals));
    const min = 0.000001; // This is the min amount that is parsable by 'parseFloat'
    const clamped = parsedFloat > min ? parsedFloat : 0;
    const format = formatSimpleAmount(clamped, symbol, decimalPlaces);
    return commas
      ? format?.replace(/\B(?=(\d{3})+(?!\d))/g, ',') || null
      : format;
  }
  return null;
};

/**
 * @deprecated
 */
export const parseAmount = (
  amountStr: string | null,
  decimals: number | null,
): Amount => {
  if (!(amountStr && decimals) || amountStr?.includes('e')) {
    return { exact: null, simple: null };
  }

  // Trim the fraction to the number of decimals (otherwise: underflow)
  const [int, fraction = '0'] = amountStr.split('.');
  const sanitizedAmount = `${int}.${fraction.slice(0, decimals)}`;

  const exact = parseUnits(sanitizedAmount, decimals);
  const simple = parseFloat(formatUnits(exact, decimals));
  return {
    exact,
    simple,
  };
};

/**
 * @deprecated
 */
export const parseExactAmount = (
  exactAmount: BigNumber | null,
  decimals: number | null,
): Amount => {
  if (!(exactAmount && decimals)) {
    return { exact: null, simple: null };
  }

  const exact = exactAmount;
  const simple = parseFloat(formatUnits(exactAmount, decimals));
  return {
    exact,
    simple,
  };
};
