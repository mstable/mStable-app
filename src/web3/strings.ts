import { BigNumber } from 'ethers/utils';
import { CHAIN_ID } from './constants';

export { asciiToHex as aToH } from 'web3-utils';

const ETHERSCAN_PREFIXES = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.',
};

export const getEtherscanLink = (data: string, type: string): string => {
  const prefix = `https://${ETHERSCAN_PREFIXES[
    CHAIN_ID as keyof typeof ETHERSCAN_PREFIXES
  ] || ETHERSCAN_PREFIXES[1]}etherscan.io`;

  switch (type) {
    case 'transaction':
      return `${prefix}/tx/${data}`;
    case 'address':
    default:
      return `${prefix}/address/${data}`;
  }
};

export const truncateAddress = (address: string): string =>
  `${address.slice(0, 6)}…${address.slice(-4)}`;

/**
 * Usage:
 *
 * decimalsStep(18);
 * '0.000000000000000001'
 *
 * @param decimals
 */
export const decimalsStep = (decimals: number): string =>
  `0.${new Array(decimals).join('0')}1`;

/**
 * Format a given exact value to given decimals to produce a formatted string.
 *
 * @param exactValue Exact value to format
 * @param decimals Decimals of the exact value
 *
 * TODO consider normalising decimals
 * TODO consider padding with a leading zero
 */
export const formatDecimal = (
  exactValue: BigNumber,
  decimals: number,
): string => {
  const value = exactValue.toString();
  return `${value.slice(0, value.length - decimals)}.${value.slice(-decimals)}`;
};
