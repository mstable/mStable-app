import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { BigNumber } from 'ethers/utils';
import { useOrderedCurrentTransactions } from '../../context/TransactionsProvider';
import { useKnownAddress } from '../../context/KnownAddressProvider';
import { ContractNames, Transaction, TransactionStatus } from '../../types';
import { MassetQuery, useMassetQuery } from '../../graphql/generated';
import { getTransactionStatus } from '../../web3/transactions';
import { formatExactAmount } from '../../web3/amounts';
import { ActivitySpinner } from '../core/ActivitySpinner';
import { EtherscanLink } from '../core/EtherscanLink';
import { EMOJIS } from '../../web3/constants';

const Container = styled.div``;

const List = styled.ul`
  padding: 0;
  width: 100%;
`;

const Item = styled.li`
  border-top: ${({ theme }) =>
    `2px ${theme.color.backgroundTransparent} solid`};
  padding: ${({ theme }) => theme.spacing.s};
`;

const PendingTxContainer = styled.div`
  display: flex;
  > * {
    margin-right: 8px;
  }
`;

const TxStatusContainer = styled.div`
  height: 16px;
  width: 16px;
`;

const LOADING = 'Loading...';

const getStatusLabel = (status: TransactionStatus): string =>
  status === TransactionStatus.Success
    ? 'Confirmed'
    : status === TransactionStatus.Error
    ? 'Error'
    : 'Pending';

const getPendingTxDescription = (
  tx: Transaction,
  mUSD?: MassetQuery['masset'],
): string => {
  if (!mUSD) return LOADING;

  const {
    basket: { bassets },
  } = mUSD;

  switch (tx.fn) {
    case 'approve': {
      const bAsset = bassets.find(b => b.token.address === tx.response.to);
      if (!bAsset) return LOADING;

      return `You ${tx.status ? 'approved' : 'are approving'} ${
        mUSD.token.symbol
      } to transfer ${bAsset.token.symbol}`;
    }
    case 'mint': {
      const [bassetAddress, bassetQ] = tx.args as [string, BigNumber];

      const bAsset = bassets.find(b => b.token.address === bassetAddress);
      if (!bAsset) return LOADING;

      return `You ${tx.status ? 'minted' : 'are minting'} ${formatExactAmount(
        bassetQ,
        bAsset.token.decimals,
        mUSD.token.symbol,
      )} with ${formatExactAmount(
        bassetQ,
        bAsset.token.decimals,
        bAsset.token.symbol,
      )}`;
    }
    case 'redeem': {
      const [bassetAddress, bassetQ] = tx.args as [string, BigNumber];

      const bAsset = bassets.find(b => b.token.address === bassetAddress);
      if (!bAsset) return LOADING;

      return `You ${
        tx.status ? 'redeemed' : 'are redeeming'
      } ${formatExactAmount(
        bassetQ,
        bAsset.token.decimals,
        bAsset.token.symbol,
      )} with ${formatExactAmount(
        bassetQ,
        bAsset.token.decimals,
        mUSD.token.symbol,
      )}`;
    }
    default:
      return 'Unknown';
  }
};

const TxStatusIndicator: FC<{ tx: Transaction }> = ({ tx }) => {
  const status = getTransactionStatus(tx);
  const label = getStatusLabel(status);
  return (
    <TxStatusContainer title={label}>
      {status === TransactionStatus.Pending ? (
        <ActivitySpinner />
      ) : status === TransactionStatus.Error ? (
        <span>{EMOJIS.error}</span>
      ) : (
        <span>{EMOJIS[tx.fn as keyof typeof EMOJIS]}</span>
      )}
    </TxStatusContainer>
  );
};

const PendingTx: FC<{
  tx: Transaction;
  mUSD?: MassetQuery['masset'];
}> = ({ tx, mUSD }) => {
  const description = useMemo(() => getPendingTxDescription(tx, mUSD), [
    tx,
    mUSD,
  ]);

  return (
    <PendingTxContainer>
      <TxStatusIndicator tx={tx} />
      <EtherscanLink data={tx.hash} type="transaction" />
      <div>{description}</div>
    </PendingTxContainer>
  );
};

/**
 * List of recently-sent transactions.
 *
 * TODO: correct design
 */
export const Transactions: FC<{}> = () => {
  const pending = useOrderedCurrentTransactions();
  const mUSDAddress = useKnownAddress(ContractNames.mUSD);
  const massetQuery = useMassetQuery({ variables: { id: mUSDAddress || '' } });
  const mUSD = massetQuery.data?.masset;

  return (
    <Container>
      {pending.length === 0 ? (
        'No transactions sent in the current session.'
      ) : (
        <List>
          {pending.map(tx => (
            <Item key={tx.hash}>
              <PendingTx tx={tx} mUSD={mUSD} />
            </Item>
          ))}
        </List>
      )}
    </Container>
  );
};
