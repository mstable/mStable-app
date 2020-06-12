import { BigNumber, parseUnits, formatUnits } from 'ethers/utils';
import { Amount } from '../types';

/**
 * @dev Formats a simple amount to 2 decimal places
 * @param simpleAmount Simple amount to parse
 * @param symbol Symbol to postfix (if any)
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
 * @dev Converts an exact token amount into a simple amount, by dividing by 10**decimals
 * @param exactAmount Exact amount to parse
 * @param decimals Number of decimal places the exact amount has
 * @param symbol Symbol of the token
 * @param commas Add comma separators to separate thousands
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
 * @dev Converts a string amount into an object containing both Simple and Exact amounts
 * @param amountStr String amount to parse
 * @param decimals Number of decimal places the exact amount should have
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
 * @dev Converts an exact amount into an object containing both Simple and Exact amounts
 * @param exactAmount Simple amount to parse
 * @param decimals Number of decimal places the exact amount should have
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
