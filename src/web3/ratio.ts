import { BigNumber } from 'bignumber.js';
import { RATIO_SCALE } from './constants';

export const applyRatioMassetToBasset = (
  input: BigNumber,
  ratio: BigNumber,
): BigNumber => input.times(RATIO_SCALE).div(ratio);

export const applyRatioBassetToMasset = (
  input: BigNumber,
  ratio: BigNumber,
): BigNumber => input.times(ratio).div(RATIO_SCALE);
