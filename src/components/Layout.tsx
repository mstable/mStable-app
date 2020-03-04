import React, { FunctionComponent } from 'react';
import { WalletConnection } from './Wallet';
import { Transactions } from './Transactions';
import { Mint } from './Mint';

export const Layout: FunctionComponent<{}> = () => (
  <div>
    <WalletConnection />
    <Transactions />
    <Mint />
  </div>
);
