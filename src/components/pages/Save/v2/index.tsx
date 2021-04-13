import React, { FC, useState } from 'react';

import { SaveDeposit } from './SaveDeposit';
import { SaveRedeem } from './SaveRedeem';
import { TabCard } from '../../../core/Tabs';

enum Tabs {
  Deposit = 'Deposit',
  Redeem = 'Redeem',
}

export const Save: FC = () => {
  const [activeTab, setActiveTab] = useState<string>(Tabs.Deposit as string);

  const tabs = {
    [Tabs.Deposit]: {
      title: `Deposit`,
      component: <SaveDeposit />,
    },
    [Tabs.Redeem]: {
      title: `Redeem`,
      component: <SaveRedeem />,
    },
  };

  return <TabCard tabs={tabs} active={activeTab} onClick={setActiveTab} />;
};
