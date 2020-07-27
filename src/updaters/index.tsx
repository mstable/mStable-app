import React, { FC } from 'react';
import { KnownAddressUpdater } from './knownAddressUpdater';
import { TransactionsUpdater } from './transactionsUpdater';
import { TokenSubscriptionsUpdater } from './tokenSubscriptionsUpdater';
import { TokenFetcher } from './tokenFetcher';
import { ContractsUpdater } from './contractsUpdater';

export const Updaters: FC<{}> = () => (
  <>
    <TokenFetcher />
    <TokenSubscriptionsUpdater />
    <KnownAddressUpdater />
    <TransactionsUpdater />
    <ContractsUpdater />
  </>
);
