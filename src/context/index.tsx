import React, { FC } from 'react';
import { UseWalletProvider } from 'use-wallet';
import { ThemeProvider } from 'styled-components';
import { NotificationsProvider } from './NotificationsProvider';
import { ApolloProvider } from './ApolloProvider';
import { TransactionsProvider } from './TransactionsProvider';
import { AppProvider } from './AppProvider';
import { SignerProvider } from './SignerProvider';
import { KnownAddressProvider } from './KnownAddressProvider';
import { AVAILABLE_CONNECTORS, CHAIN_ID } from '../web3/constants';
import { TokensProvider } from './TokensProvider';
import { StorageProvider } from './StorageProvider';
import { theme } from '../theme';

export const Providers: FC<{}> = ({ children }) => (
  <NotificationsProvider>
    <ApolloProvider>
      <UseWalletProvider chainId={CHAIN_ID} connectors={AVAILABLE_CONNECTORS}>
        <StorageProvider>
          <SignerProvider>
            <KnownAddressProvider>
              <TokensProvider>
                <TransactionsProvider>
                  <AppProvider>
                    <ThemeProvider theme={theme}>{children}</ThemeProvider>
                  </AppProvider>
                </TransactionsProvider>
              </TokensProvider>
            </KnownAddressProvider>
          </SignerProvider>
        </StorageProvider>
      </UseWalletProvider>
    </ApolloProvider>
  </NotificationsProvider>
);
