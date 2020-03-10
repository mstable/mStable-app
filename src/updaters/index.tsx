import React, { FC } from 'react';
import { TransactionsUpdater } from './transactionsUpdater';
import { TokensUpdater } from './tokensUpdater';

export const Updaters: FC<{}> = () => (
  <>
    <TokensUpdater />
    <TransactionsUpdater />
  </>
);
