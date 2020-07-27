import React, { FC } from 'react';
import styled from 'styled-components';

import Skeleton from 'react-loading-skeleton/lib';
import { Amount, NumberFormat } from '../../../core/Amount';
import {
  useCurrentStakingRewardsContract,
  useCurrentStakingToken,
  useCurrentPlatformToken,
  useCurrentRewardsToken,
  useRewardsEarned,
} from '../StakingRewardsContractProvider';
import { BigDecimal } from '../../../../web3/BigDecimal';

interface Props {
  className?: string;
}

const Heading = styled.div`
  text-transform: uppercase;
  font-size: 14px;
  font-weight: bold;
  padding-bottom: 8px;
`;

const AmountContainer = styled.div`
  text-align: center;
  font-size: 24px;
`;

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;

  > div > * {
    margin-bottom: 16px;
  }
`;

// TODO remove
const pricePlaceholder = BigDecimal.parse('1.23', 18);

export const PoolBalances: FC<Props> = ({ className }) => {
  const stakingRewardsContract = useCurrentStakingRewardsContract();

  const { rewardsEarned, platformRewardsEarned } = useRewardsEarned();
  const rewardsToken = useCurrentRewardsToken();
  const stakingToken = useCurrentStakingToken();
  const platformToken = useCurrentPlatformToken();

  return (
    <Container className={className}>
      {stakingRewardsContract &&
      rewardsToken &&
      stakingToken &&
      rewardsEarned ? (
        <>
          <div>
            <AmountContainer>
              <Heading>Earned {rewardsToken.symbol}</Heading>
              <Amount
                format={NumberFormat.Countup}
                amount={rewardsEarned}
                countup={{ decimals: 6 }}
                price={rewardsToken.price || pricePlaceholder}
              />
            </AmountContainer>
            {stakingRewardsContract.platformRewards &&
            platformRewardsEarned &&
            platformToken ? (
              <AmountContainer>
                <Heading>Earned {platformToken.symbol}</Heading>
                <Amount
                  format={NumberFormat.Countup}
                  amount={platformRewardsEarned}
                  countup={{ decimals: 6 }}
                  price={platformToken.price || pricePlaceholder}
                />
              </AmountContainer>
            ) : null}
          </div>
          <div>
            <AmountContainer>
              <Heading>Staked {stakingToken.symbol}</Heading>
              <Amount
                format={NumberFormat.Countup}
                amount={stakingRewardsContract.stakingBalance}
                countup={{ decimals: 6 }}
                price={stakingToken.price || pricePlaceholder}
              />
            </AmountContainer>
          </div>
        </>
      ) : (
        <Skeleton height={900} />
      )}
    </Container>
  );
};
