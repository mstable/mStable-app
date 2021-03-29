import React, { FC } from 'react';
import styled from 'styled-components';

import { useFeederPoolApy } from '../../../../hooks/useFeederPoolApy';
import { CountUp, DifferentialCountup } from '../../../core/CountUp';
import { Boost } from '../../../rewards/Boost';
import { useSelectedFeederPoolState } from '../FeederPoolProvider';

const Card = styled.div`
  border-radius: 1rem;
  border: 1px ${({ theme }) => theme.color.bodyTransparent} solid;

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.color.body};
    margin-bottom: 0.75rem;
  }

  > div {
    > div {
      > :last-child {
        > :last-child {
          h4 {
            font-weight: 600;
          }
          > * {
            margin-bottom: 1rem;
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
    <Card>
      <Boost
        inputAddress={feederPool.token.address}
        inputBalance={feederPool.token.balance}
      >
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
    </Card>
  );
};
