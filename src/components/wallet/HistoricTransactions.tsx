import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { useOrderedHistoricTransactions } from '../../context/TransactionsProvider';
import { ContractNames, HistoricTransaction } from '../../types';
import { EtherscanLink } from '../core/EtherscanLink';
import { MassetQuery } from '../../graphql/generated';
import { useKnownAddress, useMUSD } from '../../context/KnownAddressProvider';
import { formatExactAmount } from '../../web3/amounts';
import { EMOJIS } from '../../web3/constants';
import { P } from '../core/Typography';

type FnName = 'mint' | 'redeem' | 'withdraw' | 'depositSavings';

const LOADING = 'Loading...';

const Container = styled.div``;

const List = styled.ul`
  padding: 0;
  width: 100%;
`;

const Item = styled.li`
  border-top: 1px rgba(255, 255, 255, 0.3) solid;
  padding: ${({ theme }) => theme.spacing.m};
`;

const HistoricTxContainer = styled.div`
  align-items: flex-start;
  display: flex;
  > * {
    margin-right: 8px;
  }
  > p {
    margin-bottom: 0;
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
  if (logs.find(({ name }) => name === 'Minted')) {
    return 'mint';
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
): string => {
  if (!mUSD) return LOADING;

  if (contractAddress.toLowerCase() === mUSDSavingsAddress) {
    switch (fn) {
      case 'depositSavings': {
        const [
          {
            values: { savingsDeposited },
          },
        ] = logs;
        return `You deposited ${formatExactAmount(
          savingsDeposited,
          mUSD.token.decimals,
        )} mUSD`;
      }
      case 'withdraw': {
        const [
          {
            values: { creditsRedeemed },
          },
        ] = logs;
        return `You withdrew ${formatExactAmount(
          creditsRedeemed,
          mUSD.token.decimals,
        )} mUSD`;
      }
      default:
        return 'Unknown';
    }
  }

  switch (fn) {
    case 'redeem': {
      const [
        {
          values: { feeQuantity },
        },
        {
          values: { mAssetQuantity, bAsset, bAssetQuantity },
        },
      ] = logs;

      const bAssetToken = mUSD.basket.bassets.find(
        b => b.id === bAsset.toLowerCase(),
      );
      if (!bAssetToken) return LOADING;

      return `You redeemed ${formatExactAmount(
        bAssetQuantity,
        bAssetToken.token.decimals,
        bAssetToken.token.symbol,
      )} for ${formatExactAmount(
        mAssetQuantity,
        mUSD.token.decimals,
        mUSD.token.symbol,
      )} (fee paid: ${formatExactAmount(
        feeQuantity,
        mUSD.token.decimals,
        mUSD.token.symbol,
      )})`;
    }

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

      return `You minted ${formatExactAmount(
        mAssetQuantity,
        mUSD.token.decimals,
        mUSD.token.symbol,
      )} with ${formatExactAmount(
        bAssetQuantity,
        bAssetToken.token.decimals,
        bAssetToken.token.symbol,
      )}`;
    }
    default:
      return 'Unknown';
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
        <P>{description}</P>
      </EtherscanLink>
    </HistoricTxContainer>
  );
};

export const HistoricTransactions: FC<{}> = () => {
  const historic = useOrderedHistoricTransactions();
  const mUSD = useMUSD();
  const mUSDSavingsAddress = useKnownAddress(ContractNames.mUSDSavings);

  return (
    <Container>
      {historic.length === 0 ? (
        'No historic transactions'
      ) : (
        <List>
          {historic.map(tx => (
            <Item key={tx.hash}>
              <HistoricTx
                tx={tx}
                mUSD={mUSD}
                mUSDSavingsAddress={mUSDSavingsAddress}
              />
            </Item>
          ))}
        </List>
      )}
    </Container>
  );
};
