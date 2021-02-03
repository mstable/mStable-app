import React, { FC } from 'react';
import { useToggle } from 'react-use';
import Skeleton from 'react-loading-skeleton';

import { useSelectedMassetState } from '../../../../context/DataProvider/DataProvider';

import { ToggleInput } from '../../../forms/ToggleInput';
import { PageAction, PageHeader } from '../../PageHeader';

import { RedeemExactBassets } from './RedeemExactBassets';
import { RedeemMasset } from './RedeemMasset';

export const Redeem: FC = () => {
  const massetState = useSelectedMassetState();
  const [isExactBassets, toggleIsExactBassets] = useToggle(false);

  return massetState ? (
    <div>
      <PageHeader
        action={PageAction.Redeem}
        subtitle={`Exchange ${massetState.token.symbol} for its underlying collateral`}
      />
      {isExactBassets ? <RedeemExactBassets /> : <RedeemMasset />}
      <div>
        Redeem to multiple assets
        <ToggleInput onClick={toggleIsExactBassets} checked={isExactBassets} />
      </div>
    </div>
  ) : (
    <Skeleton height={600} />
  );
};
