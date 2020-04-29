import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { BigNumber } from 'ethers/utils';
import { useOrderedCurrentTransactions } from '../../context/TransactionsProvider';
import { useKnownAddress, useMUSD } from '../../context/KnownAddressProvider';
import { ContractNames, Transaction, TransactionStatus } from '../../types';
import { MassetQuery } from '../../graphql/generated';
import { getTransactionStatus } from '../../web3/transactions';
import { formatExactAmount } from '../../web3/amounts';
import { ActivitySpinner } from '../core/ActivitySpinner';
import { EtherscanLink } from '../core/EtherscanLink';
import { List, ListItem } from '../core/List';
import { EMOJIS } from '../../web3/constants';

const Container = styled.div``;

const PendingTxContainer = styled.div`
  display: flex;
  > * {
    margin-right: 8px;
  }

  a {
    color: ${({ theme }) => theme.color.white};
    font-weight: normal;

    span {
      color: ${({ theme }) => theme.color.gold};
      font-weight: bold;
    }
  }
`;

const TxStatusContainer = styled.div`
  height: 16px;
  width: 16px;
`;

const Loading = <>Loading...</>;

const getStatusLabel = (status: TransactionStatus): string =>
  status === TransactionStatus.Success
    ? 'Confirmed'
    : status === TransactionStatus.Error
    ? 'Error'
    : 'Pending';

const getPendingTxDescription = (
  tx: Transaction,
  {
    mUSD,
    mUSDSavingsAddress,
  }: {
    mUSD: MassetQuery['masset'];
    mUSDSavingsAddress: string | null;
  },
): JSX.Element => {
  if (!mUSD) return Loading;

  const {
    basket: { bassets },
  } = mUSD;

  if (tx.response.to === mUSDSavingsAddress) {
    switch (tx.fn) {
      case 'redeem': {
        const [amount] = tx.args as [BigNumber];
        return (
          <>
            You <span>{tx.status ? 'withdrew' : 'are withdrawing'}</span>{' '}
            {formatExactAmount(amount, mUSD.token.decimals)} $
            {mUSD.token.symbol}
          </>
        );
      }
      case 'depositSavings': {
        const [amount] = tx.args as [BigNumber];
        return (
          <>
            You <span>{tx.status ? 'deposited' : 'are depositing'}</span>{' '}
            {formatExactAmount(amount, mUSD.token.decimals)} {mUSD.token.symbol}
          </>
        );
      }
      default:
        return <>Unknown</>;
    }
  }

  switch (tx.fn) {
    case 'approve': {
      if (tx.args[0] === mUSDSavingsAddress) {
        return (
          <>
            You <span>{tx.status ? 'approved' : 'are approving'}</span> the mUSD
            Savings Contract to transfer ${mUSD.token.symbol}
          </>
        );
      }

      const bAsset = bassets.find(b => b.token.address === tx.response.to);
      if (!bAsset) return Loading;

      return (
        <>
          You <span>{tx.status ? 'approved' : 'are approving'}</span>{' '}
          {mUSD.token.symbol} to transfer {bAsset.token.symbol}
        </>
      );
    }
    case 'mint': {
      const [bassetAddress, bassetQ] = tx.args as [string, BigNumber];

      const bAsset = bassets.find(b => b.token.address === bassetAddress);
      if (!bAsset) return Loading;

      return (
        <>
          You <span>{tx.status ? 'minted' : 'are minting'}</span>{' '}
          {formatExactAmount(bassetQ, bAsset.token.decimals, mUSD.token.symbol)}{' '}
          with{' '}
          {formatExactAmount(
            bassetQ,
            bAsset.token.decimals,
            bAsset.token.symbol,
          )}
        </>
      );
    }
    case 'redeem': {
      const [bassetAddress, bassetQ] = tx.args as [string, BigNumber];

      const bAsset = bassets.find(b => b.token.address === bassetAddress);
      if (!bAsset) return Loading;

      return (
        <>
          You <span>{tx.status ? 'redeemed' : 'are redeeming'}</span>{' '}
          {formatExactAmount(
            bassetQ,
            bAsset.token.decimals,
            bAsset.token.symbol,
          )}{' '}
          with{' '}
          {formatExactAmount(bassetQ, bAsset.token.decimals, mUSD.token.symbol)}
        </>
      );
    }
    default:
      return <>Unknown</>;
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
  mUSD: MassetQuery['masset'];
  mUSDSavingsAddress: string | null;
}> = ({ tx, mUSD, mUSDSavingsAddress }) => {
  const description = useMemo(
    () => getPendingTxDescription(tx, { mUSD, mUSDSavingsAddress }),
    [tx, mUSD, mUSDSavingsAddress],
  );

  return (
    <PendingTxContainer>
      <TxStatusIndicator tx={tx} />
      <EtherscanLink data={tx.hash} type="transaction">
        {description}
      </EtherscanLink>
    </PendingTxContainer>
  );
};

/**
 * List of recently-sent transactions.
 */
export const Transactions: FC<{}> = () => {
  const pending = useOrderedCurrentTransactions();
  const mUSD = useMUSD();
  const mUSDSavingsAddress = useKnownAddress(ContractNames.mUSDSavings);

  return (
    <Container>
      {pending.length === 0 ? (
        'No transactions sent in the current session.'
      ) : (
        <List inverted>
          {pending.map(tx => (
            <ListItem key={tx.hash}>
              <PendingTx
                tx={tx}
                mUSD={mUSD}
                mUSDSavingsAddress={mUSDSavingsAddress}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};
