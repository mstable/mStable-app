import React, { FC } from 'react';

import { Analytics as AnalyticsLegacy } from './legacy';
import { Analytics as AnalyticsAMM } from './amm';
import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider';

export const Analytics: FC = () => {
  const { isLegacy } = useSelectedMassetState() ?? {};
  return isLegacy ? <AnalyticsLegacy /> : <AnalyticsAMM />;
};
