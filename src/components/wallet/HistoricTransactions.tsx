import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { BigNumber } from 'ethers/utils';
import { useOrderedHistoricTransactions } from '../../context/TransactionsProvider';
import { ContractNames, HistoricTransaction } from '../../types';
import { EtherscanLink } from '../core/EtherscanLink';
import { MassetQuery } from '../../graphql/generated';
import { useKnownAddress } from '../../context/DataProvider/KnownAddressProvider';
import { useMusdQuery } from '../../context/DataProvider/DataProvider';
import { formatExactAmount } from '../../web3/amounts';
import { EMOJIS } from '../../web3/constants';
import { List, ListItem } from '../core/List';
import { humanizeList } from '../../web3/strings';

type FnName =
  | 'mint'
  | 'mintMulti'
  | 'swap'
  | 'redeem'
  | 'redeemMasset'
  | 'withdraw'
  | 'depositSavings';

const LOADING: JSX.Element = <>Loading...</>;

const Container = styled.div``;

const HistoricTxContainer = styled.div`
  align-items: flex-start;
  display: flex;
  > * {
    margin-right: 8px;
  }
  > p {
    margin-bottom: 0;
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

const HistoricTxIcon = styled.div`
  height: 16px;
  width: 16px;
`;

const getHistoricTxFn = ({ logs }: HistoricTransaction): FnName | null => {
  if (logs.find(({ name }) => name === 'Redeemed')) {
    return 'redeem';
  }
  if (logs.find(({ name }) => name === 'RedeemedMasset')) {
    return 'redeemMasset';
  }
  if (logs.find(({ name }) => name === 'Swapped')) {
    return 'swap';
  }
  if (logs.find(({ name }) => name === 'Minted')) {
    return 'mint';
  }
  if (logs.find(({ name }) => name === 'MintedMulti')) {
    return 'mintMulti';
  }
  if (logs.find(({ name }) => name === 'SavingsDeposited')) {
    return 'depositSavings';
  }
  if (logs.find(({ name }) => name === 'CreditsRedeemed')) {
    return 'withdraw';
  }
  return null;
};

const getHistoricTransactionDescription = (
  fn: FnName,
  { contractAddress, logs }: HistoricTransaction,
  {
    mUSDSavingsAddress,
    mUSD,
  }: { mUSD: MassetQuery['masset']; mUSDSavingsAddress: string | null },
): JSX.Element => {
  if (!mUSD) return LOADING;

  if (contractAddress.toLowerCase() === mUSDSavingsAddress) {
    switch (fn) {
      case 'depositSavings': {
        const [
          {
            values: { savingsDeposited },
          },
        ] = logs;
        return (
          <>
            You <span>deposited</span>{' '}
            {formatExactAmount(
              savingsDeposited,
              mUSD.token.decimals,
              'mUSD',
              true,
            )}
          </>
        );
      }
      case 'withdraw': {
        const [
          {
            values: { creditsRedeemed },
          },
        ] = logs;
        return (
          <>
            You <span>withdrew</span>{' '}
            {formatExactAmount(
              creditsRedeemed,
              mUSD.token.decimals,
              'mUSD',
              true,
            )}
          </>
        );
      }
      default:
        return <>Unknown</>;
    }
  }

  switch (fn) {
    case 'mint': {
      const [
        {
          values: { mAssetQuantity, bAsset, bAssetQuantity },
        },
      ] = logs;
      const bAssetToken = mUSD.basket.bassets.find(
        b => b.id === bAsset.toLowerCase(),
      );
      if (!bAssetToken) return LOADING;

      return (
        <>
          You <span>minted</span>{' '}
          {formatExactAmount(
            mAssetQuantity,
            mUSD.token.decimals,
            mUSD.token.symbol,
            true,
          )}{' '}
          with{' '}
          {formatExactAmount(
            bAssetQuantity,
            bAssetToken.token.decimals,
            bAssetToken.token.symbol,
            true,
          )}
        </>
      );
    }
    case 'mintMulti': {
      const [
        {
          values: { mAssetQuantity },
        },
      ] = logs;

      return (
        <>
          You <span>minted</span>{' '}
          {formatExactAmount(
            mAssetQuantity,
            mUSD.token.decimals,
            mUSD.token.symbol,
            true,
          )}{' '}
          with{' multiple bAssets'}
        </>
      );
    }
    case 'swap': {
      const {
        values: { input, output, outputAmount },
      } = logs[logs.length - 1];
      const inputBasset = mUSD.basket.bassets.find(
        b => b.id === input.toLowerCase(),
      );
      const outputBasset = mUSD.basket.bassets.find(
        b => b.id === output.toLowerCase(),
      );
      if (!inputBasset || !outputBasset) return LOADING;

      return (
        <>
          You <span>swapped</span> {inputBasset.token.symbol} for{' '}
          {formatExactAmount(
            outputAmount,
            outputBasset.token.decimals,
            outputBasset.token.symbol,
            true,
          )}
        </>
      );
    }
    case 'redeem': {
      const totalFee = logs.reduce(
        (_totalFee, { values: { feeQuantity } }) =>
          feeQuantity ? _totalFee.add(feeQuantity) : _totalFee,
        new BigNumber(0),
      );

      const {
        values: { mAssetQuantity, bAssets, bAssetQuantities },
      } = logs[logs.length - 1];

      const bassetTokens = bAssets
        .map((address: string) =>
          mUSD.basket.bassets.find(
            b => b.token.address === address.toLowerCase(),
          ),
        )
        .filter(Boolean);

      if (bassetTokens.length !== bAssets.length) return LOADING;

      return (
        <>
          You <span>redeemed</span>{' '}
          {humanizeList(
            bAssets.map((address: string, index: number) =>
              formatExactAmount(
                bAssetQuantities[index],
                bassetTokens[index].token.decimals,
                bassetTokens[index].token.symbol,
                true,
              ),
            ),
          )}{' '}
          for{' '}
          {formatExactAmount(
            mAssetQuantity,
            mUSD.token.decimals,
            mUSD.token.symbol,
            true,
          )}{' '}
          (fee paid:{' '}
          {formatExactAmount(totalFee, mUSD.token.decimals, mUSD.token.symbol)})
        </>
      );
    }
    case 'redeemMasset': {
      const [
        {
          values: { mAssetQuantity },
        },
      ] = logs;

      return (
        <>
          You <span>redeemed</span>{' '}
          {formatExactAmount(
            mAssetQuantity,
            mUSD.token.decimals,
            mUSD.token.symbol,
            true,
          )}
          {' proportionately'}
        </>
      );
    }

    default:
      return <>Unknown</>;
  }
};

const HistoricTx: FC<{
  tx: HistoricTransaction;
  mUSD: MassetQuery['masset'];
  mUSDSavingsAddress: string | null;
}> = ({ tx, mUSDSavingsAddress, mUSD }) => {
  const { description, icon } = useMemo(() => {
    const fn = getHistoricTxFn(tx);
    return {
      description: fn
        ? getHistoricTransactionDescription(fn, tx, {
            mUSD,
            mUSDSavingsAddress,
          })
        : null,
      icon: fn ? EMOJIS[fn] : null,
    };
  }, [tx, mUSD, mUSDSavingsAddress]);

  return (
    <HistoricTxContainer>
      <HistoricTxIcon>{icon}</HistoricTxIcon>
      <EtherscanLink data={tx.hash} type="transaction">
        {description}
      </EtherscanLink>
    </HistoricTxContainer>
  );
};

export const HistoricTransactions: FC<{}> = () => {
  const historic = useOrderedHistoricTransactions();
  const musdQuery = useMusdQuery();
  const mUSD = musdQuery.data?.masset || null;
  const mUSDSavingsAddress = useKnownAddress(ContractNames.mUSDSavings);

  return (
    <Container>
      {historic.length === 0 ? (
        'No historic transactions'
      ) : (
        <List inverted>
          {historic.map(tx => (
            <ListItem key={tx.hash}>
              <HistoricTx
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
