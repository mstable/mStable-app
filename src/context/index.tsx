import React, { FC } from 'react';
import { UseWalletProvider } from 'use-wallet';
import { ModalProvider } from 'react-modal-hook';
import { ApolloProvider } from './ApolloProvider';
import { TransactionsProvider } from './TransactionsProvider';
import { UIProvider } from './UIProvider';
import { SignerProvider } from './SignerProvider';
import { ModalRoot } from '../components/ModalRoot';
import { AVAILABLE_CONNECTORS, CHAIN_ID } from '../web3/constants';

export const Providers: FC<{}> = ({ children }) => {
  return (
    <ApolloProvider>
      <UseWalletProvider chainId={CHAIN_ID} connectors={AVAILABLE_CONNECTORS}>
        <SignerProvider>
          <TransactionsProvider>
            <ModalProvider rootComponent={ModalRoot}>
              <UIProvider>{children}</UIProvider>
            </ModalProvider>
          </TransactionsProvider>
        </SignerProvider>
      </UseWalletProvider>
    </ApolloProvider>
  );
};
