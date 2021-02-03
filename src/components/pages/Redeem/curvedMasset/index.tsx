import React, { FC, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';

import { PageAction, PageHeader } from '../../PageHeader';

import { RedeemExactBassets } from './RedeemExactBassets';
import { RedeemMasset } from './RedeemMasset';
import { Toggle } from '../../../core/Toggle';

enum ToggleOption {
  Single = 'Single Asset',
  Multiple = 'Multiple Assets',
}

export const Redeem: FC = () => {
  const massetState = useSelectedMassetState();
  const [currentTab, setSelectedTab] = useState(ToggleOption.Single);

  const options = [ToggleOption.Single, ToggleOption.Multiple];

  const toggleOptions = options.map(tab => ({
    title: tab,
    onClick: () => setSelectedTab(tab as ToggleOption),
    active: currentTab === tab,
  }));

  const isExactBassets = currentTab !== ToggleOption.Single;

  return massetState ? (
    <div>
      <PageHeader
        action={PageAction.Redeem}
        subtitle={`Exchange ${massetState.token.symbol} for its underlying collateral`}
      >
        <Toggle options={toggleOptions} />
      </PageHeader>
      {isExactBassets ? <RedeemExactBassets /> : <RedeemMasset />}
    </div>
  ) : (
    <Skeleton height={600} />
  );
};
