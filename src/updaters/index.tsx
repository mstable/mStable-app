import React, { FC } from 'react';
import { KnownAddressUpdater } from './knownAddressUpdater';
import { TransactionsUpdater } from './transactionsUpdater';
import { TokenBalancesUpdater } from './tokenBalancesUpdater';
import { TokenSubscriptionUpdater } from './tokenSubscriptionUpdater';

export const Updaters: FC<{}> = () => (
  <>
    <TokenBalancesUpdater />
    <TokenSubscriptionUpdater />
    <KnownAddressUpdater />
    <TransactionsUpdater />
  </>
);


