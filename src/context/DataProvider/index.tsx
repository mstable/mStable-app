import React, { FC } from 'react';

import { ApolloProvider } from './ApolloProvider';
import { ContractsProvider } from './ContractsProvider';
import { KnownAddressProvider } from './KnownAddressProvider';
import { TokensProvider } from './TokensProvider';
import { DataProvider } from './DataProvider';

export const AllDataProviders: FC<{}> = ({ children }) => (
  <ApolloProvider>
    <KnownAddressProvider>
      <ContractsProvider>
        <TokensProvider>
          <DataProvider>{children}</DataProvider>
        </TokensProvider>
      </ContractsProvider>
    </KnownAddressProvider>
  </ApolloProvider>
);
