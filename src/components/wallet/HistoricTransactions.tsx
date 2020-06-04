import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { useOrderedHistoricTransactions } from '../../context/TransactionsProvider';
import { ContractNames, HistoricTransaction } from '../../types';
import { EtherscanLink } from '../core/EtherscanLink';
import { MassetData } from '../../context/DataProvider/types';
import { useKnownAddress } from '../../context/DataProvider/KnownAddressProvider';
import { useMusdData } from '../../context/DataProvider/DataProvider';
import { formatExactAmount } from '../../web3/amounts';
import { EMOJIS } from '../../web3/constants';
import { List, ListItem } from '../core/List';
import { humanizeList } from '../../web3/strings';
import { P } from '../core/Typography';

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
    border-bottom: none;

    span {
      border-bottom: 1px white solid;
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
  }: { mUSD?: MassetData; mUSDSavingsAddress: string | null },
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
            values: { savingsCredited },
          },
        ] = logs;
        return (
          <>
            You <span>withdrew</span>{' '}
            {formatExactAmount(
              savingsCredited,
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
          values: { mAssetQuantity, bAsset },
        },
      ] = logs;
      const bAssetToken = mUSD.bAssets?.find(
        b => b.address === bAsset.toLowerCase(),
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
          with {bAssetToken.token.symbol}
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
      const inputBasset = mUSD.bAssets.find(
        b => b.address === input.toLowerCase(),
      );
      const outputBasset = mUSD.bAssets.find(
        b => b.address === output.toLowerCase(),
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
      const {
        values: { mAssetQuantity, bAssets },
      } = logs[logs.length - 1];

      const bassetTokens = bAssets
        .map((address: string) =>
          mUSD.bAssets.find(b => b.address === address.toLowerCase()),
        )
        .filter(Boolean);

      if (bassetTokens.length !== bAssets.length) return LOADING;

      return (
        <>
          You <span>redeemed</span>{' '}
          {formatExactAmount(
            mAssetQuantity,
            mUSD.token.decimals,
            mUSD.token.symbol,
            true,
          )}
          {' into '}
          {humanizeList(
            bAssets.map(
              (address: string, index: number) =>
                bassetTokens[index].token.symbol,
            ),
          )}
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
        </>
      );
    }

    default:
      return <>Unknown</>;
  }
};

const HistoricTx: FC<{
  tx: HistoricTransaction;
  mUSD?: MassetData;
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
  const mUSD = useMusdData();
  const mUSDSavingsAddress = useKnownAddress(ContractNames.mUSDSavings);

  return (
    <Container>
      {historic.length === 0 ? (
        <P size={2}>No historic transactions.</P>
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
