import React, { FC } from 'react';

import { Mint as MintLegacy } from './legacy';
import { Mint as MintAMM } from './amm';
import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';

export const Mint: FC = () => {
  const { isLegacy } = useSelectedMassetState() ?? {};
  return isLegacy ? <MintLegacy /> : <MintAMM />;
};
