import React, { FC } from 'react'

import { Stats as AnalyticsLegacy } from './legacy'
import { Stats as AnalyticsAMM } from './amm'
import { useSelectedMassetState } from '../../../context/DataProvider/DataProvider'

export const Stats: FC = () => {
  const { isLegacy } = useSelectedMassetState() ?? {}
  return isLegacy ? <AnalyticsLegacy /> : <AnalyticsAMM />
}
