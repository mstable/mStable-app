import React, { FC, useMemo } from 'react'
import styled from 'styled-components'

import { useStakingRewardsContracts } from '../../../context/earn/EarnDataProvider'
import { Color, FontSize } from '../../../theme'
import { Table } from '../../core/Table'
import { TokenAmount } from '../../core/TokenAmount'
import { Amount, NumberFormat } from '../../core/Amount'
import { H3 } from '../../core/Typography'
import { PLATFORM_METADATA } from './constants'
import { TokenIconSvg } from '../../icons/TokenIcon'
import { ExplorerLink } from '../../core/ExplorerLink'
import { ExternalLink } from '../../core/ExternalLink'
import { AccentColors, Platforms } from '../../../types'
import { Tooltip } from '../../core/ReactTooltip'
import { ThemedSkeleton } from '../../core/ThemedSkeleton'
import { useSelectedMassetName } from '../../../context/SelectedMassetNameProvider'
import { useNetworkAddresses } from '../../../context/NetworkProvider'

const ApyAmount = styled(Amount)`
  font-size: ${FontSize.m};
  margin-bottom: 8px;
  display: block;
`

const MtaApyAmount = styled(ApyAmount)`
  font-size: 1.5rem;
`

const ApyNote = styled.div`
  font-weight: bold;
  font-size: ${FontSize.m};
`

const StyledTable = styled(Table)`
  > * {
    min-width: 40rem;
  }
`

const TableGroup = styled.div`
  border-top: 1px ${Color.blackTransparenter} solid;
  padding-top: 1rem;
  margin-bottom: 64px;
`

const PlatformIcon = styled(TokenIconSvg)`
  margin-right: 16px;
`

const PlatformContainer = styled.div<{ colors: AccentColors }>`
  display: flex;
  align-items: center;
  * {
    color: ${({ colors, theme }) => (theme.isLight ? colors.base : colors.light)};
    border-color: ${({ colors }) => colors.light};
  }
  svg {
    fill: ${({ colors, theme }) => (theme.isLight ? colors.base : colors.light)} !important;
  }
`

const Container = styled.div`
  width: 100%;
  max-width: calc(100vw - 16px);
`

enum Columns {
  Platform,
  Collateral,
  RewardsApy,
  WeeklyRewards,
}

const COLUMNS = [
  {
    key: Columns.Platform,
    title: 'Platform',
    tip: 'The platform used to earn rewards',
  },
  {
    key: Columns.Collateral,
    title: 'Collateral',
    tip: 'The collateral contributed to the pool in order to get the staking token',
  },
  {
    key: Columns.RewardsApy,
    title: 'Rewards APY',
    tip: 'The Annual Percentage Yield is the extrapolated return on investment over the course of a year',
  },
  {
    key: Columns.WeeklyRewards,
    title: 'Weekly rewards',
    tip: 'The weekly rewards made available to the pool',
  },
]

const platformOrder: { [key in Platforms]: number } = {
  [Platforms.Curve]: 0,
  [Platforms.Balancer]: 1,
  [Platforms.Uniswap]: 2,
  [Platforms.Sushi]: 3,
  [Platforms.Badger]: 4,
  [Platforms.Cream]: 5,
}

