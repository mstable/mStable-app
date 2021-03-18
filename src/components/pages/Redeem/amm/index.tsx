import React, { FC, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { PageAction, PageHeader } from '../../PageHeader';
import { RedeemExactBassets } from './RedeemExactBassets';
import { RedeemMasset } from './RedeemMasset';
import { MassetPage } from '../../MassetPage';
import { TabSwitch } from '../../../core/Tabs';

enum Tabs {
  Single = 'Single',
  Multiple = 'Multiple',
}

const tabs = {
  [Tabs.Single]: {
    title: `mBTC Amount`,
    subtitle: 'Redeem an exact amount of mBTC for its underlying collateral',
    component: <RedeemMasset />,
  },
  [Tabs.Multiple]: {
    title: 'Underlying Amount',
    subtitle: 'Redeem mBTC for an exact amount of its underlying collateral',
    component: <RedeemExactBassets />,
  },
};

export const Redeem: FC = () => {
  const massetState = useSelectedMassetState();
  const [activeTab, setActiveTab] = useState<string>(Tabs.Single as string);

  return massetState ? (
    <div>
      <PageHeader
        action={PageAction.Redeem}
        subtitle={tabs[activeTab as Tabs].subtitle}
      />
      <MassetPage asideVisible>
        <TabSwitch tabs={tabs} active={activeTab} onClick={setActiveTab} />
      </MassetPage>
    </div>
  ) : (
    <Skeleton height={600} />
  );
};
