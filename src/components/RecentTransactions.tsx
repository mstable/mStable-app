import React, { useMemo, FC } from 'react';
import { useAllTransactions } from '../context/TransactionsProvider';
import { Transaction, TransactionStatus } from '../types';
import { EtherscanLink } from './EtherscanLink';
import styles from './RecentTransactions.module.css';
import { useAllErc20TokensQuery } from '../graphql/generated';
import { convertExactToSimple } from '../web3/maths';

const getStatus = (tx: Transaction): TransactionStatus => {
  if (tx.receipt?.status === 1) return TransactionStatus.Success;

  if (tx.receipt?.status === 0) return TransactionStatus.Error;

  return TransactionStatus.Pending;
};

const getStatusClassName = (
  status: TransactionStatus,
): typeof styles[keyof typeof styles] => {
  if (status === TransactionStatus.Success) return styles.successIndicator;

  if (status === TransactionStatus.Error) return styles.errorIndicator;

  return styles.pendingIndicator;
};

const getStatusTitle = (status: TransactionStatus, confs = 0): string => {
  if (status === TransactionStatus.Success)
    return `Success (${confs} confirmation${confs > 1 ? 's' : ''})`;

  if (status === TransactionStatus.Error) return 'Error';

  return 'Pending';
};

/**
 * Description for an ERC20 `approve` transaction.
 *
 * @param tx
 */
const ERC20ApproveDescription: FC<{ tx: Transaction }> = ({ tx }) => {
  const { data: bassetData } = useAllErc20TokensQuery({
    variables: { id: tx.response.to },
  });

  // TODO support all massets
  const massetSymbol = 'mUSD';

  const basset = bassetData?.tokens[0];

  return (
    <>
      Approving {massetSymbol} to transfer ${basset?.symbol}
    </>
  );
};

/**
 * Description for a `mintSingleTo` transaction.
 *
 * @param tx
 */
const MintSingleToDescription: FC<{ tx: Transaction }> = ({ tx }) => {
  const [bassetAddress, bassetQ] = tx.args;
  const { data: bassetData } = useAllErc20TokensQuery({
    variables: { id: bassetAddress },
  });

  // TODO support all massets
  const massetSymbol = 'mUSD';

  const basset = bassetData?.tokens[0];
  const massetQ = basset?.decimals
    ? convertExactToSimple(bassetQ as string, basset.decimals || 18).toString()
    : 'unknown';

  return (
    <>
      Minting {massetQ} {massetSymbol} with {basset?.symbol || 'unknown'}
    </>
  );
};

/**
 * Small status indicator for a given transaction, to show its status
 * and link to the transaction on Etherscan.
 *
 * @param tx
 */
const TransactionStatusIndicator: FC<{ tx: Transaction }> = ({ tx }) => {
  const status = getStatus(tx);
  return (
    <div className={styles.status}>
      <div
        className={getStatusClassName(status)}
        title={getStatusTitle(status, tx.receipt?.confirmations)}
      />
      {tx.response.hash ? (
        <EtherscanLink data={tx.response.hash} type="transaction" />
      ) : null}
    </div>
  );
};

/**
 * Largely-textual description for a given transaction.
 * Each component likely uses its own hooks (hence the need for this logic).
 *
 * @param tx
 */
const TransactionDescription: FC<{ tx: Transaction }> = ({ tx }) => {
  switch (tx.fn) {
    case 'approve':
      return <ERC20ApproveDescription tx={tx} />;
    case 'mintSingleTo':
      return <MintSingleToDescription tx={tx} />;
    default:
      return null;
  }
};

/**
 * List of recently-sent transactions.
 *
 * TODO: correct design
 */
export const RecentTransactions: FC<{}> = () => {
  const state = useAllTransactions();
  const sortedTxs = useMemo(
    () =>
      [...Object.entries(state)].sort(
        ([, a], [, b]) => b.timestamp - a.timestamp,
      ),
    [state],
  );

  return (
    <ul className={styles.list}>
      {sortedTxs.map(([hash, tx]) => (
        <li key={hash} className={styles.transaction}>
          <TransactionDescription tx={tx} />
          <TransactionStatusIndicator tx={tx} />
        </li>
      ))}
    </ul>
  );
};
