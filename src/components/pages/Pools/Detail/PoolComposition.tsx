import React, { FC, useMemo } from 'react';
import { Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import styled from 'styled-components';

import { RechartsContainer } from '../../../stats/RechartsContainer';
import { assetColorMapping } from '../constants';
import { useSelectedFeederPoolState } from '../FeederPoolProvider';
import { toK } from '../../../stats/utils';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.color.accent};
  border-radius: 1rem;

  > h3 {
    font-weight: 600;
    font-size: 1.2rem;
  }
`;

export const PoolComposition: FC = () => {
  const { masset, fasset } = useSelectedFeederPoolState();

  const data = useMemo(
    () => [
      {
        name: masset.token.symbol,
        value: masset.totalVault.simple,
        fill: assetColorMapping[masset.token.symbol] ?? '#444',
      },
      {
        name: fasset.token.symbol,
        value: fasset.totalVault.simple,
        fill: assetColorMapping[fasset.token.symbol] ?? '#888',
      },
    ],
    [masset, fasset],
  );

  return (
    <Container>
      <h3>Pool Composition</h3>
      <RechartsContainer>
        <ResponsiveContainer aspect={1} width={200} maxHeight={200}>
          <PieChart margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
            <Pie
              dataKey="value"
              isAnimationActive={false}
              data={data}
              fill="fill"
            />
            <Legend />
            <Tooltip formatter={toK as never} />
          </PieChart>
        </ResponsiveContainer>
      </RechartsContainer>
    </Container>
  );
};
