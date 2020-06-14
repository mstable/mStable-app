import React, { FC, useMemo } from 'react';
import { BigNumber, formatUnits } from 'ethers/utils';
import { VictoryLabel } from 'victory-core';
import { VictoryLine } from 'victory-line';
import Skeleton from 'react-loading-skeleton';

import { useDailyApysForPastWeek } from '../../../web3/hooks';
import { Color } from '../../../theme';

export const DailyApys: FC<{}> = () => {
  const dailyApys = useDailyApysForPastWeek();

  const data = useMemo<{ x: number; y: number }[]>(
    () =>
      dailyApys
        .filter(a => a.value && a.start)
        .map(({ value, start }) => ({
          x: start as number,
          y: parseFloat(formatUnits(value as BigNumber, 16)),
        })),

    [dailyApys],
  );

  return data.length ? (
    <VictoryLine
      height={150}
      padding={0}
      domainPadding={30}
      data={data}
      labelComponent={<VictoryLabel />}
      labels={({ datum }) => `${datum.y.toFixed(2)}%`}
      style={{
        data: {
          stroke: Color.gold,
          strokeWidth: 4,
        },
        labels: {
          fontFamily: `'DM Mono', monospace`,
          fontSize: 14,
          textAnchor: 'middle',
        },
      }}
    />
  ) : (
    <Skeleton />
  );
};
