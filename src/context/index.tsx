import React, { FC } from 'react';
import { UseWalletProvider } from 'use-wallet';
import { AVAILABLE_CONNECTORS, CHAIN_ID } from '../web3/constants';
import { AppProvider } from './AppProvider';
import { AllDataProviders } from './DataProvider';
import { NotificationsProvider } from './NotificationsProvider';
import { SignerProvider } from './SignerProvider';
import { TransactionsProvider } from './TransactionsProvider';
import { UserActivityProvider } from './UserActivityProvider';
import { ThemeProvider } from './ThemeProvider';

export const Providers: FC<{}> = ({ children }) => (
  <NotificationsProvider>
    <UseWalletProvider chainId={CHAIN_ID} connectors={AVAILABLE_CONNECTORS}>
      <UserActivityProvider>
        <SignerProvider>
          <AllDataProviders>
            <TransactionsProvider>
              <AppProvider>
                <ThemeProvider>{children}</ThemeProvider>
              </AppProvider>
            </TransactionsProvider>
          </AllDataProviders>
        </SignerProvider>
      </UserActivityProvider>
    </UseWalletProvider>
  </NotificationsProvider>
);
