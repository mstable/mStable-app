import React, { FC } from 'react';

import { Analytics as AnalyticsLegacy } from './legacy';
import { Analytics as AnalyticsCurvedMasset } from './curvedMasset';
import { useSelectedMassetName } from '../../../context/SelectedMassetNameProvider';

export const Analytics: FC = () => {
  const massetName = useSelectedMassetName();
  return massetName === 'musd' ? (
    <AnalyticsLegacy />
  ) : (
    <AnalyticsCurvedMasset />
  );
};
