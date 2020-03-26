import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { getEtherscanLink } from '../../web3/strings';
import { ReactComponent as ArrowSVG } from './external-link-arrow.svg';

const Link = styled.a`
  display: flex;
  align-items: center;
`;

const Data = styled.span`
  margin-right: ${props => props.theme.spacing.s};
`;

const Icon = styled.div`
  svg {
    width: 16px;
    height: 16px;
    path {
      fill: ${props => props.theme.color.background};
    }
  }
`;

const useEtherscanLink = (
  data: string,
  type: 'account' | 'transaction',
): string => useMemo(() => getEtherscanLink(data, type), [data, type]);

/**
 * A link to Etherscan that opens in a new window.
 *
 * @param data The link data (e.g. a tx hash or account address)
 * @param type Type of the link ('transaction' or 'account')
 * @param showData {optional} Whether the data should be shown as the link content
 */
export const EtherscanLink: FC<{
  data: string;
  type: 'transaction' | 'account';
  showData?: boolean;
}> = ({ type, data, showData }) => (
  <Link
    href={useEtherscanLink(data, type)}
    target="_blank"
    rel="noopener noreferrer"
    title={`View ${type} on Etherscan`}
  >
    {showData ? <Data>{data}</Data> : null}
    <Icon>
      <ArrowSVG />
    </Icon>
  </Link>
);
