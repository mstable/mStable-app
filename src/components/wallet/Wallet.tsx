import React, { FC } from 'react';
import { useWalletExpanded } from '../../context/UIProvider';
import { CollapsedWallet } from './CollapsedWallet';
import { ExpandedWallet } from './ExpandedWallet';

export const Wallet: FC<{}> = () => {
  const walletExpanded = useWalletExpanded();
  return walletExpanded ? <ExpandedWallet /> : <CollapsedWallet />;
};