export const PoolsOverview: FC = () => {
  const stakingRewardsContracts = useStakingRewardsContracts()
  const massetName = useSelectedMassetName()
  const networkAddresses = useNetworkAddresses()

  const [activePools, otherPools, expiredPools] = useMemo(() => {
    const items = Object.values(stakingRewardsContracts)
      .filter(item => item.pool.tokens.find(token => token.address === networkAddresses?.MTA || token.symbol.toLowerCase() === massetName))
      .sort((a, b) =>
        platformOrder[a.pool.platform] < platformOrder[b.pool.platform]
          ? -1 // *teleports behind you*
          : platformOrder[a.pool.platform] > platformOrder[b.pool.platform]
          ? 1 // nothing personnel, kid
          : 0,
      )
      .map(item => {
        const { address: id, platformRewards, expired, totalStakingRewards, rewardsToken, pool, earnUrl } = item

        const { colors, getPlatformLink, name } = PLATFORM_METADATA[pool.platform]

        return COLUMNS.reduce(
          (_item, { key }) => {
            const value = (() => {
              switch (key) {
                case Columns.Platform:
                  return (
                    <PlatformContainer colors={colors}>
                      <PlatformIcon width={48} height={48} symbol={item.stakingToken.symbol} />
                      <div>
                        <div>
                          <ExternalLink href={getPlatformLink(item)}>{name}</ExternalLink>
                        </div>
                        <ExplorerLink data={item.address} type="address" showData truncate />
                      </div>
                    </PlatformContainer>
                  )
                case Columns.Collateral:
                  return (
                    <>
                      {pool.tokens.map(({ address, symbol, liquidity, price, ratio }) => (
                        <TokenAmount key={address} symbol={symbol} format={NumberFormat.Abbreviated} amount={liquidity} price={price}>
                          {ratio}
                        </TokenAmount>
                      ))}
                    </>
                  )
                case Columns.RewardsApy: {
                  if (expired) {
                    return `N/A`
                  }
                  return item.apy.value?.exact ? (
                    <div>
                      {item.address === '0x6de3a957b0344e6adeeab4648b02108f35651fb5' ? (
                        <Tooltip tip="This value is prone to fluctuate as it reflects the prices of multiple volatile tokens.">
                          <MtaApyAmount amount={item.apy.value} format={NumberFormat.CountupPercentage} />
                        </Tooltip>
                      ) : (
                        <MtaApyAmount amount={item.apy.value} format={NumberFormat.CountupPercentage} />
                      )}
                      <ApyNote>
                        + Yield
                        {item.apy.yieldApy && <ApyAmount amount={item.apy.yieldApy} format={NumberFormat.CountupPercentage} />}
                      </ApyNote>
                      {item.platformRewards && <ApyNote>+ {item.platformRewards.platformToken.symbol}</ApyNote>}
                    </div>
                  ) : item.apy.waitingForData ? (
                    <Tooltip tip="Calculating APY requires data from 24h ago, which is not available yet.">No data yet</Tooltip>
                  ) : (
                    <ThemedSkeleton />
                  )
                }
                case Columns.WeeklyRewards:
                  if (expired) {
                    return `N/A`
                  }
                  return (
                    <>
                      <TokenAmount
                        amount={totalStakingRewards}
                        format={NumberFormat.Abbreviated}
                        symbol={rewardsToken.symbol}
                        price={rewardsToken.price}
                      />
                      {platformRewards ? (
                        <Tooltip
                          tip={
                            item.curve
                              ? 'This pool receives CRV rewards'
                              : "Currently BAL rewards are airdropped based on Balancer's reward programme allocations. Earned rewards can be claimed on the EARN dashboard."
                          }
                        >
                          <TokenAmount
                            format={NumberFormat.Abbreviated}
                            symbol={platformRewards.platformToken.symbol}
                            price={platformRewards.platformToken.price}
                          />
                        </Tooltip>
                      ) : null}
                    </>
                  )
                default:
                  throw new Error('Unhandled key')
              }
            })()
            return {
              ..._item,
              data: { ..._item.data, [key]: value },
              hasStaked: item.stakingBalance.exact.gt(0),
              expired,
            }
          },
          {
            id,
            url: earnUrl.substring(1), // remove leading '/'
            colors,
            data: {},
            hasStaked: false,
            expired: false,
          },
        )
      })
    return [
      items.filter(item => !item.expired && item.hasStaked),
      items.filter(item => !item.expired && !item.hasStaked),
      items.filter(item => item.expired),
    ]
  }, [massetName, networkAddresses, stakingRewardsContracts])

  return (
    <Container>
      {Object.keys(stakingRewardsContracts).length === 0 ? (
        <ThemedSkeleton height={600} />
      ) : (
        <>
          {activePools.length > 0 && (
            <TableGroup>
              <H3>Your pools</H3>
              <StyledTable columns={COLUMNS} items={activePools} noItems="No pools joined yet." />
            </TableGroup>
          )}
          <TableGroup>
            <H3>Ecosystem pools</H3>
            <StyledTable columns={COLUMNS} items={otherPools} />
          </TableGroup>
          <TableGroup>
            <H3>Expired pools</H3>
            <StyledTable columns={COLUMNS} items={expiredPools} />
          </TableGroup>
        </>
      )}
    </Container>
  )
}
