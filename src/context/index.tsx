import React, { FC } from 'react';
import { UseWalletProvider } from 'use-wallet';
import { ThemeProvider } from 'styled-components';
import { AVAILABLE_CONNECTORS, CHAIN_ID } from '../web3/constants';
import { AppProvider } from './AppProvider';
import { AllDataProviders } from './DataProvider';
import { NotificationsProvider } from './NotificationsProvider';
import { SignerProvider } from './SignerProvider';
import { TransactionsProvider } from './TransactionsProvider';
import { theme } from '../theme';

export const Providers: FC<{}> = ({ children }) => (
  <NotificationsProvider>
    <UseWalletProvider chainId={CHAIN_ID} connectors={AVAILABLE_CONNECTORS}>
      <SignerProvider>
        <AllDataProviders>
          <TransactionsProvider>
            <AppProvider>
              <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </AppProvider>
          </TransactionsProvider>
        </AllDataProviders>
      </SignerProvider>
    </UseWalletProvider>
  </NotificationsProvider>
);
