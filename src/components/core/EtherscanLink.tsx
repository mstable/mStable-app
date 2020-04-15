import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { getEtherscanLink, truncateAddress } from '../../web3/strings';

const Link = styled.a`
  display: flex;
  align-items: center;
`;

const Data = styled.span`
  font-weight: bold;
  margin-right: ${props => props.theme.spacing.xs};
`;

const useEtherscanLink = (
  data: string,
  type?: 'account' | 'transaction' | 'address',
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
  type?: 'transaction' | 'account' | 'address';
  truncate?: boolean;
  showData?: boolean;
}> = ({ type = 'address', data, showData, truncate = true }) => (
  <Link
    href={useEtherscanLink(data, type)}
    target="_blank"
    rel="noopener noreferrer"
    title={`View ${type} on Etherscan`}
  >
    {showData ? <Data>{truncate ? truncateAddress(data) : data}</Data> : null}
  </Link>
);
