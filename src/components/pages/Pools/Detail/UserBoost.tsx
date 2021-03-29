import React, { FC } from 'react';
import styled from 'styled-components';
import { Boost } from '../../../rewards/Boost';
import { useSelectedFeederPoolState } from '../FeederPoolProvider';
import { CountUp, DifferentialCountup } from '../../../core/CountUp';

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

  const baseApy = 10.12;
  const boostedApy = 33.55;

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
              <CountUp end={baseApy} suffix="%" />
            </div>
            <div>
              <h4>My Boosted APY</h4>
              <DifferentialCountup prev={baseApy} end={boostedApy} suffix="%" />
            </div>
          </div>
        </div>
      </Boost>
    </Card>
  );
};
