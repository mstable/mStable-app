import React, { FC, useMemo } from 'react';
import styled from 'styled-components';

import { useOrderedHistoricTransactions } from '../../context/TransactionsProvider';
import { BassetState, DataState } from '../../context/DataProvider/types';
import { useDataState } from '../../context/DataProvider/DataProvider';
import { HistoricTransaction } from '../../types';
import { humanizeList } from '../../web3/strings';
import { EMOJIS } from '../../web3/constants';
import { BigDecimal } from '../../web3/BigDecimal';
import { EtherscanLink } from '../core/EtherscanLink';
import { List, ListItem } from '../core/List';
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
  dataState?: DataState,
): JSX.Element => {
  if (!dataState) return LOADING;

  const { mAsset, savingsContract, bAssets } = dataState;

  if (contractAddress.toLowerCase() === savingsContract.address) {
    switch (fn) {
      case 'depositSavings': {
        const [
          {
            values: { savingsDeposited },
          },
        ] = logs;

        const amount = new BigDecimal(savingsDeposited, mAsset.decimals);

        return (
          <>
            You <span>deposited</span> {amount.format()} {mAsset.symbol}
          </>
        );
      }
      case 'withdraw': {
        const [
          {
            values: { savingsCredited },
          },
        ] = logs;

        const amount = new BigDecimal(savingsCredited, mAsset.decimals);

        return (
          <>
            You <span>withdrew</span> {amount.format()} {mAsset.symbol}
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

      const bAssetData = bAssets[bAsset.toLowerCase()];

      if (!bAssetData) return LOADING;

      const amount = new BigDecimal(mAssetQuantity, mAsset.decimals);

      return (
        <>
          You <span>minted</span> {amount.format()} {mAsset.symbol} with{' '}
          {bAssetData.symbol}
        </>
      );
    }
    case 'mintMulti': {
      const [
        {
          values: { mAssetQuantity },
        },
      ] = logs;

      const amount = new BigDecimal(mAssetQuantity, mAsset.decimals);

      return (
        <>
          You <span>minted</span> {amount.format()} {mAsset.symbol} with
          {' multiple bAssets'}
        </>
      );
    }
    case 'swap': {
      const {
        values: { input, output, outputAmount },
      } = logs[logs.length - 1];

      const inputBasset = bAssets[input.toLowerCase()];
      const outputBasset = bAssets[output.toLowerCase()];

      if (!inputBasset || !outputBasset) return LOADING;

      const amount = new BigDecimal(outputAmount, outputBasset.decimals);

      return (
        <>
          You <span>swapped</span> {inputBasset.symbol} for {amount.format()}{' '}
          {outputBasset.symbol}
        </>
      );
    }
    case 'redeem': {
      const {
        values: { mAssetQuantity, bAssets: redeemedBassets },
      } = logs[logs.length - 1];

      const bAssetTokens: BassetState[] = redeemedBassets
        .map((address: string) => bAssets[address.toLowerCase()])
        .filter(Boolean);

      if (bAssetTokens.length === 0) return LOADING;

      const amount = new BigDecimal(mAssetQuantity, mAsset.decimals);

      return (
        <>
          You <span>redeemed</span> {amount.format()}
          {' into '}
          {humanizeList(bAssetTokens.map(b => b.symbol))}
        </>
      );
    }
    case 'redeemMasset': {
      const [
        {
          values: { mAssetQuantity },
        },
      ] = logs;

      const amount = new BigDecimal(mAssetQuantity, mAsset.decimals);

      return (
        <>
          You <span>redeemed</span> {amount.format()}
        </>
      );
    }

    default:
      return <>Unknown</>;
  }
};

const HistoricTx: FC<{
  tx: HistoricTransaction;
  dataState?: DataState;
}> = ({ tx, dataState }) => {
  const { description, icon } = useMemo(() => {
    const fn = getHistoricTxFn(tx);
    return {
      description: fn
        ? getHistoricTransactionDescription(fn, tx, dataState)
        : null,
      icon: fn ? EMOJIS[fn] : null,
    };
  }, [tx, dataState]);

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
  const dataState = useDataState();

  return (
    <Container>
      {historic.length === 0 ? (
        <P size={2}>No historic transactions.</P>
      ) : (
        <List inverted>
          {historic.map(tx => (
            <ListItem key={tx.hash}>
              <HistoricTx tx={tx} dataState={dataState} />
            </ListItem>
          ))}
        </List>
      )}
    </Container>
  );
};
