import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { BigNumber } from 'ethers/utils';
import { useOrderedCurrentTransactions } from '../../context/TransactionsProvider';
import { useKnownAddress } from '../../context/DataProvider/KnownAddressProvider';
import { useMusdData } from '../../context/DataProvider/DataProvider';
import { ContractNames, Transaction, TransactionStatus } from '../../types';
import { MassetData } from '../../context/DataProvider/types';
import { getTransactionStatus } from '../../web3/transactions';
import { formatExactAmount } from '../../web3/amounts';
import { ActivitySpinner } from '../core/ActivitySpinner';
import { EtherscanLink } from '../core/EtherscanLink';
import { List, ListItem } from '../core/List';
import { EMOJIS, RATIO_SCALE } from '../../web3/constants';
import { humanizeList } from '../../web3/strings';
import { P } from '../core/Typography';

const PendingTxContainer = styled.div<{ inverted?: boolean }>`
  display: flex;
  > * {
    margin-right: 8px;
  }

  a {
    color: ${({ theme, inverted }) =>
      inverted ? theme.color.white : theme.color.black};
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
    mUSD?: MassetData;
    mUSDSavingsAddress: string | null;
  },
): JSX.Element => {
  if (!mUSD) return Loading;

  const { bAssets } = mUSD;

  if (tx.response.to === mUSDSavingsAddress) {
    switch (tx.fn) {
      case 'redeem': {
        return (
          <>
            You <span>{tx.status ? 'withdrew' : 'are withdrawing'}</span>{' '}
            {mUSD.token.symbol} savings
          </>
        );
      }
      case 'depositSavings': {
        const [amount] = tx.args as [BigNumber];
        return (
          <>
            You <span>{tx.status ? 'deposited' : 'are depositing'}</span>{' '}
            {formatExactAmount(
              amount,
              mUSD.token.decimals,
              mUSD.token.symbol,
              true,
            )}
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
            Savings Contract to transfer {mUSD.token.symbol}
          </>
        );
      }

      const basset = bAssets.find(b => b.address === tx.response.to);
      if (!basset) return Loading;

      return (
        <>
          You <span>{tx.status ? 'approved' : 'are approving'}</span>{' '}
          {mUSD.token.symbol} to transfer {basset.token.symbol}
        </>
      );
    }
    case 'mint': {
      const [bassetAddress, bassetQ] = tx.args as [string, BigNumber];

      const basset = bAssets.find(b => b.address === bassetAddress);
      if (!basset) return Loading;

      return (
        <>
          You <span>{tx.status ? 'minted' : 'are minting'}</span>{' '}
          {formatExactAmount(
            bassetQ,
            basset.token.decimals,
            mUSD.token.symbol,
            true,
          )}{' '}
          with{' '}
          {formatExactAmount(
            bassetQ,
            basset.token.decimals,
            basset.token.symbol,
            true,
          )}
        </>
      );
    }
    case 'mintMulti': {
      const [bassetAddresses, bassetQs] = tx.args as [
        string[],
        BigNumber[],
        string,
      ];

      const bassets = bassetAddresses.map((address, index) => ({
        ...(bAssets.find(b => b.address === address) as NonNullable<
          typeof bAssets
        >[0]),
        quantity: bassetQs[index],
      }));

      if (bassets.length === 0) return Loading;

      const massetQ: BigNumber = bassets.reduce(
        (_total, { quantity, ratio }) =>
          _total.add(quantity.mul(ratio as string).div(RATIO_SCALE)),
        new BigNumber(0),
      );

      return (
        <>
          You <span>{tx.status ? 'minted' : 'are minting'}</span>{' '}
          {formatExactAmount(
            massetQ,
            mUSD.token.decimals,
            mUSD.token.symbol,
            true,
          )}{' '}
          with{' '}
          {humanizeList(
            bassets.map(
              ({ quantity, token: { decimals, symbol } }) =>
                formatExactAmount(quantity, decimals, symbol, true) as string,
            ),
          )}
        </>
      );
    }
    case 'swap': {
      const [input, output, inputQuantity] = tx.args as [
        string,
        string,
        BigNumber,
      ];

      const inputBasset = bAssets.find(b => b.address === input);
      const outputBasset = bAssets.find(b => b.address === output);
      if (!inputBasset || !outputBasset) return Loading;

      return (
        <>
          You <span>{tx.status ? 'swapped' : 'are swapping'}</span>{' '}
          {formatExactAmount(
            inputQuantity,
            inputBasset.token.decimals,
            inputBasset.token.symbol,
            true,
          )}{' '}
          for {outputBasset.token.symbol}
        </>
      );
    }
    case 'redeem': {
      const [bassetAddress, bassetQ] = tx.args as [string, BigNumber];

      const basset = bAssets.find(b => b.address === bassetAddress);
      if (!basset) return Loading;

      return (
        <>
          You <span>{tx.status ? 'redeemed' : 'are redeeming'}</span>{' '}
          {formatExactAmount(
            bassetQ,
            basset.token.decimals,
            basset.token.symbol,
            true,
          )}{' '}
          with{' '}
          {formatExactAmount(
            bassetQ,
            mUSD.token.decimals,
            mUSD.token.symbol,
            true,
          )}
        </>
      );
    }
    case 'redeemMasset': {
      const [massetQ] = tx.args as [BigNumber];

      return (
        <>
          You <span>{tx.status ? 'redeemed' : 'are redeeming'}</span>{' '}
          {formatExactAmount(massetQ, 18, mUSD.token.symbol, true)}
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
  mUSD?: MassetData;
  mUSDSavingsAddress: string | null;
  inverted?: boolean;
}> = ({ tx, mUSD, mUSDSavingsAddress, inverted }) => {
  const description = useMemo(
    () => getPendingTxDescription(tx, { mUSD, mUSDSavingsAddress }),
    [tx, mUSD, mUSDSavingsAddress],
  );

  return (
    <PendingTxContainer inverted={inverted}>
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
export const Transactions: FC<{ formId?: string }> = ({ formId }) => {
  const pending = useOrderedCurrentTransactions(formId);
  const mUSD = useMusdData();
  const mUSDSavingsAddress = useKnownAddress(ContractNames.mUSDSavings);

  return (
    <div>
      {pending.length === 0 ? (
        <P size={2}>No transactions sent in the current session.</P>
      ) : (
        <List>
          {pending.map(tx => (
            <ListItem key={tx.hash}>
              <PendingTx
                tx={tx}
                mUSD={mUSD}
                mUSDSavingsAddress={mUSDSavingsAddress}
                inverted={!formId}
              />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};
