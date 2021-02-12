import React, { FC } from 'react';

import { Redeem as RedeemLegacy } from './legacy';
import { Redeem as RedeemAMM } from './amm';
import { useSelectedMassetName } from '../../../context/SelectedMassetNameProvider';

export const Redeem: FC = () => {
  const massetName = useSelectedMassetName();
  return massetName === 'musd' ? <RedeemLegacy /> : <RedeemAMM />;
};
