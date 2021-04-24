import React, { FC } from 'react';
import styled from 'styled-components';

import { CountUp, DifferentialCountup } from '../core/CountUp';
import { Boost } from './Boost';
import { BoostedSavingsVaultState } from '../../context/DataProvider/types';
import { FetchState } from '../../hooks/useFetchState';
import { ThemedSkeleton } from '../core/ThemedSkeleton';

const Container = styled.div`
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.color.body};
  }

  > div {
    padding: 0;
    > div {
      display: flex;
      justify-content: space-between;

      p {
        font-size: 0.875rem;
        margin-top: 0.5rem;
      }

      > :last-child {
        > :first-child {
          display: flex;
          justify-content: space-between;
          h4 {
            font-weight: 600;
          }
        }
        p {
          margin-top: 1rem;
        }
      }
    }
  }
`;

export const UserBoost: FC<{
  vault: BoostedSavingsVaultState;
  apy: FetchState<{ base: number; maxBoost: number; userBoost?: number }>;
}> = ({ vault, vault: { isImusd }, apy }) => (
  <Container>
    <Boost vault={vault} apy={apy.value?.base}>
      <div>
        <div>
          <div>
            <h4>Base APY</h4>
            {apy.fetching ? (
              <ThemedSkeleton height={20} width={64} />
            ) : (
              apy.value && <CountUp end={apy.value.base} suffix="%" />
            )}
          </div>
          <div>
            <h4>Max APY</h4>
            {apy.fetching ? (
              <ThemedSkeleton height={20} width={64} />
            ) : (
              apy.value && <CountUp end={apy.value.maxBoost} suffix="%" />
            )}
          </div>
          <div>
            <h4>My APY</h4>
            {apy.fetching ? (
              <ThemedSkeleton height={20} width={64} />
            ) : (
              apy.value && (
                <DifferentialCountup
                  prev={apy.value.base}
                  end={apy.value?.userBoost ?? apy.value.base}
                  suffix="%"
                />
              )
            )}
          </div>
        </div>
        <p>
          {isImusd ? 20 : 33}% of earned MTA rewards are claimable immediately.
          The remaining rewards are streamed linearly after 26 weeks
        </p>
      </div>
    </Boost>
  </Container>
);
