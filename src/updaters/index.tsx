import React, { FC } from 'react';
import { KnownAddressUpdater } from './knownAddressUpdater';
import { TransactionsUpdater } from './transactionsUpdater';
import { TokenBalancesUpdater } from './tokenBalancesUpdater';
import { TokenSubscriptionUpdater } from './tokenSubscriptionUpdater';
import { ContractsUpdater } from './contractsUpdater';
import { StorageUpdater } from './storageUpdater';

export const Updaters: FC<{}> = () => (
  <>
    <TokenBalancesUpdater />
    <TokenSubscriptionUpdater />
    <KnownAddressUpdater />
    <TransactionsUpdater />
    <ContractsUpdater />
    <StorageUpdater />
  </>
);
