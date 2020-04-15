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
import { Size } from '../../theme';
import { InjectedEthereum } from '../../types';
import { useHasPendingTransactions } from '../../context/TransactionsProvider';
import { ActivitySpinner } from '../core/ActivitySpinner';

const Container = styled.div`
  min-width: 80px;
  button {
    width: 100%;
  }
`;

const Blockie = styled.div`
  width: 21px;
  height: 21px;
  margin-right: ${({ theme }) => theme.spacing.xs};
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
  padding: 0 4px 0 0;
  line-height: 100%;
`;

const PendingIndicatorContainer = styled.div`
  width: 16px;
  height: 16px;
  margin: ${({ theme }) => `3px ${theme.spacing.xs} 0 0`};
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
          <AccountButton size={Size.s}>
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
