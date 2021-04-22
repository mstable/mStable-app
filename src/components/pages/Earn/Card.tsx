import React, { FC } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { Amount, NumberFormat } from '../../core/Amount'
import { TokenAmount } from '../../core/TokenAmount'
import { ExternalLink } from '../../core/ExternalLink'
import { ExplorerLink } from '../../core/ExplorerLink'
import { Tooltip } from '../../core/ReactTooltip'
import { TokenIcon, TOKEN_ICONS } from '../../icons/TokenIcon'
import { StakingRewardsContract } from '../../../context/earn/types'
import { usePlatformToken, useRewardsToken, useStakingRewardsContract, useStakingToken } from '../../../context/earn/EarnDataProvider'
import { Color } from '../../../theme'
import { PlatformMetadata } from './types'
import { PLATFORM_METADATA } from './constants'
import { ThemedSkeleton } from '../../core/ThemedSkeleton'

interface Props {
  address: string
  className?: string
  linkToPool?: boolean
}

const Heading = styled.h4`
  text-transform: uppercase;
  font-weight: bold;
  font-size: 12px;
`

const StyledTokenAmount = styled(TokenAmount)`
  span {
    font-weight: bold;
  }
`

const StyledAmount = styled(Amount)`
  span {
    font-weight: bold;
  }
`

const TokenAmounts = styled.div``

const Row = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;

  > :last-child {
    text-align: right;

    ${StyledAmount} {
      > span {
        flex-direction: row-reverse;
      }
    }

    ${StyledTokenAmount} {
      flex-direction: row-reverse;
      > :first-child {
        margin-right: 0;
        margin-left: 8px;
      }
    }
  }
`

const Content = styled.div`
  width: 100%;
`

const PlatformIcon = styled(TokenIcon)`
  width: 24px;
  height: 24px;
  margin-right: 8px;
`

const PlatformContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
`

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  padding-bottom: 8px;
  text-align: left;

  a {
    border-bottom: 0;
  }
`

const Container = styled.div<{
  colors: PlatformMetadata['colors']
  stakingToken?: keyof typeof TOKEN_ICONS
  linkToPool?: boolean
}>`
  padding: 8px 16px;
  min-width: 344px;
  min-height: 225px;
  background-image: ${({ colors: { base, accent }, stakingToken }) =>
    stakingToken ? `url(${TOKEN_ICONS[stakingToken.toUpperCase()]}), linear-gradient(to top right, ${base}, ${accent})` : 'none'};
  background-size: contain;
  background-position: center center;
  background-blend-mode: soft-light;
  background-repeat: no-repeat;
  border-radius: 1rem;
  box-shadow: ${Color.blackTransparent} 0 4px 16px;
  text-shadow: ${({ colors: { base } }) => base} 0 1px 2px;
  color: ${({ colors: { text } }) => text};
  cursor: ${({ linkToPool }) => (linkToPool ? 'pointer' : 'auto')};

  ${StyledTokenAmount}, ${PlatformContainer}, ${Title} {
    color: ${({ colors: { text } }) => text};
    a {
      color: ${({ colors: { text } }) => text};
    }
    svg {
      path {
        fill: ${({ colors: { text } }) => text};
      }
    }
  }
`

export const Card: FC<Props> = ({ address, linkToPool, className }) => {
  const stakingRewardsContract = useStakingRewardsContract(address) as StakingRewardsContract

  const { colors, getPlatformLink, name } = PLATFORM_METADATA[stakingRewardsContract.pool.platform]

  const rewardsToken = useRewardsToken(address)
  const stakingToken = useStakingToken(address)
  const platformToken = usePlatformToken(address)
  const platformLink = getPlatformLink(stakingRewardsContract)

  return (
    <Container colors={colors} stakingToken={stakingToken?.symbol} className={className}>
      <>
        {linkToPool ? (
          <Title>
            <Link to={stakingRewardsContract.earnUrl}>{stakingRewardsContract.title}</Link>
          </Title>
        ) : (
          <Title>{stakingRewardsContract.title}</Title>
        )}
        {stakingToken && rewardsToken ? (
          <Content>
            <Row>
              <div>
                <Tooltip tip="The platform used to earn rewards">
                  <Heading>Platform</Heading>
                </Tooltip>
                <PlatformContainer>
                  <PlatformIcon symbol={stakingToken.symbol} />
                  <div>
                    <div>
                      <ExternalLink href={platformLink}>{name}</ExternalLink>
                    </div>
                    <ExplorerLink data={stakingToken.address} type="token" showData truncate />
                  </div>
                </PlatformContainer>
              </div>
              <div>
                {stakingRewardsContract.expired ? null : (
                  <>
                    <Tooltip tip="The Annual Percentage Yield is the extrapolated return on investment over the course of a year">
                      <Heading>{rewardsToken.symbol} APY</Heading>
                    </Tooltip>
                    <div>
                      {stakingRewardsContract.apy.waitingForData ? (
                        <Tooltip tip="Calculating APY requires data from 24h ago, which is not available yet.">No data yet</Tooltip>
                      ) : (
                        <StyledAmount format={NumberFormat.CountupPercentage} amount={stakingRewardsContract.apy.value} />
                      )}
                    </div>
                    {stakingRewardsContract.apy.yieldApy && (
                      <>
                        <Heading>Yield APY</Heading>
                        <div>
                          <StyledAmount format={NumberFormat.CountupPercentage} amount={stakingRewardsContract.apy.yieldApy} />
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </Row>
            <Row>
              <div>
                <div>
                  <Tooltip tip="The collateral contributed to the pool in order to get the staking token">
                    <Heading>Collateral</Heading>
                  </Tooltip>
                </div>
                <TokenAmounts>
                  {stakingRewardsContract.pool.tokens.map(({ price, liquidity, symbol }) => (
                    <StyledTokenAmount key={symbol} symbol={symbol} format={NumberFormat.Abbreviated} amount={liquidity} price={price} />
                  ))}
                </TokenAmounts>
              </div>
              <div>
                {stakingRewardsContract.expired ? null : (
                  <>
                    <Tooltip tip="The weekly rewards made available to the pool">
                      <Heading>Weekly rewards</Heading>
                    </Tooltip>
                    <TokenAmounts>
                      <StyledTokenAmount
                        amount={stakingRewardsContract.totalStakingRewards}
                        format={NumberFormat.Abbreviated}
                        symbol={rewardsToken.symbol}
                        price={rewardsToken.price}
                      />
                      {platformToken && (
                        <>
                          <Tooltip
                            tip={
                              stakingRewardsContract.curve
                                ? 'CRV rewards are allocated to this pool'
                                : `Currently BAL rewards are airdropped based on Balancer's reward programme allocations. Earned rewards can be claimed on the EARN dashboard.`
                            }
                            hideIcon
                          >
                            <StyledTokenAmount
                              format={NumberFormat.Abbreviated}
                              symbol={platformToken.symbol}
                              price={platformToken.price}
                            />
                          </Tooltip>
                        </>
                      )}
                    </TokenAmounts>
                  </>
                )}
              </div>
            </Row>
          </Content>
        ) : (
          <ThemedSkeleton height={225} />
        )}
      </>
    </Container>
  )
}
