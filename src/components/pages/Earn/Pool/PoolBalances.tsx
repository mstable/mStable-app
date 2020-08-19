import React, { FC } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton/lib';

import { Amount, NumberFormat } from '../../../core/Amount';
import { ViewportWidth } from '../../../../theme';
import {
  useCurrentStakingRewardsContract,
  useCurrentStakingToken,
  useCurrentPlatformToken,
  useCurrentRewardsToken,
  useRewardsEarned,
} from '../StakingRewardsContractProvider';
import { ViewAs } from './ViewAs';
import { P } from '../../../core/Typography';
import { Protip } from '../../../core/Protip';
import { ExternalLink } from '../../../core/ExternalLink';
import { useAccount } from '../../../../context/UserProvider';

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

const ProtipContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledProtip = styled(Protip)`
  max-width: 300px;
  text-align: left;
  p {
    font-size: 12px;
    line-height: 1.5em;
    &:last-child {
      padding-bottom: 0;
    }
  }
  a {
    font-weight: bold;
  }
`;

const AmountContainer = styled.div`
  text-align: center;
  ${StyledAmount} {
    display: block;
  }
`;

const Balances = styled.div`
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

export const PoolBalances: FC<Props> = () => {
  const account = useAccount();
  const stakingRewardsContract = useCurrentStakingRewardsContract();

  const {
    rewards,
    rewardsUsd,
    platformRewards,
    // platformRewardsUsd,
  } = useRewardsEarned();
  const rewardsToken = useCurrentRewardsToken();
  const stakingToken = useCurrentStakingToken();
  const platformToken = useCurrentPlatformToken();

  return (
    <div>
      <ViewAs />
      {stakingRewardsContract && rewardsToken && stakingToken && rewards ? (
        <Balances>
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
                <ProtipContainer>
                  {/* <Heading>Earned {platformToken.symbol}</Heading> */}
                  {/* <LargeAmount  */}
                  {/*   format={NumberFormat.Countup}  */}
                  {/*   amount={platformRewards}  */}
                  {/*   countup={{ decimals: 18 }}  */}
                  {/* />  */}
                  <StyledProtip emoji="🚁" title="Airdropped BAL">
                    <P>
                      For the next few weeks, BAL rewards will continue to be
                      airdropped proportionately to EARN participants. In the
                      coming month, the airdrops will be replaced with a CLAIM
                      button.{' '}
                      <ExternalLink href="https://medium.com/mstable/plans-for-the-bal-rewards-in-mstable-earn-48434a03bbab">
                        Read more
                      </ExternalLink>
                    </P>
                    <P>
                      Any airdrops will be visible{' '}
                      <ExternalLink
                        href={`https://etherscan.io/token/0xba100000625a3754423978a60c9317c58a424e3d${
                          account ? `?a=${account}` : ''
                        }`}
                      >
                        here
                      </ExternalLink>
                      .
                    </P>
                  </StyledProtip>
                </ProtipContainer>
                {/* <AmountContainer> */}
                {/*   <span>$</span> */}
                {/*   <Amount */}
                {/*     format={NumberFormat.Countup} */}
                {/*     amount={platformRewardsUsd} */}
                {/*     countup={{ decimals: 18 }} */}
                {/*   /> */}
                {/* </AmountContainer> */}
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
        </Balances>
      ) : (
        <Skeleton height={200} />
      )}
    </div>
  );
};
