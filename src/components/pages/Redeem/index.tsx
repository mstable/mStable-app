import React, { FC } from 'react';

import { Redeem as RedeemLegacy } from './legacy';
import { Redeem as RedeemAMM } from './amm';
import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';

export const Redeem: FC = () => {
  const { isLegacy } = useSelectedMassetState() ?? {};
  return isLegacy ? <RedeemLegacy /> : <RedeemAMM />;
};
