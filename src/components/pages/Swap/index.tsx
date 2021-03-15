import React, { FC } from 'react';

import { Swap as SwapLegacy } from './legacy';
import { Swap as SwapAMM } from './amm';
import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';

export const Swap: FC = () => {
  const { isLegacy } = useSelectedMassetState() ?? {};
  return isLegacy ? <SwapLegacy /> : <SwapAMM />;
};
