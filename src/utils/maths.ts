import { BigNumber } from 'ethers';

export const calculateGasMargin = (value: BigNumber): BigNumber => {
  const GAS_MARGIN = BigNumber.from(1000);
  const offset = value.mul(GAS_MARGIN).div(BigNumber.from(10000));
  return value.add(offset);
};
