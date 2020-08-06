import React, { FC } from 'react';
import { UserProvider } from './UserProvider';
import { AppProvider } from './AppProvider';
import { AllDataProviders } from './DataProvider';
import { NotificationsProvider } from './NotificationsProvider';
import { SignerProvider } from './SignerProvider';
import { TransactionsProvider } from './TransactionsProvider';
import { ThemeProvider } from './ThemeProvider';
import { EarnDataProvider } from './earn/EarnDataProvider';

export const Providers: FC<{}> = ({ children }) => (
  <NotificationsProvider>
    <UserProvider>
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
    </UserProvider>
  </NotificationsProvider>
);
