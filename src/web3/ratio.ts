import { BigNumber, BigNumberish } from 'ethers';
import { RATIO_SCALE } from './constants';

export const applyRatioMassetToBasset = (
  input: BigNumberish,
  ratio: BigNumberish,
): BigNumber =>
  BigNumber.from(input)
    .mul(RATIO_SCALE)
    .div(ratio);

export const applyRatioBassetToMasset = (
  input: BigNumberish,
  ratio: BigNumberish,
): BigNumber =>
  BigNumber.from(input)
    .mul(ratio)
    .div(RATIO_SCALE);
