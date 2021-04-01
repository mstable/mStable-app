import React, { FC, ReactElement, useMemo, useState } from 'react';

import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';
import { PageHeader, PageAction } from '../PageHeader';
import { MassetPage } from '../MassetPage';
import { MintMasset } from './MintMasset';
import { MintExact } from './MintExact';
import { TabCard } from '../../core/Tabs';

enum Tabs {
  Single = 'Single',
  Multiple = 'Multiple',
}

const getTabs = (): Record<
  Tabs,
  { title: string; component: ReactElement }
> => ({
  [Tabs.Single]: {
    title: `Single Asset`,
    component: <MintMasset />,
  },
  [Tabs.Multiple]: {
    title: 'Multiple Assets',
    component: <MintExact />,
  },
});

export const Mint: FC = () => {
  const massetState = useSelectedMassetState();
  const [activeTab, setActiveTab] = useState<string>(Tabs.Single as string);
  const tabs = useMemo(() => getTabs(), []);

  return massetState ? (
    <>
      <PageHeader
        action={PageAction.Mint}
        subtitle={`Convert into ${massetState.token.symbol}`}
      />
      <MassetPage asideVisible>
        <TabCard tabs={tabs} active={activeTab} onClick={setActiveTab} />
      </MassetPage>
    </>
  ) : null;
};
