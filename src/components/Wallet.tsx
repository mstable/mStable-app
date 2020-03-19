import React, { FC } from 'react';
import { useWallet } from 'use-wallet';
import styled from 'styled-components';

import { useUIContext } from '../context/UIProvider';
import { useTruncatedAddress } from '../web3/hooks';
import { useHasPendingTransactions } from '../context/TransactionsProvider';

interface InjectedEthereum {
  enable(): Promise<string[]>;
}

const Container = styled.div``;

const ConnectButton = styled.button``;

const AccountButton = styled.button``;

const PendingIndicator = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 100%;
  background: gold;
  margin-right: 10px;
`;

const Connected = styled.div`
  display: flex;
  align-items: center;
`;

export const WalletConnection: FC<{}> = () => {
  const { connected, account } = useWallet<InjectedEthereum>();
  const truncatedAddress = useTruncatedAddress(account);
  const [, { showWalletModal }] = useUIContext();
  const hasPendingTransactions = useHasPendingTransactions();
  return (
    <>
      <Container>
        {connected ? (
          <Connected>
            {hasPendingTransactions ? <PendingIndicator /> : null}
            <AccountButton type="submit" onClick={showWalletModal}>
              {truncatedAddress}
            </AccountButton>
          </Connected>
        ) : (
          <ConnectButton type="submit" onClick={showWalletModal}>
            connect wallet
          </ConnectButton>
        )}
      </Container>
    </>
  );
};
