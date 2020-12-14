import React, { FC } from 'react';

import { UserProvider } from './UserProvider';
import { AppProvider } from './AppProvider';
import { SelectedMassetNameProvider } from './SelectedMassetNameProvider';
import { NotificationsProvider } from './NotificationsProvider';
import { TransactionsProvider } from './TransactionsProvider';
import { ThemeProvider } from './ThemeProvider';
import { TokensProvider } from './TokensProvider';
import { BlockProvider } from './BlockProvider';
import { DataProvider } from './DataProvider/DataProvider';
import { ApolloProvider } from './ApolloProvider';

export const Providers: FC = ({ children }) => (
  <NotificationsProvider>
    <ApolloProvider>
      <UserProvider>
        <BlockProvider>
          <TransactionsProvider>
            <SelectedMassetNameProvider>
              <TokensProvider>
                <DataProvider>
                  <AppProvider>
                    <ThemeProvider>{children}</ThemeProvider>
                  </AppProvider>
                </DataProvider>
              </TokensProvider>
            </SelectedMassetNameProvider>
          </TransactionsProvider>
        </BlockProvider>
      </UserProvider>
    </ApolloProvider>
  </NotificationsProvider>
);
