import React, { FC } from 'react';
import { UseWalletProvider } from 'use-wallet';
import { CHAIN_ID } from '../web3/constants';
import { AVAILABLE_CONNECTORS } from '../web3/connectors';
import { AppProvider } from './AppProvider';
import { AllDataProviders } from './DataProvider';
import { NotificationsProvider } from './NotificationsProvider';
import { SignerProvider } from './SignerProvider';
import { TransactionsProvider } from './TransactionsProvider';
import { UserActivityProvider } from './UserActivityProvider';
import { ThemeProvider } from './ThemeProvider';
import { EarnDataProvider } from './earn/EarnDataProvider';

export const Providers: FC<{}> = ({ children }) => (
  <NotificationsProvider>
    <UseWalletProvider chainId={CHAIN_ID} connectors={AVAILABLE_CONNECTORS}>
      <UserActivityProvider>
        <SignerProvider>
          <AllDataProviders>
            <EarnDataProvider>
              <TransactionsProvider>
                <AppProvider>
                  <ThemeProvider>{children}</ThemeProvider>
                </AppProvider>
              </TransactionsProvider>
            </EarnDataProvider>
          </AllDataProviders>
        </SignerProvider>
      </UserActivityProvider>
    </UseWalletProvider>
  </NotificationsProvider>
);
