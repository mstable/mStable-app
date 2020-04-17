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
    min-width: 140px;
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
    width: 32px;
    height: 32px;
  }
`;

const Account = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AccountButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px 0 0 !important;
  line-height: 100%;

  span {
    white-space: nowrap;
  }
`;

const PendingIndicatorContainer = styled.div`
  width: 16px;
  height: 16px;
  margin-right: ${({ theme }) => theme.spacing.xs};

  @media (min-width: ${ViewportWidth.s}) {
    width: 32px;
    height: 32px;
    margin-top: 4px;
  }
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
      {connected ? (
        <Account>
          <PendingIndicator />
          <AccountButton size={Size.s} title="Account">
            <Blockie>{blockie}</Blockie>
            <span>{truncatedAddress}</span>
          </AccountButton>
        </Account>
      ) : (
        <Button type="button" size={Size.s}>
          {walletExpanded ? (connecting ? 'Back' : 'Close') : 'Connect'}
        </Button>
      )}
    </Container>
  );
};
