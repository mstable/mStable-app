import React, { FC, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';
import { PageAction, PageHeader } from '../../PageHeader';
import { RedeemExactBassets } from './RedeemExactBassets';
import { RedeemMasset } from './RedeemMasset';
import { Toggle } from '../../../core/Toggle';
import { MassetPage } from '../../MassetPage';

enum ToggleOption {
  Single = 'Single',
  Multiple = 'Multiple',
}

const { Single, Multiple } = ToggleOption;

const title: { [key in ToggleOption]: string } = {
  [Single]: 'mBTC Amount',
  [Multiple]: 'Underlying Amount',
};

const info: { [key in ToggleOption]: string } = {
  [Single]: 'Redeem an exact amount of mBTC for its underlying collateral',
  [Multiple]: 'Redeem mBTC for an exact amount of its underlying collateral',
};

export const Redeem: FC = () => {
  const massetState = useSelectedMassetState();
  const [currentTab, setSelectedTab] = useState(Single);

  const toggleOptions = Object.keys(title).map(tab => ({
    title: title[tab as ToggleOption],
    onClick: () => setSelectedTab(tab as ToggleOption),
    active: currentTab === tab,
  }));

  const isExactBassets = currentTab !== ToggleOption.Single;

  return massetState ? (
    <div>
      <PageHeader action={PageAction.Redeem} subtitle={info[currentTab]}>
        <Toggle options={toggleOptions} />
      </PageHeader>
      <MassetPage>
        {isExactBassets ? <RedeemExactBassets /> : <RedeemMasset />}
      </MassetPage>
    </div>
  ) : (
    <Skeleton height={600} />
  );
};
