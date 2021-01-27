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
import { SelectedSaveVersionProvider } from './SelectedSaveVersionProvider';
import { EthProvider } from './EthProvider';

export const Providers: FC = ({ children }) => (
  <NotificationsProvider>
    <ApolloProvider>
      <UserProvider>
        <BlockProvider>
          <EthProvider>
            <TransactionsProvider>
              <SelectedMassetNameProvider>
                <TokensProvider>
                  <DataProvider>
                    <AppProvider>
                      <ThemeProvider>
                        <SelectedSaveVersionProvider>
                          {children}
                        </SelectedSaveVersionProvider>
                      </ThemeProvider>
                    </AppProvider>
                  </DataProvider>
                </TokensProvider>
              </SelectedMassetNameProvider>
            </TransactionsProvider>
          </EthProvider>
        </BlockProvider>
      </UserProvider>
    </ApolloProvider>
  </NotificationsProvider>
);
