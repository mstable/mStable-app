import { BigNumber } from 'ethers/utils';
import { RATIO_SCALE } from './constants';

export const applyRatioMassetToBasset = (
  input: BigNumber,
  ratio: BigNumber,
): BigNumber => input.mul(RATIO_SCALE).div(ratio);

export const applyRatioBassetToMasset = (
  input: BigNumber,
  ratio: BigNumber,
): BigNumber => input.mul(ratio).div(RATIO_SCALE);
