import { CHAIN_ID } from './constants';

const ETHERSCAN_PREFIXES = {
  1: '',
  3: 'ropsten.',
  4: 'rinkeby.',
  5: 'goerli.',
  42: 'kovan.',
};

export const getEtherscanLink = (
  data: string,
  type?: 'account' | 'transaction' | 'address' | 'token',
): string => {
  const prefix = `https://${ETHERSCAN_PREFIXES[
    CHAIN_ID as keyof typeof ETHERSCAN_PREFIXES
  ] || ETHERSCAN_PREFIXES[1]}etherscan.io`;

  switch (type) {
    case 'transaction':
      return `${prefix}/tx/${data}`;
    case 'token':
      return `${prefix}/token/${data}`;
    case 'address':
    default:
      return `${prefix}/address/${data}`;
  }
};

export const truncateAddress = (address: string): string =>
  `${address.slice(0, 6)}…${address.slice(-4)}`;

export const humanizeList = (list: string[]): string =>
  list.length < 3
    ? list.join(' and ')
    : `${list.slice(0, -1).join(', ')}, and ${list[list.length - 1]}`;
