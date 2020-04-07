import React, { FC } from 'react';
import { UseWalletProvider } from 'use-wallet';
import { ThemeProvider } from 'styled-components';
import { ApolloProvider } from './ApolloProvider';
import { TransactionsProvider } from './TransactionsProvider';
import { UIProvider } from './UIProvider';
import { SignerProvider } from './SignerProvider';
import { KnownAddressProvider } from './KnownAddressProvider';
import { AVAILABLE_CONNECTORS, CHAIN_ID } from '../web3/constants';
import { TokensProvider } from './TokensProvider';
import { theme } from '../theme';

export const Providers: FC<{}> = ({ children }) => (
  <ApolloProvider>
    <UseWalletProvider chainId={CHAIN_ID} connectors={AVAILABLE_CONNECTORS}>
      <SignerProvider>
        <KnownAddressProvider>
          <TokensProvider>
            <TransactionsProvider>
              <UIProvider>
                <ThemeProvider theme={theme}>{children}</ThemeProvider>
              </UIProvider>
            </TransactionsProvider>
          </TokensProvider>
        </KnownAddressProvider>
      </SignerProvider>
    </UseWalletProvider>
  </ApolloProvider>
);
