import React, { FC } from 'react';
import { useWallet } from 'use-wallet';
import styled from 'styled-components';
import {
  useAppDispatch,
  useIsWalletConnecting,
  useWalletExpanded,
} from '../../context/AppProvider';
import { useTruncatedAddress, useBlockie } from '../../web3/hooks';
import { Button } from '../core/Button';
import { Size, ViewportWidth } from '../../theme';
import { InjectedEthereum } from '../../types';
import { useHasPendingTransactions } from '../../context/TransactionsProvider';
import { ActivitySpinner } from '../core/ActivitySpinner';

const Container = styled.div`
  @media (min-width: ${ViewportWidth.s}) {
    width: 135px;
  }

  button {
    width: 100%;
  }
`;

const Blockie = styled.div`
  width: 16px;
  height: 16px;

  canvas {
    height: 100%;
  }

  @media (min-width: ${ViewportWidth.s}) {
    width: 30px;
    height: 30px;
  }
`;

const TruncatedAddress = styled.div`
  font-weight: normal;
`;

const AccountButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 100%;
  font-size: ${({ theme }) => theme.fontSize.xs};
  height: 24px;
  margin-bottom: 8px;

  @media (min-width: ${ViewportWidth.m}) {
    height: 32px;
    padding: 0 6px 0 0;
    margin-bottom: 0;
  }

  > span {
    width: 100%;
  }

  > * {
    margin-right: 3px;
  }

  > :last-child {
    margin-right: 0;
  }
`;

const PendingIndicatorContainer = styled.div`
  width: 16px;
`;

const PendingIndicator: FC<{}> = () => {
  const hasPendingTxs = useHasPendingTransactions();
  return (
    <PendingIndicatorContainer
      title={hasPendingTxs ? 'Pending transactions' : ''}
    >
      {hasPendingTxs ? <ActivitySpinner /> : null}
    </PendingIndicatorContainer>
  );
};

export const WalletButton: FC<{}> = () => {
  const { connected, account } = useWallet<InjectedEthereum>();
  const connecting = useIsWalletConnecting();
  const truncatedAddress = useTruncatedAddress(account);
  const walletExpanded = useWalletExpanded();
  const { expandWallet, collapseWallet, resetWallet } = useAppDispatch();
  const blockie = useBlockie(account);

  return (
    <Container
      onClick={
        walletExpanded
          ? connecting
            ? resetWallet
            : collapseWallet
          : expandWallet
      }
    >
      <AccountButton size={Size.s} title="Account">
        {connected ? (
          <>
            <Blockie>{blockie}</Blockie>
            <TruncatedAddress>{truncatedAddress}</TruncatedAddress>
            <PendingIndicator />
          </>
        ) : (
          <span>
            {walletExpanded ? (connecting ? 'Back' : 'Close') : 'Connect'}
          </span>
        )}
      </AccountButton>
    </Container>
  );
};
