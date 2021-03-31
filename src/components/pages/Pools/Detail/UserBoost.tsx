import React, { FC } from 'react';
import styled from 'styled-components';

import { useFeederPoolApy } from '../../../../hooks/useFeederPoolApy';
import { CountUp, DifferentialCountup } from '../../../core/CountUp';
import { Boost } from '../../../rewards/Boost';
import { useSelectedFeederPoolState } from '../FeederPoolProvider';

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
      > :last-child {
        padding-top: 0.25rem;
        > :last-child {
          display: flex;
          margin-top: 2rem;
          h4 {
            font-weight: 600;
          }
          > *:not(:last-child) {
            margin-right: 3rem;
          }
        }
      }
    }
  }
`;

export const UserBoost: FC = () => {
  const feederPool = useSelectedFeederPoolState();
  const apy = useFeederPoolApy(feederPool.address);

  return (
    <Container>
      <Boost vault={feederPool.vault} disableCalculator>
        <div>
          <h3>Rewards APY</h3>
          <div>
            <div>
              <h4>Base APY</h4>
              {apy.value && <CountUp end={apy.value.base} suffix="%" />}
            </div>
            <div>
              <h4>My Boosted APY</h4>
              {apy.value && (
                <DifferentialCountup
                  prev={apy.value.base}
                  end={apy.value.userBoost}
                  suffix="%"
                />
              )}
            </div>
          </div>
        </div>
      </Boost>
    </Container>
  );
};
