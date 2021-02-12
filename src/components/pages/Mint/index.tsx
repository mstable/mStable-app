import React, { FC } from 'react';

import { Mint as MintLegacy } from './legacy';
import { Mint as MintAMM } from './amm';
import { useSelectedMassetName } from '../../../context/SelectedMassetNameProvider';

export const Mint: FC = () => {
  const massetName = useSelectedMassetName();
  return massetName === 'musd' ? <MintLegacy /> : <MintAMM />;
};
