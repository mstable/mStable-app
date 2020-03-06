import React, { FC, useMemo } from 'react';

import { getEtherscanLink } from '../web3/strings';
import styles from './EtherscanLink.module.css';

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
 *
 * TODO correct design
 */
export const EtherscanLink: FC<{
  data: string;
  type: 'transaction' | 'account';
  showData?: boolean;
}> = ({ type, data, showData }) => (
  <a
    className={styles.link}
    href={useEtherscanLink(data, type)}
    target="_blank"
    rel="noopener noreferrer"
    title={`View ${type} on Etherscan`}
  >
    {showData ? <span className={styles.data}>{data}</span> : null}
    <i className={styles.icon}>[-&gt;]</i>
  </a>
);
