/**
 * @notice Common maths functions
 * In theory, this can be built out and shipped in a separate mStable-js lib at some stage as
 * it likely share code with the front end
 */

import { BigNumber } from 'bignumber.js';
import { PERCENT_SCALE, EXP_SCALE, RATIO_SCALE } from './constants';

export const divideByRatio = (value: BigNumber): BigNumber =>
  value.div(RATIO_SCALE);

export const percentToWeight = (percent: number): BigNumber =>
  new BigNumber(percent).times(PERCENT_SCALE);

export const convertExactToPercent = (percentExact: BigNumber): number =>
  new BigNumber(percentExact).div(PERCENT_SCALE).toNumber();

export const createMultiple = (ratio: number): BigNumber =>
  new BigNumber(ratio).times(RATIO_SCALE);

/** @dev Converts a simple ratio (e.g. x1.1) to 1e6 format for OracleData */
export const simpleToExactRelativePrice = (relativePrice: number): BigNumber =>
  new BigNumber(relativePrice).times(new BigNumber(10).pow(new BigNumber(6)));

export const convertSimpleToExact = (
  value: number | string,
  decimals: number,
): BigNumber =>
  new BigNumber(value).times(new BigNumber(10).pow(new BigNumber(decimals)));

export const convertExactToSimple = (
  value: number | string,
  decimals: number,
): BigNumber =>
  new BigNumber(value).div(new BigNumber(10).pow(new BigNumber(decimals)));

export const centsToDollars = (priceInCents: string): BigNumber =>
  new BigNumber(priceInCents).div(new BigNumber('100'));

export const priceToCents = (priceFromContract: string): BigNumber =>
  new BigNumber(priceFromContract).div(new BigNumber('10000'));

export const priceToDollars = (priceFromContract: string): BigNumber =>
  new BigNumber(priceFromContract).div(new BigNumber('1000000'));

export const uintToDate = (uintTimeFromContract: number): Date =>
  new Date(uintTimeFromContract * 1000);

/**
 * @dev Returns a weighting or fee to a fraction
 * @param value Big number representing fee or weighting, in fee*10**18
 * @returns Big value as fraction (i.e. 1% == 0.01)
 */
export const percentToFraction = (value: BigNumber): BigNumber =>
  value.eq(new BigNumber(0)) ? value : value.div(EXP_SCALE);
