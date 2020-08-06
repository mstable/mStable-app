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
import { ViewportWidth } from '../../../../theme';

interface Props {
  className?: string;
}

const Heading = styled.div`
  text-transform: uppercase;
  font-size: 14px;
  font-weight: bold;
  padding-bottom: 8px;
`;

const StyledAmount = styled(Amount)``;

const LargeAmount = styled(StyledAmount)`
  font-size: 24px;
`;

const AmountContainer = styled.div`
  text-align: center;
  ${StyledAmount} {
    display: block;
  }
`;

const Container = styled.div`
  width: 100%;
  padding-bottom: 32px;

  > div > * {
    margin-bottom: 16px;
  }

  @media (min-width: ${ViewportWidth.s}) {
    display: flex;
    justify-content: space-around;
  }
`;

export const PoolBalances: FC<Props> = ({ className }) => {
  const stakingRewardsContract = useCurrentStakingRewardsContract();

  const {
    rewards,
    rewardsUsd,
    platformRewards,
    platformRewardsUsd,
  } = useRewardsEarned();
  const rewardsToken = useCurrentRewardsToken();
  const stakingToken = useCurrentStakingToken();
  const platformToken = useCurrentPlatformToken();

  return (
    <Container className={className}>
      {stakingRewardsContract && rewardsToken && stakingToken && rewards ? (
        <>
          <div>
            <AmountContainer>
              <Heading>Earned {rewardsToken.symbol}</Heading>
              <LargeAmount
                format={NumberFormat.Countup}
                amount={rewards}
                countup={{ decimals: 6 }}
              />
            </AmountContainer>
            <AmountContainer>
              <span>$</span>
              <Amount
                format={NumberFormat.Countup}
                amount={rewardsUsd}
                countup={{ decimals: 6 }}
              />
            </AmountContainer>
            {stakingRewardsContract.platformRewards &&
            platformRewards &&
            platformToken ? (
              <>
                <AmountContainer>
                  <Heading>Earned {platformToken.symbol}</Heading>
                  <LargeAmount
                    format={NumberFormat.Countup}
                    amount={platformRewards}
                    countup={{ decimals: 18 }}
                  />
                </AmountContainer>
                <AmountContainer>
                  <span>$</span>
                  <Amount
                    format={NumberFormat.Countup}
                    amount={platformRewardsUsd}
                    countup={{ decimals: 18 }}
                  />
                </AmountContainer>
              </>
            ) : null}
          </div>
          <div>
            <AmountContainer>
              <Heading>Share of pool</Heading>
              <LargeAmount
                format={NumberFormat.CountupPercentage}
                amount={stakingRewardsContract.stakingBalancePercentage}
                countup={{ decimals: 8 }}
                decimalPlaces={8}
              />
            </AmountContainer>
            <AmountContainer>
              <Heading>Staked {stakingToken.symbol}</Heading>
              <Amount
                format={NumberFormat.Countup}
                amount={stakingRewardsContract.stakingBalance}
                countup={{ decimals: 8 }}
                price={stakingToken.price}
              />
            </AmountContainer>
          </div>
        </>
      ) : (
        <Skeleton height={200} />
      )}
    </Container>
  );
};
