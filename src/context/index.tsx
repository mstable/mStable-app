import React, { FC } from 'react';
import { UserProvider } from './UserProvider';
import { AppProvider } from './AppProvider';
import { AllDataProviders } from './DataProvider';
import { NotificationsProvider } from './NotificationsProvider';
import { TransactionsProvider } from './TransactionsProvider';
import { ThemeProvider } from './ThemeProvider';
import { EarnDataProvider } from './earn/EarnDataProvider';
import { CurveProvider } from './earn/CurveProvider';

export const Providers: FC<{}> = ({ children }) => (
  <NotificationsProvider>
    <UserProvider>
      <AllDataProviders>
        <CurveProvider>
          <EarnDataProvider>
            <TransactionsProvider>
              <AppProvider>
                <ThemeProvider>{children}</ThemeProvider>
              </AppProvider>
            </TransactionsProvider>
          </EarnDataProvider>
        </CurveProvider>
      </AllDataProviders>
    </UserProvider>
  </NotificationsProvider>
);
