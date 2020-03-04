import React, { FC } from 'react';
import { UseWalletProvider } from 'use-wallet';
import { ApolloProvider } from './ApolloProvider';
import { TransactionsProvider } from './TransactionsProvider';
import { UIProvider } from './UIProvider';
import { SignerProvider } from './SignerProvider';

export const Providers: FC<{}> = ({ children }) => (
  <ApolloProvider>
    <UseWalletProvider chainId={1337}>
      <SignerProvider>
        <TransactionsProvider>
          <UIProvider>{children}</UIProvider>
        </TransactionsProvider>
      </SignerProvider>
    </UseWalletProvider>
  </ApolloProvider>
);
