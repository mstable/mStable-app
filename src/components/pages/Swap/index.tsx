import React, { FC } from 'react';

import { Swap as SwapLegacy } from './legacy';
import { Swap as SwapAMM } from './amm';
import { useSelectedMassetName } from '../../../context/SelectedMassetNameProvider';

export const Swap: FC = () => {
  const massetName = useSelectedMassetName();
  return massetName === 'musd' ? <SwapLegacy /> : <SwapAMM />;
};
