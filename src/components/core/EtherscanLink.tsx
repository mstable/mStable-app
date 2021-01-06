import React, { FC, useMemo } from 'react';

import { getEtherscanLink, truncateAddress } from '../../utils/strings';
import { ExternalLink } from './ExternalLink';

const useEtherscanLink = (
  data: string,
  type?: 'account' | 'transaction' | 'address' | 'token',
): string => useMemo(() => getEtherscanLink(data, type), [data, type]);

/**
 * A link to Etherscan that opens in a new window.
 *
 * @param data The link data (e.g. a tx hash or account address)
 * @param type Type of the link ('transaction' or 'account')
 * @param showData {optional} Whether the data should be shown as the link content
 * @param truncate {optional} Whether the data should be truncated (default: true)
 */
export const EtherscanLink: FC<{
  data: string;
  type?: 'transaction' | 'account' | 'address' | 'token';
  truncate?: boolean;
  showData?: boolean;
}> = ({ children, type = 'address', data, showData, truncate = true }) => (
  <ExternalLink
    href={useEtherscanLink(data, type)}
    title={`View ${type} on Etherscan`}
  >
    {children || (showData ? (truncate ? truncateAddress(data) : data) : null)}
  </ExternalLink>
);
