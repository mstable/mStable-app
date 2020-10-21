import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { BigNumber } from 'ethers/utils';

import { useOrderedCurrentTransactions } from '../../context/TransactionsProvider';
import { useDataState } from '../../context/DataProvider/DataProvider';
import { useStakingRewardsContracts } from '../../context/earn/EarnDataProvider';
import { StakingRewardsContractsMap } from '../../context/earn/types';
import { DataState } from '../../context/DataProvider/types';
import { Transaction, TransactionStatus } from '../../types';
import { getTransactionStatus } from '../../web3/transactions';
import { EMOJIS } from '../../web3/constants';
import { humanizeList } from '../../web3/strings';
import { BigDecimal } from '../../web3/BigDecimal';
import { ActivitySpinner } from '../core/ActivitySpinner';
import { EtherscanLink } from '../core/EtherscanLink';
import { List, ListItem } from '../core/List';
import { P } from '../core/Typography';

const PendingTxContainer = styled.div<{ inverted?: boolean }>`
  display: flex;
  > * {
    margin-right: 8px;
  }

  a {
    color: ${({ theme, inverted }) =>
      inverted ? theme.color.white : theme.color.black};
    border-bottom: none;

    span {
      border-bottom: 1px
        ${({ theme, inverted }) =>
          inverted ? theme.color.white : theme.color.black}
        solid;
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
  stakingRewardsContracts: StakingRewardsContractsMap,
  dataState?: DataState,
): JSX.Element => {
  if (!dataState) return Loading;

  const { bAssets, savingsContract, mAsset } = dataState;

  const stakingRewardsAddress = Object.keys(stakingRewardsContracts).find(
    address => address === (tx.response.to as string),
  );

  if (stakingRewardsAddress) {
    const {
      title,
      stakingToken,
      rewardsToken,
      platformRewards,
    } = stakingRewardsContracts[stakingRewardsAddress];

    switch (tx.fn) {
      case 'exit': {
        return (
          <>
            You {tx.status ? 'exited' : 'are exiting'} {title}
          </>
        );
      }
      case 'withdraw': {
        return (
          <>
            You {tx.status ? 'withdrew' : 'are withdrawing'}{' '}
            {stakingToken.symbol} from {title}
          </>
        );
      }
      case 'claimReward': {
        return (
          <>
            You {tx.status ? 'claimed' : 'are claiming'} {rewardsToken.symbol}
            {platformRewards
              ? ` and ${platformRewards.platformToken.symbol}`
              : ''}{' '}
            from {title}
          </>
        );
      }
      case 'stake(uint256)': {
        return (
          <>
            You {tx.status ? 'staked' : 'are staking'} in {title}
          </>
        );
      }
      case 'approve': {
        return (
          <>
            You {tx.status ? 'approved' : 'are approving'} {title} to transfer
            your {stakingToken.symbol}
          </>
        );
      }
      default:
        return <>Unknown</>;
    }
  }

  if (tx.response.to === savingsContract.address) {
    switch (tx.fn) {
      case 'redeem': {
        return (
          <>
            You <span>{tx.status ? 'withdrew' : 'are withdrawing'}</span>{' '}
            {mAsset.symbol} savings
          </>
        );
      }
      case 'depositSavings': {
        const [quantity] = tx.args as [BigNumber];
        const amount = new BigDecimal(quantity, mAsset.decimals);
        return (
          <>
            You <span>{tx.status ? 'deposited' : 'are depositing'}</span>{' '}
            {amount.format()} {mAsset.symbol}
          </>
        );
      }
      default:
        return <>Unknown</>;
    }
  }

  switch (tx.fn) {
    case 'approve': {
      if (tx.args[0] === savingsContract.address) {
        return (
          <>
            You <span>{tx.status ? 'approved' : 'are approving'}</span> the mUSD
            SAVE Contract to transfer {mAsset.symbol}
          </>
        );
      }

      const bAsset = bAssets[tx.response.to as string];
      if (!bAsset) {
        return (
          <>
            You{' '}
            <span>{tx.status ? 'approved' : 'are approving'} transfers</span>
          </>
        );
      }

      return (
        <>
          You <span>{tx.status ? 'approved' : 'are approving'}</span>{' '}
          {mAsset.symbol} to transfer {bAsset.symbol}
        </>
      );
    }
    case 'mint': {
      const [bAssetAddress, bAssetQ] = tx.args as [string, BigNumber];

      const bAsset = bAssets[bAssetAddress];
      if (!bAsset) return Loading;

      const amount = new BigDecimal(bAssetQ, bAsset.decimals).format();

      return (
        <>
          You <span>{tx.status ? 'minted' : 'are minting'}</span> {amount}{' '}
          {mAsset.symbol} with {amount} {bAsset.symbol}
        </>
      );
    }
    case 'mintMulti': {
      const [bAssetAddresses, bAssetQs] = tx.args as [
        string[],
        BigNumber[],
        string,
      ];

      const bAssetsWithAmounts = bAssetAddresses.map(
        (bAssetAddress, index) => ({
          ...bAssets[bAssetAddress],
          amount: new BigDecimal(
            bAssetQs[index],
            bAssets[bAssetAddress].decimals,
          ),
        }),
      );

      if (bAssetsWithAmounts.length === 0) return Loading;

      const mAssetQ: BigDecimal = bAssetsWithAmounts.reduce(
        (_total, { amount, ratio }) =>
          _total.add(amount.mulRatioTruncate(ratio)),
        new BigDecimal(0, mAsset.decimals),
      );

      return (
        <>
          You <span>{tx.status ? 'minted' : 'are minting'}</span>{' '}
          {mAssetQ.format()} {mAsset.symbol} with{' '}
          {humanizeList(
            bAssetsWithAmounts.map(
              ({ amount, symbol }) => `${amount.format()} ${symbol}`,
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

      const inputBasset = bAssets[input];
      const outputBasset = bAssets[output];
      if (!inputBasset || !outputBasset) return Loading;

      const amount = new BigDecimal(inputQuantity, inputBasset.decimals);

      return (
        <>
          You <span>{tx.status ? 'swapped' : 'are swapping'}</span>{' '}
          {amount.format()} {inputBasset.symbol} for {outputBasset.symbol}
        </>
      );
    }
    case 'redeem': {
      const [bAssetAddress, bAssetQ] = tx.args as [string, BigNumber];

      const bAsset = bAssets[bAssetAddress];
      if (!bAsset) return Loading;

      const amount = new BigDecimal(bAssetQ, bAsset.decimals);

      return (
        <>
          You <span>{tx.status ? 'redeemed' : 'are redeeming'}</span>{' '}
          {amount.format()} {mAsset.symbol} into {bAsset.symbol}
        </>
      );
    }
    case 'redeemMulti': {
      const [addresses, amounts] = tx.args as [string[], BigNumber[]];

      // Scale the amounts to mAsset units and add them up
      const totalMassetAmount = addresses.reduce((prev, current, index) => {
        const { decimals, ratio } = bAssets[current];

        const mAssetAmount = new BigDecimal(
          amounts[index],
          decimals,
        ).mulRatioTruncate(ratio);

        return prev.add(mAssetAmount);
      }, new BigDecimal(0, mAsset.decimals));

      return (
        <>
          You <span>{tx.status ? 'redeemed' : 'are redeeming'}</span>{' '}
          {totalMassetAmount.format()} {mAsset.symbol}
        </>
      );
    }
    case 'redeemMasset': {
      const [mAssetQ] = tx.args as [BigNumber];

      const amount = new BigDecimal(mAssetQ, mAsset.decimals);

      return (
        <>
          You <span>{tx.status ? 'redeemed' : 'are redeeming'}</span>{' '}
          {amount.format()} {mAsset.symbol}
        </>
      );
    }
    case 'distributeRewards': {
      return <>You {tx.status ? 'distributed' : 'are distributing'} rewards</>;
    }
    case 'claimWeeks': {
      const [, tranches] = tx.args as [string, string[], string[], string[][]];

      return (
        <>
          You <span>{tx.status ? 'claimed' : 'are claiming'}</span> rewards for
          week{tranches.length > 1 ? 's' : ''} {tranches.join(', ')}
        </>
      );
    }
    case 'claimWeek': {
      const [, tranche] = tx.args as [string, string, string, string[]];

      return (
        <>
          You <span>{tx.status ? 'claimed' : 'are claiming'}</span> rewards for
          week {tranche}
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
        <ActivitySpinner pending />
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
  inverted: boolean;
}> = ({ tx, inverted }) => {
  const dataState = useDataState();
  const stakingRewardsContracts = useStakingRewardsContracts();

  const description = useMemo(
    () => getPendingTxDescription(tx, stakingRewardsContracts, dataState),
    [tx, dataState, stakingRewardsContracts],
  );

  return (
    <PendingTxContainer inverted={inverted}>
      <TxStatusIndicator tx={tx} />
      <EtherscanLink data={tx.hash} type="transaction">
        {tx.status === 0 ? 'Error: ' : ''}
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

  return (
    <div>
      {pending.length === 0 ? (
        <P size={2}>No transactions sent in the current session.</P>
      ) : (
        <List>
          {pending.map(tx => (
            <ListItem key={tx.hash}>
              <PendingTx tx={tx} inverted={!formId} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};
