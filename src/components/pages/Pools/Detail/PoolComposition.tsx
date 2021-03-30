import React, { FC, useMemo } from 'react';
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { RechartsContainer } from '../../../stats/RechartsContainer';
import { assetColorMapping } from '../constants';
import { useSelectedFeederPoolState } from '../FeederPoolProvider';
import { toK } from '../../../stats/utils';
import { Color } from '../../../../theme';

const MARGIN = { top: 40, left: 16, right: 0, bottom: 0 };

export const PoolComposition: FC = () => {
  const { masset, fasset } = useSelectedFeederPoolState();

  const data = useMemo(
    () => [
      {
        name: masset.token.symbol,
        value: masset.totalVaultInMasset.simple,
        fill: assetColorMapping[masset.token.symbol] ?? '#444',
      },
      {
        name: fasset.token.symbol,
        value: fasset.totalVaultInMasset.simple,
        fill: assetColorMapping[fasset.token.symbol] ?? '#888',
      },
    ],
    [masset, fasset],
  );

  return (
    <RechartsContainer>
      <ResponsiveContainer aspect={2}>
        <PieChart margin={MARGIN}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={data}
            fill="fill"
          />
          <Legend align="left" layout="vertical" verticalAlign="middle" />
          <Tooltip
            formatter={toK as never}
            separator=" "
            contentStyle={{
              fontSize: '14px',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'right',
              border: 'none',
              borderRadius: '4px',
              color: Color.black,
            }}
            wrapperStyle={{
              top: 0,
              left: 0,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </RechartsContainer>
  );
};
