import { BigNumber, bigNumberify, BigNumberish } from 'ethers/utils';
import { RATIO_SCALE } from './constants';

export const applyRatioMassetToBasset = (
  input: BigNumberish,
  ratio: BigNumberish,
): BigNumber =>
  bigNumberify(input)
    .mul(RATIO_SCALE)
    .div(ratio);

export const applyRatioBassetToMasset = (
  input: BigNumberish,
  ratio: BigNumberish,
): BigNumber =>
  bigNumberify(input)
    .mul(ratio)
    .div(RATIO_SCALE);
