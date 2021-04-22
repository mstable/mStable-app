import React, { FC } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { Amount, NumberFormat } from '../../../core/Amount'
import { ViewportWidth } from '../../../../theme'
import {
  useCurrentStakingRewardsContract,
  useCurrentStakingToken,
  useCurrentPlatformToken,
  useCurrentRewardsToken,
  useRewardsEarned,
} from '../StakingRewardsContractProvider'
import { ViewAs } from './ViewAs'
import { P } from '../../../core/Typography'
import { Protip } from '../../../core/Protip'
import { ThemedSkeleton } from '../../../core/ThemedSkeleton'
import { useSelectedMassetName } from '../../../../context/SelectedMassetNameProvider'

interface Props {
  className?: string
}

const Heading = styled.div`
  text-transform: uppercase;
  font-size: 14px;
  font-weight: bold;
  padding-bottom: 8px;
`

const StyledAmount = styled(Amount)``

const LargeAmount = styled(StyledAmount)`
  font-size: 24px;
`

const ProtipContainer = styled.div`
  display: flex;
  justify-content: center;
`

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
`

const AmountContainer = styled.div`
  text-align: center;
  ${StyledAmount} {
    display: block;
  }
`

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
`

export const PoolBalances: FC<Props> = () => {
  const stakingRewardsContract = useCurrentStakingRewardsContract()

  const { rewards, rewardsUsd, platformRewards, platformRewardsUsd } = useRewardsEarned()
  const rewardsToken = useCurrentRewardsToken()
  const stakingToken = useCurrentStakingToken()
  const platformToken = useCurrentPlatformToken()
  const massetName = useSelectedMassetName()

  return (
    <div>
      <ViewAs />
      {stakingRewardsContract && rewardsToken && stakingToken && rewards ? (
        <Balances>
          <div>
            <AmountContainer>
              <Heading>Earned {rewardsToken.symbol}</Heading>
              <LargeAmount format={NumberFormat.Countup} amount={rewards} countup={{ decimals: 6 }} />
            </AmountContainer>
            <AmountContainer>
              <span>$</span>
              <Amount format={NumberFormat.Countup} amount={rewardsUsd} countup={{ decimals: 6 }} />
            </AmountContainer>
            {stakingRewardsContract.platformRewards && !stakingRewardsContract.curve && platformRewards && platformToken && (
              <>
                <ProtipContainer>
                  <StyledProtip emoji="💰" title="Claim BAL">
                    <P>
                      You can now claim any BAL earned directly from the <Link to={`/${massetName}/earn`}>EARN dashboard.</Link>
                    </P>
                  </StyledProtip>
                </ProtipContainer>
              </>
            )}
          </div>
          {stakingRewardsContract.curve && (
            <div>
              <AmountContainer>
                <Heading>Earned CRV</Heading>
                <LargeAmount format={NumberFormat.Countup} amount={platformRewards} countup={{ decimals: 6 }} />
              </AmountContainer>
              <AmountContainer>
                <span>$</span>
                <Amount format={NumberFormat.Countup} amount={platformRewardsUsd} countup={{ decimals: 6 }} />
              </AmountContainer>
            </div>
          )}
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
        <ThemedSkeleton height={200} />
      )}
    </div>
  )
}
