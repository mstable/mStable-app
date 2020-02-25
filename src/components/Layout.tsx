import React, { FunctionComponent } from 'react';
import { WalletConnection } from './Wallet';
import { Token } from './Token';

export const Layout: FunctionComponent<{}> = () => (
  <div>
    <h1>App</h1>
    <WalletConnection />
    <Token id="0x02f1398bcdd4821133b448f5cde8cdce010f77a0" />
  </div>
);
