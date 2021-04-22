import { composedComponent } from '../utils/reactUtils'

import { AppProvider } from './AppProvider'
import { SelectedMassetNameProvider } from './SelectedMassetNameProvider'
import { NotificationsProvider } from './NotificationsProvider'
import { TransactionsProvider } from './TransactionsProvider'
import { ThemeProvider } from './ThemeProvider'
import { TokensProvider } from './TokensProvider'
import { BlockProvider } from './BlockProvider'
import { DataProvider } from './DataProvider/DataProvider'
import { ApolloProvider } from './ApolloProvider'
import { SelectedSaveVersionProvider } from './SelectedSaveVersionProvider'
import { NetworkProvider } from './NetworkProvider'
import { AccountProvider } from './AccountProvider'

export const Providers = composedComponent(
  NetworkProvider,
  NotificationsProvider,
  ApolloProvider,
  AccountProvider,
  BlockProvider,
  TransactionsProvider,
  SelectedMassetNameProvider,
  TokensProvider,
  DataProvider,
  AppProvider,
  SelectedSaveVersionProvider,
  ThemeProvider,
)
