import React, { FC } from 'react';

import { AccountItems, useAccountItem } from '../../context/AppProvider';
import { Wallet } from '../wallet/Wallet';

export const Account: FC = () => {
  const accountItem = useAccountItem();

  return accountItem === AccountItems.Wallet ? <Wallet /> : null;
};
