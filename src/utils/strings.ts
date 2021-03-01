import { ErrorCode } from '@ethersproject/logger';
import { CHAIN_ID } from '../constants';

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

export const getEtherscanLinkForHash = (
  hash: string,
): { href: string; title: string } => ({
  title: 'View on Etherscan',
  href: getEtherscanLink(hash, 'transaction'),
});

export const truncateAddress = (address: string): string =>
  `${address.slice(0, 6)}…${address.slice(-4)}`;

export const humanizeList = (list: string[]): string =>
  list.length < 3
    ? list.join(' and ')
    : `${list.slice(0, -1).join(', ')}, and ${list[list.length - 1]}`;

interface EthersError extends Error {
  code?: ErrorCode;
  error?: Error;
}

const sanitizeEthersError = (error: EthersError): string => {
  let { message } = error;

  switch (error.code) {
    case ErrorCode.UNPREDICTABLE_GAS_LIMIT: {
      if (error.error?.message) {
        break;
      }
      return 'Unable to estimate gas';
    }
    case ErrorCode.INSUFFICIENT_FUNDS:
      return 'Insufficient funds';
    case ErrorCode.NETWORK_ERROR:
      return 'Network error';
    case ErrorCode.REPLACEMENT_UNDERPRICED:
      return 'Replacement transaction underpriced';
    case ErrorCode.TIMEOUT:
      return 'Timeout';
    default:
      break;
  }

  if (error.error?.message) {
    message = error.error.message;
  }

  return message.replace('execution reverted: ', '');
};

export const sanitizeMassetError = (error: EthersError): string => {
  const message = sanitizeEthersError(error);

  switch (message) {
    case 'Out of bounds':
      return 'This swap would exceed hard limits to maintain diversification. Try a different pair of assets or a smaller amount.';
    default:
      return message;
  }
};
