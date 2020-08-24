import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import Skeleton from 'react-loading-skeleton';

import { useStakingRewardsContracts } from '../../../context/earn/EarnDataProvider';
import { Color, FontSize } from '../../../theme';
import { Table } from '../../core/Table';
import { TokenAmount } from '../../core/TokenAmount';
import { Amount, NumberFormat } from '../../core/Amount';
import { H3 } from '../../core/Typography';
import { PLATFORM_METADATA } from './constants';
import { TokenIconSvg } from '../../icons/TokenIcon';
import { EtherscanLink } from '../../core/EtherscanLink';
import { ExternalLink } from '../../core/ExternalLink';
import { AccentColors } from '../../../types';
import { Tooltip } from '../../core/ReactTooltip';

const ApyAmount = styled(Amount)`
  font-size: ${FontSize.xl};
  margin-bottom: 8px;
  display: block;
`;

const ApyNote = styled.div`
  font-weight: bold;
  font-size: ${FontSize.m};
`;

const TableGroup = styled.div`
  border-top: 1px ${Color.blackTransparenter} solid;
  margin-bottom: 64px;
`;

const PlatformIcon = styled(TokenIconSvg)`
  margin-right: 8px;
`;

const PlatformContainer = styled.div<{ colors: AccentColors }>`
  display: flex;
  align-items: center;
  * {
    color: ${({ colors }) => colors.base};
    border-color: ${({ colors }) => colors.light};
  }
  svg {
    fill: ${({ colors }) => colors.base} !important;
  }
`;

const Container = styled.div`
  width: 100%;
  overflow-x: auto;
  max-width: calc(100vw - 16px);
`;

enum Columns {
  Platform,
  Collateral,
  // StakingApy,
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
    tip:
      'The collateral contributed to the pool in order to get the staking token',
  },
  // {
  //   key: Columns.StakingApy,
  //   title: 'Staking APY',
  //   tip:
  //     'The Annual Percentage Yield the pool is currently generating from the staking token itself',
  // },
  {
    key: Columns.RewardsApy,
    title: 'Rewards APY',
    tip:
      'The Annual Percentage Yield is the extrapolated return on investment over the course of a year',
  },
  {
    key: Columns.WeeklyRewards,
    title: 'Weekly rewards',
    tip: 'The weekly rewards made available to the pool',
  },
];

export const PoolsOverview: FC<{}> = () => {
  const stakingRewardsContracts = useStakingRewardsContracts();

  const [activePools, otherPools, expiredPools] = useMemo(() => {
    const items = Object.values(stakingRewardsContracts)
      .sort()
      .map(item => {
        const {
          address: id,
          platformRewards,
          expired,
          totalStakingRewards,
          rewardsToken,
          pool,
          earnUrl,
        } = item;
        const { colors, getPlatformLink, name } = PLATFORM_METADATA[
          pool.platform
        ];

        return COLUMNS.reduce(
          (_item, { key }) => {
            const value = (() => {
              switch (key) {
                case Columns.Platform:
                  return (
                    <PlatformContainer colors={colors}>
                      <PlatformIcon
                        width={48}
                        height={48}
                        symbol={item.stakingToken.symbol}
                      />
                      <div>
                        <div>
                          <ExternalLink href={getPlatformLink(item)}>
                            {name}
                          </ExternalLink>
                        </div>
                        <EtherscanLink
                          data={item.address}
                          type="address"
                          showData
                          truncate
                        />
                      </div>
                    </PlatformContainer>
                  );
                case Columns.Collateral:
                  return (
                    <>
                      {pool.tokens.map(
                        ({ address, symbol, liquidity, price, ratio }) => (
                          <TokenAmount
                            key={address}
                            symbol={symbol}
                            format={NumberFormat.Abbreviated}
                            amount={liquidity}
                            price={price}
                          >
                            {ratio}
                          </TokenAmount>
                        ),
                      )}
                    </>
                  );
                // case Columns.StakingApy:
                //   return (
                //     <ApyAmount
                //       amount={stakingRewardsContract.stakingTokenApy}
                //       format={NumberFormat.Percentage}
                //     />
                //   );
                case Columns.RewardsApy: {
                  if (expired) {
                    return <>N/A</>;
                  }
                  return item.apy.value?.exact.gt(0) ? (
                    <div>
                      <ApyAmount
                        amount={item.apy.value}
                        format={NumberFormat.CountupPercentage}
                      />
                      {item.platformRewards ? <ApyNote>+ BAL</ApyNote> : null}
                    </div>
                  ) : item.apy.waitingForData ? (
                    <Tooltip tip="Calculating APY requires data from 24h ago, which is not available yet.">
                      No data yet
                    </Tooltip>
                  ) : (
                    <Skeleton />
                  );
                }
                case Columns.WeeklyRewards:
                  if (expired) {
                    return <>N/A</>;
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
                        <Tooltip tip="Currently BAL rewards are airdropped based on Balancer's reward programme allocations.">
                          <TokenAmount
                            // amount={platformRewards.totalPlatformRewards}
                            format={NumberFormat.Abbreviated}
                            symbol={platformRewards.platformToken.symbol}
                            price={platformRewards.platformToken.price}
                          />
                        </Tooltip>
                      ) : null}
                    </>
                  );
                default:
                  throw new Error('Unhandled key');
              }
            })();
            return {
              ..._item,
              data: { ..._item.data, [key]: value },
              hasStaked: item.stakingBalance.exact.gt(0),
              expired,
            };
          },
          {
            id,
            url: earnUrl,
            colors,
            data: {},
            hasStaked: false,
            expired: false,
          },
        );
      });
    return [
      items.filter(item => !item.expired && item.hasStaked),
      items.filter(item => !item.expired && !item.hasStaked),
      items.filter(item => item.expired),
    ];
  }, [stakingRewardsContracts]);

  return (
    <Container>
      {Object.keys(stakingRewardsContracts).length === 0 ? (
        <Skeleton height={600} />
      ) : (
        <>
          <TableGroup>
            <H3>Your pools</H3>
            <Table
              columns={COLUMNS}
              items={activePools}
              noItems="No pools joined yet."
            />
          </TableGroup>
          <TableGroup>
            <H3>Ecosystem pools</H3>
            <Table columns={COLUMNS} items={otherPools} />
          </TableGroup>
          <TableGroup>
            <H3>Expired pools</H3>
            <Table columns={COLUMNS} items={expiredPools} />
          </TableGroup>
        </>
      )}
    </Container>
  );
};
