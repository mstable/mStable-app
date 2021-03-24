import React, { FC, useMemo, useState, ReactElement } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { PageAction, PageHeader } from '../../PageHeader';
import { RedeemExactBassets } from './RedeemExactBassets';
import { RedeemMasset } from './RedeemMasset';
import { MassetPage } from '../../MassetPage';
import { TabCard } from '../../../core/Tabs';

enum Tabs {
  Single = 'Single',
  Multiple = 'Multiple',
}

const getTabs = (
  massetSymbol = 'mAsset',
): Record<
  Tabs,
  { title: string; subtitle: string; component: ReactElement }
> => ({
  [Tabs.Single]: {
    title: `${massetSymbol} Amount`,
    subtitle: `Redeem an exact amount of ${massetSymbol} for its underlying collateral`,
    component: <RedeemMasset />,
  },
  [Tabs.Multiple]: {
    title: 'Underlying Amount',
    subtitle: `Redeem ${massetSymbol} for an exact amount of its underlying collateral`,
    component: <RedeemExactBassets />,
  },
});

export const Redeem: FC = () => {
  const massetState = useSelectedMassetState();
  const [activeTab, setActiveTab] = useState<string>(Tabs.Single as string);

  const symbol = massetState?.token.symbol;
  const tabs = useMemo(() => getTabs(symbol), [symbol]);

  return massetState ? (
    <div>
      <PageHeader
        action={PageAction.Redeem}
        subtitle={tabs[activeTab as Tabs].subtitle}
      />
      <MassetPage asideVisible>
        <TabCard tabs={tabs} active={activeTab} onClick={setActiveTab} />
      </MassetPage>
    </div>
  ) : (
    <Skeleton height={600} />
  );
};
