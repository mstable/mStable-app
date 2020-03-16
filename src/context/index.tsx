import React, { FC } from 'react';
import { UseWalletProvider } from 'use-wallet';
import { ModalProvider } from 'react-modal-hook';
import { ApolloProvider } from './ApolloProvider';
import { TransactionsProvider } from './TransactionsProvider';
import { UIProvider } from './UIProvider';
import { SignerProvider } from './SignerProvider';
import { KnownAddressProvider } from './KnownAddressProvider';
import { ModalRoot } from '../components/ModalRoot';
import { AVAILABLE_CONNECTORS, CHAIN_ID } from '../web3/constants';
import { TokensProvider } from './TokensProvider';

export const Providers: FC<{}> = ({ children }) => (
  <ApolloProvider>
    <UseWalletProvider chainId={CHAIN_ID} connectors={AVAILABLE_CONNECTORS}>
      <SignerProvider>
        <TokensProvider>
          <KnownAddressProvider>
            <TransactionsProvider>
              <ModalProvider rootComponent={ModalRoot}>
                <UIProvider>{children}</UIProvider>
              </ModalProvider>
            </TransactionsProvider>
          </KnownAddressProvider>
        </TokensProvider>
      </SignerProvider>
    </UseWalletProvider>
  </ApolloProvider>
);
