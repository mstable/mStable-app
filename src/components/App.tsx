import React, { FunctionComponent } from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { UseWalletProvider } from 'use-wallet';
import { ContractProvider } from '../context/ContractProvider';
import { apolloClient } from '../context/apolloClient';
import { Layout } from './Layout';

export const App: FunctionComponent<{}> = () => {
  return (
    <UseWalletProvider chainId={1}>
      <ContractProvider>
        <ApolloProvider client={apolloClient}>
          <Layout />
        </ApolloProvider>
      </ContractProvider>
    </UseWalletProvider>
  );
};
