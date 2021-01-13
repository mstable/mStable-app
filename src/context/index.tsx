import React, { FC } from 'react';
import { ModalProvider } from 'react-modal-hook';

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
import { GasPricesProvider } from './GasPricesProvider';

export const Providers: FC = ({ children }) => (
  <NotificationsProvider>
    <ApolloProvider>
      <UserProvider>
        <BlockProvider>
          <GasPricesProvider>
            <TransactionsProvider>
              <SelectedMassetNameProvider>
                <TokensProvider>
                  <DataProvider>
                    <AppProvider>
                      <ThemeProvider>
                        <SelectedSaveVersionProvider>
                          <ModalProvider>{children}</ModalProvider>
                        </SelectedSaveVersionProvider>
                      </ThemeProvider>
                    </AppProvider>
                  </DataProvider>
                </TokensProvider>
              </SelectedMassetNameProvider>
            </TransactionsProvider>
          </GasPricesProvider>
        </BlockProvider>
      </UserProvider>
    </ApolloProvider>
  </NotificationsProvider>
);
